import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import StatusBadge from '@/components/UI/StatusBadge';
import {
  Plus,
  Search,
  ClipboardList,
  Cloud,
  Wind,
  Thermometer,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Shield,
  FileCheck,
} from 'lucide-react';
import { format } from 'date-fns';

export default function Records() {
  const { workRecords, projects } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const filteredRecords = workRecords.filter((r) =>
    r.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWindLevelInfo = (level: number) => {
    if (level <= 3) return { label: '可作业', variant: 'success' as const };
    if (level <= 4) return { label: '谨慎作业', variant: 'warning' as const };
    return { label: '禁止作业', variant: 'danger' as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">作业记录</h1>
          <p className="text-slate-500 mt-1">管理安全交底、锚点检查和作业进度记录</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>新建记录</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">总记录数</p>
              <p className="text-2xl font-bold text-slate-800">{workRecords.length}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">正常作业</p>
              <p className="text-2xl font-bold text-green-600">
                {workRecords.filter((r) => r.isWorkable).length}
              </p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Wind className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">风力停工作业</p>
              <p className="text-2xl font-bold text-orange-600">
                {workRecords.filter((r) => !r.isWorkable).length}
              </p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">总工时</p>
              <p className="text-2xl font-bold text-purple-600">
                {workRecords.reduce((sum, r) => sum + r.workHours, 0)}h
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>作业记录列表</Card.Title>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索项目名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-56 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="divide-y divide-slate-100">
              {filteredRecords.map((record) => {
                const windInfo = getWindLevelInfo(record.windLevel);
                const isSelected = selectedRecord === record.id;
                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(isSelected ? null : record.id)}
                    className={`p-4 cursor-pointer transition-all hover:bg-slate-50 ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ClipboardList className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800">{record.projectName}</h4>
                          <p className="text-sm text-slate-500">
                            {record.date} · {record.weather}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-800">
                            进度 {record.progress}%
                          </p>
                          <p className="text-xs text-slate-500">
                            工时 {record.workHours}h
                          </p>
                        </div>
                        <StatusBadge variant={windInfo.variant}>
                          {record.windLevel}级风
                        </StatusBadge>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="p-3 bg-white rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Cloud className="w-4 h-4 text-blue-500" />
                              <span className="text-xs text-slate-500">天气</span>
                            </div>
                            <p className="font-medium text-slate-800">{record.weather}</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Thermometer className="w-4 h-4 text-orange-500" />
                              <span className="text-xs text-slate-500">温度</span>
                            </div>
                            <p className="font-medium text-slate-800">{record.temperature}°C</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Wind className="w-4 h-4 text-cyan-500" />
                              <span className="text-xs text-slate-500">风速</span>
                            </div>
                            <p className="font-medium text-slate-800">{record.windSpeed}m/s</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-purple-500" />
                              <span className="text-xs text-slate-500">作业状态</span>
                            </div>
                            <p className={`font-medium ${
                              record.isWorkable ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {record.isWorkable ? '正常作业' : '风力停工'}
                            </p>
                          </div>
                        </div>

                        {record.briefing && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-slate-800 text-sm">安全交底</span>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-slate-700">{record.briefing.content}</p>
                              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                                <span>交底人: {record.briefing.briefinger}</span>
                                <span>
                                  参与人员: {record.briefing.attendeeNames.join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {record.anchorChecks.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-slate-800 text-sm">锚点检查</span>
                            </div>
                            <div className="space-y-2">
                              {record.anchorChecks.map((check) => (
                                <div
                                  key={check.id}
                                  className="p-3 bg-slate-50 rounded-lg flex items-center justify-between"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-slate-800">
                                      {check.location}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {check.anchorType} · {check.remarks}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {check.isSecure ? (
                                      <StatusBadge variant="success">牢固</StatusBadge>
                                    ) : (
                                      <StatusBadge variant="danger">不牢固</StatusBadge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>今日天气研判</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-3">
                  <Cloud className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800">28°C</h3>
                <p className="text-slate-500">晴转多云</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wind className="w-5 h-5 text-cyan-500" />
                    <span className="text-slate-600">风速/风力</span>
                  </div>
                  <span className="font-medium text-slate-800">3.5m/s / 3级</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 font-medium">作业条件</span>
                  </div>
                  <span className="font-medium text-green-600">适宜作业</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2">风力等级说明</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-slate-600">≤3级：可正常作业</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="text-slate-600">4级：谨慎作业</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-slate-600">≥5级：禁止作业</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>作业人员</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {workRecords[0]?.personnelNames.map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{name}</p>
                      <p className="text-xs text-green-600">已到岗</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>安全检查要点</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: FileCheck,
                title: '安全交底',
                desc: '作业前必须进行安全技术交底',
                status: 'required',
              },
              {
                icon: Shield,
                title: '个人防护',
                desc: '安全帽、安全带、防滑鞋穿戴齐全',
                status: 'required',
              },
              {
                icon: MapPin,
                title: '锚点检查',
                desc: '作业前检查所有锚点牢固可靠',
                status: 'required',
              },
              {
                icon: Wind,
                title: '天气确认',
                desc: '风力不超过4级，无雷电暴雨',
                status: 'required',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
