import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import StatusBadge from '@/components/UI/StatusBadge';
import { Plus, Search, Filter, MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Projects() {
  const { projects, deleteProject } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: '已完成', variant: 'success' as const };
      case 'in_progress':
        return { label: '进行中', variant: 'info' as const };
      case 'pending':
        return { label: '待启动', variant: 'pending' as const };
      case 'cancelled':
        return { label: '已取消', variant: 'default' as const };
      default:
        return { label: status, variant: 'default' as const };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">项目管理</h1>
          <p className="text-slate-500 mt-1">管理所有外墙清洗项目</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>新建项目</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-slate-500">全部项目</p>
            <p className="text-2xl font-bold text-slate-800 mt-2">{projects.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-slate-500">进行中</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {projects.filter((p) => p.status === 'in_progress').length}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-slate-500">待启动</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {projects.filter((p) => p.status === 'pending').length}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-slate-500">已完成</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {projects.filter((p) => p.status === 'completed').length}
            </p>
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
                placeholder="搜索项目名称、客户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-36 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="pending">待启动</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
          </div>
          <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
            更多筛选
          </Button>
        </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Header>
              <tr>
                <Table.Head>项目名称</Table.Head>
                <Table.Head>客户</Table.Head>
                <Table.Head>建筑类型</Table.Head>
                <Table.Head>楼层/面积</Table.Head>
                <Table.Head>合同金额</Table.Head>
                <Table.Head>开始时间</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {filteredProjects.map((project) => {
                const statusInfo = getStatusLabel(project.status);
                return (
                  <Table.Row key={project.id}>
                    <Table.Cell>
                      <div>
                        <p className="font-medium text-slate-800">{project.name}</p>
                        <p className="text-xs text-slate-500">{project.address}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="text-slate-700">{project.customerName}</p>
                      <p className="text-xs text-slate-500">{project.contact}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-600">{project.buildingType}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="text-slate-700">{project.floors}层 / {project.area}㎡</p>
                      <p className="text-xs text-slate-500">楼高 {project.height}m</p>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-medium text-slate-800">{formatCurrency(project.amount)}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="text-slate-700">{format(new Date(project.startDate), 'yyyy-MM-dd')}</p>
                      <p className="text-xs text-slate-500">至 {format(new Date(project.endDate), 'MM-dd')}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge variant={statusInfo.variant}>{statusInfo.label}</StatusBadge>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setShowMenu(showMenu === project.id ? null : project.id)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-slate-500" />
                        </button>
                        {showMenu === project.id && (
                          <div className="absolute right-0 top-9 w-36 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-10">
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              查看详情
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <Edit2 className="w-4 h-4" />
                              编辑
                            </button>
                            <button
                              onClick={() => deleteProject(project.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              删除
                            </button>
                          </div>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Card.Body>
        <Card.Footer>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              共 {filteredProjects.length} 条记录
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                上一页
              </button>
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                2
              </button>
              <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                下一页
              </button>
            </div>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}
