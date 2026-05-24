// Cliente móvil — 6 pantallas en device frame iOS
// Pantallas: home, routines, workout, progress, calendar, profile

const clientStyles = {
  screen: { background: 'var(--bg)', minHeight: '100%', paddingBottom: 90 },
  navbar: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding: '60px 24px 8px', position:'sticky', top:0, zIndex:5,
    background:'var(--bg)',
  },
  navTitle: { fontFamily:'var(--font-display)', fontSize: 13, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', color:'var(--ink-3)' },
  navIcon: { width:40, height:40, borderRadius:40, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink-2)' },
  card: { background:'var(--bg-elev)', borderRadius:20, padding:20, boxShadow:'var(--shadow-sm)' },
  bigNum: { fontFamily:'var(--font-display)', fontSize:64, fontWeight:600, lineHeight:1, letterSpacing:-2, color:'var(--ink)' },
  label: { fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'var(--ink-3)' },
  pill: { display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:99, fontSize:11, fontFamily:'var(--font-mono)', letterSpacing:0.5 },
};

function ClientNav({ active, onNav }) {
  const items = [
    { id:'home', icon: ICON.home, label:'Inicio' },
    { id:'routines', icon: ICON.dumbbell, label:'Rutinas' },
    { id:'progress', icon: ICON.chart, label:'Progreso' },
    { id:'calendar', icon: ICON.calendar, label:'Agenda' },
    { id:'profile', icon: ICON.user, label:'Perfil' },
  ];
  return (
    <div style={{
      position:'absolute', bottom:0, left:0, right:0, padding:'8px 12px 30px',
      background: 'color-mix(in oklab, var(--bg) 88%, transparent)',
      backdropFilter:'blur(20px) saturate(180%)',
      WebkitBackdropFilter:'blur(20px) saturate(180%)',
      borderTop:'0.5px solid var(--line)',
      display:'flex', justifyContent:'space-around', zIndex:50,
    }}>
      {items.map(it => (
        <button key={it.id} onClick={()=>onNav(it.id)} style={{
          background:'none', border:'none', padding:'8px 12px', cursor:'pointer',
          display:'flex', flexDirection:'column', alignItems:'center', gap:3,
          color: active===it.id ? 'var(--ink)' : 'var(--ink-4)',
        }}>
          {it.icon(22)}
          <span style={{fontSize:10, fontWeight:500, letterSpacing:0.2}}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── HOME ───────────────────────────────────────────────────
function ClientHome({ go }) {
  return (
    <div style={clientStyles.screen}>
      <div style={clientStyles.navbar}>
        <div>
          <div style={{...clientStyles.label, marginBottom:2}}>Lunes 18 May</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:24, fontWeight:600, letterSpacing:-0.5}}>Hola, Cliente 1</div>
        </div>
        <div style={clientStyles.navIcon}>{ICON.bell()}</div>
      </div>

      {/* Today's workout — hero card */}
      <div style={{padding:'12px 20px 0'}}>
        <div style={{
          background:'var(--ink)', color:'var(--bg)', borderRadius:24,
          padding:24, position:'relative', overflow:'hidden',
        }}>
          <div style={{...clientStyles.label, color:'rgba(255,255,255,0.5)', marginBottom:14}}>Hoy · Día 3 / 5</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:34, fontWeight:600, letterSpacing:-1, lineHeight:1.05, marginBottom:20}}>
            Pecho &<br/>Tríceps
          </div>
          <div style={{display:'flex', gap:24, marginBottom:24, fontSize:12, fontFamily:'var(--font-mono)', color:'rgba(255,255,255,0.7)'}}>
            <div><span style={{color:'#fff', fontSize:18, fontWeight:600, fontFamily:'var(--font-display)'}}>8</span> ejercicios</div>
            <div><span style={{color:'#fff', fontSize:18, fontWeight:600, fontFamily:'var(--font-display)'}}>~52</span> min</div>
            <div><span style={{color:'#fff', fontSize:18, fontWeight:600, fontFamily:'var(--font-display)'}}>24</span> series</div>
          </div>
          <button onClick={()=>go('workout')} style={{
            width:'100%', padding:'16px', borderRadius:14, border:'none',
            background:'var(--accent)', color:'var(--accent-ink)',
            fontFamily:'var(--font-display)', fontWeight:600, fontSize:15,
            display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer',
          }}>
            {ICON.play(12)} Empezar entreno
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{padding:'16px 20px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div style={clientStyles.card}>
          <div style={clientStyles.label}>Esta semana</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:36, fontWeight:600, letterSpacing:-1, marginTop:4}}>3<span style={{color:'var(--ink-4)', fontSize:20}}>/5</span></div>
          <div style={{display:'flex', gap:4, marginTop:10}}>
            {[1,1,1,0,0].map((v,i)=>(
              <div key={i} style={{flex:1, height:6, borderRadius:3, background: v?'var(--accent)':'var(--bg-sunk)'}}/>
            ))}
          </div>
        </div>
        <div style={clientStyles.card}>
          <div style={clientStyles.label}>Racha</div>
          <div style={{display:'flex', alignItems:'baseline', gap:6, marginTop:4}}>
            <div style={{fontFamily:'var(--font-display)', fontSize:36, fontWeight:600, letterSpacing:-1}}>12</div>
            <div style={{color:'var(--ink-3)', fontSize:13}}>días</div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:4, marginTop:10, color:'var(--ink-3)', fontSize:11}}>
            <span style={{color:'var(--accent)'}}>{ICON.flame()}</span> récord personal
          </div>
        </div>
      </div>

      {/* Próximo pago */}
      <div style={{padding:'16px 20px 0'}}>
        <div style={{...clientStyles.label, marginBottom:8, paddingLeft:4}}>Membresía</div>
        <button onClick={()=>go('profile')} style={{
          width:'100%', textAlign:'left', border:'none', cursor:'pointer',
          ...clientStyles.card, display:'flex', alignItems:'center', gap:14,
        }}>
          <div style={{width:42, height:42, borderRadius:12, background:'var(--bg-sunk)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink-2)'}}>
            {ICON.card()}
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600, fontSize:14, color:'var(--ink)'}}>Plan Mensual</div>
            <div style={{fontSize:12, color:'var(--ink-3)', marginTop:2}}>Próximo cobro · 1 Jun</div>
          </div>
          <div style={{fontFamily:'var(--font-mono)', fontSize:14, color:'var(--ink-2)'}}>₡25.000</div>
        </button>
      </div>

      {/* Quick log */}
      <div style={{padding:'20px'}}>
        <div style={{...clientStyles.label, marginBottom:8, paddingLeft:4}}>Acciones rápidas</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          {[
            {icon: ICON.weight, label:'Registrar peso'},
            {icon: ICON.ruler, label:'Medidas'},
          ].map(it=>(
            <button key={it.label} style={{
              ...clientStyles.card, border:'none', cursor:'pointer', textAlign:'left',
              display:'flex', flexDirection:'column', gap:14, padding:16,
            }}>
              <div style={{color:'var(--ink-2)'}}>{it.icon()}</div>
              <div style={{fontSize:13, fontWeight:500}}>{it.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROUTINES LIST ──────────────────────────────────────────
function ClientRoutines({ go, onOpenRoutine }) {
  const routines = [
    { id:'push',  name:'Push · Pecho/Tríceps',  day:'Hoy',   sets:24, exs:8, active:true },
    { id:'pull',  name:'Pull · Espalda/Bíceps', day:'Mañana',sets:22, exs:7 },
    { id:'legs',  name:'Legs · Tren inferior',  day:'Mié',   sets:20, exs:6 },
    { id:'shldr', name:'Push · Hombros foco',   day:'Jue',   sets:18, exs:6 },
    { id:'pullv', name:'Pull · Volumen',        day:'Vie',   sets:24, exs:8 },
  ];
  return (
    <div style={clientStyles.screen}>
      <div style={clientStyles.navbar}>
        <div style={{fontFamily:'var(--font-display)', fontSize:28, fontWeight:600, letterSpacing:-0.5}}>Rutinas</div>
        <div style={clientStyles.navIcon}>{ICON.search()}</div>
      </div>

      <div style={{padding:'4px 20px 12px'}}>
        <div style={{...clientStyles.label, marginBottom:6}}>Programa actual</div>
        <div style={{fontFamily:'var(--font-display)', fontSize:18, fontWeight:600}}>Push / Pull / Legs · 5 días</div>
        <div style={{fontSize:12, color:'var(--ink-3)', marginTop:2}}>Asignado por Owner 1 · Sem 4 de 8</div>
      </div>

      <div style={{padding:'8px 20px', display:'flex', flexDirection:'column', gap:10}}>
        {routines.map((r,i)=>(
          <button key={i} onClick={()=>onOpenRoutine(r)} style={{
            ...clientStyles.card, border:'none', cursor:'pointer', textAlign:'left',
            padding:18, position:'relative',
            ...(r.active ? {outline:'2px solid var(--accent)', outlineOffset:-2} : {}),
          }}>
            <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14}}>
              <div>
                <div style={{...clientStyles.label, color: r.active?'var(--ink)':'var(--ink-3)', marginBottom:4}}>{r.day}</div>
                <div style={{fontFamily:'var(--font-display)', fontSize:18, fontWeight:600, letterSpacing:-0.3}}>{r.name}</div>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                {r.active && <div style={{...clientStyles.pill, background:'var(--accent)', color:'var(--accent-ink)'}}>Hoy</div>}
                <span style={{color:'var(--ink-4)'}}>{ICON.arrow(14)}</span>
              </div>
            </div>
            <div style={{display:'flex', gap:18, fontSize:12, color:'var(--ink-3)', fontFamily:'var(--font-mono)'}}>
              <div>{r.exs} ejercicios</div>
              <div>{r.sets} series</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ROUTINE DETAIL (read-only preview) ─────────────────────
const ROUTINE_EXERCISES = {
  push: [
    {name:'Press de banca',           muscle:'Pecho',    sets:4, reps:'8-12',  rest:'90s', tempo:'2-1-2', last:'60 kg × 12'},
    {name:'Press inclinado mancuerna',muscle:'Pecho',    sets:4, reps:'10',    rest:'90s', tempo:'2-1-2', last:'22 kg × 10'},
    {name:'Aperturas con mancuerna',  muscle:'Pecho',    sets:3, reps:'10-12', rest:'60s', tempo:'3-0-2', last:'25 kg × 12'},
    {name:'Cruce en polea',           muscle:'Pecho',    sets:3, reps:'12-15', rest:'60s', tempo:'2-1-2', last:'18 kg × 14'},
    {name:'Press francés',            muscle:'Tríceps',  sets:3, reps:'8-10',  rest:'75s', tempo:'2-1-2', last:'30 kg × 10'},
    {name:'Extensión en polea',       muscle:'Tríceps',  sets:3, reps:'12',    rest:'60s', tempo:'2-1-2', last:'22 kg × 12'},
    {name:'Fondos en máquina',        muscle:'Tríceps',  sets:2, reps:'10-12', rest:'60s', tempo:'2-1-2', last:'40 kg × 12'},
    {name:'Plancha',                  muscle:'Core',     sets:2, reps:'45 s',  rest:'45s', tempo:'—',     last:'45 s'},
  ],
  pull: [
    {name:'Dominadas asistidas',      muscle:'Espalda',  sets:4, reps:'6-10',  rest:'90s', tempo:'2-1-2', last:'−15 kg × 8'},
    {name:'Remo con barra',           muscle:'Espalda',  sets:4, reps:'8-10',  rest:'90s', tempo:'2-1-2', last:'50 kg × 10'},
    {name:'Jalón al pecho',           muscle:'Espalda',  sets:3, reps:'10-12', rest:'75s', tempo:'2-1-2', last:'45 kg × 12'},
    {name:'Remo en polea baja',       muscle:'Espalda',  sets:3, reps:'12',    rest:'60s', tempo:'2-1-2', last:'40 kg × 12'},
    {name:'Curl con barra',           muscle:'Bíceps',   sets:3, reps:'8-10',  rest:'75s', tempo:'2-1-2', last:'30 kg × 10'},
    {name:'Curl martillo',            muscle:'Bíceps',   sets:3, reps:'10-12', rest:'60s', tempo:'2-1-2', last:'14 kg × 12'},
    {name:'Face pull',                muscle:'Hombro',   sets:3, reps:'15',    rest:'60s', tempo:'2-1-2', last:'18 kg × 15'},
  ],
  legs: [
    {name:'Sentadilla con barra',     muscle:'Cuádriceps',sets:5,reps:'5-8',   rest:'120s',tempo:'3-1-1', last:'80 kg × 6'},
    {name:'Prensa 45°',               muscle:'Cuádriceps',sets:4,reps:'10-12', rest:'90s', tempo:'2-1-2', last:'140 kg × 12'},
    {name:'Peso muerto rumano',       muscle:'Glúteos',  sets:4, reps:'8-10',  rest:'90s', tempo:'3-1-1', last:'70 kg × 10'},
    {name:'Extensión de cuádriceps',  muscle:'Cuádriceps',sets:3,reps:'12-15', rest:'60s', tempo:'2-1-2', last:'45 kg × 15'},
    {name:'Curl femoral',             muscle:'Isquios',  sets:3, reps:'10-12', rest:'60s', tempo:'2-1-2', last:'35 kg × 12'},
    {name:'Elevación de gemelos',     muscle:'Gemelos',  sets:4, reps:'12-15', rest:'45s', tempo:'2-1-2', last:'90 kg × 15'},
  ],
  shldr: [
    {name:'Press militar',            muscle:'Hombros',  sets:4, reps:'6-8',   rest:'90s', tempo:'2-1-2', last:'40 kg × 8'},
    {name:'Press Arnold',             muscle:'Hombros',  sets:3, reps:'10',    rest:'75s', tempo:'2-1-2', last:'14 kg × 10'},
    {name:'Elevaciones laterales',    muscle:'Hombros',  sets:4, reps:'12-15', rest:'60s', tempo:'2-1-2', last:'8 kg × 14'},
    {name:'Pájaros',                  muscle:'Hombros',  sets:3, reps:'12-15', rest:'60s', tempo:'2-1-2', last:'7 kg × 15'},
    {name:'Encogimientos',            muscle:'Trapecio', sets:3, reps:'12',    rest:'60s', tempo:'2-1-2', last:'30 kg × 12'},
    {name:'Press francés',            muscle:'Tríceps',  sets:3, reps:'10',    rest:'60s', tempo:'2-1-2', last:'30 kg × 10'},
  ],
  pullv: [
    {name:'Remo Pendlay',             muscle:'Espalda',  sets:4, reps:'6-8',   rest:'120s',tempo:'2-1-2', last:'60 kg × 8'},
    {name:'Dominadas lastradas',      muscle:'Espalda',  sets:4, reps:'6-8',   rest:'90s', tempo:'2-1-2', last:'+5 kg × 6'},
    {name:'Remo en T',                muscle:'Espalda',  sets:3, reps:'10',    rest:'75s', tempo:'2-1-2', last:'45 kg × 10'},
    {name:'Pullover en polea',        muscle:'Espalda',  sets:3, reps:'12',    rest:'60s', tempo:'2-1-2', last:'25 kg × 12'},
    {name:'Curl predicador',          muscle:'Bíceps',   sets:4, reps:'8-10',  rest:'75s', tempo:'2-1-2', last:'25 kg × 10'},
    {name:'Curl concentrado',         muscle:'Bíceps',   sets:3, reps:'10-12', rest:'60s', tempo:'2-1-2', last:'10 kg × 12'},
    {name:'Curl inverso',             muscle:'Antebrazo',sets:3, reps:'12',    rest:'45s', tempo:'2-1-2', last:'15 kg × 12'},
    {name:'Face pull',                muscle:'Hombro',   sets:3, reps:'15',    rest:'45s', tempo:'2-1-2', last:'18 kg × 15'},
  ],
};

function ClientRoutineDetail({ routine, onBack, onStart }) {
  const exs = ROUTINE_EXERCISES[routine.id] || ROUTINE_EXERCISES.push;
  const totalMin = Math.round(exs.reduce((acc,e)=>acc + e.sets*1.5 + (parseInt(e.rest)||60)/60*e.sets, 0));

  // group by muscle
  const groups = exs.reduce((acc, e)=>{
    (acc[e.muscle] = acc[e.muscle] || []).push(e);
    return acc;
  }, {});

  return (
    <div style={{...clientStyles.screen, paddingBottom:140}}>
      <div style={{...clientStyles.navbar, alignItems:'center'}}>
        <button onClick={onBack} style={{...clientStyles.navIcon, border:'none', background:'var(--bg-sunk)', cursor:'pointer'}}>
          {ICON.arrow(16)}
        </button>
        <div style={clientStyles.label}>Detalle de rutina</div>
        <div style={clientStyles.navIcon}>{ICON.dots()}</div>
      </div>

      {/* hero */}
      <div style={{padding:'8px 20px 16px'}}>
        <div style={{...clientStyles.label, marginBottom:6, color: routine.active?'var(--ink)':'var(--ink-3)'}}>
          {routine.day}{routine.active && ' · ACTIVA'}
        </div>
        <div style={{fontFamily:'var(--font-display)', fontSize:28, fontWeight:600, letterSpacing:-0.5, lineHeight:1.1}}>{routine.name}</div>
        <div style={{display:'flex', gap:18, marginTop:14, fontSize:12, fontFamily:'var(--font-mono)', color:'var(--ink-3)'}}>
          <div><span style={{color:'var(--ink)', fontFamily:'var(--font-display)', fontSize:16, fontWeight:600}}>{exs.length}</span> ejercicios</div>
          <div><span style={{color:'var(--ink)', fontFamily:'var(--font-display)', fontSize:16, fontWeight:600}}>{routine.sets}</span> series</div>
          <div><span style={{color:'var(--ink)', fontFamily:'var(--font-display)', fontSize:16, fontWeight:600}}>~{totalMin}</span> min</div>
        </div>
      </div>

      {/* muscle pills summary */}
      <div style={{padding:'0 20px 16px', display:'flex', gap:6, flexWrap:'wrap'}}>
        {Object.keys(groups).map(m=>(
          <div key={m} style={{
            padding:'5px 11px', borderRadius:99, fontSize:11, fontFamily:'var(--font-mono)',
            background:'var(--bg-sunk)', color:'var(--ink-2)', letterSpacing:0.3,
          }}>{m} · {groups[m].length}</div>
        ))}
      </div>

      {/* exercise list grouped */}
      <div style={{padding:'0 20px', display:'flex', flexDirection:'column', gap:18}}>
        {Object.entries(groups).map(([muscle, items])=>(
          <div key={muscle}>
            <div style={{...clientStyles.label, marginBottom:8, paddingLeft:4}}>{muscle}</div>
            <div style={{...clientStyles.card, padding:0, overflow:'hidden'}}>
              {items.map((ex, i)=>(
                <div key={i} style={{
                  padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12,
                  borderBottom: i<items.length-1?'1px solid var(--line-2)':'none',
                }}>
                  <div style={{
                    width:28, height:28, borderRadius:8, flexShrink:0,
                    background:'var(--bg-sunk)', color:'var(--ink-2)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600,
                  }}>{i+1}</div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:14, fontWeight:500, letterSpacing:-0.1}}>{ex.name}</div>
                    <div style={{display:'flex', gap:14, marginTop:6, fontSize:11, fontFamily:'var(--font-mono)', color:'var(--ink-3)', flexWrap:'wrap'}}>
                      <div><span style={{color:'var(--ink-2)'}}>{ex.sets}×{ex.reps}</span></div>
                      <div>desc {ex.rest}</div>
                      {ex.tempo!=='—' && <div>tempo {ex.tempo}</div>}
                    </div>
                    <div style={{fontSize:10, fontFamily:'var(--font-mono)', color:'var(--ink-4)', marginTop:4, letterSpacing:0.3}}>
                      ÚLTIMA · {ex.last}
                    </div>
                  </div>
                  <button style={{
                    background:'none', border:'none', cursor:'pointer', padding:6,
                    color:'var(--ink-4)', flexShrink:0,
                  }}>{ICON.dots(14)}</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* sticky CTA */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:90,
        padding:'12px 20px',
        background:'color-mix(in oklab, var(--bg) 88%, transparent)',
        backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        borderTop:'0.5px solid var(--line)',
      }}>
        <button onClick={onStart} style={{
          width:'100%', padding:'16px', borderRadius:14, border:'none', cursor:'pointer',
          background: routine.active?'var(--accent)':'var(--ink)',
          color: routine.active?'var(--accent-ink)':'var(--bg)',
          fontFamily:'var(--font-display)', fontWeight:600, fontSize:15,
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        }}>
          {ICON.play(12)} {routine.active?'Empezar entreno':'Hacer esta rutina'}
        </button>
      </div>
    </div>
  );
}

// ─── WORKOUT (executing) ────────────────────────────────────
function ClientWorkout({ go, dark }) {
  const [exIdx, setExIdx] = React.useState(0);
  const [sets, setSets] = React.useState([
    [{w:60,r:12,done:true},{w:60,r:10,done:true},{w:60,r:8,done:false},{w:60,r:8,done:false}],
    [{w:25,r:12,done:false},{w:25,r:12,done:false},{w:25,r:10,done:false}],
    [{w:30,r:10,done:false},{w:30,r:10,done:false},{w:30,r:8,done:false}],
  ]);
  const [timer, setTimer] = React.useState(78);
  const [running, setRunning] = React.useState(true);

  React.useEffect(()=>{
    if (!running) return;
    const id = setInterval(()=>setTimer(t=>t+1), 1000);
    return ()=>clearInterval(id);
  }, [running]);

  const exs = [
    {name:'Press de banca', target:'4 × 8-12', muscle:'Pecho', last:'60 kg × 12'},
    {name:'Aperturas con mancuerna', target:'3 × 10-12', muscle:'Pecho', last:'25 kg × 12'},
    {name:'Press francés', target:'3 × 8-10', muscle:'Tríceps', last:'30 kg × 10'},
  ];
  const ex = exs[exIdx];
  const exSets = sets[exIdx];
  const totalSets = sets.flat().length;
  const doneSets = sets.flat().filter(s=>s.done).length;

  const toggleSet = (si) => {
    const ns = sets.map(arr=>arr.map(s=>({...s})));
    ns[exIdx][si].done = !ns[exIdx][si].done;
    setSets(ns);
  };
  const updateSet = (si, k, v) => {
    const ns = sets.map(arr=>arr.map(s=>({...s})));
    ns[exIdx][si][k] = v;
    setSets(ns);
  };

  const fmtTime = (s)=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div style={{...clientStyles.screen, paddingBottom:120, background:'var(--bg)'}}>
      <div style={{...clientStyles.navbar, alignItems:'center'}}>
        <button onClick={()=>go('home')} style={{...clientStyles.navIcon, border:'none', background:'var(--bg-sunk)', cursor:'pointer'}}>
          {ICON.close()}
        </button>
        <div style={{textAlign:'center'}}>
          <div style={clientStyles.label}>Pecho · Tríceps</div>
          <div style={{fontFamily:'var(--font-mono)', fontSize:18, fontWeight:600, letterSpacing:0.5, marginTop:2}}>{fmtTime(timer)}</div>
        </div>
        <button onClick={()=>setRunning(!running)} style={{...clientStyles.navIcon, border:'none', background:'var(--accent)', color:'var(--accent-ink)', cursor:'pointer'}}>
          {running?ICON.pause():ICON.play()}
        </button>
      </div>

      {/* progress bar */}
      <div style={{padding:'8px 20px 16px'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:11, fontFamily:'var(--font-mono)', color:'var(--ink-3)'}}>
          <span>SERIES {doneSets}/{totalSets}</span>
          <span>EJERCICIO {exIdx+1}/{exs.length}</span>
        </div>
        <div style={{height:4, background:'var(--bg-sunk)', borderRadius:2, overflow:'hidden'}}>
          <div style={{height:'100%', width:`${(doneSets/totalSets)*100}%`, background:'var(--accent)', transition:'width .3s'}}/>
        </div>
      </div>

      {/* current exercise */}
      <div style={{padding:'0 20px'}}>
        <div style={clientStyles.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14}}>
            <div>
              <div style={{...clientStyles.label, marginBottom:4}}>{ex.muscle}</div>
              <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, letterSpacing:-0.4}}>{ex.name}</div>
              <div style={{fontSize:12, color:'var(--ink-3)', marginTop:4, fontFamily:'var(--font-mono)'}}>OBJETIVO {ex.target} · ÚLTIMA: {ex.last}</div>
            </div>
          </div>

          {/* set rows */}
          <div style={{marginTop:8}}>
            <div style={{display:'grid', gridTemplateColumns:'32px 1fr 1fr 40px', gap:10, padding:'4px 0 8px', fontSize:10, fontFamily:'var(--font-mono)', color:'var(--ink-3)', letterSpacing:0.8, borderBottom:'1px solid var(--line)'}}>
              <div>SET</div>
              <div>KG</div>
              <div>REPS</div>
              <div></div>
            </div>
            {exSets.map((s,i)=>(
              <div key={i} style={{
                display:'grid', gridTemplateColumns:'32px 1fr 1fr 40px', gap:10,
                padding:'10px 0', alignItems:'center',
                borderBottom: i<exSets.length-1?'1px solid var(--line-2)':'none',
                opacity: s.done?0.55:1,
              }}>
                <div style={{fontFamily:'var(--font-mono)', fontSize:13, color:'var(--ink-3)'}}>{i+1}</div>
                <input type="number" value={s.w} onChange={e=>updateSet(i,'w',+e.target.value||0)} style={{
                  border:'none', background:'var(--bg-sunk)', borderRadius:8, padding:'8px 10px',
                  fontFamily:'var(--font-mono)', fontSize:14, color:'var(--ink)', width:'100%',
                  textDecoration: s.done?'line-through':'none',
                }}/>
                <input type="number" value={s.r} onChange={e=>updateSet(i,'r',+e.target.value||0)} style={{
                  border:'none', background:'var(--bg-sunk)', borderRadius:8, padding:'8px 10px',
                  fontFamily:'var(--font-mono)', fontSize:14, color:'var(--ink)', width:'100%',
                  textDecoration: s.done?'line-through':'none',
                }}/>
                <button onClick={()=>toggleSet(i)} style={{
                  width:32, height:32, borderRadius:32, border:'none', cursor:'pointer',
                  background: s.done?'var(--accent)':'var(--bg-sunk)',
                  color: s.done?'var(--accent-ink)':'var(--ink-3)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{ICON.check()}</button>
              </div>
            ))}
          </div>

          <button style={{
            marginTop:10, width:'100%', padding:'10px', borderRadius:10,
            background:'transparent', border:'1px dashed var(--line)',
            color:'var(--ink-3)', fontSize:13, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>{ICON.plus(14)} Añadir serie</button>
        </div>
      </div>

      {/* nav between exs */}
      <div style={{padding:'16px 20px', display:'flex', gap:8}}>
        <button onClick={()=>setExIdx(Math.max(0,exIdx-1))} disabled={exIdx===0} style={{
          flex:1, padding:'14px', border:'1px solid var(--line)', background:'var(--bg-elev)',
          borderRadius:14, cursor: exIdx===0?'default':'pointer', opacity: exIdx===0?0.4:1,
          color:'var(--ink-2)', fontWeight:500, fontSize:14,
        }}>Anterior</button>
        <button onClick={()=>exIdx<exs.length-1 ? setExIdx(exIdx+1) : go('home')} style={{
          flex:2, padding:'14px', border:'none', background:'var(--ink)',
          borderRadius:14, cursor:'pointer', color:'var(--bg)', fontWeight:600, fontSize:14,
          fontFamily:'var(--font-display)',
        }}>{exIdx<exs.length-1?'Siguiente ejercicio':'Finalizar entreno'}</button>
      </div>
    </div>
  );
}

// ─── PROGRESS ───────────────────────────────────────────────
function ClientProgress({ onLogWeight, onLogMeasure, weightLatest, measurements }) {
  const weightData = [76.2, 75.8, 75.4, 75.1, 74.6, 74.3, weightLatest];
  const benchData = [55, 57.5, 60, 60, 62.5, 60, 65];
  const volumeData = [4200, 4800, 4500, 5200, 4900, 5400, 5800, 6100];
  const weightDelta = (weightLatest - 76.2).toFixed(1);

  return (
    <div style={clientStyles.screen}>
      <div style={clientStyles.navbar}>
        <div style={{fontFamily:'var(--font-display)', fontSize:28, fontWeight:600, letterSpacing:-0.5}}>Progreso</div>
        <div style={clientStyles.navIcon}>{ICON.dots()}</div>
      </div>

      {/* tab pills */}
      <div style={{padding:'4px 20px 12px', display:'flex', gap:6}}>
        {['Semana','Mes','3 Meses','Año'].map((t,i)=>(
          <button key={t} style={{
            padding:'6px 14px', borderRadius:99, border:'none', cursor:'pointer',
            background: i===1?'var(--ink)':'var(--bg-sunk)',
            color: i===1?'var(--bg)':'var(--ink-3)',
            fontSize:12, fontWeight:500,
          }}>{t}</button>
        ))}
      </div>

      {/* weight body */}
      <div style={{padding:'0 20px', display:'flex', flexDirection:'column', gap:12}}>
        <div style={clientStyles.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8}}>
            <div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10}}>
                <div style={clientStyles.label}>Peso corporal</div>
              </div>
              <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:4}}>
                <div style={{fontFamily:'var(--font-display)', fontSize:38, fontWeight:600, letterSpacing:-1}}>{weightLatest.toFixed(1)}</div>
                <div style={{color:'var(--ink-3)', fontSize:14}}>kg</div>
              </div>
            </div>
            <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8}}>
              <div style={{...clientStyles.pill, background:'color-mix(in oklab, var(--accent) 25%, transparent)', color:'var(--ink-2)', alignItems:'center'}}>
                {ICON.trend()} {weightDelta} kg
              </div>
              <button onClick={onLogWeight} style={{
                background:'var(--ink)', color:'var(--bg)', border:'none', cursor:'pointer',
                padding:'6px 12px', borderRadius:99, fontSize:11, fontFamily:'var(--font-mono)',
                letterSpacing:0.3, display:'flex', alignItems:'center', gap:5,
              }}>{ICON.plus(11)} Registrar</button>
            </div>
          </div>
          <div style={{marginTop:8}}>
            <Sparkline data={weightData} width={320} height={60} color="var(--ink)" fill={true}/>
          </div>
        </div>

        {/* PR — bench press */}
        <div style={clientStyles.card}>
          <div style={{...clientStyles.label, marginBottom:8}}>Press de banca · 1RM est.</div>
          <div style={{display:'flex', alignItems:'baseline', gap:8, marginBottom:14}}>
            <div style={{fontFamily:'var(--font-display)', fontSize:38, fontWeight:600, letterSpacing:-1}}>78</div>
            <div style={{color:'var(--ink-3)', fontSize:14}}>kg</div>
            <div style={{marginLeft:'auto', ...clientStyles.pill, background:'var(--bg-sunk)', color:'var(--ink-3)'}}>+10 kg / 8 sem</div>
          </div>
          <BarChart data={benchData} labels={['S1','S2','S3','S4','S5','S6','S7']} width={320} height={100} color="var(--ink)" />
        </div>

        {/* volume */}
        <div style={clientStyles.card}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <div>
              <div style={clientStyles.label}>Volumen total</div>
              <div style={{fontFamily:'var(--font-display)', fontSize:24, fontWeight:600, marginTop:4}}>6.100 <span style={{color:'var(--ink-3)', fontSize:14, fontWeight:400}}>kg/sem</span></div>
            </div>
            <Sparkline data={volumeData} width={140} height={50} color="var(--accent)"/>
          </div>
        </div>

        {/* measurements */}
        <div style={clientStyles.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
            <div style={clientStyles.label}>Medidas corporales</div>
            <button onClick={onLogMeasure} style={{background:'none', border:'none', color:'var(--ink-2)', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:4}}>
              {ICON.plus(12)} Nueva
            </button>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            {measurements.map(m=>(
              <div key={m.label}>
                <div style={{fontSize:11, color:'var(--ink-3)', marginBottom:2}}>{m.label}</div>
                <div style={{display:'flex', alignItems:'baseline', gap:4}}>
                  <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:600}}>{m.v}</div>
                  <div style={{fontSize:11, color:'var(--ink-3)'}}>{m.u}</div>
                  <div style={{marginLeft:'auto', fontSize:11, fontFamily:'var(--font-mono)', color:'var(--ink-2)'}}>{m.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ASSIGN ROUTINE SHEET ───────────────────────────────────
function AssignRoutineSheet({ open, onClose, onAssign }) {
  const [step, setStep] = React.useState(1); // 1: choose routine, 2: choose day, 3: optional time
  const [routine, setRoutine] = React.useState(null);
  const [day, setDay] = React.useState(null);
  const [time, setTime] = React.useState('07:00');

  React.useEffect(()=>{
    if (open) { setStep(1); setRoutine(null); setDay(null); setTime('07:00'); }
  }, [open]);

  const routines = [
    { id:'push',  name:'Push · Pecho/Tríceps',  exs:8, sets:24, mins:52, muscle:'Pecho · Tríceps' },
    { id:'pull',  name:'Pull · Espalda/Bíceps', exs:7, sets:22, mins:48, muscle:'Espalda · Bíceps' },
    { id:'legs',  name:'Legs · Tren inferior',  exs:6, sets:20, mins:55, muscle:'Cuádriceps · Glúteos' },
    { id:'shldr', name:'Push · Hombros foco',   exs:6, sets:18, mins:42, muscle:'Hombros' },
    { id:'pullv', name:'Pull · Volumen',        exs:8, sets:24, mins:58, muscle:'Espalda · Bíceps' },
    { id:'core',  name:'Core & Movilidad',      exs:5, sets:12, mins:30, muscle:'Core' },
  ];
  const days = [
    { id:'L', label:'Lun', date:'19 May' },
    { id:'M', label:'Mar', date:'20 May' },
    { id:'X', label:'Mié', date:'21 May' },
    { id:'J', label:'Jue', date:'22 May' },
    { id:'V', label:'Vie', date:'23 May' },
    { id:'S', label:'Sáb', date:'24 May' },
    { id:'D', label:'Dom', date:'25 May' },
  ];
  const occupied = { L:true, J:true, V:true }; // already-planned days

  if (!open) return null;

  const canConfirm = routine && day;

  return (
    <div style={{
      position:'absolute', inset:0, zIndex:100,
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
      background:'rgba(0,0,0,0.45)',
      animation:'sheetFade .18s ease-out',
    }} onClick={onClose}>
      <style>{`
        @keyframes sheetFade { from { background: rgba(0,0,0,0); } to { background: rgba(0,0,0,0.45); } }
        @keyframes sheetSlide { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'var(--bg)', borderTopLeftRadius:24, borderTopRightRadius:24,
        maxHeight:'88%', display:'flex', flexDirection:'column',
        animation:'sheetSlide .26s cubic-bezier(.2,.8,.2,1)',
        boxShadow:'0 -10px 40px rgba(0,0,0,0.25)',
      }}>
        {/* grabber */}
        <div style={{display:'flex', justifyContent:'center', padding:'10px 0 4px'}}>
          <div style={{width:38, height:5, borderRadius:5, background:'var(--line)'}}/>
        </div>

        {/* header */}
        <div style={{padding:'8px 20px 12px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div>
            <div style={{...clientStyles.label}}>Paso {step} / 2</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, letterSpacing:-0.4, marginTop:2}}>
              {step===1?'Elegí una rutina':'Asignala a un día'}
            </div>
          </div>
          <button onClick={onClose} style={{
            width:34, height:34, borderRadius:34, border:'none', cursor:'pointer',
            background:'var(--bg-sunk)', color:'var(--ink-2)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{ICON.close(14)}</button>
        </div>

        {/* progress segments */}
        <div style={{padding:'0 20px 14px', display:'flex', gap:6}}>
          {[1,2].map(s=>(
            <div key={s} style={{
              flex:1, height:3, borderRadius:3,
              background: step>=s?'var(--ink)':'var(--bg-sunk)',
              transition:'background .2s',
            }}/>
          ))}
        </div>

        {/* body */}
        <div style={{flex:1, overflowY:'auto', padding:'4px 20px 16px'}}>
          {step===1 && (
            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              {routines.map(r=>{
                const sel = routine?.id===r.id;
                return (
                  <button key={r.id} onClick={()=>setRoutine(r)} style={{
                    ...clientStyles.card, border:'none', cursor:'pointer', textAlign:'left',
                    padding:16, display:'flex', alignItems:'center', gap:14,
                    outline: sel?'2px solid var(--accent)':'1px solid var(--line-2)',
                    outlineOffset:-1,
                  }}>
                    <div style={{
                      width:42, height:42, borderRadius:12, flexShrink:0,
                      background: sel?'var(--accent)':'var(--bg-sunk)',
                      color: sel?'var(--accent-ink)':'var(--ink-2)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>{ICON.dumbbell(20)}</div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontFamily:'var(--font-display)', fontSize:15, fontWeight:600, letterSpacing:-0.2}}>{r.name}</div>
                      <div style={{display:'flex', gap:12, marginTop:4, fontSize:11, fontFamily:'var(--font-mono)', color:'var(--ink-3)'}}>
                        <span>{r.exs} ej.</span>
                        <span>{r.sets} series</span>
                        <span>~{r.mins} min</span>
                      </div>
                    </div>
                    <div style={{
                      width:22, height:22, borderRadius:22, flexShrink:0,
                      border: sel?'none':'1.5px solid var(--line)',
                      background: sel?'var(--ink)':'transparent',
                      color:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center',
                    }}>{sel && ICON.check(12)}</div>
                  </button>
                );
              })}
            </div>
          )}

          {step===2 && (
            <div>
              {/* selected routine summary */}
              <div style={{
                background:'var(--bg-sunk)', borderRadius:14, padding:12,
                display:'flex', alignItems:'center', gap:12, marginBottom:18,
              }}>
                <div style={{
                  width:36, height:36, borderRadius:10, background:'var(--accent)', color:'var(--accent-ink)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{ICON.dumbbell(18)}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:600}}>{routine?.name}</div>
                  <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)', marginTop:2}}>
                    {routine?.exs} ej. · ~{routine?.mins} min
                  </div>
                </div>
                <button onClick={()=>setStep(1)} style={{
                  background:'none', border:'none', cursor:'pointer',
                  fontSize:11, color:'var(--ink-2)', fontFamily:'var(--font-mono)',
                  textDecoration:'underline', textUnderlineOffset:3,
                }}>Cambiar</button>
              </div>

              <div style={{...clientStyles.label, marginBottom:10}}>Día de la semana</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6, marginBottom:20}}>
                {days.map(d=>{
                  const sel = day?.id===d.id;
                  const busy = occupied[d.id] && !sel;
                  return (
                    <button key={d.id} onClick={()=>setDay(d)} style={{
                      aspectRatio:'1/1.15', borderRadius:12, cursor:'pointer',
                      border:'none', padding:0,
                      background: sel?'var(--ink)':busy?'color-mix(in oklab, var(--accent) 20%, var(--bg-sunk))':'var(--bg-sunk)',
                      color: sel?'var(--bg)':'var(--ink)',
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4,
                      position:'relative',
                    }}>
                      <div style={{fontSize:10, fontFamily:'var(--font-mono)', letterSpacing:0.5, opacity:0.6}}>{d.label.toUpperCase()}</div>
                      <div style={{fontFamily:'var(--font-display)', fontSize:18, fontWeight:600, lineHeight:1}}>{d.id}</div>
                      {busy && <div style={{position:'absolute', bottom:5, width:4, height:4, borderRadius:4, background:'var(--accent)'}}/>}
                    </button>
                  );
                })}
              </div>

              {day && (
                <div style={{marginBottom:14}}>
                  <div style={{...clientStyles.label, marginBottom:10}}>Hora</div>
                  <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                    {['06:00','07:00','12:00','17:00','18:30','20:00'].map(t=>{
                      const sel = time===t;
                      return (
                        <button key={t} onClick={()=>setTime(t)} style={{
                          padding:'8px 14px', borderRadius:99, border:'none', cursor:'pointer',
                          background: sel?'var(--ink)':'var(--bg-sunk)',
                          color: sel?'var(--bg)':'var(--ink-2)',
                          fontSize:12, fontFamily:'var(--font-mono)', letterSpacing:0.3,
                        }}>{t}</button>
                      );
                    })}
                  </div>
                </div>
              )}

              {day && occupied[day.id] && (
                <div style={{
                  padding:'10px 12px', borderRadius:10,
                  background:'color-mix(in oklab, var(--accent) 22%, transparent)',
                  display:'flex', alignItems:'center', gap:10, fontSize:12, color:'var(--ink-2)',
                }}>
                  <span style={{color:'var(--ink)'}}>{ICON.bell(14)}</span>
                  Ya hay una sesión planeada el {day.label}. Se reemplazará.
                </div>
              )}
            </div>
          )}
        </div>

        {/* footer */}
        <div style={{
          padding:'12px 20px 26px', borderTop:'1px solid var(--line-2)',
          background:'var(--bg)', display:'flex', gap:10,
        }}>
          {step===2 && (
            <button onClick={()=>setStep(1)} style={{
              padding:'14px 18px', borderRadius:14, border:'1px solid var(--line)',
              background:'var(--bg-elev)', color:'var(--ink-2)', cursor:'pointer',
              fontSize:14, fontWeight:500,
            }}>Atrás</button>
          )}
          <button
            disabled={step===1?!routine:!canConfirm}
            onClick={()=>{
              if (step===1) setStep(2);
              else { onAssign({routine, day, time}); onClose(); }
            }}
            style={{
              flex:1, padding:'14px', borderRadius:14, border:'none',
              background: (step===1?routine:canConfirm)?'var(--ink)':'var(--bg-sunk)',
              color: (step===1?routine:canConfirm)?'var(--bg)':'var(--ink-4)',
              cursor: (step===1?routine:canConfirm)?'pointer':'default',
              fontFamily:'var(--font-display)', fontWeight:600, fontSize:15,
            }}>
            {step===1?'Continuar':`Asignar al ${day?.label||'día'}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CALENDAR ───────────────────────────────────────────────
function ClientCalendar({ assignments, onOpenSheet }) {
  const days = ['L','M','X','J','V','S','D'];
  // 5 weeks
  const month = Array.from({length:35}, (_,i)=>{
    const d = i-2; // start offset
    return {
      n: d>=1 && d<=31 ? d : null,
      done: [3,5,7,10,12,14,17,19,21].includes(d),
      planned: [22,24,26,28].includes(d),
      today: d===18,
    };
  });
  return (
    <div style={clientStyles.screen}>
      <div style={clientStyles.navbar}>
        <div>
          <div style={{...clientStyles.label}}>Mayo 2026</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:28, fontWeight:600, letterSpacing:-0.5, marginTop:2}}>Agenda</div>
        </div>
        <button onClick={onOpenSheet} style={{
          ...clientStyles.navIcon, border:'none', cursor:'pointer',
          background:'var(--ink)', color:'var(--bg)',
        }}>{ICON.plus()}</button>
      </div>

      <div style={{padding:'8px 20px'}}>
        <div style={{...clientStyles.card, padding:18}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6, marginBottom:10}}>
            {days.map(d=><div key={d} style={{textAlign:'center', fontSize:10, fontFamily:'var(--font-mono)', color:'var(--ink-3)', letterSpacing:1}}>{d}</div>)}
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6}}>
            {month.map((d,i)=>(
              <div key={i} style={{
                aspectRatio:'1', borderRadius:10, position:'relative',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontFamily:'var(--font-display)', fontWeight: d.today?700:500,
                background: d.today?'var(--ink)':d.done?'color-mix(in oklab, var(--accent) 45%, transparent)':d.planned?'var(--bg-sunk)':'transparent',
                color: d.today?'var(--bg)':d.n?'var(--ink)':'var(--ink-4)',
                outline: d.planned ? '1px dashed var(--line)' : 'none',
                outlineOffset: -1,
              }}>{d.n}</div>
            ))}
          </div>
          <div style={{display:'flex', gap:14, marginTop:14, fontSize:10, color:'var(--ink-3)', fontFamily:'var(--font-mono)', letterSpacing:0.5}}>
            <div style={{display:'flex', alignItems:'center', gap:5}}><div style={{width:8,height:8,borderRadius:8,background:'var(--accent)'}}/>HECHO</div>
            <div style={{display:'flex', alignItems:'center', gap:5}}><div style={{width:8,height:8,borderRadius:8,background:'var(--bg-sunk)', border:'1px dashed var(--line)'}}/>PLANEADO</div>
          </div>
        </div>

        {/* upcoming */}
        <div style={{marginTop:18}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, paddingLeft:4, paddingRight:4}}>
            <div style={clientStyles.label}>Próximos</div>
            <button onClick={onOpenSheet} style={{
              background:'none', border:'none', cursor:'pointer',
              color:'var(--ink-2)', fontSize:11, fontFamily:'var(--font-mono)',
              display:'flex', alignItems:'center', gap:4, padding:0,
            }}>{ICON.plus(12)} Asignar rutina</button>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {assignments.map((it,i)=>(
              <div key={i} style={{...clientStyles.card, padding:14, display:'flex', alignItems:'center', gap:14}}>
                <div style={{width:44, textAlign:'center'}}>
                  <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, lineHeight:1}}>{it.d}</div>
                  <div style={{fontSize:10, color:'var(--ink-3)', fontFamily:'var(--font-mono)', textTransform:'uppercase', marginTop:2}}>{it.m}</div>
                </div>
                <div style={{width:1, height:28, background:'var(--line)'}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14, fontWeight:500}}>{it.name}</div>
                  <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)', marginTop:2}}>{it.t}</div>
                </div>
                <div style={{color:'var(--ink-4)'}}>{ICON.arrow()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE / Pagos ────────────────────────────────────────
function ClientProfile() {
  return (
    <div style={clientStyles.screen}>
      <div style={clientStyles.navbar}>
        <div style={{fontFamily:'var(--font-display)', fontSize:28, fontWeight:600, letterSpacing:-0.5}}>Perfil</div>
        <div style={clientStyles.navIcon}>{ICON.settings()}</div>
      </div>

      {/* user header */}
      <div style={{padding:'4px 20px 16px', display:'flex', alignItems:'center', gap:14}}>
        <Avatar name="Cliente 1" size={64}/>
        <div>
          <div style={{fontFamily:'var(--font-display)', fontSize:20, fontWeight:600}}>Cliente 1</div>
          <div style={{fontSize:12, color:'var(--ink-3)', marginTop:2}}>Miembro desde Feb 2026 · Gym 1</div>
        </div>
      </div>

      {/* membership card */}
      <div style={{padding:'0 20px'}}>
        <div style={{
          background:'var(--ink)', color:'var(--bg)', borderRadius:20, padding:22,
          position:'relative', overflow:'hidden',
        }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18}}>
            <div>
              <div style={{fontSize:10, fontFamily:'var(--font-mono)', letterSpacing:1.5, color:'rgba(255,255,255,0.5)'}}>MEMBRESÍA</div>
              <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, marginTop:4}}>Plan Mensual</div>
            </div>
            <div style={{
              padding:'4px 10px', borderRadius:99, fontSize:10, fontFamily:'var(--font-mono)',
              background:'var(--accent)', color:'var(--accent-ink)', letterSpacing:0.5,
            }}>ACTIVA</div>
          </div>
          <div style={{display:'flex', gap:24, fontSize:11, fontFamily:'var(--font-mono)', color:'rgba(255,255,255,0.6)', letterSpacing:0.5}}>
            <div>
              <div>PRÓXIMO COBRO</div>
              <div style={{color:'#fff', fontSize:14, marginTop:4}}>1 Jun 2026</div>
            </div>
            <div>
              <div>MONTO</div>
              <div style={{color:'#fff', fontSize:14, marginTop:4}}>₡25.000</div>
            </div>
          </div>
        </div>
      </div>

      {/* payment history */}
      <div style={{padding:'24px 20px 0'}}>
        <div style={{...clientStyles.label, marginBottom:10, paddingLeft:4}}>Historial de pagos</div>
        <div style={{...clientStyles.card, padding:0, overflow:'hidden'}}>
          {[
            {d:'1 May 2026', amt:'25.000', method:'Tarjeta •• 4821', status:'Pagado'},
            {d:'1 Abr 2026', amt:'25.000', method:'Tarjeta •• 4821', status:'Pagado'},
            {d:'1 Mar 2026', amt:'25.000', method:'Transferencia', status:'Pagado'},
            {d:'1 Feb 2026', amt:'25.000', method:'Efectivo', status:'Pagado'},
          ].map((p,i,arr)=>(
            <div key={i} style={{
              padding:'14px 18px', display:'flex', alignItems:'center', gap:14,
              borderBottom: i<arr.length-1?'1px solid var(--line-2)':'none',
            }}>
              <div style={{width:32, height:32, borderRadius:32, background:'color-mix(in oklab, var(--accent) 30%, transparent)', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center'}}>{ICON.check(14)}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13, fontWeight:500}}>₡{p.amt}</div>
                <div style={{fontSize:11, color:'var(--ink-3)', marginTop:2, fontFamily:'var(--font-mono)'}}>{p.d} · {p.method}</div>
              </div>
              <button style={{background:'none', border:'none', color:'var(--ink-3)', cursor:'pointer'}}>{ICON.download()}</button>
            </div>
          ))}
        </div>
      </div>

      {/* settings rows */}
      <div style={{padding:'24px 20px 0'}}>
        <div style={{...clientStyles.card, padding:0, overflow:'hidden'}}>
          {['Datos personales','Métodos de pago','Notificaciones','Cerrar sesión'].map((t,i,arr)=>(
            <button key={t} style={{
              width:'100%', textAlign:'left', padding:'14px 18px',
              background:'none', border:'none', cursor:'pointer',
              borderBottom: i<arr.length-1?'1px solid var(--line-2)':'none',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              color: i===arr.length-1?'var(--danger)':'var(--ink)',
              fontSize:14, fontFamily:'var(--font-ui)',
            }}>
              <span>{t}</span>
              <span style={{color:'var(--ink-4)'}}>{ICON.arrow(14)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LOG WEIGHT SHEET ───────────────────────────────────────
function LogWeightSheet({ open, onClose, onSave, initial }) {
  const [val, setVal] = React.useState(initial || 73.9);
  const [note, setNote] = React.useState('');
  const [moment, setMoment] = React.useState('morning');

  React.useEffect(()=>{ if (open) { setVal(initial || 73.9); setNote(''); setMoment('morning'); } }, [open, initial]);
  if (!open) return null;

  const adjust = (delta)=> setVal(v => Math.round((v + delta) * 10) / 10);

  return (
    <div style={{
      position:'absolute', inset:0, zIndex:100,
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
      background:'rgba(0,0,0,0.45)', animation:'sheetFade .18s ease-out',
    }} onClick={onClose}>
      <style>{`
        @keyframes sheetFade { from { background: rgba(0,0,0,0); } to { background: rgba(0,0,0,0.45); } }
        @keyframes sheetSlide { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'var(--bg)', borderTopLeftRadius:24, borderTopRightRadius:24,
        display:'flex', flexDirection:'column',
        animation:'sheetSlide .26s cubic-bezier(.2,.8,.2,1)',
        boxShadow:'0 -10px 40px rgba(0,0,0,0.25)',
      }}>
        <div style={{display:'flex', justifyContent:'center', padding:'10px 0 4px'}}>
          <div style={{width:38, height:5, borderRadius:5, background:'var(--line)'}}/>
        </div>

        <div style={{padding:'8px 20px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div>
            <div style={clientStyles.label}>Hoy · Lun 18 May</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, letterSpacing:-0.4, marginTop:2}}>Registrar peso</div>
          </div>
          <button onClick={onClose} style={{
            width:34, height:34, borderRadius:34, border:'none', cursor:'pointer',
            background:'var(--bg-sunk)', color:'var(--ink-2)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{ICON.close(14)}</button>
        </div>

        {/* big stepper */}
        <div style={{padding:'4px 20px 20px'}}>
          <div style={{
            background:'var(--bg-sunk)', borderRadius:20, padding:'24px 20px',
            display:'flex', alignItems:'center', justifyContent:'space-between', gap:14,
          }}>
            <button onClick={()=>adjust(-0.1)} style={{
              width:48, height:48, borderRadius:48, border:'none', cursor:'pointer',
              background:'var(--bg)', color:'var(--ink)', fontSize:24, fontWeight:500,
              boxShadow:'var(--shadow-sm)',
            }}>−</button>
            <div style={{textAlign:'center', flex:1}}>
              <div style={{display:'flex', alignItems:'baseline', justifyContent:'center', gap:8}}>
                <div style={{fontFamily:'var(--font-display)', fontSize:54, fontWeight:600, letterSpacing:-2, lineHeight:1}}>{val.toFixed(1)}</div>
                <div style={{color:'var(--ink-3)', fontSize:16}}>kg</div>
              </div>
              <div style={{fontSize:11, fontFamily:'var(--font-mono)', color:'var(--ink-3)', marginTop:8, letterSpacing:0.5}}>
                {(val - 76.2 >= 0 ? '+' : '−')}{Math.abs(val - 76.2).toFixed(1)} kg DESDE INICIO
              </div>
            </div>
            <button onClick={()=>adjust(0.1)} style={{
              width:48, height:48, borderRadius:48, border:'none', cursor:'pointer',
              background:'var(--bg)', color:'var(--ink)', fontSize:24, fontWeight:500,
              boxShadow:'var(--shadow-sm)',
            }}>+</button>
          </div>

          {/* quick steps */}
          <div style={{display:'flex', gap:6, marginTop:10, justifyContent:'center'}}>
            {[-1, -0.5, 0.5, 1].map(d=>(
              <button key={d} onClick={()=>adjust(d)} style={{
                padding:'6px 12px', borderRadius:99, border:'none', cursor:'pointer',
                background:'var(--bg-sunk)', color:'var(--ink-2)',
                fontSize:11, fontFamily:'var(--font-mono)',
              }}>{d>0?'+':''}{d}</button>
            ))}
          </div>
        </div>

        {/* moment */}
        <div style={{padding:'0 20px 16px'}}>
          <div style={{...clientStyles.label, marginBottom:8}}>Momento del día</div>
          <div style={{display:'flex', gap:6}}>
            {[
              {id:'morning', label:'Mañana'},
              {id:'noon', label:'Mediodía'},
              {id:'night', label:'Noche'},
            ].map(m=>{
              const sel = moment===m.id;
              return (
                <button key={m.id} onClick={()=>setMoment(m.id)} style={{
                  flex:1, padding:'10px', borderRadius:10, border:'none', cursor:'pointer',
                  background: sel?'var(--ink)':'var(--bg-sunk)',
                  color: sel?'var(--bg)':'var(--ink-2)',
                  fontSize:12, fontWeight:500,
                }}>{m.label}</button>
              );
            })}
          </div>
        </div>

        {/* note */}
        <div style={{padding:'0 20px 16px'}}>
          <div style={{...clientStyles.label, marginBottom:8}}>Nota (opcional)</div>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Ej. en ayunas"
            style={{
              width:'100%', padding:'12px 14px', borderRadius:12, border:'1px solid var(--line)',
              background:'var(--bg-elev)', color:'var(--ink)', fontSize:13, fontFamily:'var(--font-ui)',
              boxSizing:'border-box',
            }}/>
        </div>

        <div style={{padding:'12px 20px 26px', borderTop:'1px solid var(--line-2)', display:'flex', gap:10}}>
          <button onClick={()=>{ onSave({val, note, moment}); onClose(); }} style={{
            flex:1, padding:'14px', borderRadius:14, border:'none', cursor:'pointer',
            background:'var(--ink)', color:'var(--bg)',
            fontFamily:'var(--font-display)', fontWeight:600, fontSize:15,
          }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── LOG MEASURE SHEET ──────────────────────────────────────
function LogMeasureSheet({ open, onClose, onSave, current }) {
  const groups = [
    { id:'Pecho',   prev: current?.find(m=>m.label==='Pecho')?.v   || '104', u:'cm' },
    { id:'Cintura', prev: current?.find(m=>m.label==='Cintura')?.v || '82',  u:'cm' },
    { id:'Brazo',   prev: current?.find(m=>m.label==='Brazo')?.v   || '38',  u:'cm' },
    { id:'Pierna',  prev: current?.find(m=>m.label==='Pierna')?.v  || '58',  u:'cm' },
    { id:'Cadera',  prev: '92', u:'cm' },
    { id:'Cuello',  prev: '38', u:'cm' },
  ];
  const [vals, setVals] = React.useState({});
  const [active, setActive] = React.useState(['Pecho','Cintura','Brazo','Pierna']);

  React.useEffect(()=>{
    if (open) {
      const init = {};
      groups.forEach(g=>{ init[g.id] = g.prev; });
      setVals(init);
      setActive(['Pecho','Cintura','Brazo','Pierna']);
    }
  }, [open]);

  if (!open) return null;

  const toggleGroup = (id)=>{
    setActive(a => a.includes(id) ? a.filter(x=>x!==id) : [...a, id]);
  };

  return (
    <div style={{
      position:'absolute', inset:0, zIndex:100,
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
      background:'rgba(0,0,0,0.45)', animation:'sheetFade .18s ease-out',
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'var(--bg)', borderTopLeftRadius:24, borderTopRightRadius:24,
        maxHeight:'92%', display:'flex', flexDirection:'column',
        animation:'sheetSlide .26s cubic-bezier(.2,.8,.2,1)',
        boxShadow:'0 -10px 40px rgba(0,0,0,0.25)',
      }}>
        <div style={{display:'flex', justifyContent:'center', padding:'10px 0 4px'}}>
          <div style={{width:38, height:5, borderRadius:5, background:'var(--line)'}}/>
        </div>

        <div style={{padding:'8px 20px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div>
            <div style={clientStyles.label}>Hoy · Lun 18 May</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, letterSpacing:-0.4, marginTop:2}}>Nueva medida</div>
          </div>
          <button onClick={onClose} style={{
            width:34, height:34, borderRadius:34, border:'none', cursor:'pointer',
            background:'var(--bg-sunk)', color:'var(--ink-2)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{ICON.close(14)}</button>
        </div>

        {/* group toggles */}
        <div style={{padding:'0 20px 14px'}}>
          <div style={{...clientStyles.label, marginBottom:8}}>Zonas a registrar</div>
          <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
            {groups.map(g=>{
              const sel = active.includes(g.id);
              return (
                <button key={g.id} onClick={()=>toggleGroup(g.id)} style={{
                  padding:'6px 12px', borderRadius:99, border:'none', cursor:'pointer',
                  background: sel?'var(--ink)':'var(--bg-sunk)',
                  color: sel?'var(--bg)':'var(--ink-3)',
                  fontSize:12, fontWeight:500,
                  display:'flex', alignItems:'center', gap:5,
                }}>
                  {sel && ICON.check(11)}
                  {g.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* fields */}
        <div style={{flex:1, overflowY:'auto', padding:'0 20px 16px', display:'flex', flexDirection:'column', gap:8}}>
          {groups.filter(g=>active.includes(g.id)).map(g=>{
            const cur = parseFloat(vals[g.id]) || 0;
            const prev = parseFloat(g.prev) || 0;
            const delta = (cur - prev).toFixed(1);
            const showDelta = !isNaN(cur) && cur > 0 && cur !== prev;
            return (
              <div key={g.id} style={{
                background:'var(--bg-sunk)', borderRadius:14, padding:'12px 14px',
                display:'flex', alignItems:'center', gap:12,
              }}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13, fontWeight:500}}>{g.id}</div>
                  <div style={{fontSize:10, color:'var(--ink-3)', fontFamily:'var(--font-mono)', marginTop:2, letterSpacing:0.3}}>
                    ANTERIOR {g.prev} {g.u}
                    {showDelta && <span style={{marginLeft:8, color:'var(--ink-2)'}}>{delta>=0?'+':''}{delta}</span>}
                  </div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:6, background:'var(--bg)', borderRadius:10, padding:'6px 10px'}}>
                  <input
                    type="number" step="0.1"
                    value={vals[g.id] ?? ''}
                    onChange={e=>setVals(v=>({...v, [g.id]: e.target.value}))}
                    style={{
                      border:'none', background:'transparent', width:64,
                      fontFamily:'var(--font-mono)', fontSize:16, fontWeight:600,
                      color:'var(--ink)', textAlign:'right', outline:'none',
                    }}/>
                  <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)'}}>{g.u}</div>
                </div>
              </div>
            );
          })}
          {active.length===0 && (
            <div style={{padding:'24px 12px', textAlign:'center', color:'var(--ink-3)', fontSize:12}}>
              Seleccioná al menos una zona arriba.
            </div>
          )}
        </div>

        <div style={{padding:'12px 20px 26px', borderTop:'1px solid var(--line-2)', display:'flex', gap:10}}>
          <button
            disabled={active.length===0}
            onClick={()=>{
              const out = active.map(id=>{
                const g = groups.find(x=>x.id===id);
                const cur = parseFloat(vals[id]) || parseFloat(g.prev);
                return { label:id, v: cur.toString(), u: g.u, prev: parseFloat(g.prev) };
              });
              onSave(out);
              onClose();
            }}
            style={{
              flex:1, padding:'14px', borderRadius:14, border:'none',
              background: active.length>0?'var(--ink)':'var(--bg-sunk)',
              color: active.length>0?'var(--bg)':'var(--ink-4)',
              cursor: active.length>0?'pointer':'default',
              fontFamily:'var(--font-display)', fontWeight:600, fontSize:15,
            }}>Guardar {active.length>0?`(${active.length})`:''}</button>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT CLIENT APP ────────────────────────────────────────
function ClientApp({ dark }) {
  const [screen, setScreen] = React.useState('home');
  const [activeRoutine, setActiveRoutine] = React.useState(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [weightSheetOpen, setWeightSheetOpen] = React.useState(false);
  const [measureSheetOpen, setMeasureSheetOpen] = React.useState(false);
  const [weightLatest, setWeightLatest] = React.useState(73.9);
  const [measurements, setMeasurements] = React.useState([
    {label:'Pecho', v:'104', u:'cm', d:'+1.5'},
    {label:'Cintura', v:'82', u:'cm', d:'−2.0'},
    {label:'Brazo', v:'38', u:'cm', d:'+0.8'},
    {label:'Pierna', v:'58', u:'cm', d:'+1.2'},
  ]);
  const [assignments, setAssignments] = React.useState([
    {d:'19',m:'Mar',name:'Pull · Espalda', t:'07:00'},
    {d:'21',m:'Jue',name:'Push · Hombros', t:'18:30'},
    {d:'22',m:'Vie',name:'Legs · Tren inf.', t:'07:00'},
  ]);

  const handleAssign = ({routine, day, time}) => {
    const dn = day.date.split(' ')[0];
    const mn = day.label;
    setAssignments(prev => {
      const filtered = prev.filter(p => !(p.d===dn));
      return [...filtered, {d:dn, m:mn, name:routine.name, t:time}].sort((a,b)=>+a.d-+b.d);
    });
  };

  const handleSaveWeight = ({val}) => setWeightLatest(val);

  const handleSaveMeasure = (entries) => {
    setMeasurements(prev => {
      const map = new Map(prev.map(m=>[m.label, m]));
      entries.forEach(e=>{
        const delta = (parseFloat(e.v) - e.prev);
        const sign = delta>=0?'+':'−';
        map.set(e.label, {label:e.label, v:e.v, u:e.u, d:`${sign}${Math.abs(delta).toFixed(1)}`});
      });
      return Array.from(map.values());
    });
  };

  const screens = {
    home: <ClientHome go={setScreen}/>,
    routines: <ClientRoutines go={setScreen} onOpenRoutine={(r)=>{ setActiveRoutine(r); setScreen('routineDetail'); }}/>,
    routineDetail: activeRoutine && <ClientRoutineDetail
      routine={activeRoutine}
      onBack={()=>setScreen('routines')}
      onStart={()=>setScreen('workout')}/>,
    workout: <ClientWorkout go={setScreen} dark={dark}/>,
    progress: <ClientProgress
      onLogWeight={()=>setWeightSheetOpen(true)}
      onLogMeasure={()=>setMeasureSheetOpen(true)}
      weightLatest={weightLatest}
      measurements={measurements}/>,
    calendar: <ClientCalendar assignments={assignments} onOpenSheet={()=>setSheetOpen(true)}/>,
    profile: <ClientProfile/>,
  };
  // map workout/profile to nav slot
  const navActive = screen==='workout'?'routines':screen==='routineDetail'?'routines':screen==='profile'?'profile':screen;
  return (
    <div data-screen-label={`Cliente · ${screen}`} style={{height:'100%', position:'relative', background:'var(--bg)'}}>
      <div style={{height:'100%', overflowY:'auto'}}>
        {screens[screen]}
      </div>
      {screen!=='workout' && <ClientNav active={navActive} onNav={setScreen}/>}
      <AssignRoutineSheet open={sheetOpen} onClose={()=>setSheetOpen(false)} onAssign={handleAssign}/>
      <LogWeightSheet open={weightSheetOpen} onClose={()=>setWeightSheetOpen(false)} onSave={handleSaveWeight} initial={weightLatest}/>
      <LogMeasureSheet open={measureSheetOpen} onClose={()=>setMeasureSheetOpen(false)} onSave={handleSaveMeasure} current={measurements}/>
    </div>
  );
}

Object.assign(window, { ClientApp });
