import { Bell, Search, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  collapsed: boolean;
  onMenuToggle: () => void;
}

export default function Header({ collapsed, onMenuToggle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-40 transition-all duration-300',
        collapsed ? 'left-20' : 'left-64'
      )}
    >
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索项目、人员、装备..."
              className="w-72 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">通知中心</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 text-xs">!</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 font-medium">装备检验提醒</p>
                        <p className="text-xs text-slate-500 mt-0.5">主绳-003 将在7天后到期</p>
                        <p className="text-xs text-slate-400 mt-1">2小时前</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-xs">!</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 font-medium">资质过期预警</p>
                        <p className="text-xs text-slate-500 mt-0.5">陈飞的高处作业证已过期</p>
                        <p className="text-xs text-slate-400 mt-1">1天前</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 font-medium">项目验收通过</p>
                        <p className="text-xs text-slate-500 mt-0.5">腾讯大厦项目已完成验收</p>
                        <p className="text-xs text-slate-400 mt-1">3天前</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-800">管理员</p>
              <p className="text-xs text-slate-500">系统管理员</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
