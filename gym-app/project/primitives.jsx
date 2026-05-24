// Iconos — line icons minimalistas (stroke 1.5)
const ICON = {
  home: (s=20)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>),
  dumbbell: (s=20)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  chart: (s=20)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 20h18M7 16V10M12 16V6M17 16v-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  calendar: (s=20)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  user: (s=20)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  play: (s=14)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8V4z"/></svg>),
  pause: (s=14)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>),
  plus: (s=18)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  check: (s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  arrow: (s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  trend: (s=14)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 17l6-6 4 4 8-8M14 7h7v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  bell: (s=18)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15L6 16zM10 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  search: (s=18)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  filter: (s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  card: (s=18)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 11h20" stroke="currentColor" strokeWidth="1.5"/></svg>),
  dots: (s=18)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>),
  back: (s=18)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  close: (s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  ruler: (s=20)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 8l5-5 13 13-5 5L3 8zM7 8l1 1M10 5l1 1M5 11l1 1M11 14l1 1M8 17l1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  flame: (s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3c2 4-3 5-3 9a3 3 0 006 0c0-2-1-3-1-5 3 2 4 5 4 8a6 6 0 01-12 0c0-5 6-7 6-12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>),
  bolt: (s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>),
  users: (s=18)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 20c0-2.5 1.6-4.7 4-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  money: (s=18)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M14 9c-.5-1-1.6-1.5-3-1.3-1.5.2-2 1-2 1.7 0 2 5 1.4 5 3.6 0 .8-.6 1.7-2 2-1.5.3-2.7-.3-3.2-1.3M11 6v1.5M11 16v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  settings: (s=18)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" stroke="currentColor" strokeWidth="1.5"/></svg>),
  send: (s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 12L21 4l-4 18-4-7-7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>),
  weight: (s=18)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 8h14l-1.5 12H6.5L5 8zM9 8a3 3 0 016 0" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>),
  download: (s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

// Placeholder image for missing assets — striped SVG with mono label
function Placeholder({ label='IMAGE', w='100%', h=120, dark=false }) {
  const fg = dark ? 'rgba(245,244,238,0.18)' : 'rgba(14,14,12,0.12)';
  const tx = dark ? 'rgba(245,244,238,0.6)' : 'rgba(14,14,12,0.55)';
  const id = 'p'+Math.random().toString(36).slice(2,7);
  return (
    <div style={{ width: w, height: h, position:'relative', borderRadius: 12, overflow:'hidden', background: dark?'#1a1a18':'#EFEDE6' }}>
      <svg width="100%" height="100%" style={{position:'absolute', inset:0}}>
        <defs>
          <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke={fg} strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`}/>
      </svg>
      <div style={{
        position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:1, color: tx, textTransform:'uppercase',
      }}>{label}</div>
    </div>
  );
}

// Avatar — initial circle in muted tone
function Avatar({ name='??', size=36, dark=false }) {
  const initials = name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
  const hue = (name.charCodeAt(0)*7) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: size,
      background: `oklch(${dark?0.32:0.92} 0.04 ${hue})`,
      color: dark ? '#F5F4EE' : '#0E0E0C',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'var(--font-display)', fontWeight:600, fontSize: size*0.38,
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// Simple sparkline
function Sparkline({ data=[], width=120, height=36, color='currentColor', fill=false }) {
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max-min || 1;
  const pts = data.map((v,i)=>[
    (i/(data.length-1))*width,
    height - ((v-min)/range)*(height-4) - 2
  ]);
  const d = pts.map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const fillD = d + ` L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} style={{ display:'block', overflow:'visible' }}>
      {fill && <path d={fillD} fill={color} fillOpacity="0.12"/>}
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Bar chart
function BarChart({ data=[], labels=[], width=300, height=140, color='currentColor', dark=false }) {
  const max = Math.max(...data) || 1;
  const bw = width / data.length;
  const padding = 4;
  return (
    <svg width={width} height={height} style={{display:'block'}}>
      {data.map((v,i)=>{
        const h = (v/max)*(height-24);
        return (
          <g key={i}>
            <rect x={i*bw+padding} y={height-h-18} width={bw-padding*2} height={h} rx="3" fill={color} opacity={i===data.length-1?1:0.45}/>
            <text x={i*bw+bw/2} y={height-4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill={dark?'#A0A097':'#6B6B64'}>{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

Object.assign(window, { ICON, Placeholder, Avatar, Sparkline, BarChart });
