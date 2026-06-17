import { useState, useMemo } from 'react';
import { useAppStore, generateId } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import StatusBadge from '@/components/UI/StatusBadge';
import Modal, { ConfirmModal, FormField, Input, Select, Textarea } from '@/components/UI/Modal';
import { Plus, Search, Filter, Eye, Edit2, Trash2, Building2, MapPin, Phone, Calendar, DollarSign, Layers } from 'lucide-react';
import { format } from 'date-fns';
import type { Project } from '@/types';

export default function Projects() {
  const {
    projects,
    customers,
    addProject,
    updateProject,
    deleteProjectWithRelations,
    getProjectRelations,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    customerId: '',
    buildingType: '',
    height: '',
    area: '',
    floors: '',
    amount: '',
    startDate: '',
    endDate: '',
    contact: '',
    phone: '',
    address: '',
    status: 'pending' as Project['status'],
    remarks: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchCustomer = customerFilter === 'all' || project.customerId === customerFilter;
      return matchSearch && matchStatus && matchCustomer;
    });
  }, [projects, searchTerm, statusFilter, customerFilter]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = '请输入项目名称';
    if (!formData.customerId) errors.customerId = '请选择客户';
    if (!formData.buildingType.trim()) errors.buildingType = '请输入建筑类型';
    if (!formData.height || Number(formData.height) <= 0) errors.height = '请输入有效楼高';
    if (!formData.area || Number(formData.area) <= 0) errors.area = '请输入有效面积';
    if (!formData.floors || Number(formData.floors) <= 0) errors.floors = '请输入有效楼层数';
    if (!formData.amount || Number(formData.amount) <= 0) errors.amount = '请输入有效金额';
    if (!formData.startDate) errors.startDate = '请选择开始日期';
    if (!formData.endDate) errors.endDate = '请选择结束日期';
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      errors.endDate = '结束日期不能早于开始日期';
    }
    if (!formData.contact.trim()) errors.contact = '请输入联系人';
    if (!formData.phone.trim()) errors.phone = '请输入联系电话';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      customerId: '',
      buildingType: '',
      height: '',
      area: '',
      floors: '',
      amount: '',
      startDate: '',
      endDate: '',
      contact: '',
      phone: '',
      address: '',
      status: 'pending',
      remarks: '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      customerId: project.customerId,
      buildingType: project.buildingType,
      height: String(project.height),
      area: String(project.area),
      floors: String(project.floors),
      amount: String(project.amount),
      startDate: project.startDate,
      endDate: project.endDate,
      contact: project.contact,
      phone: project.phone,
      address: project.address,
      status: project.status,
      remarks: project.remarks,
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenDetail = (project: Project) => {
    setViewingProject(project);
    setShowDetailModal(true);
  };

  const handleDelete = (projectId: string) => {
    setDeletingProjectId(projectId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingProjectId) {
      deleteProjectWithRelations(deletingProjectId);
      setShowDeleteConfirm(false);
      setDeletingProjectId(null);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const customer = customers.find((c) => c.id === formData.customerId);

    if (editingProject) {
      updateProject(editingProject.id, {
        name: formData.name,
        customerId: formData.customerId,
        customerName: customer?.name || '',
        buildingType: formData.buildingType,
        height: Number(formData.height),
        area: Number(formData.area),
        floors: Number(formData.floors),
        amount: Number(formData.amount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        contact: formData.contact,
        phone: formData.phone,
        address: formData.address,
        status: formData.status,
        remarks: formData.remarks,
      });
    } else {
      const newProject: Project = {
        id: generateId('p'),
        name: formData.name,
        customerId: formData.customerId,
        customerName: customer?.name || '',
        buildingType: formData.buildingType,
        height: Number(formData.height),
        area: Number(formData.area),
        floors: Number(formData.floors),
        amount: Number(formData.amount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        contact: formData.contact,
        phone: formData.phone,
        address: formData.address,
        status: formData.status,
        remarks: formData.remarks,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      addProject(newProject);
    }

    setShowFormModal(false);
  };

  const getStatusInfo = (status: string) => {
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

  const deleteRelationCount = deletingProjectId
    ? getProjectRelations(deletingProjectId)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">项目管理</h1>
          <p className="text-slate-500 mt-1">管理所有外墙清洗项目</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          新建项目
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">全部项目</p>
              <p className="text-2xl font-bold text-slate-800">{projects.length}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">进行中</p>
              <p className="text-2xl font-bold text-blue-600">
                {projects.filter((p) => p.status === 'in_progress').length}
              </p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">待启动</p>
              <p className="text-2xl font-bold text-orange-600">
                {projects.filter((p) => p.status === 'pending').length}
              </p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已完成</p>
              <p className="text-2xl font-bold text-green-600">
                {projects.filter((p) => p.status === 'completed').length}
              </p>
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
                  placeholder="搜索项目名称、客户..."
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
                <option value="pending">待启动</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
              <select
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部客户</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
                <Table.Head>项目名称</Table.Head>
                <Table.Head>客户</Table.Head>
                <Table.Head>建筑类型</Table.Head>
                <Table.Head>楼层/面积</Table.Head>
                <Table.Head>合同金额</Table.Head>
                <Table.Head>时间</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => {
                  const statusInfo = getStatusInfo(project.status);
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
                        <p className="text-slate-700">
                          {project.floors}层 / {project.area}㎡
                        </p>
                        <p className="text-xs text-slate-500">楼高 {project.height}m</p>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-slate-800">
                          {formatCurrency(project.amount)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <p className="text-slate-700">
                          {format(new Date(project.startDate), 'yyyy-MM-dd')}
                        </p>
                        <p className="text-xs text-slate-500">
                          至 {format(new Date(project.endDate), 'MM-dd')}
                        </p>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </StatusBadge>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenDetail(project)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(project)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
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
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    暂无项目数据
                  </td>
                </tr>
              )}
            </Table.Body>
          </Table>
        </Card.Body>
        <Card.Footer>
          <p className="text-sm text-slate-500">
            共 {filteredProjects.length} 条记录
          </p>
        </Card.Footer>
      </Card>

      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingProject ? '编辑项目' : '新建项目'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowFormModal(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingProject ? '保存修改' : '创建项目'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="项目名称" required error={formErrors.name}>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!formErrors.name}
                placeholder="请输入项目名称"
              />
            </FormField>
            <FormField label="客户" required error={formErrors.customerId}>
              <Select
                value={formData.customerId}
                onChange={(e) => {
                  const customer = customers.find((c) => c.id === e.target.value);
                  setFormData({
                    ...formData,
                    customerId: e.target.value,
                    contact: customer?.contact || '',
                    phone: customer?.phone || '',
                    address: customer?.address || '',
                  });
                }}
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
            <FormField label="建筑类型" required error={formErrors.buildingType}>
              <Input
                value={formData.buildingType}
                onChange={(e) => setFormData({ ...formData, buildingType: e.target.value })}
                error={!!formErrors.buildingType}
                placeholder="如：商务写字楼、商业综合体"
              />
            </FormField>
            <FormField label="项目状态" required>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Project['status'],
                  })
                }
              >
                <option value="pending">待启动</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="楼高(米)" required error={formErrors.height}>
              <Input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                error={!!formErrors.height}
                placeholder="如：120"
              />
            </FormField>
            <FormField label="面积(㎡)" required error={formErrors.area}>
              <Input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                error={!!formErrors.area}
                placeholder="如：15000"
              />
            </FormField>
            <FormField label="楼层数" required error={formErrors.floors}>
              <Input
                type="number"
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                error={!!formErrors.floors}
                placeholder="如：32"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="合同金额(元)" required error={formErrors.amount}>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                error={!!formErrors.amount}
                placeholder="如：180000"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="开始日期" required error={formErrors.startDate}>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                error={!!formErrors.startDate}
              />
            </FormField>
            <FormField label="结束日期" required error={formErrors.endDate}>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                error={!!formErrors.endDate}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="联系人" required error={formErrors.contact}>
              <Input
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                error={!!formErrors.contact}
                placeholder="请输入联系人姓名"
              />
            </FormField>
            <FormField label="联系电话" required error={formErrors.phone}>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={!!formErrors.phone}
                placeholder="请输入联系电话"
              />
            </FormField>
          </div>

          <FormField label="项目地址">
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="请输入项目地址"
            />
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

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="项目详情"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (viewingProject) {
                  handleOpenEdit(viewingProject);
                  setShowDetailModal(false);
                }
              }}
            >
              编辑项目
            </Button>
            <Button onClick={() => setShowDetailModal(false)}>关闭</Button>
          </div>
        }
      >
        {viewingProject && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{viewingProject.name}</h3>
                <p className="text-slate-500 mt-1">{viewingProject.customerName}</p>
              </div>
              <StatusBadge variant={getStatusInfo(viewingProject.status).variant}>
                {getStatusInfo(viewingProject.status).label}
              </StatusBadge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Building2 className="w-4 h-4" />
                  建筑类型
                </div>
                <p className="font-medium text-slate-800">{viewingProject.buildingType}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Layers className="w-4 h-4" />
                  楼层/面积
                </div>
                <p className="font-medium text-slate-800">
                  {viewingProject.floors}层 / {viewingProject.area}㎡
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <DollarSign className="w-4 h-4" />
                  合同金额
                </div>
                <p className="font-medium text-slate-800">
                  {formatCurrency(viewingProject.amount)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  工期
                </div>
                <p className="font-medium text-slate-800">
                  {viewingProject.startDate} 至 {viewingProject.endDate}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  项目地址
                </div>
                <p className="font-medium text-slate-800">{viewingProject.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Phone className="w-4 h-4" />
                  联系人
                </div>
                <p className="font-medium text-slate-800">
                  {viewingProject.contact} / {viewingProject.phone}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Building2 className="w-4 h-4" />
                  楼高
                </div>
                <p className="font-medium text-slate-800">{viewingProject.height} 米</p>
              </div>
            </div>

            {viewingProject.remarks && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-800 font-medium mb-1">备注</p>
                <p className="text-sm text-yellow-700">{viewingProject.remarks}</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-medium text-slate-800 mb-3">关联数据</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {getProjectRelations(viewingProject.id).schedules.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">作业排期</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {getProjectRelations(viewingProject.id).workRecords.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">作业记录</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {getProjectRelations(viewingProject.id).billings.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">结算记录</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingProjectId(null);
        }}
        onConfirm={confirmDelete}
        title="确认删除项目"
        variant="danger"
        confirmText="确认删除"
        message={
          <div className="space-y-4">
            <p className="text-slate-600">
              确定要删除该项目吗？此操作将同时删除以下关联数据：
            </p>
            {deleteRelationCount && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <p className="text-xl font-bold text-red-600">
                    {deleteRelationCount.schedules.length}
                  </p>
                  <p className="text-xs text-red-500">作业排期</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <p className="text-xl font-bold text-red-600">
                    {deleteRelationCount.workRecords.length}
                  </p>
                  <p className="text-xs text-red-500">作业记录</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <p className="text-xl font-bold text-red-600">
                    {deleteRelationCount.billings.length}
                  </p>
                  <p className="text-xs text-red-500">结算记录</p>
                </div>
              </div>
            )}
            <p className="text-sm text-red-500 font-medium">
              ⚠️ 删除后无法恢复，请谨慎操作！
            </p>
          </div>
        }
      />
    </div>
  );
}
