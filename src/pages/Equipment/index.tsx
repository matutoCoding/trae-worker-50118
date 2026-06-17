import { useState, useMemo } from 'react';
import { useAppStore, generateId } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import StatusBadge from '@/components/UI/StatusBadge';
import Modal, { ConfirmModal, FormField, Input, Select, Textarea } from '@/components/UI/Modal';
import { Plus, Search, Link as LinkIcon, ShieldAlert, AlertTriangle, CheckCircle, Edit2, Trash2, Calendar, Package, Wrench } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import type { Equipment } from '@/types';

export default function Equipment() {
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deletingEquipmentId, setDeletingEquipmentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'rope' as Equipment['type'],
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    inspectionCycle: '',
    lastInspectionDate: '',
    nextInspectionDate: '',
    status: 'normal' as Equipment['status'],
    location: '',
    remarks: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      const matchSearch =
        (eq.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (eq.serialNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === 'all' || eq.type === typeFilter;
      const matchStatus = statusFilter === 'all' || eq.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [equipment, searchTerm, typeFilter, statusFilter]);

  const equipmentTypes = [...new Set(equipment.map((e) => e.type))];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'rope':
        return '安全绳';
      case 'harness':
        return '安全带';
      case 'helmet':
        return '安全帽';
      case 'descender':
        return '下降器';
      case 'carabiner':
        return '主锁';
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rope':
        return <LinkIcon className="w-5 h-5" />;
      case 'harness':
        return <ShieldAlert className="w-5 h-5" />;
      case 'helmet':
        return <Package className="w-5 h-5" />;
      default:
        return <Wrench className="w-5 h-5" />;
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'normal':
        return { label: '正常', variant: 'success' as const };
      case 'inspection_due':
        return { label: '待检验', variant: 'warning' as const };
      case 'maintenance':
        return { label: '维护中', variant: 'info' as const };
      case 'scrapped':
        return { label: '已报废', variant: 'danger' as const };
      default:
        return { label: status, variant: 'default' as const };
    }
  };

  const getDaysUntilNextInspection = (nextDate: string | undefined) => {
    if (!nextDate) return 999;
    const today = new Date();
    const next = parseISO(nextDate);
    return differenceInDays(next, today);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = '请输入装备名称';
    if (!formData.serialNumber.trim()) errors.serialNumber = '请输入编号';
    if (!formData.purchaseDate) errors.purchaseDate = '请选择购买日期';
    if (!formData.nextInspectionDate) errors.nextInspectionDate = '请选择下次检验日期';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingEquipment(null);
    setFormData({
      name: '',
      type: 'rope',
      brand: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      inspectionCycle: '180',
      lastInspectionDate: '',
      nextInspectionDate: '',
      status: 'normal',
      location: '',
      remarks: '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenEdit = (eq: Equipment) => {
    setEditingEquipment(eq);
    setFormData({
      name: eq.name,
      type: eq.type,
      brand: eq.brand,
      model: eq.model,
      serialNumber: eq.serialNumber,
      purchaseDate: eq.purchaseDate,
      inspectionCycle: String(eq.inspectionCycle),
      lastInspectionDate: eq.lastInspectionDate,
      nextInspectionDate: eq.nextInspectionDate,
      status: eq.status,
      location: eq.location,
      remarks: eq.remarks || '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleDelete = (eqId: string) => {
    setDeletingEquipmentId(eqId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingEquipmentId) {
      deleteEquipment(deletingEquipmentId);
      setShowDeleteConfirm(false);
      setDeletingEquipmentId(null);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingEquipment) {
      updateEquipment(editingEquipment.id, {
        name: formData.name,
        type: formData.type,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber,
        purchaseDate: formData.purchaseDate,
        inspectionCycle: Number(formData.inspectionCycle),
        lastInspectionDate: formData.lastInspectionDate,
        nextInspectionDate: formData.nextInspectionDate,
        status: formData.status,
        location: formData.location,
        remarks: formData.remarks,
      });
    } else {
      const newEquipment: Equipment = {
        id: generateId('eq'),
        name: formData.name,
        type: formData.type,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber,
        purchaseDate: formData.purchaseDate,
        inspectionCycle: Number(formData.inspectionCycle),
        lastInspectionDate: formData.lastInspectionDate,
        nextInspectionDate: formData.nextInspectionDate,
        status: formData.status,
        location: formData.location,
        remarks: formData.remarks,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      addEquipment(newEquipment);
    }

    setShowFormModal(false);
  };

  const typeOptions = [
    { value: 'rope', label: '安全绳' },
    { value: 'harness', label: '安全带' },
    { value: 'helmet', label: '安全帽' },
    { value: 'descender', label: '下降器' },
    { value: 'carabiner', label: '主锁' },
    { value: 'other', label: '其他' },
  ];

  const statusOptions = [
    { value: 'normal', label: '正常' },
    { value: 'inspection_due', label: '待检验' },
    { value: 'maintenance', label: '维护中' },
    { value: 'scrapped', label: '已报废' },
  ];

  const nearExpiryCount = equipment.filter((e) => {
    const days = getDaysUntilNextInspection(e.nextInspectionDate);
    return days <= 30 && days > 0 && e.status !== 'scrapped';
  }).length;

  const overdueCount = equipment.filter((e) => {
    const days = getDaysUntilNextInspection(e.nextInspectionDate);
    return days < 0 && e.status !== 'scrapped';
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">绳索装备</h1>
          <p className="text-slate-500 mt-1">管理安全装备台账和检验周期</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          新增装备
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Package className="w-6 h-6" />
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
              <p className="text-sm text-slate-500">正常使用</p>
              <p className="text-2xl font-bold text-green-600">
                {equipment.filter((e) => e.status === 'normal').length}
              </p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">即将到期</p>
              <p className="text-2xl font-bold text-yellow-600">{nearExpiryCount}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已过期</p>
              <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {typeOptions.slice(0, 4).map((type) => {
          const count = equipment.filter((e) => e.type === type.value).length;
          const typeInfo = typeOptions.find((t) => t.value === type.value);
          return (
            <Card key={type.value} hover>
              <Card.Body className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                  {getTypeIcon(type.value)}
                </div>
                <div>
                  <p className="text-sm text-slate-500">{type.label}</p>
                  <p className="text-xl font-bold text-slate-800">{count}</p>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      <Card>
        <Card.Header>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索装备名称、编号..."
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
                {typeOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部状态</option>
                {statusOptions.map((s) => (
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
                <Table.Head>装备名称</Table.Head>
                <Table.Head>类型</Table.Head>
                <Table.Head>编号</Table.Head>
                <Table.Head>品牌/型号</Table.Head>
                <Table.Head>购买日期</Table.Head>
                <Table.Head>下次检验</Table.Head>
                <Table.Head>存放位置</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((eq) => {
                  const statusInfo = getStatusInfo(eq.status);
                  const daysLeft = getDaysUntilNextInspection(eq.nextInspectionDate);
                  const isNearExpiry = daysLeft <= 30 && daysLeft > 0 && eq.status !== 'scrapped';
                  const isOverdue = daysLeft < 0 && eq.status !== 'scrapped';
                  return (
                    <Table.Row key={eq.id}>
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                            {getTypeIcon(eq.type)}
                          </div>
                          <span className="font-medium text-slate-800">{eq.name}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{getTypeLabel(eq.type)}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600 font-mono text-sm">{eq.serialNumber}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">
                          {eq.brand || '-'} / {eq.model || '-'}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{eq.purchaseDate}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <div>
                          <p className={`font-medium ${isOverdue ? 'text-red-600' : isNearExpiry ? 'text-yellow-600' : 'text-slate-700'}`}>
                            {eq.nextInspectionDate}
                          </p>
                          <p className="text-xs text-slate-400">
                            {daysLeft > 0 ? `还剩 ${daysLeft} 天` : '已过期'}
                          </p>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{eq.location}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge variant={statusInfo.variant}>{statusInfo.label}</StatusBadge>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(eq)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(eq.id)}
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
                    暂无装备数据
                  </td>
                </tr>
              )}
            </Table.Body>
          </Table>
        </Card.Body>
        <Card.Footer>
          <p className="text-sm text-slate-500">
            共 {filteredEquipment.length} 条记录
          </p>
        </Card.Footer>
      </Card>

      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingEquipment ? '编辑装备' : '新增装备'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowFormModal(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingEquipment ? '保存修改' : '添加装备'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="装备名称" required error={formErrors.name}>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!formErrors.name}
                placeholder="如：主绳-100米"
              />
            </FormField>
            <FormField label="装备类型">
              <Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as Equipment['type'] })
                }
              >
                {typeOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="品牌">
              <Input
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="请输入品牌"
              />
            </FormField>
            <FormField label="型号">
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="请输入型号"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="装备编号" required error={formErrors.serialNumber}>
              <Input
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                error={!!formErrors.serialNumber}
                placeholder="请输入装备编号"
              />
            </FormField>
            <FormField label="检验周期(天)">
              <Input
                type="number"
                value={formData.inspectionCycle}
                onChange={(e) => setFormData({ ...formData, inspectionCycle: e.target.value })}
                placeholder="如：180"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="购买日期" required error={formErrors.purchaseDate}>
              <Input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                error={!!formErrors.purchaseDate}
              />
            </FormField>
            <FormField label="上次检验日期">
              <Input
                type="date"
                value={formData.lastInspectionDate}
                onChange={(e) => setFormData({ ...formData, lastInspectionDate: e.target.value })}
              />
            </FormField>
            <FormField label="下次检验日期" required error={formErrors.nextInspectionDate}>
              <Input
                type="date"
                value={formData.nextInspectionDate}
                onChange={(e) => setFormData({ ...formData, nextInspectionDate: e.target.value })}
                error={!!formErrors.nextInspectionDate}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="存放位置">
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="如：装备室A架"
              />
            </FormField>
            <FormField label="状态">
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Equipment['status'] })
                }
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
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

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingEquipmentId(null);
        }}
        onConfirm={confirmDelete}
        title="确认删除装备"
        variant="danger"
        confirmText="确认删除"
        message={
          <div className="space-y-2">
            <p className="text-slate-600">确定要删除该装备吗？</p>
            <p className="text-sm text-red-500 font-medium">⚠️ 删除后无法恢复，请谨慎操作！</p>
          </div>
        }
      />
    </div>
  );
}
