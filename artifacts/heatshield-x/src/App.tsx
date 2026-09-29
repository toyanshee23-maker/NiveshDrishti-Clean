import { type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowDownRight, ArrowUpRight, BarChart3, Check, ChevronDown, CircleHelp, CloudSun, Compass, Download, Droplets, FileText, Flame, Gauge, Info, Layers3, Map as MapIcon, Menu, MousePointer2, PanelLeftClose, RotateCcw, ShieldCheck, Sparkles, TreePine, Waves, X, Zap } from 'lucide-react';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Zone = {
  id: string;
  name: string;
  short: string;
  risk: number;
  temp: number;
  residents: string;
  equity: string;
  note: string;
  x: string;
  y: string;
  color: string;
  recommendation: string;
};

const zones: Zone[] = [
  { id: 'south-market', name: 'South Market', short: 'SM-04', risk: 92, temp: 43.8, residents: '18.4k', equity: 'Very high', note: 'Industrial edges + low canopy', x: '30%', y: '66%', color: '#e65535', recommendation: 'Shade corridors around the transit spine.' },
  { id: 'river-ward', name: 'River Ward', short: 'RW-07', risk: 78, temp: 41.2, residents: '12.7k', equity: 'High', note: 'Floodable soil, sparse shade', x: '62%', y: '55%', color: '#ef913d', recommendation: 'Pair cool roofs with a riparian shade loop.' },
  { id: 'old-town', name: 'Old Town', short: 'OT-02', risk: 61, temp: 39.7, residents: '9.1k', equity: 'Medium', note: 'Dense historic fabric', x: '76%', y: '25%', color: '#e9b94e', recommendation: 'Prioritize reflective roofs before street works.' },
  { id: 'north-hills', name: 'North Hills', short: 'NH-11', risk: 34, temp: 35.4, residents: '6.8k', equity: 'Low', note: 'Existing canopy buffers heat', x: '44%', y: '18%', color: '#61a67e', recommendation: 'Protect mature canopy; defer capital works.' },
];

const layers = [
  { number: '01', title: 'Heat signal', icon: Flame, body: 'Satellite land-surface temperature and street-level sensors locate the hottest blocks.' },
  { number: '02', title: 'People + place', icon: Compass, body: 'Exposure, age, income, mobility and canopy gaps turn heat into human risk.' },
  { number: '03', title: 'Interventions', icon: TreePine, body: 'A tested library of trees, cool roofs, shade and water is scoped to each block.' },
  { number: '04', title: 'Budget logic', icon: BarChart3, body: 'Capital, maintenance and delivery time are scored against available funding.' },
  { number: '05', title: 'Action brief', icon: FileText, body: 'An explainable sequence gives city teams a plan they can fund and defend.' },
];

function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="noise min-h-[100dvh] bg-background">
      <div className="flex min-h-[100dvh]">
        {children}
      </div>
      <span className="sr-only" data-testid="status-location">{location}</span>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3" data-testid="brand-mark">
      <div className="relative grid size-9 place-items-center rounded-xl bg-[#ff7045] text-[#182d2d] shadow-[0_5px_0_#d14b29]">
        <ShieldCheck size={20} strokeWidth={2.6} />
        <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-[#f8f4ea] bg-[#f5c451]" />
      </div>
      <div>
        <div className="font-display text-[17px] font-bold tracking-[-.03em] text-[#eff2df]">HeatShield<span className="text-[#ff7045]">-X</span></div>
        <div className="font-mono text-[9px] uppercase tracking-[.18em] text-[#91aba0]">Decision command center</div>
      </div>
    </div>
  );
}

