import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  CalendarClock,
  Link as LinkIcon,
  GraduationCap,
  Users,
  ClipboardList,
  Receipt,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const menuItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'projects', label: '项目接单', icon: Briefcase, path: '/projects' },
  { id: 'scheduling', label: '作业排期', icon: CalendarClock, path: '/scheduling' },
  { id: 'equipment', label: '绳索装备', icon: LinkIcon, path: '/equipment' },
  { id: 'training', label: '安全培训', icon: GraduationCap, path: '/training' },
  { id: 'personnel', label: '人员资质', icon: Users, path: '/personnel' },
  { id: 'records', label: '作业记录', icon: ClipboardList, path: '/records' },
  { id: 'billing', label: '结算开票', icon: Receipt, path: '/billing' },
  { id: 'customers', label: '客户管理', icon: Building2, path: '/customers' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">蜘蛛人管理系统</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
            <LinkIcon className="w-5 h-5" />
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-700 p-3">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
