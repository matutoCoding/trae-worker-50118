import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import StatusBadge from '@/components/UI/StatusBadge';
import { Plus, Search, Filter, CircleDot, Shield, HardHat, Link, Package, AlertTriangle, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Equipment() {
  const { equipment, inspectionRecords } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'list' | 'inspection'>('list');

  const today = new Date();

  const filteredEquipment = equipment.filter((eq) => {
    const matchSearch =
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.serialNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || eq.type === typeFilter;
    const matchStatus = statusFilter === 'all' || eq.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rope':
        return { icon: CircleDot, label: '绳索', color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'harness':
        return { icon: Shield, label: '安全带', color: 'text-green-600', bg: 'bg-green-100' };
      case 'helmet':
        return { icon: HardHat, label: '安全帽', color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'carabiner':
        return { icon: Link, label: '锁具', color: 'text-purple-600', bg: 'bg-purple-100' };
      default:
        return { icon: Package, label: '其他', color: 'text-slate-600', bg: 'bg-slate-100' };
    }
  };

  const getStatusInfo = (eq: any) => {
    if (eq.status === 'scrapped') {
      return { label: '已报废', variant: 'danger' as const };
    }
    if (eq.status === 'maintenance') {
      return { label: '维护中', variant: 'warning' as const };
    }
    if (eq.status === 'inspecting') {
      return { label: '检验中', variant: 'info' as const };
    }
    const nextInspection = new Date(eq.nextInspectionDate);
    const daysLeft = differenceInDays(nextInspection, today);
    if (daysLeft <= 0) {
      return { label: '已过期', variant: 'danger' as const };
    }
    if (daysLeft <= 30) {
      return { label: '即将到期', variant: 'warning' as const };
    }
    return { label: '正常', variant: 'success' as const };
  };

  const typeStats = {
    rope: equipment.filter((e) => e.type === 'rope').length,
    harness: equipment.filter((e) => e.type === 'harness').length,
    helmet: equipment.filter((e) => e.type === 'helmet').length,
    carabiner: equipment.filter((e) => e.type === 'carabiner').length,
  };

  const warningCount = equipment.filter((e) => {
    if (e.status === 'normal') {
      const daysLeft = differenceInDays(new Date(e.nextInspectionDate), today);
      return daysLeft <= 30;
    }
    return false;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">绳索装备</h1>
          <p className="text-slate-500 mt-1">管理作业装备台账和检验记录</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">检验记录</Button>
          <Button icon={<Plus className="w-4 h-4" />}>新增装备</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">装备总数</p>
              <p className="text-2xl font-bold text-slate-800">{equipment.length}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">正常可用</p>
              <p className="text-2xl font-bold text-green-600">
                {equipment.filter((e) => e.status === 'normal').length}
              </p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">待检验</p>
              <p className="text-2xl font-bold text-orange-600">{warningCount}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">检验中</p>
              <p className="text-2xl font-bold text-purple-600">
                {equipment.filter((e) => e.status === 'inspecting').length}
              </p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已报废</p>
              <p className="text-2xl font-bold text-red-600">
                {equipment.filter((e) => e.status === 'scrapped').length}
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { type: 'rope', label: '绳索', count: typeStats.rope },
          { type: 'harness', label: '安全带', count: typeStats.harness },
          { type: 'helmet', label: '安全帽', count: typeStats.helmet },
          { type: 'carabiner', label: '锁具', count: typeStats.carabiner },
        ].map((item) => {
          const typeInfo = getTypeIcon(item.type);
          const Icon = typeInfo.icon;
          return (
            <Card
              key={item.type}
              hover
              className={cn(
                'cursor-pointer transition-all',
                typeFilter === item.type && 'ring-2 ring-blue-500'
              )}
              onClick={() => setTypeFilter(typeFilter === item.type ? 'all' : item.type)}
            >
              <Card.Body className="flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', typeInfo.bg)}>
                  <Icon className={cn('w-6 h-6', typeInfo.color)} />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{item.label}</p>
                  <p className="text-2xl font-bold text-slate-700">{item.count} 件</p>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      <Card>
        <Card.Header>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索装备名称、型号、编号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="normal">正常</option>
                <option value="inspecting">检验中</option>
                <option value="maintenance">维护中</option>
                <option value="scrapped">已报废</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                导出
              </Button>
              <Button variant="outline" size="sm">
                批量检验
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Header>
            <tr>
              <Table.Head>装备名称</Table.Head>
              <Table.Head>类型</Table.Head>
              <Table.Head>型号/规格</Table.Head>
              <Table.Head>编号</Table.Head>
              <Table.Head>购入日期</Table.Head>
              <Table.Head>使用次数</Table.Head>
              <Table.Head>上次检验</Table.Head>
              <Table.Head>下次检验</Table.Head>
              <Table.Head>状态</Table.Head>
              <Table.Head className="text-right">操作</Table.Head>
            </tr>
            </Table.Header>
            <Table.Body>
              {filteredEquipment.map((eq) => {
                const typeInfo = getTypeIcon(eq.type);
                const TypeIcon = typeInfo.icon;
                const statusInfo = getStatusInfo(eq);
                const daysLeft = differenceInDays(new Date(eq.nextInspectionDate), today);

                return (
                  <Table.Row key={eq.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', typeInfo.bg)}>
                          <TypeIcon className={cn('w-5 h-5', typeInfo.color)} />
                        </div>
                        <span className="font-medium text-slate-800">{eq.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-600">{typeInfo.label}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                      <p className="text-slate-700">{eq.model}</p>
                      <p className="text-xs text-slate-500">{eq.specification}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-mono text-sm text-slate-600">{eq.serialNo}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-600">{eq.purchaseDate}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-700">{eq.usageCount} 次</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-600">{eq.lastInspectionDate}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <p className="text-slate-700">{eq.nextInspectionDate}</p>
                        {eq.status === 'normal' && (
                          <p
                            className={cn('text-xs', 
                            daysLeft <= 30 ? 'text-orange-600' : 'text-slate-500'
                            )}
                          >
                            {daysLeft > 0 ? `还剩 ${daysLeft} 天` : '已过期'}
                          </p>
                        )}
                      </div>
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

      <Card>
        <Card.Header>
          <Card.Title>近期检验记录</Card.Title>
        </Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Header>
            <tr>
              <Table.Head>检验日期</Table.Head>
              <Table.Head>装备名称</Table.Head>
              <Table.Head>检验员</Table.Head>
              <Table.Head>检验结果</Table.Head>
              <Table.Head>下次检验</Table.Head>
              <Table.Head>备注</Table.Head>
            </tr>
            </Table.Header>
            <Table.Body>
              {inspectionRecords.map((record) => (
                <Table.Row key={record.id}>
                  <Table.Cell>
                    <span className="text-slate-700">{record.inspectionDate}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-slate-800">{record.equipmentName}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-slate-600">{record.inspector}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge
                      variant={
                        record.result === 'pass'
                          ? 'success'
                          : record.result === 'fail'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {record.result === 'pass'
                        ? '合格'
                        : record.result === 'fail'
                        ? '不合格'
                        : '需维护'}
                    </StatusBadge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-slate-600">{record.nextInspectionDate || '-'}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-slate-500 text-sm">{record.remarks}</span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
