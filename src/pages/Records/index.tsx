import { useState, useMemo } from 'react';
import { useAppStore, generateId } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import StatusBadge from '@/components/UI/StatusBadge';
import Modal, { ConfirmModal, FormField, Input, Select, Textarea } from '@/components/UI/Modal';
import {
  Plus,
  Search,
  FileText,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Wind,
  Thermometer,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import type { WorkRecord } from '@/types';

export default function Records() {
  const { workRecords, projects, personnel, addWorkRecord, updateWorkRecord, deleteWorkRecord } =
    useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkRecord | null>(null);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [viewingRecord, setViewingRecord] = useState<WorkRecord | null>(null);

  const [formData, setFormData] = useState({
    projectId: '',
    date: '',
    shift: 'day' as WorkRecord['shift'],
    status: 'normal' as WorkRecord['status'],
    personnelIds: [] as string[],
    anchorCheck: 'pass' as WorkRecord['anchorCheck'],
    equipmentCheck: 'pass' as WorkRecord['equipmentCheck'],
    weather: '',
    temperature: '',
    windSpeed: '',
    safetyBriefing: '',
    workContent: '',
    completedTasks: '',
    issues: '',
    workHours: '',
    supervisor: '',
    remarks: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredRecords = useMemo(() => {
    return workRecords.filter((r) => {
      const project = projects.find((p) => p.id === r.projectId);
      const matchSearch =
        project?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.workContent.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchProject = projectFilter === 'all' || r.projectId === projectFilter;
      return matchSearch && matchStatus && matchProject;
    });
  }, [workRecords, projects, searchTerm, statusFilter, projectFilter]);

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || '未知项目';
  };

  const getWorkerNames = (workerIds: string[]) => {
    return workerIds
      .map((id) => {
        const p = personnel.find((per) => per.id === id);
        return p?.name || '';
      })
      .filter(Boolean)
      .join('、');
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'normal':
        return { label: '正常', variant: 'success' as const };
      case 'delayed':
        return { label: '延迟', variant: 'warning' as const };
      case 'stopped':
        return { label: '停工', variant: 'danger' as const };
      case 'completed':
        return { label: '完工', variant: 'success' as const };
      default:
        return { label: status, variant: 'default' as const };
    }
  };

  const getCheckLabel = (check: string) => {
    switch (check) {
      case 'pass':
        return '合格';
      case 'fail':
        return '不合格';
      case 'na':
        return '不适用';
      default:
        return check;
    }
  };

  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case 'day':
        return '白班';
      case 'night':
        return '夜班';
      default:
        return shift;
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.projectId) errors.projectId = '请选择项目';
    if (!formData.date) errors.date = '请选择日期';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormData({
      projectId: '',
      date: '',
      shift: 'day',
      status: 'normal',
      personnelIds: [],
      anchorCheck: 'pass',
      equipmentCheck: 'pass',
      weather: '',
      temperature: '',
      windSpeed: '',
      safetyBriefing: '',
      workContent: '',
      completedTasks: '',
      issues: '',
      workHours: '',
      supervisor: '',
      remarks: '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenEdit = (record: WorkRecord) => {
    setEditingRecord(record);
    setFormData({
      projectId: record.projectId,
      date: record.date,
      shift: record.shift,
      status: record.status,
      personnelIds: record.personnelIds || [],
      anchorCheck: record.anchorCheck,
      equipmentCheck: record.equipmentCheck,
      weather: record.weather || '',
      temperature: String(record.temperature || ''),
      windSpeed: String(record.windSpeed || ''),
      safetyBriefing: record.safetyBriefing || '',
      workContent: record.workContent,
      completedTasks: record.completedTasks || '',
      issues: record.issues || '',
      workHours: String(record.workHours || ''),
      supervisor: record.supervisor || '',
      remarks: record.remarks || '',
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const handleOpenDetail = (record: WorkRecord) => {
    setViewingRecord(record);
    setShowDetailModal(true);
  };

  const handleDelete = (recordId: string) => {
    setDeletingRecordId(recordId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingRecordId) {
      deleteWorkRecord(deletingRecordId);
      setShowDeleteConfirm(false);
      setDeletingRecordId(null);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingRecord) {
      updateWorkRecord(editingRecord.id, {
        projectId: formData.projectId,
        date: formData.date,
        shift: formData.shift,
        status: formData.status,
        personnelIds: formData.personnelIds,
        anchorCheck: formData.anchorCheck,
        equipmentCheck: formData.equipmentCheck,
        weather: formData.weather,
        temperature: Number(formData.temperature) || undefined,
        windSpeed: Number(formData.windSpeed) || undefined,
        safetyBriefing: formData.safetyBriefing,
        workContent: formData.workContent,
        completedTasks: formData.completedTasks,
        issues: formData.issues,
        workHours: Number(formData.workHours) || 0,
        supervisor: formData.supervisor,
        remarks: formData.remarks,
      });
    } else {
      const newRecord: WorkRecord = {
        id: generateId('wr'),
        projectId: formData.projectId,
        date: formData.date,
        shift: formData.shift,
        status: formData.status,
        personnelIds: formData.personnelIds,
        anchorCheck: formData.anchorCheck,
        equipmentCheck: formData.equipmentCheck,
        weather: formData.weather,
        temperature: Number(formData.temperature) || undefined,
        windSpeed: Number(formData.windSpeed) || undefined,
        safetyBriefing: formData.safetyBriefing,
        workContent: formData.workContent,
        completedTasks: formData.completedTasks,
        issues: formData.issues,
        workHours: Number(formData.workHours) || 0,
        supervisor: formData.supervisor,
        remarks: formData.remarks,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      addWorkRecord(newRecord);
    }

    setShowFormModal(false);
  };

  const handleWorkerToggle = (personnelId: string) => {
    setFormData((prev) => {
      if (prev.personnelIds.includes(personnelId)) {
        return { ...prev, personnelIds: prev.personnelIds.filter((id) => id !== personnelId) };
      } else {
        return { ...prev, personnelIds: [...prev.personnelIds, personnelId] };
      }
    });
  };

  const activePersonnel = personnel.filter((p) => p.status === 'active');
  const activeProjects = projects.filter((p) => p.status === 'in_progress' || p.status === 'pending');

  const totalWorkHours = workRecords.reduce((sum, r) => sum + r.workHours, 0);
  const abnormalCount = workRecords.filter(
    (r) => r.anchorCheck === 'fail' || r.equipmentCheck === 'fail' || r.status === 'stopped'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">作业记录</h1>
          <p className="text-slate-500 mt-1">管理每日作业安全交底和进度记录</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          新增记录
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">作业记录</p>
              <p className="text-2xl font-bold text-slate-800">{workRecords.length}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">正常作业</p>
              <p className="text-2xl font-bold text-green-600">
                {workRecords.filter((r) => r.status === 'normal').length}
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
              <p className="text-sm text-slate-500">总工时</p>
              <p className="text-2xl font-bold text-orange-600">{totalWorkHours}h</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">异常记录</p>
              <p className="text-2xl font-bold text-red-600">{abnormalCount}</p>
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
                  placeholder="搜索项目、作业内容..."
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
                <option value="normal">正常</option>
                <option value="delayed">延迟</option>
                <option value="stopped">停工</option>
                <option value="completed">完工</option>
              </select>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Header>
              <tr>
                <Table.Head>日期</Table.Head>
                <Table.Head>项目</Table.Head>
                <Table.Head>班次</Table.Head>
                <Table.Head>作业人员</Table.Head>
                <Table.Head>作业内容</Table.Head>
                <Table.Head>工时</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => {
                  const statusInfo = getStatusInfo(record.status);
                  return (
                    <Table.Row key={record.id}>
                      <Table.Cell>
                        <span className="text-slate-600">{record.date}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-slate-800">
                          {getProjectName(record.projectId)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{getShiftLabel(record.shift)}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600 text-sm">
                          {(record.personnelIds || []).length > 0
                            ? getWorkerNames(record.personnelIds || [])
                            : '未指派'}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600 text-sm line-clamp-1">
                          {record.workContent}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">{record.workHours}h</span>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge variant={statusInfo.variant}>{statusInfo.label}</StatusBadge>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenDetail(record)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(record)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
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
                    暂无作业记录
                  </td>
                </tr>
              )}
            </Table.Body>
          </Table>
        </Card.Body>
        <Card.Footer>
          <p className="text-sm text-slate-500">共 {filteredRecords.length} 条记录</p>
        </Card.Footer>
      </Card>

      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingRecord ? '编辑作业记录' : '新增作业记录'}
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowFormModal(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingRecord ? '保存修改' : '创建记录'}
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <FormField label="项目" required error={formErrors.projectId}>
              <Select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                error={!!formErrors.projectId}
              >
                <option value="">请选择项目</option>
                {activeProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="日期" required error={formErrors.date}>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                error={!!formErrors.date}
              />
            </FormField>
            <FormField label="班次">
              <Select
                value={formData.shift}
                onChange={(e) =>
                  setFormData({ ...formData, shift: e.target.value as WorkRecord['shift'] })
                }
              >
                <option value="day">白班</option>
                <option value="night">夜班</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <FormField label="天气">
              <Input
                value={formData.weather}
                onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                placeholder="如：晴"
                icon={<Wind className="w-4 h-4" />}
              />
            </FormField>
            <FormField label="温度(℃)">
              <Input
                type="number"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                placeholder="如：25"
                icon={<Thermometer className="w-4 h-4" />}
              />
            </FormField>
            <FormField label="风速(m/s)">
              <Input
                type="number"
                value={formData.windSpeed}
                onChange={(e) => setFormData({ ...formData, windSpeed: e.target.value })}
                placeholder="如：5"
              />
            </FormField>
            <FormField label="工时(小时)">
              <Input
                type="number"
                value={formData.workHours}
                onChange={(e) => setFormData({ ...formData, workHours: e.target.value })}
                placeholder="如：8"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="锚点检查">
              <Select
                value={formData.anchorCheck}
                onChange={(e) =>
                  setFormData({ ...formData, anchorCheck: e.target.value as WorkRecord['anchorCheck'] })
                }
              >
                <option value="pass">合格</option>
                <option value="fail">不合格</option>
                <option value="na">不适用</option>
              </Select>
            </FormField>
            <FormField label="装备检查">
              <Select
                value={formData.equipmentCheck}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    equipmentCheck: e.target.value as WorkRecord['equipmentCheck'],
                  })
                }
              >
                <option value="pass">合格</option>
                <option value="fail">不合格</option>
                <option value="na">不适用</option>
              </Select>
            </FormField>
            <FormField label="作业状态">
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as WorkRecord['status'] })
                }
              >
                <option value="normal">正常</option>
                <option value="delayed">延迟</option>
                <option value="stopped">停工</option>
                <option value="completed">完工</option>
              </Select>
            </FormField>
          </div>

          <FormField label="作业人员">
            <div className="border border-slate-200 rounded-lg p-3 max-h-32 overflow-y-auto">
              {activePersonnel.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
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
                        onChange={() => handleWorkerToggle(p.id)}
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

          <FormField label="安全交底">
            <Textarea
              value={formData.safetyBriefing}
              onChange={(e) => setFormData({ ...formData, safetyBriefing: e.target.value })}
              rows={2}
              placeholder="请记录安全交底内容"
            />
          </FormField>

          <FormField label="作业内容">
            <Textarea
              value={formData.workContent}
              onChange={(e) => setFormData({ ...formData, workContent: e.target.value })}
              rows={2}
              placeholder="请描述今日作业内容"
            />
          </FormField>

          <FormField label="完成任务">
            <Textarea
              value={formData.completedTasks}
              onChange={(e) => setFormData({ ...formData, completedTasks: e.target.value })}
              rows={2}
              placeholder="请记录完成的具体任务"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="存在问题">
              <Textarea
                value={formData.issues}
                onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                rows={2}
                placeholder="请记录作业中发现的问题"
              />
            </FormField>
            <FormField label="备注">
              <Textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={2}
                placeholder="其他备注信息"
              />
            </FormField>
          </div>

          <FormField label="现场负责人">
            <Input
              value={formData.supervisor}
              onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
              placeholder="请输入负责人姓名"
            />
          </FormField>
        </div>
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="作业记录详情"
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (viewingRecord) {
                  handleOpenEdit(viewingRecord);
                  setShowDetailModal(false);
                }
              }}
            >
              编辑记录
            </Button>
            <Button onClick={() => setShowDetailModal(false)}>关闭</Button>
          </div>
        }
      >
        {viewingRecord && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {getProjectName(viewingRecord.projectId)}
                </h3>
                <p className="text-slate-500 mt-1">
                  {viewingRecord.date} · {getShiftLabel(viewingRecord.shift)}
                </p>
              </div>
              <StatusBadge variant={getStatusInfo(viewingRecord.status).variant}>
                {getStatusInfo(viewingRecord.status).label}
              </StatusBadge>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">天气</p>
                <p className="font-medium text-slate-800">{viewingRecord.weather || '-'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">温度</p>
                <p className="font-medium text-slate-800">
                  {viewingRecord.temperature ? `${viewingRecord.temperature}℃` : '-'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">风速</p>
                <p className="font-medium text-slate-800">
                  {viewingRecord.windSpeed ? `${viewingRecord.windSpeed} m/s` : '-'}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 mb-1">工时</p>
                <p className="font-medium text-slate-800">{viewingRecord.workHours} 小时</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">锚点检查</p>
                <p className="font-medium text-slate-800">
                  {getCheckLabel(viewingRecord.anchorCheck)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">装备检查</p>
                <p className="font-medium text-slate-800">
                  {getCheckLabel(viewingRecord.equipmentCheck)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-600 mb-1">现场负责人</p>
                <p className="font-medium text-slate-800">{viewingRecord.supervisor || '-'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-800 mb-2">
                作业人员 ({(viewingRecord?.personnelIds || []).length} 人)
              </h4>
              <div className="flex flex-wrap gap-2">
                {(viewingRecord?.personnelIds || []).length > 0 ? (
                  (viewingRecord?.personnelIds || []).map((pId) => {
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
                  <p className="text-sm text-slate-400">未指派作业人员</p>
                )}
              </div>
            </div>

            {viewingRecord.safetyBriefing && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm font-medium text-yellow-800 mb-2">安全交底</p>
                <p className="text-sm text-yellow-700 whitespace-pre-wrap">
                  {viewingRecord.safetyBriefing}
                </p>
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm font-medium text-slate-800 mb-2">作业内容</p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                {viewingRecord.workContent}
              </p>
            </div>

            {viewingRecord.completedTasks && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm font-medium text-green-800 mb-2">完成任务</p>
                <p className="text-sm text-green-700 whitespace-pre-wrap">
                  {viewingRecord.completedTasks}
                </p>
              </div>
            )}

            {viewingRecord.issues && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <p className="text-sm font-medium text-red-800 mb-2">存在问题</p>
                <p className="text-sm text-red-700 whitespace-pre-wrap">{viewingRecord.issues}</p>
              </div>
            )}

            {viewingRecord.remarks && (
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-800 mb-2">备注</p>
                <p className="text-sm text-slate-600">{viewingRecord.remarks}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingRecordId(null);
        }}
        onConfirm={confirmDelete}
        title="确认删除作业记录"
        variant="danger"
        confirmText="确认删除"
        message={
          <div className="space-y-2">
            <p className="text-slate-600">确定要删除这条作业记录吗？</p>
            <p className="text-sm text-red-500 font-medium">⚠️ 删除后无法恢复，请谨慎操作！</p>
          </div>
        }
      />
    </div>
  );
}
