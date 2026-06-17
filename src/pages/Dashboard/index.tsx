import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import StatusBadge from '@/components/UI/StatusBadge';
import {
  Briefcase,
  Users,
  Link as LinkIcon,
  AlertTriangle,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldAlert,
  ChevronRight,
  Calendar,
  Wind,
  CheckCircle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, differenceInDays } from 'date-fns';

export default function Dashboard() {
  const { projects, personnel, equipment, certificates, schedules, billings } = useAppStore();

  const activeProjects = projects.filter((p) => p.status === 'in_progress').length;
  const pendingProjects = projects.filter((p) => p.status === 'pending').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const activePersonnel = personnel.filter((p) => p.status === 'active').length;
  const normalEquipment = equipment.filter((e) => e.status === 'normal').length;

  const today = new Date();
  const expiringCerts = certificates.filter((c) => {
    const expiryDate = new Date(c.expiryDate);
    const daysLeft = differenceInDays(expiryDate, today);
    return daysLeft <= 30 && daysLeft > 0;
  }).length;

  const expiredCerts = certificates.filter((c) => c.status === 'expired').length;
  const expiringEquipment = equipment.filter((e) => {
    const nextInspection = new Date(e.nextInspectionDate);
    const daysLeft = differenceInDays(nextInspection, today);
    return daysLeft <= 30 && daysLeft > 0 && e.status === 'normal';
  }).length;

  const totalBilling = billings.reduce((sum, b) => sum + b.amount, 0);
  const paidBilling = billings.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);

  const projectStatusData = [
    { name: '进行中', value: activeProjects, color: '#3B82F6' },
    { name: '待启动', value: pendingProjects, color: '#F59E0B' },
    { name: '已完成', value: completedProjects, color: '#10B981' },
  ];

  const monthlyData = [
    { month: '1月', 项目数: 3, 收入: 45 },
    { month: '2月', 项目数: 4, 收入: 58 },
    { month: '3月', 项目数: 5, 收入: 72 },
    { month: '4月', 项目数: 4, 收入: 65 },
    { month: '5月', 项目数: 6, 收入: 88 },
    { month: '6月', 项目数: 7, 收入: 95 },
  ];

  const todaySchedules = schedules.filter((s) => s.date === format(today, 'yyyy-MM-dd'));

  const warnings = [
    { type: 'cert', message: '陈飞的高处作业证已过期', level: 'danger' },
    { type: 'cert', message: '刘洋的高处作业证将在8天后到期', level: 'warning' },
    { type: 'equipment', message: '主绳-003 检验即将到期', level: 'warning' },
  ];

  const recentProjects = projects.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">仪表盘</h1>
          <p className="text-slate-500 mt-1">欢迎回来，今天是 {format(new Date(), 'yyyy年MM月dd日 EEEE')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card hover>
          <Card.Body className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">进行中项目</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{activeProjects}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                较上月 +2
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-blue-600" />
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">在职人员</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{activePersonnel}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Users className="w-3 h-3" />
                持证率 85%
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-green-600" />
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">在用装备</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{normalEquipment}</p>
              <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {expiringEquipment} 件待检验
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <LinkIcon className="w-7 h-7 text-purple-600" />
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">累计营收</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{formatCurrency(paidBilling / 10000)}万</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                已收款
              </p>
            </div>
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-amber-600" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>月度项目与收入趋势</Card.Title>
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>2026年</option>
                <option>2025年</option>
              </select>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="h-72">
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
                  <Bar dataKey="项目数" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="收入" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>安全预警</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {warnings.map((warning, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    warning.level === 'danger'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        warning.level === 'danger' ? 'bg-red-100' : 'bg-orange-100'
                      }`}
                    >
                      <ShieldAlert
                        className={`w-4 h-4 ${
                          warning.level === 'danger' ? 'text-red-600' : 'text-orange-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          warning.level === 'danger' ? 'text-red-800' : 'text-orange-800'
                        }`}
                      >
                        {warning.message}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          warning.level === 'danger' ? 'text-red-600' : 'text-orange-600'
                        }`}
                      >
                        {warning.type === 'cert' ? '资质证书' : '装备检验'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">过期证书</span>
                <span className="font-semibold text-red-600">{expiredCerts} 个</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-500">即将到期</span>
                <span className="font-semibold text-orange-600">{expiringCerts} 个</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>近期项目</Card.Title>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                查看全部 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="divide-y divide-slate-100">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{project.name}</p>
                      <p className="text-sm text-slate-500">{project.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-800">
                        {formatCurrency(project.amount)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {project.floors}层 | {project.area}㎡
                      </p>
                    </div>
                    <StatusBadge
                      variant={
                        project.status === 'completed'
                          ? 'success'
                          : project.status === 'in_progress'
                          ? 'info'
                          : project.status === 'pending'
                          ? 'pending'
                          : 'default'
                      }
                    >
                      {project.status === 'completed'
                        ? '已完成'
                        : project.status === 'in_progress'
                        ? '进行中'
                        : project.status === 'pending'
                        ? '待启动'
                        : '已取消'}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>今日作业安排</Card.Title>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
          </Card.Header>
          <Card.Body>
            {todaySchedules.length > 0 ? (
              <div className="space-y-3">
                {todaySchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{schedule.building}</p>
                        <p className="text-xs text-slate-500 mt-1">{schedule.projectName}</p>
                      </div>
                      <StatusBadge
                        variant={
                          schedule.status === 'in_progress'
                            ? 'info'
                            : schedule.status === 'completed'
                            ? 'success'
                            : 'pending'
                        }
                      >
                        {schedule.status === 'in_progress'
                          ? '进行中'
                          : schedule.status === 'completed'
                          ? '已完成'
                          : '待开始'}
                      </StatusBadge>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {schedule.shift === 'morning'
                          ? '上午班'
                          : schedule.shift === 'afternoon'
                          ? '下午班'
                          : '全天'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {schedule.personnelNames.slice(0, 3).map((name, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs text-white font-medium"
                          >
                            {name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">
                        {schedule.personnelNames.length}人
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">今日暂无作业安排</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Wind className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">今日风力: 3级</p>
                  <p className="text-xs text-blue-600">风速 3.5m/s，适合作业</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>项目状态分布</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="flex items-center justify-center">
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-8 space-y-3">
                {projectStatusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-slate-600">{item.name}</span>
                    <span className="text-sm font-medium text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>财务概览</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                <p className="text-sm text-blue-100">合同总金额</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalBilling)}</p>
                <p className="text-xs text-blue-200 mt-2">共 {billings.length} 个项目</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600">已收款</p>
                  <p className="text-lg font-bold text-green-700 mt-1">
                    {formatCurrency(paidBilling)}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-600">待收款</p>
                  <p className="text-lg font-bold text-orange-700 mt-1">
                    {formatCurrency(totalBilling - paidBilling)}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">收款率</span>
                  <span className="font-medium text-slate-800">
                    {((paidBilling / totalBilling) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(paidBilling / totalBilling) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
