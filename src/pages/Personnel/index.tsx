import { useState, useMemo } from 'react';
import { useAppStore, generateId } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import StatusBadge from '@/components/UI/StatusBadge';
import Modal, { ConfirmModal, FormField, Input, Select, Textarea } from '@/components/UI/Modal';
import { Plus, Search, User, Phone, MapPin, Calendar, Award, AlertTriangle, CheckCircle, Edit2, Trash2, Eye } from 'lucide-react';
import { differenceInDays, format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Personnel, Certificate } from '@/types';

export default function PersonnelPage() {
  const {
    personnel,
    certificates,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    getPersonnelCertificates,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [showPersonForm, setShowPersonForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCertDeleteConfirm, setShowCertDeleteConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [deletingPersonnelId, setDeletingPersonnelId] = useState<string | null>(null);
  const [deletingCertificateId, setDeletingCertificateId] = useState<string | null>(null);
  const [viewingPersonnel, setViewingPersonnel] = useState<Personnel | null>(null);

  const [personFormData, setPersonFormData] = useState({
    name: '',
    phone: '',
    position: '',
    status: 'active' as Personnel['status'],
    idNumber: '',
    address: '',
    entryDate: '',
    remarks: '',
  });

  const [certFormData, setCertFormData] = useState({
    type: '',
    certNumber: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    status: 'valid' as Certificate['status'],
    personnelId: '',
    remarks: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [certFormErrors, setCertFormErrors] = useState<Record<string, string>>({});

  const today = new Date();

  const filteredPersonnel = useMemo(() => {
    return personnel.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        p.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [personnel, searchTerm, statusFilter]);

  const getCertStatus = (cert: Certificate) => {
    const daysLeft = differenceInDays(new Date(cert.expiryDate), today);
    if (daysLeft <= 0) return 'expired';
    if (daysLeft <= 30) return 'expiring';
    return 'valid';
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { label: '在职', variant: 'success' as const };
      case 'inactive':
        return { label: '离职', variant: 'default' as const };
      case 'leave':
        return { label: '休假', variant: 'warning' as const };
      default:
        return { label: status, variant: 'default' as const };
    }
  };

  const expiringCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const status = getCertStatus(c);
      return status === 'expiring' || status === 'expired';
    });
  }, [certificates]);

  const validatePersonForm = () => {
    const errors: Record<string, string> = {};
    if (!personFormData.name.trim()) errors.name = '请输入姓名';
    if (!personFormData.phone.trim()) errors.phone = '请输入电话';
    if (!personFormData.position.trim()) errors.position = '请输入岗位';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCertForm = () => {
    const errors: Record<string, string> = {};
    if (!certFormData.type.trim()) errors.type = '请输入证书类型';
    if (!certFormData.certNumber.trim()) errors.certNumber = '请输入证书编号';
    if (!certFormData.issuingAuthority.trim()) errors.issuingAuthority = '请输入发证机关';
    if (!certFormData.issueDate) errors.issueDate = '请选择发证日期';
    if (!certFormData.expiryDate) errors.expiryDate = '请选择到期日期';
    setCertFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAddPerson = () => {
    setEditingPersonnel(null);
    setPersonFormData({
      name: '',
      phone: '',
      position: '',
      status: 'active',
      idNumber: '',
      address: '',
      entryDate: '',
      remarks: '',
    });
    setFormErrors({});
    setShowPersonForm(true);
  };

  const handleOpenEditPerson = (person: Personnel) => {
    setEditingPersonnel(person);
    setPersonFormData({
      name: person.name,
      phone: person.phone,
      position: person.position,
      status: person.status,
      idNumber: person.idNumber || '',
      address: person.address || '',
      entryDate: person.entryDate || '',
      remarks: person.remarks || '',
    });
    setFormErrors({});
    setShowPersonForm(true);
  };

  const handleOpenDetail = (person: Personnel) => {
    setViewingPersonnel(person);
    setShowDetailModal(true);
  };

  const handleDeletePerson = (personId: string) => {
    setDeletingPersonnelId(personId);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePerson = () => {
    if (deletingPersonnelId) {
      deletePersonnel(deletingPersonnelId);
      setShowDeleteConfirm(false);
      setDeletingPersonnelId(null);
    }
  };

  const handleSubmitPerson = () => {
    if (!validatePersonForm()) return;

    if (editingPersonnel) {
      updatePersonnel(editingPersonnel.id, {
        name: personFormData.name,
        phone: personFormData.phone,
        position: personFormData.position,
        status: personFormData.status,
        idNumber: personFormData.idNumber,
        address: personFormData.address,
        entryDate: personFormData.entryDate,
        remarks: personFormData.remarks,
      });
    } else {
      const newPerson: Personnel = {
        id: generateId('per'),
        name: personFormData.name,
        phone: personFormData.phone,
        position: personFormData.position,
        status: personFormData.status,
        idNumber: personFormData.idNumber,
        address: personFormData.address,
        entryDate: personFormData.entryDate,
        remarks: personFormData.remarks,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      addPersonnel(newPerson);
    }

    setShowPersonForm(false);
  };

  const handleOpenAddCert = (personnelId: string) => {
    setEditingCertificate(null);
    setCertFormData({
      type: '',
      certNumber: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: '',
      status: 'valid',
      personnelId,
      remarks: '',
    });
    setCertFormErrors({});
    setShowCertForm(true);
  };

  const handleOpenEditCert = (cert: Certificate) => {
    setEditingCertificate(cert);
    setCertFormData({
      type: cert.type,
      certNumber: cert.certNumber,
      issuingAuthority: cert.issuingAuthority,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      status: cert.status,
      personnelId: cert.personnelId,
      remarks: cert.remarks || '',
    });
    setCertFormErrors({});
    setShowCertForm(true);
  };

  const handleDeleteCert = (certId: string) => {
    setDeletingCertificateId(certId);
    setShowCertDeleteConfirm(true);
  };

  const confirmDeleteCert = () => {
    if (deletingCertificateId) {
      deleteCertificate(deletingCertificateId);
      setShowCertDeleteConfirm(false);
      setDeletingCertificateId(null);
    }
  };

  const handleSubmitCert = () => {
    if (!validateCertForm()) return;

    const person = personnel.find((p) => p.id === certFormData.personnelId);

    if (editingCertificate) {
      updateCertificate(editingCertificate.id, {
        type: certFormData.type,
        certNumber: certFormData.certNumber,
        issuingAuthority: certFormData.issuingAuthority,
        issueDate: certFormData.issueDate,
        expiryDate: certFormData.expiryDate,
        status: certFormData.status,
        remarks: certFormData.remarks,
      });
    } else {
      const newCert: Certificate = {
        id: generateId('cert'),
        personnelId: certFormData.personnelId,
        personnelName: person?.name || '',
        type: certFormData.type,
        certNumber: certFormData.certNumber,
        issuingAuthority: certFormData.issuingAuthority,
        issueDate: certFormData.issueDate,
        expiryDate: certFormData.expiryDate,
        status: certFormData.status,
        remarks: certFormData.remarks,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      addCertificate(newCert);
    }

    setShowCertForm(false);
  };

  const certTypes = ['高处作业证', '特种作业操作证', '安全管理员证', '电工证', '焊工证', '其他'];

  const positionOptions = ['蜘蛛人作业员', '班组长', '安全员', '项目经理', '其他'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">人员资质</h1>
          <p className="text-slate-500 mt-1">管理作业人员信息和特种作业证</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={handleOpenAddPerson}>
          新增人员
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">人员总数</p>
              <p className="text-2xl font-bold text-slate-800">{personnel.length}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">在职</p>
              <p className="text-2xl font-bold text-green-600">
                {personnel.filter((p) => p.status === 'active').length}
              </p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">证书总数</p>
              <p className="text-2xl font-bold text-orange-600">{certificates.length}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">即将到期</p>
              <p className="text-2xl font-bold text-red-600">{expiringCertificates.length}</p>
            </div>
          </Card.Body>
        </Card>
      </div>

      {expiringCertificates.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <Card.Body>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">证书到期提醒</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  有 {expiringCertificates.length} 个证书即将到期或已过期，请及时处理
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索姓名、电话、岗位..."
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
                <option value="active">在职</option>
                <option value="leave">休假</option>
                <option value="inactive">离职</option>
              </select>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Header>
              <tr>
                <Table.Head>姓名</Table.Head>
                <Table.Head>岗位</Table.Head>
                <Table.Head>联系电话</Table.Head>
                <Table.Head>入职日期</Table.Head>
                <Table.Head>证书数量</Table.Head>
                <Table.Head>证书状态</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {filteredPersonnel.length > 0 ? (
                filteredPersonnel.map((person) => {
                  const statusInfo = getStatusInfo(person.status);
                  const personCerts = getPersonnelCertificates(person.id);
                  const hasExpiring = personCerts.some((c) => getCertStatus(c) !== 'valid');
                  return (
                    <Table.Row key={person.id}>
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                            {person.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-800">{person.name}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{person.position}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{person.phone}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{person.entryDate || '-'}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-blue-600">{personCerts.length} 个</span>
                      </Table.Cell>
                      <Table.Cell>
                        {hasExpiring ? (
                          <StatusBadge variant="warning">有证书到期</StatusBadge>
                        ) : (
                          <StatusBadge variant="success">全部有效</StatusBadge>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge variant={statusInfo.variant}>{statusInfo.label}</StatusBadge>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenDetail(person)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditPerson(person)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePerson(person.id)}
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
                    暂无人员数据
                  </td>
                </tr>
              )}
            </Table.Body>
          </Table>
        </Card.Body>
        <Card.Footer>
          <p className="text-sm text-slate-500">
            共 {filteredPersonnel.length} 条记录
          </p>
        </Card.Footer>
      </Card>

      <Modal
        isOpen={showPersonForm}
        onClose={() => setShowPersonForm(false)}
        title={editingPersonnel ? '编辑人员' : '新增人员'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowPersonForm(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitPerson}>
              {editingPersonnel ? '保存修改' : '添加人员'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="姓名" required error={formErrors.name}>
              <Input
                value={personFormData.name}
                onChange={(e) => setPersonFormData({ ...personFormData, name: e.target.value })}
                error={!!formErrors.name}
                placeholder="请输入姓名"
              />
            </FormField>
            <FormField label="岗位">
              <Select
                value={personFormData.position}
                onChange={(e) =>
                  setPersonFormData({ ...personFormData, position: e.target.value })
                }
              >
                <option value="">请选择岗位</option>
                {positionOptions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="联系电话" required error={formErrors.phone}>
              <Input
                value={personFormData.phone}
                onChange={(e) => setPersonFormData({ ...personFormData, phone: e.target.value })}
                error={!!formErrors.phone}
                placeholder="请输入联系电话"
              />
            </FormField>
            <FormField label="状态">
              <Select
                value={personFormData.status}
                onChange={(e) =>
                  setPersonFormData({
                    ...personFormData,
                    status: e.target.value as Personnel['status'],
                  })
                }
              >
                <option value="active">在职</option>
                <option value="leave">休假</option>
                <option value="inactive">离职</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="身份证号">
              <Input
                value={personFormData.idNumber}
                onChange={(e) => setPersonFormData({ ...personFormData, idNumber: e.target.value })}
                placeholder="请输入身份证号"
              />
            </FormField>
            <FormField label="入职日期">
              <Input
                type="date"
                value={personFormData.entryDate}
                onChange={(e) => setPersonFormData({ ...personFormData, entryDate: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="家庭住址">
            <Input
              value={personFormData.address}
              onChange={(e) => setPersonFormData({ ...personFormData, address: e.target.value })}
              placeholder="请输入家庭住址"
            />
          </FormField>

          <FormField label="备注">
            <Textarea
              value={personFormData.remarks}
              onChange={(e) => setPersonFormData({ ...personFormData, remarks: e.target.value })}
              rows={3}
              placeholder="请输入备注信息"
            />
          </FormField>
        </div>
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="人员详情"
        size="lg"
        footer={
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (viewingPersonnel) {
                  handleOpenAddCert(viewingPersonnel.id);
                  setShowDetailModal(false);
                }
              }}
              icon={<Award className="w-4 h-4" />}
            >
              添加证书
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (viewingPersonnel) {
                    handleOpenEditPerson(viewingPersonnel);
                    setShowDetailModal(false);
                  }
                }}
              >
                编辑信息
              </Button>
              <Button onClick={() => setShowDetailModal(false)}>关闭</Button>
            </div>
          </div>
        }
      >
        {viewingPersonnel && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {viewingPersonnel.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{viewingPersonnel.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge variant={getStatusInfo(viewingPersonnel.status).variant}>
                    {getStatusInfo(viewingPersonnel.status).label}
                  </StatusBadge>
                  <span className="text-sm text-slate-500">{viewingPersonnel.position}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">联系电话</p>
                <p className="font-medium text-slate-800">{viewingPersonnel.phone}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">入职日期</p>
                <p className="font-medium text-slate-800">{viewingPersonnel.entryDate || '-'}</p>
              </div>
            </div>

            {viewingPersonnel.idNumber && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">身份证号</p>
                <p className="font-medium text-slate-800">{viewingPersonnel.idNumber}</p>
              </div>
            )}

            {viewingPersonnel.address && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">家庭住址</p>
                <p className="font-medium text-slate-800">{viewingPersonnel.address}</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-800">资质证书</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenAddCert(viewingPersonnel.id)}
                >
                  添加证书
                </Button>
              </div>
              <div className="space-y-3">
                {getPersonnelCertificates(viewingPersonnel.id).length > 0 ? (
                  getPersonnelCertificates(viewingPersonnel.id).map((cert) => {
                    const certStatus = getCertStatus(cert);
                    const daysLeft = differenceInDays(new Date(cert.expiryDate), today);
                    return (
                      <div
                        key={cert.id}
                        className={cn(
                          'p-4 rounded-xl border',
                          certStatus === 'expired'
                            ? 'bg-red-50 border-red-200'
                            : certStatus === 'expiring'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-white border-slate-200'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Award
                                className={cn(
                                  'w-4 h-4',
                                  certStatus === 'expired'
                                    ? 'text-red-600'
                                    : certStatus === 'expiring'
                                    ? 'text-yellow-600'
                                    : 'text-green-600'
                                )}
                              />
                              <span className="font-medium text-slate-800">{cert.type}</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              编号：{cert.certNumber}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              发证机关：{cert.issuingAuthority}
                            </p>
                          </div>
                          <div className="text-right">
                            <StatusBadge
                              variant={
                                certStatus === 'expired'
                                  ? 'danger'
                                  : certStatus === 'expiring'
                                  ? 'warning'
                                  : 'success'
                              }
                            >
                              {certStatus === 'expired'
                                ? '已过期'
                                : certStatus === 'expiring'
                                ? '即将到期'
                                : '有效'}
                            </StatusBadge>
                            <p className="text-xs text-slate-500 mt-2">
                              {cert.expiryDate}到期
                              <br />
                              {daysLeft > 0 ? `还剩 ${daysLeft} 天` : `已过期 ${Math.abs(daysLeft)} 天`}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => handleOpenEditCert(cert)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteCert(cert.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-400 text-center py-6">暂无证书</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showCertForm}
        onClose={() => setShowCertForm(false)}
        title={editingCertificate ? '编辑证书' : '新增证书'}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCertForm(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitCert}>
              {editingCertificate ? '保存修改' : '添加证书'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="证书类型" required error={certFormErrors.type}>
              <Select
                value={certFormData.type}
                onChange={(e) => setCertFormData({ ...certFormData, type: e.target.value })}
                error={!!certFormErrors.type}
              >
                <option value="">请选择证书类型</option>
                {certTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="证书编号" required error={certFormErrors.certNumber}>
              <Input
                value={certFormData.certNumber}
                onChange={(e) =>
                  setCertFormData({ ...certFormData, certNumber: e.target.value })
                }
                error={!!certFormErrors.certNumber}
                placeholder="请输入证书编号"
              />
            </FormField>
          </div>

          <FormField label="发证机关" required error={certFormErrors.issuingAuthority}>
            <Input
              value={certFormData.issuingAuthority}
              onChange={(e) =>
                setCertFormData({ ...certFormData, issuingAuthority: e.target.value })
              }
              error={!!certFormErrors.issuingAuthority}
              placeholder="请输入发证机关"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="发证日期" required error={certFormErrors.issueDate}>
              <Input
                type="date"
                value={certFormData.issueDate}
                onChange={(e) => setCertFormData({ ...certFormData, issueDate: e.target.value })}
                error={!!certFormErrors.issueDate}
              />
            </FormField>
            <FormField label="到期日期" required error={certFormErrors.expiryDate}>
              <Input
                type="date"
                value={certFormData.expiryDate}
                onChange={(e) => setCertFormData({ ...certFormData, expiryDate: e.target.value })}
                error={!!certFormErrors.expiryDate}
              />
            </FormField>
          </div>

          <FormField label="状态">
            <Select
              value={certFormData.status}
              onChange={(e) =>
                setCertFormData({
                  ...certFormData,
                  status: e.target.value as Certificate['status'],
                })
              }
            >
              <option value="valid">有效</option>
              <option value="expired">已过期</option>
              <option value="suspended">已暂停</option>
            </Select>
          </FormField>

          <FormField label="备注">
            <Textarea
              value={certFormData.remarks}
              onChange={(e) => setCertFormData({ ...certFormData, remarks: e.target.value })}
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
          setDeletingPersonnelId(null);
        }}
        onConfirm={confirmDeletePerson}
        title="确认删除人员"
        variant="danger"
        confirmText="确认删除"
        message={
          <div className="space-y-2">
            <p className="text-slate-600">
              确定要删除该人员吗？将同时删除该人员的所有证书记录。
            </p>
            <p className="text-sm text-red-500 font-medium">⚠️ 删除后无法恢复，请谨慎操作！</p>
          </div>
        }
      />

      <ConfirmModal
        isOpen={showCertDeleteConfirm}
        onClose={() => {
          setShowCertDeleteConfirm(false);
          setDeletingCertificateId(null);
        }}
        onConfirm={confirmDeleteCert}
        title="确认删除证书"
        variant="danger"
        confirmText="确认删除"
        message={
          <div className="space-y-2">
            <p className="text-slate-600">确定要删除该证书吗？</p>
            <p className="text-sm text-red-500 font-medium">⚠️ 删除后无法恢复，请谨慎操作！</p>
          </div>
        }
      />
    </div>
  );
}
