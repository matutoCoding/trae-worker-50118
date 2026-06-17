import { useState, useMemo } from 'react';
import { useAppStore, generateId } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import StatusBadge from '@/components/UI/StatusBadge';
import Table from '@/components/UI/Table';
import Modal, { ConfirmModal, FormField, Input, Select, Textarea } from '@/components/UI/Modal';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Building2,
  Edit2,
  Trash2,
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { Schedule } from '@/types';

export default function Scheduling() {
  const { schedules, projects, personnel, addSchedule, updateSchedule, deleteSchedule } = useAppStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    projectId: '',
    date: '',
    shift: 'full' as Schedule['shift'],
    startTime: '08:00',
    endTime: '17:00',
    personnelIds: [] as string[],
    buildingName: '',
    floorRange: '',
    status: 'scheduled' as Schedule['status'],
    remarks: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const weekSchedules = useMemo(() => {
    const start = selectedDate;
    const end = addDays(selectedDate, 6);
    return schedules.filter((s) => {
      const scheduleDate = new Date(s.date);
      return scheduleDate >= start && scheduleDate <= end;
    });
  }, [schedules, selectedDate]);

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'warning';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
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

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || '未知项目';
  };

  const getPersonnelNames = (personnelIds: string[]) => {
    return personnelIds
      .map((id) => {
        const p = personnel.find((per) => per.id === id);
        return p?.name || '';
      })
      .filter(Boolean)
      .join('、');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.projectId) errors.projectId = '请选择项目';
    if (!formData.date) errors.date = '请选择日期';
    if (formData.personnelIds.length === 0) errors.personnelIds = '请至少选择一名作业人员';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setFormData({
      projectId: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      shift: 'full',
      startTime: '08:00',
      endTime: '17:00',
      personnelIds: [],
      buildingName: '',
      floorRange: '',
      status: 'scheduled',
      remarks: '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      projectId: schedule.projectId,
      date: schedule.date,
      shift: schedule.shift,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      personnelIds: schedule.personnelIds,
      buildingName: schedule.buildingName,
      floorRange: schedule.floorRange,
      status: schedule.status,
      remarks: schedule.remarks || '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleDelete = (scheduleId: string) => {
    setDeletingScheduleId(scheduleId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingScheduleId) {
      deleteSchedule(deletingScheduleId);
      setShowDeleteConfirm(false);
      setDeletingScheduleId(null);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const project = projects.find((p) => p.id === formData.projectId);

    if (editingSchedule) {
      updateSchedule(editingSchedule.id, {
        projectId: formData.projectId,
        projectName: project?.name || '',
        date: formData.date,
        shift: formData.shift,
        startTime: formData.startTime,
        endTime: formData.endTime,
        personnelIds: formData.personnelIds,
        buildingName: formData.buildingName,
        floorRange: formData.floorRange,
        status: formData.status,
        remarks: formData.remarks,
      });
    } else {
      const newSchedule: Schedule = {
        id: generateId('s'),
        projectId: formData.projectId,
        projectName: project?.name || '',
        date: formData.date,
        shift: formData.shift,
        startTime: formData.startTime,
        endTime: formData.endTime,
        personnelIds: formData.personnelIds,
        personnelNames: getPersonnelNames(formData.personnelIds),
        buildingName: formData.buildingName,
        floorRange: formData.floorRange,
        status: formData.status,
        remarks: formData.remarks,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      addSchedule(newSchedule);
    }

    setShowFormModal(false);
  };

  const handlePersonnelToggle = (personnelId: string) => {
    setFormData((prev) => {
      if (prev.personnelIds.includes(personnelId)) {
        return { ...prev, personnelIds: prev.personnelIds.filter((id) => id !== personnelId) };
      } else {
        return { ...prev, personnelIds: [...prev.personnelIds, personnelId] };
      }
    });
  };

  const firstDay = days[0].getDay();
  const paddingDays = Array(firstDay).fill(null);

  const activeProjects = projects.filter((p) => p.status === 'in_progress' || p.status === 'pending');

  const availablePersonnel = personnel.filter((p) => p.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">作业排期</h1>
          <p className="text-slate-500 mt-1">管理作业计划和人员排班</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          新建排期
        </Button>
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
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              今天
            </button>
          </div>
        </Card.Header>
        <Card.Body>
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
            {paddingDays.map((_, index) => (
              <div key={`padding-${index}`} className="aspect-square" />
            ))}
            {days.map((day) => {
                const daySchedules = getSchedulesForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isTodayDate = isToday(day);

                return (
                  <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square p-1 rounded-lg transition-all text-left flex flex-col
                    ${isSelected ? 'bg-blue-500 text-white' : ''}
                    ${!isSelected && isCurrentMonth ? 'hover:bg-slate-100' : ''}
                    ${!isCurrentMonth ? 'opacity-40' : ''}
                    ${isToday && !isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                  `}
                >
                  <span
                    className={`
                      text-sm font-medium
                      ${isSelected ? 'text-white' : isToday && isCurrentMonth ? 'text-slate-800' : 'text-slate-400'}
                    `}
                  >
                    {format(day, 'd')}
                  </span>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {daySchedules.slice(0, 2).map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`
                          w-1.5 h-1.5 rounded-full
                          ${getStatusColor(schedule.status)}
                        `}
                      />
                    ))}
                    {daySchedules.length > 2 && (
                      <span className="text-xs opacity-60">+{daySchedules.length - 2}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card.Body>
      </Card>

        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-slate-800">
              {format(selectedDate, 'M月d日', { locale: zhCN })} 排期
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {selectedDateSchedules.length > 0 ? (
                selectedDateSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          {schedule.projectName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {schedule.buildingName} · {getShiftLabel(schedule.shift)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(schedule)}
                          className="p-1 hover:bg-white rounded transition-colors text-slate-400 hover:text-blue-600"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-1 hover:bg-white rounded transition-colors text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge variant={getStatusBadgeVariant(schedule.status) as any}>
                        {getStatusLabel(schedule.status)}
                      </StatusBadge>
                      <span className="text-xs text-slate-500">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                      <Users className="w-3 h-3" />
                      <span>{schedule.personnelIds.length}人</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  当天暂无排期
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold text-slate-800">本周排期</h2>
        </Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Header>
              <tr>
                <Table.Head>日期</Table.Head>
                <Table.Head>项目</Table.Head>
                <Table.Head>楼栋</Table.Head>
                <Table.Head>班次</Table.Head>
                <Table.Head>时间</Table.Head>
                <Table.Head>作业人员</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {weekSchedules.length > 0 ? (
                weekSchedules.map((schedule) => (
                  <Table.Row key={schedule.id}>
                    <Table.Cell>
                      <span className="font-medium text-slate-800">{schedule.date}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-700">{schedule.projectName}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-600">{schedule.buildingName}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-600">{getShiftLabel(schedule.shift)}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-600">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-600 text-sm">
                        {schedule.personnelIds.length} 人
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge variant={getStatusBadgeVariant(schedule.status) as any}>
                        {getStatusLabel(schedule.status)}
                      </StatusBadge>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(schedule)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-500 hover:text-red-600"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                  本周暂无排期
                </td>
              </tr>
              )}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>

      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingSchedule ? '编辑排期' : '新建排期'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowFormModal(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingSchedule ? '保存修改' : '创建排期'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="项目" required error={formErrors.projectId}>
              <Select
                value={formData.projectId}
                onChange={(e) => {
                  const project = projects.find((p) => p.id === e.target.value);
                  setFormData({
                    ...formData,
                    projectId: e.target.value,
                    buildingName: project?.buildingType || '',
                  });
                }}
                error={!!formErrors.projectId}
              >
                <option value="">请选择项目</option>
                {activeProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="日期" required error={formErrors.date}>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                error={!!formErrors.date}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="班次">
              <Select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
              >
                <option value="full">全天</option>
                <option value="morning">上午班</option>
                <option value="afternoon">下午班</option>
              </Select>
            </FormField>
            <FormField label="开始时间">
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </FormField>
            <FormField label="结束时间">
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="楼栋名称">
              <Input
                value={formData.buildingName}
                onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                placeholder="如：A栋写字楼"
              />
            </FormField>
            <FormField label="作业楼层">
              <Input
                value={formData.floorRange}
                onChange={(e) => setFormData({ ...formData, floorRange: e.target.value })}
                placeholder="如：1-10层"
              />
            </FormField>
          </div>

          <FormField label="状态">
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as any,
                })
              }
            >
              <option value="scheduled">已排期</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </Select>
          </FormField>

          <FormField label="作业人员" required error={formErrors.personnelIds}>
            <div className="border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto">
              {availablePersonnel.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {availablePersonnel.map((p) => (
                    <label
                      key={p.id}
                      className={`
                        flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
                        ${formData.personnelIds.includes(p.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.personnelIds.includes(p.id)}
                        onChange={() => handlePersonnelToggle(p.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">{p.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-2">暂无可用人员</p>
              )}
            </div>
          </FormField>

          <FormField label="备注">
            <Textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={3}
              placeholder="请输入备注信息"
            />
          </FormField>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingScheduleId(null);
        }}
        onConfirm={confirmDelete}
        title="确认删除排期"
        variant="danger"
        confirmText="确认删除"
        message={
          <div className="space-y-2">
            <p className="text-slate-600">确定要删除该排期吗？</p>
            <p className="text-sm text-red-500 font-medium">⚠️ 删除后无法恢复，请谨慎操作！</p>
          </div>
        }
      />
    </div>
  );
}