function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }: { activeView: string; setActiveView: (value: string) => void; collapsed: boolean; setCollapsed: (value: boolean) => void }) {
  const navItems = [
    { id: 'dashboard', label: 'Heat overview', icon: Gauge },
    { id: 'scenario', label: 'Scenario lab', icon: Sparkles },
    { id: 'explain', label: 'How it works', icon: Layers3 },
  ];
  return (
    <aside className={`${collapsed ? 'md:w-[82px]' : 'md:w-[252px]'} fixed inset-y-0 left-0 z-30 hidden flex-col bg-[#173536] px-4 py-5 transition-[width] duration-300 md:flex`} data-testid="sidebar-navigation">
      <div className={`mb-10 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
        {!collapsed && <BrandMark />}
        {collapsed && <div className="grid size-9 place-items-center rounded-xl bg-[#ff7045] text-[#173536]"><ShieldCheck size={20} /></div>}
        <button onClick={() => setCollapsed(!collapsed)} className="rounded-lg p-2 text-[#9db8ab] transition-colors hover:bg-[#254847] hover:text-white" aria-label="Toggle sidebar" data-testid="button-toggle-sidebar">
          {collapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      {!collapsed && <div className="mb-3 px-3 font-mono text-[9px] uppercase tracking-[.2em] text-[#78968a]">Command center</div>}
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = activeView === item.id;
          return (
            <button key={item.id} onClick={() => setActiveView(item.id)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all ${selected ? 'bg-[#e8f0d7] font-bold text-[#173536] shadow-[inset_3px_0_#ff7045]' : 'text-[#afc2b4] hover:bg-[#254847] hover:text-[#eff2df]'}`} data-testid={`nav-${item.id}`}>
              <Icon size={18} strokeWidth={selected ? 2.5 : 1.8} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.id === 'scenario' && <span className="ml-auto rounded-md bg-[#ff7045] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#173536]">BETA</span>}
            </button>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-[#37605a] bg-[#204342] p-4">
            <div className="mb-3 flex items-center gap-2 text-[#ffcf70]"><Zap size={15} fill="currentColor" /><span className="font-mono text-[10px] uppercase tracking-wider">Live model</span></div>
            <p className="text-xs leading-relaxed text-[#b8cec0]">Risk model updated from the latest 14-day heat window.</p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-[#77c9a0]"><span className="size-1.5 rounded-full bg-[#77c9a0]" /> Synced 08:42</div>
          </div>
          <button onClick={() => setActiveView('explain')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#afc2b4] transition-colors hover:bg-[#254847] hover:text-white" data-testid="button-help">
            <CircleHelp size={18} /><span>Method notes</span>
          </button>
        </div>
      )}
    </aside>
  );
}

