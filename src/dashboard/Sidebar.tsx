import { useState } from 'react'
import {
  LayoutDashboard, IdCard, Users, Sparkles, BarChart3, Wallet, Settings,
  HelpCircle, Bell, PanelLeftClose, PanelLeftOpen, LogOut,
} from 'lucide-react'
import { DASH_USER } from './data'

export type DashPage =
  | 'home' | 'my-cards' | 'contacts' | 'ai-studio' | 'analytics' | 'wallet' | 'settings' | 'help'

export function Sidebar({
  page,
  onNavigate,
  onExit,
}: {
  page: DashPage
  onNavigate: (p: DashPage) => void
  onExit: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const w = collapsed ? 68 : 240

  return (
    <aside
      style={{ width: w }}
      className="h-full bg-white border-r border-[#EBEBEB] flex flex-col flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-out"
    >
      {/* Logo */}
      <div className="h-[68px] flex items-center px-5 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 flex-1 mr-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#5B8DEF] to-[#8B5CF6] grid place-items-center text-white text-[14px] font-bold">
              S
            </div>
            <span className="text-[15px] font-bold tracking-tight text-[#1A1A1A]">SWAPO.</span>
          </div>
        )}
        {collapsed && (
          <div className="h-9 w-9 mx-auto rounded-xl bg-gradient-to-br from-[#5B8DEF] to-[#8B5CF6] grid place-items-center text-white text-[14px] font-bold">
            S
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`hidden md:inline-flex p-1.5 text-[#616161] hover:bg-[#F3F3F3] rounded-lg transition ${collapsed ? 'mx-auto mt-2' : 'ml-auto'}`}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav groups */}
      <div className={`flex-1 overflow-y-auto px-3 py-4 ${collapsed ? 'space-y-3' : 'space-y-6'}`}>
        <NavGroup label="Overview" collapsed={collapsed}>
          <NavItem icon={LayoutDashboard} label="Dashboard" active={page === 'home'} onClick={() => onNavigate('home')} collapsed={collapsed} />
        </NavGroup>

        {collapsed && <Divider />}

        <NavGroup label="Cards" collapsed={collapsed}>
          <NavItem icon={IdCard} label="My Cards" active={page === 'my-cards'} onClick={() => onNavigate('my-cards')} collapsed={collapsed} />
          <NavItem icon={Users} label="Saved Contacts" active={page === 'contacts'} onClick={() => onNavigate('contacts')} collapsed={collapsed} />
        </NavGroup>

        {collapsed && <Divider />}

        <NavGroup label="Engagement" collapsed={collapsed}>
          <NavItem icon={Sparkles} label="AI Studio" active={page === 'ai-studio'} onClick={() => onNavigate('ai-studio')} collapsed={collapsed} />
          <NavItem icon={BarChart3} label="Analytics" active={page === 'analytics'} onClick={() => onNavigate('analytics')} collapsed={collapsed} />
        </NavGroup>

        {collapsed && <Divider />}

        <NavGroup label="Account" collapsed={collapsed}>
          <NavItem icon={Wallet} label="Subscription" active={page === 'wallet'} onClick={() => onNavigate('wallet')} collapsed={collapsed} />
          <NavItem icon={Settings} label="Settings" active={page === 'settings'} onClick={() => onNavigate('settings')} collapsed={collapsed} />
        </NavGroup>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-[#EBEBEB] space-y-1 shrink-0">
        <NavItem icon={HelpCircle} label="Help" active={page === 'help'} onClick={() => onNavigate('help')} collapsed={collapsed} />
        <NavItem icon={Bell} label="Notifications" badge collapsed={collapsed} onClick={() => {}} />

        {/* User profile */}
        <div className={`mt-3 flex items-center rounded-xl ${collapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2.5 bg-[#F8F8F8]'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B8DEF] to-[#8B5CF6] text-white grid place-items-center text-xs font-semibold shrink-0">
            {DASH_USER.initials}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[13px] font-semibold text-[#1A1A1A] truncate">{DASH_USER.firstName} {DASH_USER.lastName}</span>
              <span className="text-[11px] text-[#616161] truncate">{DASH_USER.email}</span>
            </div>
          )}
        </div>

        <button
          onClick={onExit}
          className={`mt-1 flex items-center rounded-xl text-[13.5px] font-medium text-[#616161] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] transition ${collapsed ? 'justify-center p-2 h-10 w-10 mx-auto' : 'gap-3 px-3 py-2.5 w-full'}`}
          title={collapsed ? 'Back to phone' : undefined}
        >
          <LogOut className="w-[17px] h-[17px] shrink-0" strokeWidth={1.75} />
          {!collapsed && <span className="whitespace-nowrap">Back to phone</span>}
        </button>
      </div>
    </aside>
  )
}

function NavGroup({ label, collapsed, children }: { label: string; collapsed: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className={`mb-2 text-[10.5px] font-semibold text-[#9A9A9A] uppercase tracking-wider transition ${collapsed ? 'opacity-0 h-0 overflow-hidden' : 'px-3 opacity-100 h-auto'}`}>
        {label}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-[#EBEBEB] mx-2" />
}

function NavItem({
  icon: Icon, label, active, onClick, collapsed, badge,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
  onClick: () => void
  collapsed: boolean
  badge?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`flex items-center rounded-xl text-[13.5px] font-medium transition group relative ${collapsed ? 'justify-center p-2 h-10 w-10 mx-auto' : 'gap-3 px-3 py-2.5 w-full'} ${
        active ? 'bg-[#EEF2FF] text-[#5B8DEF]' : 'text-[#4A4A4A] hover:bg-[#F3F3F3] hover:text-[#1A1A1A]'
      }`}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-[#5B8DEF]" />
      )}
      <span className="relative inline-flex">
        <Icon className={`w-[17px] h-[17px] shrink-0 ${active ? 'text-[#5B8DEF]' : 'text-[#616161] group-hover:text-[#4A4A4A]'}`} strokeWidth={1.75} />
        {badge && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF3C21] border border-white" />}
      </span>
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </button>
  )
}
