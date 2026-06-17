import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Table from '@/components/UI/Table';
import { Plus, Search, Building2, Phone, MapPin, Briefcase, User } from 'lucide-react';
import { format } from 'date-fns';

export default function Customers() {
  const { customers, projects } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    const matchIndustry = industryFilter === 'all' || c.industry === industryFilter;
    return matchSearch && matchIndustry;
  });

  const getCustomerProjects = (customerId: string) => {
    return projects.filter((p) => p.customerId === customerId);
  };

  const industries = [...new Set(customers.map((c) => c.industry))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">客户管理</h1>
          <p className="text-slate-500 mt-1">管理客户信息和合作记录</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>新增客户</Button>
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
            <div className="flex items-center gap-3">
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
              {filteredCustomers.map((customer) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => {
          const customerProjects = getCustomerProjects(customer.id);
          return (
            <Card key={customer.id} hover>
              <Card.Body>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">{customer.name}</h3>
                    <p className="text-xs text-blue-600 mt-0.5">{customer.industry}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{customer.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{customer.address}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    合作项目 <span className="font-medium text-slate-800">{customerProjects.length}</span> 个
                  </span>
                  <Button size="sm" variant="outline">
                    查看详情
                  </Button>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
