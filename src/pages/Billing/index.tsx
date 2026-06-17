import { useState, useMemo } from 'react';
import { useAppStore, generateId } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import StatusBadge from '@/components/UI/StatusBadge';
import Modal, { ConfirmModal, FormField, Input, Select, Textarea } from '@/components/UI/Modal';
import { Plus, Search, DollarSign, FileText, CheckCircle, Clock, AlertCircle, Edit2, Trash2, Eye, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import type { Billing } from '@/types';

export default function Billing() {
  const { billings, projects, customers, addBilling, updateBilling, deleteBilling } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingBilling, setEditingBilling] = useState<Billing | null>(null);
  const [deletingBillingId, setDeletingBillingId] = useState<string | null>(null);
  const [viewingBilling, setViewingBilling] = useState<Billing | null>(null);

  const [formData, setFormData] = useState({
    projectId: '',
    customerId: '',
    invoiceNumber: '',
    amount: '',
    paidAmount: '',
    issueDate: '',
    dueDate: '',
    paymentDate: '',
    status: 'unpaid' as Billing['status'],
    items: [] as { description: string; quantity: number; unitPrice: number }[],
    remarks: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredBilling = useMemo(() => {
    return billings.filter((b) => {
      const project = projects.find((p) => p.id === b.projectId);
      const customer = customers.find((c) => c.id === b.customerId);
      const matchSearch =
        (project?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchProject = projectFilter === 'all' || b.projectId === projectFilter;
      return matchSearch && matchStatus && matchProject;
    });
  }, [billings, projects, customers, searchTerm, statusFilter, projectFilter]);

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || '未知项目';
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer?.name || '未知客户';
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: '已收款', variant: 'success' as const };
      case 'unpaid':
        return { label: '待收款', variant: 'warning' as const };
      case 'partial':
        return { label: '部分收款', variant: 'info' as const };
      case 'overdue':
        return { label: '已逾期', variant: 'danger' as const };
      case 'cancelled':
        return { label: '已取消', variant: 'default' as const };
      default:
        return { label: status, variant: 'default' as const };
    }
  };

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.projectId) errors.projectId = '请选择项目';
    if (!formData.customerId) errors.customerId = '请选择客户';
    if (!formData.invoiceNumber.trim()) errors.invoiceNumber = '请输入发票编号';
    if (!formData.amount || Number(formData.amount) <= 0) errors.amount = '请输入有效金额';
    if (!formData.issueDate) errors.issueDate = '请选择开票日期';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingBilling(null);
    setFormData({
      projectId: '',
      customerId: '',
      invoiceNumber: '',
      amount: '',
      paidAmount: '',
      issueDate: '',
      dueDate: '',
      paymentDate: '',
      status: 'unpaid',
      items: [],
      remarks: '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenEdit = (billing: Billing) => {
    setEditingBilling(billing);
    setFormData({
      projectId: billing.projectId,
      customerId: billing.customerId,
      invoiceNumber: billing.invoiceNumber,
      amount: String(billing.amount),
      paidAmount: String(billing.paidAmount || 0),
      issueDate: billing.issueDate,
      dueDate: billing.dueDate || '',
      paymentDate: billing.paymentDate || '',
      status: billing.status,
      items: billing.items || [],
      remarks: billing.remarks || '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenDetail = (billing: Billing) => {
    setViewingBilling(billing);
    setShowDetailModal(true);
  };

  const handleDelete = (billingId: string) => {
    setDeletingBillingId(billingId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingBillingId) {
      deleteBilling(deletingBillingId);
      setShowDeleteConfirm(false);
      setDeletingBillingId(null);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingBilling) {
      updateBilling(editingBilling.id, {
        projectId: formData.projectId,
        customerId: formData.customerId,
        invoiceNumber: formData.invoiceNumber,
        amount: Number(formData.amount),
        paidAmount: Number(formData.paidAmount) || 0,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        paymentDate: formData.paymentDate,
        status: formData.status,
        items: formData.items,
        remarks: formData.remarks,
      });
    } else {
      const newBilling: Billing = {
        id: generateId('bl'),
        projectId: formData.projectId,
        customerId: formData.customerId,
        invoiceNumber: formData.invoiceNumber,
        amount: Number(formData.amount),
        paidAmount: Number(formData.paidAmount) || 0,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        paymentDate: formData.paymentDate,
        status: formData.status,
        items: formData.items,
        remarks: formData.remarks,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      addBilling(newBilling);
    }

    setShowFormModal(false);
  };

  const totalAmount = billings.reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = billings.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalUnpaid = totalAmount - totalPaid;
  const overdueCount = billings.filter((b) => b.status === 'overdue').length;

  const billingStatusOptions = [
    { value: 'unpaid', label: '待收款' },
    { value: 'partial', label: '部分收款' },
    { value: 'paid', label: '已收款' },
    { value: 'overdue', label: '已逾期' },
    { value: 'cancelled', label: '已取消' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">结算开票</h1>
          <p className="text-slate-500 mt-1">管理项目结算和发票收款记录</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          新增开票
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">开票总额</p>
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
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">待收款</p>
              <p className="text-xl font-bold text-orange-600">{formatCurrency(totalUnpaid)}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已逾期</p>
              <p className="text-xl font-bold text-red-600">{overdueCount} 张</p>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索项目、客户、发票号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部项目</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部状态</option>
                {billingStatusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Header>
              <tr>
                <Table.Head>发票编号</Table.Head>
                <Table.Head>项目</Table.Head>
                <Table.Head>客户</Table.Head>
                <Table.Head>开票金额</Table.Head>
                <Table.Head>已收金额</Table.Head>
                <Table.Head>开票日期</Table.Head>
                <Table.Head>到期日期</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {filteredBilling.length > 0 ? (
                filteredBilling.map((billing) => {
                  const statusInfo = getStatusInfo(billing.status);
                  return (
                    <Table.Row key={billing.id}>
                      <Table.Cell>
                        <span className="font-medium text-blue-600">{billing.invoiceNumber}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-800">{getProjectName(billing.projectId)}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{getCustomerName(billing.customerId)}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-800 font-medium">
                          {formatCurrency(billing.amount)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-green-600 font-medium">
                          {formatCurrency(billing.paidAmount)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{billing.issueDate}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{billing.dueDate || '-'}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge variant={statusInfo.variant}>{statusInfo.label}</StatusBadge>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenDetail(billing)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(billing)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(billing.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-500 hover:text-red-600"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    暂无开票记录
                  </td>
                </tr>
              )}
            </Table.Body>
          </Table>
        </Card.Body>
        <Card.Footer>
          <p className="text-sm text-slate-500">共 {filteredBilling.length} 条记录</p>
        </Card.Footer>
      </Card>

      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingBilling ? '编辑开票' : '新增开票'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowFormModal(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingBilling ? '保存修改' : '创建开票'}
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
                    customerId: project?.customerId || formData.customerId,
                  });
                }}
                error={!!formErrors.projectId}
              >
                <option value="">请选择项目</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="客户" required error={formErrors.customerId}>
              <Select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                error={!!formErrors.customerId}
              >
                <option value="">请选择客户</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="发票编号" required error={formErrors.invoiceNumber}>
              <Input
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                error={!!formErrors.invoiceNumber}
                placeholder="如：INV-2024-001"
              />
            </FormField>
            <FormField label="状态">
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Billing['status'] })
                }
              >
                {billingStatusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="开票金额(元)" required error={formErrors.amount}>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                error={!!formErrors.amount}
                placeholder="请输入开票金额"
              />
            </FormField>
            <FormField label="已收金额(元)">
              <Input
                type="number"
                value={formData.paidAmount}
                onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                placeholder="请输入已收金额"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="开票日期" required error={formErrors.issueDate}>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                error={!!formErrors.issueDate}
              />
            </FormField>
            <FormField label="到期日期">
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </FormField>
            <FormField label="收款日期">
              <Input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              />
            </FormField>
          </div>

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

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="开票详情"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (viewingBilling) {
                  handleOpenEdit(viewingBilling);
                  setShowDetailModal(false);
                }
              }}
            >
              编辑开票
            </Button>
            <Button onClick={() => setShowDetailModal(false)}>关闭</Button>
          </div>
        }
      >
        {viewingBilling && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {viewingBilling.invoiceNumber}
                </h3>
                <p className="text-slate-500 mt-1">
                  {getProjectName(viewingBilling.projectId)}
                </p>
              </div>
              <StatusBadge variant={getStatusInfo(viewingBilling.status).variant}>
                {getStatusInfo(viewingBilling.status).label}
              </StatusBadge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">客户</p>
                <p className="font-medium text-slate-800">
                  {getCustomerName(viewingBilling.customerId)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">开票日期</p>
                <p className="font-medium text-slate-800">{viewingBilling.issueDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-600 mb-1">开票金额</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatCurrency(viewingBilling.amount)}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-xs text-green-600 mb-1">已收金额</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(viewingBilling.paidAmount)}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl">
                <p className="text-xs text-orange-600 mb-1">待收金额</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(viewingBilling.amount - viewingBilling.paidAmount)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">到期日期</p>
                <p className="font-medium text-slate-800">{viewingBilling.dueDate || '-'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">收款日期</p>
                <p className="font-medium text-slate-800">
                  {viewingBilling.paymentDate || '-'}
                </p>
              </div>
            </div>

            {viewingBilling.remarks && (
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-800 mb-2">备注</p>
                <p className="text-sm text-slate-600">{viewingBilling.remarks}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingBillingId(null);
        }}
        onConfirm={confirmDelete}
        title="确认删除开票"
        variant="danger"
        confirmText="确认删除"
        message={
          <div className="space-y-2">
            <p className="text-slate-600">确定要删除这条开票记录吗？</p>
            <p className="text-sm text-red-500 font-medium">⚠️ 删除后无法恢复，请谨慎操作！</p>
          </div>
        }
      />
    </div>
  );
}
