import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import StatusBadge from '@/components/UI/StatusBadge';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Building2,
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function Scheduling() {
  const { schedules, projects, personnel } = useAppStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getSchedulesForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedules.filter((s) => s.date === dateStr);
  };

  const selectedDateSchedules = getSchedulesForDate(selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'scheduled':
        return 'bg-orange-500';
      case 'cancelled':
        return 'bg-slate-400';
      default:
        return 'bg-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'scheduled':
        return '已排期';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case 'morning':
        return '上午班';
      case 'afternoon':
        return '下午班';
      case 'full':
        return '全天';
      default:
        return shift;
    }
  };

  const firstDay = days[0].getDay();
  const paddingDays = Array(firstDay).fill(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">作业排期</h1>
          <p className="text-slate-500 mt-1">管理作业计划和人员排班</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>新建排期</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  {format(currentMonth, 'yyyy年MM月', { locale: zhCN })}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    今天
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-slate-600">进行中</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="text-slate-600">已排期</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-slate-600">已完成</span>
                </div>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-slate-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {paddingDays.map((_, idx) => (
                <div key={`pad-${idx}`} className="h-28 p-2"></div>
              ))}
              {days.map((day) => {
                const daySchedules = getSchedulesForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`h-28 p-2 rounded-lg cursor-pointer transition-all border ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-transparent hover:bg-slate-50'
                    } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          isToday(day)
                            ? 'w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center'
                            : isSelected
                            ? 'text-blue-600'
                            : 'text-slate-700'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                      {daySchedules.length > 0 && (
                        <span className="text-xs text-slate-500">
                          {daySchedules.length}项
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      {daySchedules.slice(0, 2).map((schedule) => (
                        <div
                          key={schedule.id}
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(
                            schedule.status
                          )} text-white truncate`}
                        >
                          {schedule.building}
                        </div>
                      ))}
                      {daySchedules.length > 2 && (
                        <div className="text-xs text-slate-500 px-2">
                          +{daySchedules.length - 2} 更多
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>
                {format(selectedDate, 'MM月dd日 EEEE', { locale: zhCN })}
              </Card.Title>
              <CalendarIcon className="w-5 h-5 text-slate-400" />
            </div>
          </Card.Header>
          <Card.Body>
            {selectedDateSchedules.length > 0 ? (
              <div className="space-y-3">
                {selectedDateSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-slate-800">{schedule.building}</h4>
                        <p className="text-sm text-slate-500 mt-0.5">{schedule.projectName}</p>
                      </div>
                      <StatusBadge
                        variant={
                          schedule.status === 'in_progress'
                            ? 'info'
                            : schedule.status === 'completed'
                            ? 'success'
                            : 'pending'
                        }
                      >
                        {getStatusLabel(schedule.status)}
                      </StatusBadge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{getShiftLabel(schedule.shift)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{schedule.personnelNames.length} 人作业</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {schedule.personnelNames.slice(0, 4).map((name, idx) => (
                          <div
                            key={idx}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-xs text-white font-medium"
                          >
                            {name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      {schedule.personnelNames.length > 4 && (
                        <span className="text-xs text-slate-500">
                          +{schedule.personnelNames.length - 4}
                        </span>
                      )}
                    </div>
                    {schedule.remarks && (
                      <p className="mt-3 text-xs text-slate-500 bg-white p-2 rounded-lg">
                        {schedule.remarks}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">当天暂无作业安排</p>
                <Button variant="outline" size="sm" className="mt-4">
                  添加排期
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>本周排期</Card.Title>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3 font-medium">日期</th>
                  <th className="px-6 py-3 font-medium">项目</th>
                  <th className="px-6 py-3 font-medium">作业楼栋</th>
                  <th className="px-6 py-3 font-medium">班次</th>
                  <th className="px-6 py-3 font-medium">人员</th>
                  <th className="px-6 py-3 font-medium">状态</th>
                  <th className="px-6 py-3 font-medium">备注</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.slice(0, 6).map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{schedule.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">{schedule.projectName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">{schedule.building}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{getShiftLabel(schedule.shift)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{schedule.personnelNames.length}人</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        variant={
                          schedule.status === 'in_progress'
                            ? 'info'
                            : schedule.status === 'completed'
                            ? 'success'
                            : 'pending'
                        }
                      >
                        {getStatusLabel(schedule.status)}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {schedule.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
