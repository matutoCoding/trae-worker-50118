import { useState, useMemo } from 'react';
import { useAppStore, generateId } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import Modal, { ConfirmModal, FormField, Input, Select, Textarea } from '@/components/UI/Modal';
import { Plus, Search, Building2, Phone, MapPin, Briefcase, User, Edit2, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import type { Customer } from '@/types';

export default function Customers() {
  const { customers, projects, addCustomer, updateCustomer, deleteCustomer, getCustomerProjects } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    contact: '',
    phone: '',
    address: '',
    remarks: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm);
      const matchIndustry = industryFilter === 'all' || c.industry === industryFilter;
      return matchSearch && matchIndustry;
    });
  }, [customers, searchTerm, industryFilter]);

  const industries = useMemo(
    () => [...new Set(customers.map((c) => c.industry))],
    [customers]
  );

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = '请输入客户名称';
    if (!formData.industry.trim()) errors.industry = '请输入行业';
    if (!formData.contact.trim()) errors.contact = '请输入联系人';
    if (!formData.phone.trim()) errors.phone = '请输入联系电话';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      industry: '',
      contact: '',
      phone: '',
      address: '',
      remarks: '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      industry: customer.industry,
      contact: customer.contact,
      phone: customer.phone,
      address: customer.address,
      remarks: customer.remarks || '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenDetail = (customer: Customer) => {
    setViewingCustomer(customer);
    setShowDetailModal(true);
  };

  const handleDelete = (customerId: string) => {
    const customerProjects = getCustomerProjects(customerId);
    if (customerProjects.length > 0) {
      alert('该客户下有项目，无法直接删除');
      return;
    }
    setDeletingCustomerId(customerId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingCustomerId) {
      deleteCustomer(deletingCustomerId);
      setShowDeleteConfirm(false);
      setDeletingCustomerId(null);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: formData.name,
        industry: formData.industry,
        contact: formData.contact,
        phone: formData.phone,
        address: formData.address,
        remarks: formData.remarks,
      });
    } else {
      const newCustomer: Customer = {
        id: generateId('c'),
        name: formData.name,
        industry: formData.industry,
        contact: formData.contact,
        phone: formData.phone,
        address: formData.address,
        remarks: formData.remarks,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      addCustomer(newCustomer);
    }

    setShowFormModal(false);
  };

  const commonIndustryOptions = ['商务办公楼', '商业综合体', '酒店宾馆', '医院', '住宅', '政府机关', '学校教育', '其他'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">客户管理</h1>
          <p className="text-slate-500 mt-1">管理客户信息和合作记录</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          新增客户
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">客户总数</p>
              <p className="text-2xl font-bold text-slate-800">{customers.length}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">合作项目</p>
              <p className="text-2xl font-bold text-green-600">{projects.length}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">联系人</p>
              <p className="text-2xl font-bold text-orange-600">{customers.length}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">行业数量</p>
              <p className="text-2xl font-bold text-purple-600">{industries.length}</p>
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
                  placeholder="搜索客户名称、联系人、电话..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部行业</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
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
                <Table.Head>客户名称</Table.Head>
                <Table.Head>行业</Table.Head>
                <Table.Head>联系人</Table.Head>
                <Table.Head>联系电话</Table.Head>
                <Table.Head>地址</Table.Head>
                <Table.Head>合作项目</Table.Head>
                <Table.Head>创建时间</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => {
                  const customerProjects = getCustomerProjects(customer.id);
                  return (
                    <Table.Row key={customer.id}>
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-800">{customer.name}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {customer.industry}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{customer.contact}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{customer.phone}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-start gap-2 max-w-xs">
                          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600 text-sm truncate">{customer.address}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-blue-600">{customerProjects.length} 个</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{customer.createdAt}</span>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenDetail(customer)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(customer)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
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
                    暂无客户数据
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
        title={editingCustomer ? '编辑客户' : '新增客户'}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowFormModal(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingCustomer ? '保存修改' : '创建客户'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="客户名称" required error={formErrors.name}>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!formErrors.name}
            placeholder="请输入客户名称"
          />
        </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="行业" required error={formErrors.industry}>
              <Select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                error={!!formErrors.industry}
              >
                <option value="">请选择行业</option>
                {commonIndustryOptions.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </Select>
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

          <FormField label="地址">
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="请输入客户地址"
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
        title="客户详情"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (viewingCustomer) {
                  handleOpenEdit(viewingCustomer);
                  setShowDetailModal(false);
                }
              }}
            >
              编辑客户
            </Button>
            <Button onClick={() => setShowDetailModal(false)}>关闭</Button>
          </div>
        }
      >
        {viewingCustomer && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{viewingCustomer.name}</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {viewingCustomer.industry}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">联系人</p>
                <p className="font-medium text-slate-800">{viewingCustomer.contact}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">联系电话</p>
                <p className="font-medium text-slate-800">{viewingCustomer.phone}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">地址</p>
              <p className="font-medium text-slate-800">{viewingCustomer.address}</p>
            </div>

            {viewingCustomer.remarks && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-700 font-medium mb-1">备注</p>
                <p className="text-sm text-yellow-600">{viewingCustomer.remarks}</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-medium text-slate-800 mb-3">合作项目</h4>
              <div className="space-y-2">
                {getCustomerProjects(viewingCustomer.id).length > 0 ? (
                  getCustomerProjects(viewingCustomer.id).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">{project.name}</span>
                      <span className="text-xs text-blue-600">{project.status === 'completed' ? '已完成' : project.status === 'in_progress' ? '进行中' : '待启动'}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4">暂无合作项目</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingCustomerId(null);
        }}
        onConfirm={confirmDelete}
        title="确认删除客户"
        variant="danger"
        confirmText="确认删除"
        message={
          <div className="space-y-2">
            <p className="text-slate-600">确定要删除该客户吗？</p>
            <p className="text-sm text-red-500 font-medium">⚠️ 删除后无法恢复，请谨慎操作！</p>
          </div>
        }
      />
    </div>
  );
}
