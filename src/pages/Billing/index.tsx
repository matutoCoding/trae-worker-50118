import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import StatusBadge from '@/components/UI/StatusBadge';
import { Plus, Search, DollarSign, FileText, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Billing() {
  const { billings, projects } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBillings = billings.filter((b) => {
    const matchSearch =
      b.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalAmount = billings.reduce((sum, b) => sum + b.amount, 0);
  const paidAmount = billings.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const invoicedAmount = billings.filter((b) => b.status === 'invoiced').reduce((sum, b) => sum + b.amount, 0);
  const overdueAmount = billings.filter((b) => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: '已收款', variant: 'success' as const };
      case 'invoiced':
        return { label: '已开票', variant: 'info' as const };
      case 'uninvoiced':
        return { label: '未开票', variant: 'pending' as const };
      case 'overdue':
        return { label: '已逾期', variant: 'danger' as const };
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

  const monthlyData = [
    { month: '1月', 收入: 450000 },
    { month: '2月', 收入: 580000 },
    { month: '3月', 收入: 720000 },
    { month: '4月', 收入: 650000 },
    { month: '5月', 收入: 880000 },
    { month: '6月', 收入: 950000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">结算开票</h1>
          <p className="text-slate-500 mt-1">管理项目结算和发票收款记录</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">导出报表</Button>
          <Button icon={<Plus className="w-4 h-4" />}>新建发票</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">合同总金额</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(totalAmount)}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已收款</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">待收款</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(invoicedAmount)}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已逾期</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(overdueAmount)}</p>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>月度收入趋势</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="收入" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>收款统计</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">收款率</span>
                  <span className="text-sm font-medium text-green-600">
                    {((paidAmount / totalAmount) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${(paidAmount / totalAmount) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-sm text-slate-600">已收款</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">
                    {billings.filter((b) => b.status === 'paid').length} 笔
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-sm text-slate-600">已开票</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">
                    {billings.filter((b) => b.status === 'invoiced').length} 笔
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span className="text-sm text-slate-600">未开票</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">
                    {billings.filter((b) => b.status === 'uninvoiced').length} 笔
                  </span>
                </div>
              </div>
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
                  placeholder="搜索项目名称、发票号..."
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
                <option value="uninvoiced">未开票</option>
                <option value="invoiced">已开票</option>
                <option value="paid">已收款</option>
                <option value="overdue">已逾期</option>
              </select>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Header>
              <tr>
                <Table.Head>项目名称</Table.Head>
                <Table.Head>付款单位</Table.Head>
                <Table.Head>发票号</Table.Head>
                <Table.Head>金额</Table.Head>
                <Table.Head>开票日期</Table.Head>
                <Table.Head>到期日期</Table.Head>
                <Table.Head>收款日期</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {filteredBillings.map((billing) => {
                const statusInfo = getStatusInfo(billing.status);
                return (
                  <Table.Row key={billing.id}>
                    <Table.Cell>
                      <span className="font-medium text-slate-800">{billing.projectName}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-600">{billing.payer}</span>
                    </Table.Cell>
                    <Table.Cell>
                      {billing.invoiceNo ? (
                        <span className="font-mono text-sm text-slate-700">
                          {billing.invoiceNo}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(billing.amount)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      {billing.invoiceDate ? (
                        <span className="text-slate-600">{billing.invoiceDate}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {billing.dueDate ? (
                        <span className="text-slate-600">{billing.dueDate}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {billing.paidDate ? (
                        <span className="text-green-600">{billing.paidDate}</span>
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
            <Card.Title>待开票项目</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {billings
                .filter((b) => b.status === 'uninvoiced')
                .map((billing) => (
                  <div
                    key={billing.id}
                    className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{billing.projectName}</p>
                      <p className="text-sm text-orange-600">{formatCurrency(billing.amount)}</p>
                    </div>
                    <Button size="sm">开票</Button>
                  </div>
                ))}
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>待收款提醒</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {billings
                .filter((b) => b.status === 'invoiced')
                .map((billing) => (
                  <div
                    key={billing.id}
                    className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{billing.projectName}</p>
                      <p className="text-sm text-blue-600">
                        {formatCurrency(billing.amount)} · {billing.invoiceNo}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      标记已收
                    </Button>
                  </div>
                ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