function Header({ city, setCity, onExport, onMobileMenu }: { city: string; setCity: (value: string) => void; onExport: () => void; onMobileMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#e6dfd0] bg-[#f8f4ea]/95 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMobileMenu} className="rounded-lg p-2 text-[#274847] hover:bg-[#e8e4d8] md:hidden" aria-label="Open menu" data-testid="button-mobile-menu"><Menu size={20} /></button>
        <div className="hidden font-mono text-[10px] uppercase tracking-[.2em] text-[#779086] sm:block">Municipal heat desk <span className="mx-2 text-[#c5bfae]">/</span> 2025 planning cycle</div>
        <div className="sm:hidden font-display text-base font-bold text-[#183737]">HeatShield<span className="text-[#ec643e]">-X</span></div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <label className="relative">
          <span className="sr-only">Select city</span>
          <select value={city} onChange={(event) => setCity(event.target.value)} className="h-10 appearance-none rounded-xl border border-[#dcd5c5] bg-[#fffdf7] py-2 pl-3 pr-8 text-xs font-bold text-[#244545] outline-none transition focus:border-[#337b68]" data-testid="select-city">
            <option>Port Meridian</option>
            <option>East Harbor</option>
            <option>New Carthage</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-3.5 text-[#6a8175]" />
        </label>
        <button onClick={onExport} className="hidden h-10 items-center gap-2 rounded-xl bg-[#173536] px-4 text-xs font-bold text-[#eff2df] transition hover:-translate-y-0.5 hover:bg-[#285451] sm:flex" data-testid="button-export-brief"><Download size={15} /> Export brief</button>
        <div className="grid size-10 place-items-center rounded-xl border border-[#ddd5c4] bg-[#fffdf7] font-display text-xs font-bold text-[#24504b]" data-testid="avatar-user">AM</div>
      </div>
    </header>
  );
}

function StatCard({ label, value, detail, trend, icon: Icon, accent = 'teal' }: { label: string; value: string; detail: string; trend?: string; icon: typeof Gauge; accent?: 'teal' | 'orange' | 'yellow' }) {
  const colors = { teal: 'bg-[#dceee4] text-[#28745f]', orange: 'bg-[#ffe0d2] text-[#cb5638]', yellow: 'bg-[#f8edc6] text-[#96721a]' };
  return (
    <div className="rise-in rounded-2xl border border-[#e5ddcd] bg-[#fffdf8] p-4 shadow-[0_5px_15px_rgba(66,72,49,.04)] transition-transform hover:-translate-y-0.5" data-testid={`stat-${label.toLowerCase().replaceAll(' ', '-')}`}>
      <div className="mb-5 flex items-start justify-between"><div className={`grid size-9 place-items-center rounded-xl ${colors[accent]}`}><Icon size={17} /></div>{trend && <span className="flex items-center gap-1 font-mono text-[10px] font-medium text-[#388568]"><ArrowDownRight size={12} /> {trend}</span>}</div>
      <div className="font-mono text-[10px] uppercase tracking-[.15em] text-[#788f83]">{label}</div>
      <div className="mt-1 font-display text-[27px] font-bold tracking-[-.05em] text-[#183737]">{value}</div>
      <div className="mt-1 text-xs text-[#71857b]">{detail}</div>
    </div>
  );
}

function RiskMap({ selectedId, setSelectedId }: { selectedId: string; setSelectedId: (id: string) => void }) {
  return (
    <div className="relative h-[330px] overflow-hidden rounded-2xl border border-[#d7dfce] bg-[#d9e7dc]" data-testid="heat-risk-map">
      <div className="heat-map map-grid absolute inset-0 opacity-90" />
      <div className="absolute inset-0 opacity-50">
        <span className="map-street left-[-3%] top-[42%] w-[110%] rotate-[18deg]" /><span className="map-street left-[4%] top-[73%] w-[105%] rotate-[-28deg]" /><span className="map-street left-[28%] top-[-5%] h-[120%] w-[2px] rotate-[21deg]" /><span className="map-street left-[67%] top-[-4%] h-[120%] w-[2px] rotate-[55deg]" /><span className="map-street left-[-2%] top-[21%] w-[90%] rotate-[-8deg]" />
      </div>
      <div className="absolute left-4 top-4 rounded-lg border border-white/70 bg-[#fffdf7]/80 px-3 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.12em] text-[#456b60]"><MapIcon size={13} /> Surface temperature</div>
        <div className="mt-1 text-[11px] text-[#658177]">14-day daytime average · 1 km grid</div>
      </div>
      {zones.map((zone) => (
        <button key={zone.id} onClick={() => setSelectedId(zone.id)} style={{ left: zone.x, top: zone.y, backgroundColor: zone.color }} className={`hotspot absolute -ml-4 -mt-4 grid size-8 place-items-center rounded-full border-[3px] border-white/90 text-[10px] font-bold text-white shadow-lg ${selectedId === zone.id ? 'selected' : ''}`} aria-label={`Select ${zone.name}`} data-testid={`map-zone-${zone.id}`}>
          {zone.risk}
        </button>
      ))}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-[#fffdf7]/85 px-2.5 py-2 backdrop-blur"><span className="size-2 rounded-full bg-[#5ea57e]" /><span className="size-2 rounded-full bg-[#efba4d]" /><span className="size-2 rounded-full bg-[#e65535]" /><span className="ml-1 font-mono text-[9px] uppercase tracking-wider text-[#5d746a]">lower risk <span className="px-1 text-[#c6bdaa]">—</span> higher risk</span></div>
      <div className="absolute bottom-3 right-3 rounded-lg border border-white/70 bg-[#fffdf7]/80 p-2 text-[#4e7468] backdrop-blur"><MousePointer2 size={15} /></div>
    </div>
  );
}

function ZoneList({ selectedId, setSelectedId }: { selectedId: string; setSelectedId: (id: string) => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5ddcd] bg-[#fffdf8]" data-testid="zone-list">
      <div className="flex items-center justify-between border-b border-[#ece5d6] px-4 py-3"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-[#788f83]">Priority zones</span><span className="rounded-md bg-[#f2eee4] px-2 py-1 font-mono text-[10px] text-[#60786c]">4 of 18</span></div>
      <div className="divide-y divide-[#eee8dc]">
        {zones.map((zone) => (
          <button key={zone.id} onClick={() => setSelectedId(zone.id)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${selectedId === zone.id ? 'bg-[#eff3df]' : 'hover:bg-[#faf7ee]'}`} data-testid={`zone-row-${zone.id}`}>
            <span className="grid size-8 shrink-0 place-items-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: zone.color }}>{zone.risk}</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[#244545]">{zone.name}</span><span className="block truncate text-[11px] text-[#82958b]">{zone.note}</span></span>
            <span className="font-mono text-[11px] text-[#668078]">{zone.temp}°</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ZoneDetail({ zone, onPlan }: { zone: Zone; onPlan: () => void }) {
  return (
    <div className="rounded-2xl border border-[#e5ddcd] bg-[#fffdf8] p-5" data-testid="selected-zone-detail">
      <div className="mb-4 flex items-start justify-between"><div><div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.15em] text-[#799086]"><span className="size-2 rounded-full" style={{ backgroundColor: zone.color }} /> Selected zone / {zone.short}</div><h2 className="font-display text-xl font-bold tracking-[-.04em] text-[#183737]">{zone.name}</h2></div><button onClick={onPlan} className="rounded-lg border border-[#cbd9ca] p-2 text-[#337461] transition hover:bg-[#e8f0df]" aria-label="Build scenario" data-testid="button-open-scenario"><Sparkles size={16} /></button></div>
      <div className="mb-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-[#f7f0df] p-3"><div className="font-mono text-[9px] uppercase text-[#8b8771]">Risk index</div><div className="mt-1 font-display text-lg font-bold text-[#ce5638]">{zone.risk}<span className="text-xs font-normal text-[#9a806e]">/100</span></div></div>
        <div className="rounded-xl bg-[#edf1e2] p-3"><div className="font-mono text-[9px] uppercase text-[#7b8c70]">Peak temp</div><div className="mt-1 font-display text-lg font-bold text-[#2d6556]">{zone.temp}°</div></div>
        <div className="rounded-xl bg-[#eef1e9] p-3"><div className="font-mono text-[9px] uppercase text-[#7b8c70]">Residents</div><div className="mt-1 font-display text-lg font-bold text-[#244545]">{zone.residents}</div></div>
      </div>
      <div className="space-y-3 border-t border-[#ece5d6] pt-4 text-xs">
        <div className="flex items-center justify-between"><span className="text-[#7b8c83]">Equity exposure</span><span className="font-bold text-[#cb5638]">{zone.equity}</span></div>
        <div className="flex items-center justify-between"><span className="text-[#7b8c83]">Primary signal</span><span className="font-bold text-[#304f4a]">{zone.note}</span></div>
      </div>
      <div className="mt-5 rounded-xl border border-[#f0d4b5] bg-[#fff3e7] p-3 text-xs leading-relaxed text-[#785e4b]"><span className="mr-1 font-bold text-[#cc653a]">Model read:</span>{zone.recommendation}</div>
      <button onClick={onPlan} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#255e53] py-3 text-xs font-bold text-[#f6f4e8] transition hover:bg-[#174b43]" data-testid="button-plan-zone">Build an intervention plan <ArrowUpRight size={15} /></button>
    </div>
  );
}

function Dashboard({ city, selectedId, setSelectedId, setActiveView }: { city: string; selectedId: string; setSelectedId: (id: string) => void; setActiveView: (value: string) => void }) {
  const zone = zones.find((item) => item.id === selectedId) ?? zones[0];
  return (
    <div className="space-y-6">
      <div className="rise-in flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div><div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#db613d]"><span className="size-1.5 rounded-full bg-[#e45d3e]" /> Decision window open</div><h1 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[.94] tracking-[-.065em] text-[#183737]">Where should <span className="text-[#dd643f]">{city}</span><br className="hidden sm:block" /> act first?</h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6c8177]">A live read of heat exposure, people at risk and what the city can deliver this season.</p></div>
        <div className="flex items-center gap-2 self-start rounded-xl border border-[#e5ddcd] bg-[#fffdf8] px-3 py-2 text-xs text-[#60786c] lg:self-auto"><CloudSun size={16} className="text-[#d47743]" /><span><b className="text-[#244545]">38°C</b> forecast peak</span><span className="text-[#c8bfae]">·</span><span>Thursday</span></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="City heat risk" value="72 / 100" detail="High · 4 priority zones" trend="6 pts" icon={Flame} accent="orange" />
        <StatCard label="People exposed" value="46.9k" detail="Within high-risk blocks" trend="2.4%" icon={Droplets} accent="yellow" />
        <StatCard label="Actionable budget" value="$4.2M" detail="FY25 resilience allocation" icon={BarChart3} accent="teal" />
        <StatCard label="Canopy gap" value="18.6%" detail="Against 2030 target" trend="1.8%" icon={TreePine} accent="teal" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
        <section className="rounded-2xl border border-[#e5ddcd] bg-[#fffdf8] p-4 sm:p-5" data-testid="map-section">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="font-display text-base font-bold text-[#244545]">Heat-risk map</h2><p className="mt-1 text-xs text-[#7d9187]">Click a zone to inspect the evidence trail.</p></div><button onClick={() => setActiveView('scenario')} className="hidden items-center gap-1.5 rounded-lg border border-[#d4e0d1] px-3 py-2 text-[11px] font-bold text-[#327361] transition hover:bg-[#edf3e5] sm:flex" data-testid="button-open-map-scenario"><Sparkles size={13} /> Scenario lab</button></div>
          <RiskMap selectedId={selectedId} setSelectedId={setSelectedId} />
        </section>
        <ZoneList selectedId={selectedId} setSelectedId={setSelectedId} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.72fr)]">
        <ZoneDetail zone={zone} onPlan={() => setActiveView('scenario')} />
        <div className="rounded-2xl bg-[#173536] p-5 text-[#f3f2e5]" data-testid="decision-note">
          <div className="mb-8 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[.17em] text-[#9eb6a8]">This week's signal</span><span className="rounded-md bg-[#315b53] px-2 py-1 font-mono text-[9px] text-[#a4d1af]">MODEL 2.4</span></div>
          <div className="font-display text-[38px] font-bold leading-[.95] tracking-[-.06em] text-[#ffcf70]">Act where heat<br />meets inequity.</div>
          <p className="mt-5 text-xs leading-relaxed text-[#adc2b4]">South Market is not the hottest point on the map by accident. It combines hard surface, low canopy and the city's highest proportion of older residents.</p>
          <button onClick={() => setActiveView('explain')} className="mt-7 flex items-center gap-2 text-xs font-bold text-[#f4e6b9] transition hover:text-[#ff7045]" data-testid="button-read-method"><Info size={14} /> See how the model got here <ArrowUpRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}

function SliderControl({ label, value, setValue, unit, icon: Icon, caption }: { label: string; value: number; setValue: (value: number) => void; unit: string; icon: typeof TreePine; caption: string }) {
  return (
    <div className="rounded-2xl border border-[#e5ddcd] bg-[#fffdf8] p-4" data-testid={`control-${label.toLowerCase().replaceAll(' ', '-')}`}>
      <div className="flex items-start gap-3"><div className="grid size-9 place-items-center rounded-xl bg-[#e5efe0] text-[#327561]"><Icon size={17} /></div><div className="flex-1"><div className="flex items-center justify-between"><label className="text-sm font-bold text-[#244545]">{label}</label><span className="font-display text-lg font-bold text-[#2a6d5c]">{value}<span className="ml-0.5 text-xs font-medium">{unit}</span></span></div><p className="mt-1 text-[11px] text-[#83958a]">{caption}</p></div></div>
      <input type="range" min="0" max="100" value={value} onChange={(event) => setValue(Number(event.target.value))} className="range-accent mt-5 w-full" data-testid={`slider-${label.toLowerCase().replaceAll(' ', '-')}`} />
      <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-wider text-[#a2aa9b]"><span>Low</span><span>High</span></div>
    </div>
  );
}

function Scenario({ selectedId }: { selectedId: string }) {
  const zone = zones.find((item) => item.id === selectedId) ?? zones[0];
  const [trees, setTrees] = useState(62);
  const [roofs, setRoofs] = useState(38);
  const [shade, setShade] = useState(54);
  const [water, setWater] = useState(18);
  const [saved, setSaved] = useState(false);
  const cooling = Math.round((trees * .35 + roofs * .28 + shade * .32 + water * .15) / 1.1);
  const cost = (1.1 + trees * .013 + roofs * .009 + shade * .012 + water * .006).toFixed(1);
  const impact = Math.min(74, Math.round(cooling * .7));
  return (
    <div className="space-y-6" data-testid="scenario-lab">
      <div className="rise-in flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#327561]"><Sparkles size={13} /> Intervention scenario</div><h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-[-.06em] text-[#183737]">Make the plan<br /><span className="text-[#dd643f]">defensible.</span></h1><p className="mt-3 max-w-xl text-sm text-[#6c8177]">Tune a bundle for <b className="text-[#315b53]">{zone.name}</b>. The model updates cost, cooling and who benefits as you test the trade-offs.</p></div><button onClick={() => { setTrees(62); setRoofs(38); setShade(54); setWater(18); }} className="flex items-center gap-2 self-start rounded-xl border border-[#d7dfd0] bg-[#fffdf8] px-3 py-2 text-xs font-bold text-[#557267] transition hover:bg-[#eff3e7]" data-testid="button-reset-scenario"><RotateCcw size={14} /> Reset scenario</button></div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(310px,.85fr)]">
        <div className="space-y-3">
          <div className="mb-4 flex items-center justify-between"><div className="font-mono text-[10px] uppercase tracking-[.16em] text-[#7a9084]">Bundle controls</div><span className="rounded-md bg-[#eaf0df] px-2 py-1 font-mono text-[10px] text-[#347662]">LIVE CALCULATION</span></div>
          <SliderControl label="Street trees" value={trees} setValue={setTrees} unit="%" icon={TreePine} caption="Shade + evapotranspiration along walking routes" />
          <SliderControl label="Cool roofs" value={roofs} setValue={setRoofs} unit="%" icon={Waves} caption="Reflective roof coverage on high-exposure parcels" />
          <SliderControl label="Shade structures" value={shade} setValue={setShade} unit="%" icon={ShieldCheck} caption="Transit stops and outdoor worker rest points" />
          <SliderControl label="Blue-green corridors" value={water} setValue={setWater} unit="%" icon={Droplets} caption="Permeable surface and water-sensitive planting" />
        </div>
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-[#173536] p-5 text-[#eff2df]"><div className="absolute -right-8 -top-10 size-40 rounded-full border-[22px] border-[#315b53] opacity-60" /><div className="relative"><div className="mb-8 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[.17em] text-[#9db6a7]">Scenario output</span><span className="flex items-center gap-1.5 font-mono text-[10px] text-[#a5d3ae]"><span className="size-1.5 rounded-full bg-[#7cc18c]" /> recalculating</span></div><div className="font-mono text-[10px] uppercase text-[#a3bbad]">Estimated peak cooling</div><div className="mt-1 font-display text-6xl font-bold tracking-[-.08em] text-[#ffcf70]">-{impact}<span className="text-2xl">%</span></div><div className="mt-2 text-xs text-[#b9cabc]">Compared with current conditions</div><div className="mt-8 grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#214441] p-3"><div className="font-mono text-[9px] uppercase text-[#99b1a5]">Delivery cost</div><div className="mt-1 font-display text-xl font-bold">${cost}M</div></div><div className="rounded-xl bg-[#214441] p-3"><div className="font-mono text-[9px] uppercase text-[#99b1a5]">People helped</div><div className="mt-1 font-display text-xl font-bold">{Math.round(6.2 + impact * .11)}.4k</div></div></div></div></div>
          <div className="rounded-2xl border border-[#e5ddcd] bg-[#fffdf8] p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-display font-bold text-[#244545]">Recommended bundle</h2><span className="rounded-full bg-[#ddefdf] px-2 py-1 text-[10px] font-bold text-[#2c755f]">BEST FIT</span></div><div className="space-y-3 text-xs"><ReasonRow icon={Check} label="Transit shade spine" value="High equity" positive /><ReasonRow icon={Check} label="Cool roof rebates" value="Fast to launch" positive /><ReasonRow icon={Check} label="Pocket rain gardens" value="Adds resilience" positive /><ReasonRow icon={X} label="City-center fountain" value="Low reach" /></div><button onClick={() => setSaved(!saved)} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition ${saved ? 'bg-[#dceee1] text-[#30745f]' : 'bg-[#ff7045] text-[#173536] hover:bg-[#ff815b]'}`} data-testid="button-save-scenario">{saved ? <><Check size={15} /> Saved to action brief</> : <><FileText size={15} /> Add to action brief</>}</button></div>
        </div>
      </div>
      <ImpactComparison impact={impact} />
    </div>
  );
}

function ReasonRow({ icon: Icon, label, value, positive = false }: { icon: typeof Check; label: string; value: string; positive?: boolean }) {
  return <div className="flex items-center gap-3"><div className={`grid size-6 place-items-center rounded-full ${positive ? 'bg-[#dceee1] text-[#2c795e]' : 'bg-[#f6ded7] text-[#cd5d43]'}`}><Icon size={13} strokeWidth={3} /></div><span className="flex-1 font-medium text-[#36544d]">{label}</span><span className={`text-[11px] ${positive ? 'text-[#608275]' : 'text-[#c36149]'}`}>{value}</span></div>;
}

function ImpactComparison({ impact }: { impact: number }) {
  const current = 72;
  const future = Math.max(22, current - Math.round(impact * .58));
  return <div className="rounded-2xl border border-[#e5ddcd] bg-[#fffdf8] p-5" data-testid="impact-comparison"><div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><h2 className="font-display text-base font-bold text-[#244545]">The before / after</h2><p className="mt-1 text-xs text-[#7d9187]">What this bundle changes in South Market.</p></div><div className="flex items-center gap-2 font-mono text-[10px] text-[#70877b]"><span className="size-2 rounded-full bg-[#dd643f]" /> Current <span className="ml-2 size-2 rounded-full bg-[#2e8067]" /> With plan</div></div><div className="grid items-end gap-5 md:grid-cols-[150px_1fr]"><div className="font-display text-5xl font-bold tracking-[-.07em] text-[#244545]">{future}<span className="text-xl text-[#7b9186]">/100</span><div className="mt-1 font-mono text-[10px] font-normal uppercase tracking-[.13em] text-[#82958a]">new risk index</div></div><div className="space-y-4"><Bar label="Current heat risk" value={current} color="#df6745" /><Bar label="With recommended plan" value={future} color="#32816a" /><div className="flex items-center gap-2 border-t border-[#eee8dc] pt-3 text-xs text-[#647b71]"><ArrowDownRight size={15} className="text-[#34846a]" /><b className="text-[#34846a]">{current - future} point reduction</b> in modeled risk over 24 months</div></div></div></div>;
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return <div><div className="mb-1.5 flex justify-between text-xs"><span className="font-medium text-[#547067]">{label}</span><span className="font-mono text-[#789086]">{value}</span></div><div className="h-3 overflow-hidden rounded-full bg-[#edf0e6]"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${value}%`, backgroundColor: color }} /></div></div>;
}

function Explain() {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-6">
      <div className="rise-in max-w-3xl"><div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#327561]"><Layers3 size={13} /> Explainable by design</div><h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-[-.06em] text-[#183737]">From heat signal<br /><span className="text-[#dd643f]">to city action.</span></h1><p className="mt-4 max-w-xl text-sm leading-relaxed text-[#6c8177]">HeatShield-X is a five-layer decision loop. Each layer makes the recommendation more useful to a city team — and easier to explain in a public meeting.</p></div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)]">
        <div className="overflow-hidden rounded-2xl border border-[#e5ddcd] bg-[#fffdf8]">{layers.map((layer, index) => { const Icon = layer.icon; const isOpen = open === index; return <button key={layer.number} onClick={() => setOpen(isOpen ? -1 : index)} className={`flex w-full items-start gap-4 border-b border-[#eee8dc] p-5 text-left transition last:border-b-0 ${isOpen ? 'bg-[#eff3e3]' : 'hover:bg-[#faf7ee]'}`} data-testid={`button-layer-${index + 1}`}><span className={`font-mono text-[10px] ${isOpen ? 'text-[#dd643f]' : 'text-[#9aac9f]'}`}>{layer.number}</span><span className={`grid size-9 shrink-0 place-items-center rounded-xl ${isOpen ? 'bg-[#ff7045] text-[#173536]' : 'bg-[#e8f0e0] text-[#337460]'}`}><Icon size={17} /></span><span className="flex-1"><span className="block font-display font-bold text-[#244545]">{layer.title}</span>{isOpen && <span className="mt-2 block text-xs leading-relaxed text-[#71877c]">{layer.body}</span>}</span><ChevronDown size={16} className={`mt-1 text-[#7e9488] transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>; })}</div>
        <div className="rounded-2xl bg-[#173536] p-6 text-[#eff2df]"><div className="mb-12 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-[#9db6a7]"><ShieldCheck size={15} className="text-[#ff7045]" /> A defensible recommendation</div><div className="font-display text-[30px] font-bold leading-[1.02] tracking-[-.06em]">Not just the<br /><span className="text-[#ffcf70]">hottest block.</span></div><p className="mt-5 text-xs leading-relaxed text-[#b1c5b7]">The best first move is where heat, exposure and delivery readiness overlap. That is why the model rejects expensive gestures and recommends a bundle people can feel.</p><div className="mt-8 space-y-4 border-t border-[#355951] pt-5"><div className="flex items-center gap-3 text-xs"><Check size={15} className="text-[#80c890]" /><span>Evidence attached to every score</span></div><div className="flex items-center gap-3 text-xs"><Check size={15} className="text-[#80c890]" /><span>Budget and maintenance included</span></div><div className="flex items-center gap-3 text-xs"><Check size={15} className="text-[#80c890]" /><span>Trade-offs shown, not hidden</span></div></div></div>
      </div>
      <div className="rounded-2xl border border-[#ecdcc6] bg-[#fff5e6] p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f6d4ad] text-[#b65e38]"><Info size={19} /></div><div className="flex-1"><div className="text-sm font-bold text-[#57473d]">Model note</div><div className="mt-1 text-xs leading-relaxed text-[#7d6859]">Simulated hackathon data for Port Meridian. In production, this pipeline would connect to municipal GIS, weather forecasts and capital project systems.</div></div><button onClick={() => window.alert('Method notes copied to clipboard for your demo brief.')} className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-3 py-2 text-xs font-bold text-[#7a5a46] shadow-sm transition hover:bg-white" data-testid="button-copy-notes"><Download size={14} /> Copy notes</button></div></div>
    </div>
  );
}

function Home() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState('south-market');
  const [city, setCity] = useState('Port Meridian');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const viewTitle = activeView === 'dashboard' ? 'Overview' : activeView === 'scenario' ? 'Scenario lab' : 'How it works';
  const handleExport = () => { setNotice('Action brief ready — your scenario is included.'); window.setTimeout(() => setNotice(''), 3200); };
  const selectedZone = useMemo(() => zones.find((zone) => zone.id === selectedId) ?? zones[0], [selectedId]);
  return (
    <AppShell>
      <Sidebar activeView={activeView} setActiveView={setActiveView} collapsed={collapsed} setCollapsed={setCollapsed} />
      {mobileOpen && <div className="fixed inset-0 z-40 bg-[#173536]/40 md:hidden" onClick={() => setMobileOpen(false)}><div className="h-full w-[280px] bg-[#173536] p-5" onClick={(event) => event.stopPropagation()}><div className="mb-10 flex items-center justify-between"><BrandMark /><button onClick={() => setMobileOpen(false)} className="p-2 text-[#b4c8ba]" aria-label="Close menu" data-testid="button-close-mobile-menu"><X size={20} /></button></div><div className="space-y-2">{['dashboard', 'scenario', 'explain'].map((view) => <button key={view} onClick={() => { setActiveView(view); setMobileOpen(false); }} className="flex w-full rounded-xl px-3 py-3 text-left text-sm font-bold capitalize text-[#e9eddf]" data-testid={`mobile-nav-${view}`}>{view === 'dashboard' ? 'Heat overview' : view === 'scenario' ? 'Scenario lab' : 'How it works'}</button>)}</div></div></div>}
      <div className={`min-w-0 flex-1 transition-[margin] duration-300 ${collapsed ? 'md:ml-[82px]' : 'md:ml-[252px]'}`}>
        <Header city={city} setCity={setCity} onExport={handleExport} onMobileMenu={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-[1480px] px-4 py-7 sm:px-6 md:px-8">
          <div className="mb-7 flex items-center gap-2 text-xs text-[#82968a]"><span className="font-mono text-[10px] uppercase tracking-[.16em]">{viewTitle}</span><span className="text-[#c9c2b4]">/</span><span className="font-medium text-[#42655b]">{selectedZone.name}</span></div>
          {activeView === 'dashboard' && <Dashboard city={city} selectedId={selectedId} setSelectedId={setSelectedId} setActiveView={setActiveView} />}
          {activeView === 'scenario' && <Scenario selectedId={selectedId} />}
          {activeView === 'explain' && <Explain />}
        </main>
        {notice && <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-xl bg-[#173536] px-4 py-3 text-xs font-bold text-[#eff2df] shadow-xl fade-in" role="status" data-testid="status-notice"><Check size={15} className="text-[#83c391]" /> {notice}</div>}
      </div>
    </AppShell>
  );
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary resetKey={location.pathname}><Router /></ErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;