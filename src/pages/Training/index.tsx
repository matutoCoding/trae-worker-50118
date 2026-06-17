import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import StatusBadge from '@/components/UI/StatusBadge';
import { Plus, Search, GraduationCap, Users, Clock, Calendar, BookOpen, Award } from 'lucide-react';
import { format } from 'date-fns';

export default function Training() {
  const { trainingRecords, personnel } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTraining = trainingRecords.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.trainer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'safety':
        return { label: '安全培训', color: 'text-red-600', bg: 'bg-red-100' };
      case 'skill':
        return { label: '技能培训', color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'regulation':
        return { label: '法规培训', color: 'text-green-600', bg: 'bg-green-100' };
      default:
        return { label: type, color: 'text-slate-600', bg: 'bg-slate-100' };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: '已完成', variant: 'success' as const };
      case 'ongoing':
        return { label: '进行中', variant: 'info' as const };
      case 'planned':
        return { label: '待开展', variant: 'pending' as const };
      default:
        return { label: status, variant: 'default' as const };
    }
  };

  const completedCount = trainingRecords.filter((t) => t.status === 'completed').length;
  const totalPersonnel = personnel.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">安全培训</h1>
          <p className="text-slate-500 mt-1">管理培训计划和培训记录</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>新建培训</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">培训总数</p>
              <p className="text-2xl font-bold text-slate-800">{trainingRecords.length}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已完成</p>
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">待开展</p>
              <p className="text-2xl font-bold text-orange-600">
                {trainingRecords.filter((t) => t.status === 'planned').length}
              </p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">参训人员</p>
              <p className="text-2xl font-bold text-purple-600">{totalPersonnel}</p>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索培训名称、讲师..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部类型</option>
                <option value="safety">安全培训</option>
                <option value="skill">技能培训</option>
                <option value="regulation">法规培训</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="planned">待开展</option>
                <option value="ongoing">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
            <Button variant="outline" size="sm">
              导出记录
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Header>
              <tr>
                <Table.Head>培训名称</Table.Head>
                <Table.Head>类型</Table.Head>
                <Table.Head>时间</Table.Head>
                <Table.Head>时长</Table.Head>
                <Table.Head>讲师</Table.Head>
                <Table.Head>参训人员</Table.Head>
                <Table.Head>成绩</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {filteredTraining.map((training) => {
                const typeInfo = getTypeInfo(training.type);
                const statusInfo = getStatusInfo(training.status);

                return (
                  <Table.Row key={training.id}>
                    <Table.Cell>
                      <div>
                        <p className="font-medium text-slate-800">{training.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-xs">
                          {training.content}
                        </p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}
                      >
                        {typeInfo.label}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <p className="text-slate-700">{training.startDate}</p>
                        <p className="text-xs text-slate-500">至 {training.endDate}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{training.duration} 学时</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-700">{training.trainer}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {training.personnelNames.slice(0, 3).map((name, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-xs text-white font-medium"
                            >
                              {name.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-slate-500">
                          {training.personnelNames.length}人
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {training.score !== undefined ? (
                        <span className="font-medium text-slate-800">{training.score} 分</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge variant={statusInfo.variant}>{statusInfo.label}</StatusBadge>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        详情
                      </button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>近期培训计划</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {trainingRecords
                .filter((t) => t.status === 'planned')
                .map((training) => {
                  const typeInfo = getTypeInfo(training.type);
                  return (
                    <div
                      key={training.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-slate-800">{training.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{training.content}</p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}
                        >
                          {typeInfo.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{training.startDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{training.duration}学时</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>{training.personnelNames.length}人</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                          讲师: <span className="text-slate-700">{training.trainer}</span>
                        </p>
                        <Button size="sm" variant="outline">
                          查看详情
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>培训统计</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">安全培训</span>
                  <span className="text-sm font-medium text-slate-800">
                    {trainingRecords.filter((t) => t.type === 'safety').length} 次
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${(trainingRecords.filter((t) => t.type === 'safety').length /
                        trainingRecords.length) *
                        100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">技能培训</span>
                  <span className="text-sm font-medium text-slate-800">
                    {trainingRecords.filter((t) => t.type === 'skill').length} 次
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(trainingRecords.filter((t) => t.type === 'skill').length /
                        trainingRecords.length) *
                        100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">法规培训</span>
                  <span className="text-sm font-medium text-slate-800">
                    {trainingRecords.filter((t) => t.type === 'regulation').length} 次
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(trainingRecords.filter((t) => t.type === 'regulation').length /
                        trainingRecords.length) *
                        100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {trainingRecords.reduce((sum, t) => sum + t.duration, 0)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">总学时</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {trainingRecords.filter((t) => t.certificate).length}
                    </p>
                    <p className="text-xs text-green-600 mt-1">颁发证书</p>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
