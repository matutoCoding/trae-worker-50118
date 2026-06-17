import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import StatusBadge from '@/components/UI/StatusBadge';
import { Plus, Search, User, Phone, MapPin, Calendar, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Personnel() {
  const { personnel, certificates } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const today = new Date();

  const filteredPersonnel = personnel.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getPersonnelCerts = (personnelId: string) => {
    return certificates.filter((c) => c.personnelId === personnelId);
  };

  const getCertStatus = (cert: any) => {
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

  const activeCount = personnel.filter((p) => p.status === 'active').length;
  const certExpiringCount = certificates.filter((c) => getCertStatus(c) === 'expiring').length;
  const certExpiredCount = certificates.filter((c) => getCertStatus(c) === 'expired').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">人员资质</h1>
          <p className="text-slate-500 mt-1">管理人员档案和特种作业资质</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">证书管理</Button>
          <Button icon={<Plus className="w-4 h-4" />}>新增人员</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">总人数</p>
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
              <p className="text-sm text-slate-500">在职人员</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">证书即将到期</p>
              <p className="text-2xl font-bold text-orange-600">{certExpiringCount}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">证书已过期</p>
              <p className="text-2xl font-bold text-red-600">{certExpiredCount}</p>
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
                <option value="inactive">离职</option>
                <option value="leave">休假</option>
              </select>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Header>
              <tr>
                <Table.Head>人员信息</Table.Head>
                <Table.Head>岗位</Table.Head>
                <Table.Head>联系电话</Table.Head>
                <Table.Head>入职日期</Table.Head>
                <Table.Head>资质证书</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head className="text-right">操作</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {filteredPersonnel.map((person) => {
                const statusInfo = getStatusInfo(person.status);
                const personCerts = getPersonnelCerts(person.id);
                const hasExpired = personCerts.some((c) => getCertStatus(c) === 'expired');
                const hasExpiring = personCerts.some((c) => getCertStatus(c) === 'expiring');

                return (
                  <Table.Row key={person.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {person.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{person.name}</p>
                          <p className="text-xs text-slate-500">{person.idCard}</p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-700">{person.position}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{person.phone}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-600">{person.hireDate}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="space-y-1">
                        {personCerts.length > 0 ? (
                          personCerts.map((cert) => {
                            const certStatus = getCertStatus(cert);
                            return (
                              <div
                                key={cert.id}
                                className={cn(
                                  'flex items-center gap-2 text-xs',
                                  certStatus === 'expired'
                                    ? 'text-red-600'
                                    : certStatus === 'expiring'
                                    ? 'text-orange-600'
                                    : 'text-green-600'
                                )}
                              >
                                <Award className="w-3 h-3" />
                                <span>{cert.type}</span>
                                <span className="text-slate-400">|</span>
                                <span>{cert.expiryDate}</span>
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-slate-400 text-sm">暂无证书</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>证书即将到期提醒</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {certificates
                .filter((c) => getCertStatus(c) === 'expiring')
                .map((cert) => {
                  const daysLeft = differenceInDays(new Date(cert.expiryDate), today);
                  return (
                    <div
                      key={cert.id}
                      className="p-3 bg-orange-50 rounded-lg border border-orange-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-orange-800">{cert.personnelName}</p>
                          <p className="text-sm text-orange-600">
                            {cert.type} - {cert.certificateNo}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">{daysLeft}天</p>
                        <p className="text-xs text-orange-500">后到期</p>
                      </div>
                    </div>
                  );
                })}
              {certificates.filter((c) => getCertStatus(c) === 'expiring').length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  暂无即将到期的证书
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>已过期证书</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {certificates
                .filter((c) => getCertStatus(c) === 'expired')
                .map((cert) => {
                  const daysExpired = Math.abs(
                    differenceInDays(new Date(cert.expiryDate), today)
                  );
                  return (
                    <div
                      key={cert.id}
                      className="p-3 bg-red-50 rounded-lg border border-red-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-red-800">{cert.personnelName}</p>
                          <p className="text-sm text-red-600">
                            {cert.type} - {cert.certificateNo}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">{daysExpired}天</p>
                        <p className="text-xs text-red-500">已过期</p>
                      </div>
                    </div>
                  );
                })}
              {certificates.filter((c) => getCertStatus(c) === 'expired').length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  暂无已过期的证书
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
