import { useState, useMemo } from 'react';
import { useAppStore, generateId } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import StatusBadge from '@/components/UI/StatusBadge';
import Modal, { ConfirmModal, FormField, Input, Select, Textarea } from '@/components/UI/Modal';
import { Plus, Search, BookOpen, Users, Calendar, Award, CheckCircle, Clock, Edit2, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import type { TrainingRecord } from '@/types';

export default function Training() {
  const { trainingRecords, personnel, addTraining, updateTraining, deleteTraining } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingTraining, setEditingTraining] = useState<TrainingRecord | null>(null);
  const [deletingTrainingId, setDeletingTrainingId] = useState<string | null>(null);
  const [viewingTraining, setViewingTraining] = useState<TrainingRecord | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'safety' as TrainingRecord['type'],
    trainer: '',
    startDate: '',
    endDate: '',
    duration: '',
    location: '',
    status: 'upcoming' as TrainingRecord['status'],
    personnelIds: [] as string[],
    content: '',
    remarks: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredTraining = useMemo(() => {
    return trainingRecords.filter((t) => {
      const matchSearch =
        (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.trainer || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [trainingRecords, searchTerm, statusFilter, typeFilter]);

  const trainingTypes = [...new Set(trainingRecords.map((t) => t.type))];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'safety':
        return '安全培训';
      case 'technical':
        return '技术培训';
      case 'certificate':
        return '证书培训';
      case 'new_employee':
        return '新员工培训';
      default:
        return type;
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: '已完成', variant: 'success' as const };
      case 'in_progress':
        return { label: '进行中', variant: 'info' as const };
      case 'upcoming':
        return { label: '待开始', variant: 'pending' as const };
      case 'cancelled':
        return { label: '已取消', variant: 'default' as const };
      default:
        return { label: status, variant: 'default' as const };
    }
  };

  const getPersonnelNames = (personnelIds: string[]) => {
    return personnelIds
      .map((id) => {
        const p = personnel.find((per) => per.id === id);
        return p?.name || '';
      })
      .filter(Boolean)
      .join('、');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = '请输入培训名称';
    if (!formData.startDate) errors.startDate = '请选择开始日期';
    if (!formData.endDate) errors.endDate = '请选择结束日期';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingTraining(null);
    setFormData({
      title: '',
      type: 'safety',
      trainer: '',
      startDate: '',
      endDate: '',
      duration: '',
      location: '',
      status: 'upcoming',
      personnelIds: [],
      content: '',
      remarks: '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenEdit = (training: TrainingRecord) => {
    setEditingTraining(training);
    setFormData({
      title: training.title,
      type: training.type,
      trainer: training.trainer,
      startDate: training.startDate,
      endDate: training.endDate,
      duration: String(training.duration),
      location: training.location,
      status: training.status,
      personnelIds: training.personnelIds,
      content: training.content || '',
      remarks: training.remarks || '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenDetail = (training: TrainingRecord) => {
    setViewingTraining(training);
    setShowDetailModal(true);
  };

  const handleDelete = (trainingId: string) => {
    setDeletingTrainingId(trainingId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingTrainingId) {
      deleteTraining(deletingTrainingId);
      setShowDeleteConfirm(false);
      setDeletingTrainingId(null);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingTraining) {
      updateTraining(editingTraining.id, {
        title: formData.title,
        type: formData.type,
        trainer: formData.trainer,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: Number(formData.duration) || 0,
        location: formData.location,
        status: formData.status,
        personnelIds: formData.personnelIds,
        content: formData.content,
        remarks: formData.remarks,
      });
    } else {
      const newTraining: TrainingRecord = {
        id: generateId('tr'),
        title: formData.title,
        type: formData.type,
        trainer: formData.trainer,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: Number(formData.duration) || 0,
        location: formData.location,
        status: formData.status,
        personnelIds: formData.personnelIds,
        content: formData.content,
        remarks: formData.remarks,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      addTraining(newTraining);
    }

    setShowFormModal(false);
  };

  const handleParticipantToggle = (personnelId: string) => {
    setFormData((prev) => {
      if (prev.personnelIds.includes(personnelId)) {
        return { ...prev, personnelIds: prev.personnelIds.filter((id) => id !== personnelId) };
      } else {
        return { ...prev, personnelIds: [...prev.personnelIds, personnelId] };
      }
    });
  };

  const typeOptions = [
    { value: 'safety', label: '安全培训' },
    { value: 'technical', label: '技术培训' },
    { value: 'certificate', label: '证书培训' },
    { value: 'new_employee', label: '新员工培训' },
  ];

  const statusOptions = [
    { value: 'upcoming', label: '待开始' },
    { value: 'in_progress', label: '进行中' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' },
  ];

  const totalTrainingHours = trainingRecords
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.duration, 0);

  const activePersonnel = personnel.filter((p) => p.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">安全培训</h1>
          <p className="text-slate-500 mt-1">管理高处作业培训和考核记录</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          新增培训
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已完成</p>
              <p className="text-2xl font-bold text-green-600">
                {trainingRecords.filter((t) => t.status === 'completed').length}
              </p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">进行中</p>
              <p className="text-2xl font-bold text-orange-600">
                {trainingRecords.filter((t) => t.status === 'in_progress').length}
              </p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">总培训时长</p>
              <p className="text-2xl font-bold text-purple-600">{totalTrainingHours}h</p>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trainingRecords
          .filter((t) => t.status === 'upcoming' || t.status === 'in_progress')
          .slice(0, 3)
          .map((training) => {
            const statusInfo = getStatusInfo(training.status);
            return (
              <Card key={training.id} hover onClick={() => handleOpenDetail(training)}>
                <Card.Body>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">{training.title}</h3>
                      <p className="text-sm text-blue-600 mt-1">{getTypeLabel(training.type)}</p>
                    </div>
                    <StatusBadge variant={statusInfo.variant}>{statusInfo.label}</StatusBadge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>
                        {training.startDate} ~ {training.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>{(training.personnelIds || []).length} 人参加</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{training.duration} 小时</span>
                    </div>
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
                <Table.Head>培训名称</Table.Head>
                <Table.Head>类型</Table.Head>
                <Table.Head>讲师</Table.Head>
                <Table.Head>时间</Table.Head>
                <Table.Head>时长</Table.Head>
                <Table.Head>参加人数</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {filteredTraining.length > 0 ? (
                filteredTraining.map((training) => {
                  const statusInfo = getStatusInfo(training.status);
                  return (
                    <Table.Row key={training.id}>
                      <Table.Cell>
                        <span className="font-medium text-slate-800">{training.title}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{getTypeLabel(training.type)}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{training.trainer}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">
                          {training.startDate} ~ {training.endDate}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{training.duration}h</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{(training.personnelIds || []).length} 人</span>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge variant={statusInfo.variant}>{statusInfo.label}</StatusBadge>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenDetail(training)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(training)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(training.id)}
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
                    暂无培训数据
                  </td>
                </tr>
              )}
            </Table.Body>
          </Table>
        </Card.Body>
        <Card.Footer>
          <p className="text-sm text-slate-500">
            共 {filteredTraining.length} 条记录
          </p>
        </Card.Footer>
      </Card>

      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingTraining ? '编辑培训' : '新增培训'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowFormModal(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingTraining ? '保存修改' : '创建培训'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="培训名称" required error={formErrors.title}>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={!!formErrors.title}
                placeholder="请输入培训名称"
              />
            </FormField>
            <FormField label="培训类型">
              <Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as TrainingRecord['type'] })
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
            <FormField label="讲师">
              <Input
                value={formData.trainer}
                onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                placeholder="请输入讲师姓名"
              />
            </FormField>
            <FormField label="培训地点">
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="请输入培训地点"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <FormField label="时长(小时)">
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="如：8"
              />
            </FormField>
          </div>

          <FormField label="状态">
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as TrainingRecord['status'] })
              }
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="参训人员">
            <div className="border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto">
              {activePersonnel.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {activePersonnel.map((p) => (
                    <label
                      key={p.id}
                      className={`
                        flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
                        ${formData.personnelIds.includes(p.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.personnelIds.includes(p.id)}
                        onChange={() => handleParticipantToggle(p.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">{p.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-2">暂无可用人员</p>
              )}
            </div>
          </FormField>

          <FormField label="培训内容">
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={3}
              placeholder="请输入培训内容"
            />
          </FormField>

          <FormField label="备注">
            <Textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={2}
              placeholder="请输入备注信息"
            />
          </FormField>
        </div>
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="培训详情"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (viewingTraining) {
                  handleOpenEdit(viewingTraining);
                  setShowDetailModal(false);
                }
              }}
            >
              编辑培训
            </Button>
            <Button onClick={() => setShowDetailModal(false)}>关闭</Button>
          </div>
        }
      >
        {viewingTraining && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{viewingTraining.title}</h3>
                <p className="text-blue-600 mt-1">{getTypeLabel(viewingTraining.type)}</p>
              </div>
              <StatusBadge variant={getStatusInfo(viewingTraining.status).variant}>
                {getStatusInfo(viewingTraining.status).label}
              </StatusBadge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">讲师</p>
                <p className="font-medium text-slate-800">{viewingTraining.trainer}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">地点</p>
                <p className="font-medium text-slate-800">{viewingTraining.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">开始日期</p>
                <p className="font-medium text-slate-800">{viewingTraining.startDate}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">结束日期</p>
                <p className="font-medium text-slate-800">{viewingTraining.endDate}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 mb-1">培训时长</p>
                <p className="font-medium text-slate-800">{viewingTraining.duration} 小时</p>
              </div>
            </div>

            {viewingTraining.content && (
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-800 mb-2">培训内容</p>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{viewingTraining.content}</p>
              </div>
            )}

            <div>
              <h4 className="font-medium text-slate-800 mb-3">
                参训人员 ({(viewingTraining?.personnelIds || []).length} 人)
              </h4>
              <div className="flex flex-wrap gap-2">
                {(viewingTraining?.personnelIds || []).length > 0 ? (
                  (viewingTraining?.personnelIds || []).map((pId) => {
                    const person = personnel.find((p) => p.id === pId);
                    return (
                      <span
                        key={pId}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {person?.name || '未知'}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-400">暂无参训人员</p>
                )}
              </div>
            </div>

            {viewingTraining.remarks && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm font-medium text-yellow-800 mb-1">备注</p>
                <p className="text-sm text-yellow-700">{viewingTraining.remarks}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingTrainingId(null);
        }}
        onConfirm={confirmDelete}
        title="确认删除培训"
        variant="danger"
        confirmText="确认删除"
        message={
          <div className="space-y-2">
            <p className="text-slate-600">确定要删除该培训记录吗？</p>
            <p className="text-sm text-red-500 font-medium">⚠️ 删除后无法恢复，请谨慎操作！</p>
          </div>
        }
      />
    </div>
  );
}
