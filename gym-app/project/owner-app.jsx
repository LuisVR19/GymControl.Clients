// Owner web — 4 pantallas en browser window
// Pantallas: dashboard, clients, routines, payments

const ownerStyles = {
  shell: { display:'grid', gridTemplateColumns:'220px 1fr', height:'100%', background:'var(--bg)' },
  sidebar: {
    background:'var(--bg-elev)', borderRight:'1px solid var(--line)',
    padding:'24px 14px', display:'flex', flexDirection:'column', gap:2,
  },
  brand: {
    display:'flex', alignItems:'center', gap:10, padding:'4px 10px 24px',
  },
  brandMark: {
    width:32, height:32, borderRadius:8, background:'var(--ink)', color:'var(--bg)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, letterSpacing:-0.5,
  },
  sideItem: (active) => ({
    display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
    borderRadius:8, fontSize:13, fontWeight: active?500:400,
    background: active?'var(--bg-sunk)':'transparent',
    color: active?'var(--ink)':'var(--ink-3)',
    border:'none', cursor:'pointer', textAlign:'left', width:'100%',
    fontFamily:'var(--font-ui)',
  }),
  topbar: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'18px 32px', borderBottom:'1px solid var(--line)',
    background:'var(--bg-elev)',
  },
  pageTitle: { fontFamily:'var(--font-display)', fontSize:24, fontWeight:600, letterSpacing:-0.5 },
  content: { padding:'28px 32px', overflow:'auto' },
  card: { background:'var(--bg-elev)', borderRadius:14, padding:22, border:'1px solid var(--line)' },
  label: { fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'var(--ink-3)' },
  pill: (variant)=>({
    display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', borderRadius:99,
    fontSize:10, fontFamily:'var(--font-mono)', letterSpacing:0.5, textTransform:'uppercase',
    background: variant==='ok' ? 'color-mix(in oklab, var(--accent) 30%, transparent)' :
                variant==='warn' ? 'color-mix(in oklab, var(--warn) 30%, transparent)' :
                variant==='danger' ? 'color-mix(in oklab, var(--danger) 25%, transparent)' :
                'var(--bg-sunk)',
    color: variant==='danger'?'var(--danger)':'var(--ink-2)',
  }),
  btn: (kind='primary')=>({
    display:'inline-flex', alignItems:'center', gap:6, padding:'8px 14px',
    borderRadius:8, border:'none', cursor:'pointer', fontWeight:500, fontSize:13,
    fontFamily:'var(--font-ui)',
    ...(kind==='primary'?{background:'var(--ink)', color:'var(--bg)'}:
       kind==='accent'?{background:'var(--accent)', color:'var(--accent-ink)'}:
       {background:'var(--bg-sunk)', color:'var(--ink-2)'}),
  }),
};

function OwnerSidebar({ active, onNav }) {
  const items = [
    {id:'dashboard', icon: ICON.home, label:'Dashboard'},
    {id:'clients', icon: ICON.users, label:'Clientes'},
    {id:'routines', icon: ICON.dumbbell, label:'Rutinas'},
    {id:'memberships', icon: ICON.card, label:'Membresías'},
    {id:'payments', icon: ICON.money, label:'Pagos'},
  ];
  return (
    <div style={ownerStyles.sidebar}>
      <div style={ownerStyles.brand}>
        <div style={ownerStyles.brandMark}>F</div>
        <div>
          <div style={{fontFamily:'var(--font-display)', fontWeight:600, fontSize:14}}>Forja</div>
          <div style={{fontSize:10, color:'var(--ink-3)', fontFamily:'var(--font-mono)', letterSpacing:0.5}}>GYM 1</div>
        </div>
      </div>
      {items.map(it=>(
        <button key={it.id} onClick={()=>onNav(it.id)} style={ownerStyles.sideItem(active===it.id)}>
          {it.icon(16)} {it.label}
        </button>
      ))}
      <div style={{flex:1}}/>
      <div style={{
        padding:14, borderRadius:12, border:'1px solid var(--line)', marginTop:20,
      }}>
        <div style={{...ownerStyles.label, marginBottom:6}}>Asistencia hoy</div>
        <div style={{display:'flex', alignItems:'baseline', gap:6}}>
          <div style={{fontFamily:'var(--font-display)', fontSize:24, fontWeight:600}}>47</div>
          <div style={{fontSize:11, color:'var(--ink-3)'}}>/ 124</div>
        </div>
        <div style={{height:4, background:'var(--bg-sunk)', borderRadius:2, marginTop:8, overflow:'hidden'}}>
          <div style={{height:'100%', width:'38%', background:'var(--accent)'}}/>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ──────────────────────────────────────────────
function OwnerDashboard() {
  const incomeData = [620,680,720,690,810,890,950,920,1020,1080,1100,1180];
  return (
    <div style={ownerStyles.content}>
      {/* KPIs */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:18}}>
        {[
          {label:'Ingresos del mes', v:'₡3.180.000', delta:'+12.4%', spark:incomeData, ok:true},
          {label:'Clientes activos', v:'124', delta:'+8', spark:[110,112,115,118,120,122,124], ok:true},
          {label:'Asistencia (mes)', v:'78%', delta:'−3%', spark:[82,80,79,76,78,77,78], ok:false},
          {label:'Pagos pendientes', v:'7', delta:'₡175.000', spark:null, danger:true},
        ].map((k,i)=>(
          <div key={i} style={ownerStyles.card}>
            <div style={ownerStyles.label}>{k.label}</div>
            <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:8}}>
              <div style={{fontFamily:'var(--font-display)', fontSize:30, fontWeight:600, letterSpacing:-0.8}}>{k.v}</div>
              {k.spark && <Sparkline data={k.spark} width={80} height={28} color={k.ok?'var(--accent)':'var(--ink-3)'} fill/>}
            </div>
            <div style={{...ownerStyles.pill(k.danger?'danger':k.ok?'ok':'warn'), marginTop:10}}>
              {k.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Income chart + recent activity */}
      <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14, marginBottom:18}}>
        <div style={ownerStyles.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18}}>
            <div>
              <div style={ownerStyles.label}>Ingresos por mes</div>
              <div style={{fontFamily:'var(--font-display)', fontSize:24, fontWeight:600, marginTop:4}}>2026 · ₡10.95M acumulado</div>
            </div>
            <div style={{display:'flex', gap:6}}>
              {['Mes','Trimestre','Año'].map((t,i)=>(
                <button key={t} style={{
                  padding:'5px 10px', borderRadius:6, border:'1px solid var(--line)',
                  background: i===2?'var(--bg-sunk)':'var(--bg-elev)', cursor:'pointer',
                  fontSize:11, color:'var(--ink-2)',
                }}>{t}</button>
              ))}
            </div>
          </div>
          <BarChart
            data={incomeData}
            labels={['E','F','M','A','M','J','J','A','S','O','N','D']}
            width={580} height={180} color="var(--ink)"
          />
        </div>

        <div style={ownerStyles.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
            <div style={ownerStyles.label}>Actividad reciente</div>
            <button style={{background:'none', border:'none', color:'var(--ink-3)', fontSize:12, cursor:'pointer'}}>Ver todo</button>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            {[
              {who:'Cliente 7', act:'pagó membresía', t:'hace 12 min', dot:'var(--accent)'},
              {who:'Cliente 12', act:'completó entreno', t:'hace 28 min', dot:'var(--ink-3)'},
              {who:'Cliente 3', act:'check-in', t:'hace 41 min', dot:'var(--ink-3)'},
              {who:'Cliente 22', act:'pago vencido', t:'hace 1 h', dot:'var(--danger)'},
              {who:'Cliente 9', act:'rutina asignada', t:'hace 2 h', dot:'var(--ink-3)'},
              {who:'Cliente 18', act:'completó entreno', t:'hace 3 h', dot:'var(--ink-3)'},
            ].map((a,i)=>(
              <div key={i} style={{display:'flex', alignItems:'center', gap:12, fontSize:13}}>
                <div style={{width:8, height:8, borderRadius:8, background:a.dot, flexShrink:0}}/>
                <div style={{flex:1}}>
                  <span style={{fontWeight:500}}>{a.who}</span>{' '}
                  <span style={{color:'var(--ink-3)'}}>{a.act}</span>
                </div>
                <div style={{fontSize:11, color:'var(--ink-4)', fontFamily:'var(--font-mono)'}}>{a.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: pending payments + send notification */}
      <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14}}>
        <div style={ownerStyles.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
            <div>
              <div style={ownerStyles.label}>Pagos pendientes</div>
              <div style={{fontFamily:'var(--font-display)', fontSize:18, fontWeight:600, marginTop:2}}>7 clientes · ₡175.000</div>
            </div>
            <button style={ownerStyles.btn('primary')}>Recordar a todos</button>
          </div>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
            <thead>
              <tr style={{textAlign:'left', color:'var(--ink-3)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:1}}>
                <th style={{padding:'8px 0', fontWeight:500, borderBottom:'1px solid var(--line)'}}>CLIENTE</th>
                <th style={{padding:'8px 0', fontWeight:500, borderBottom:'1px solid var(--line)'}}>VENCIMIENTO</th>
                <th style={{padding:'8px 0', fontWeight:500, borderBottom:'1px solid var(--line)'}}>MONTO</th>
                <th style={{padding:'8px 0', fontWeight:500, borderBottom:'1px solid var(--line)'}}>DÍAS</th>
                <th style={{padding:'8px 0', fontWeight:500, borderBottom:'1px solid var(--line)'}}></th>
              </tr>
            </thead>
            <tbody>
              {[
                {n:'Cliente 22', d:'1 May', amt:'25.000', late:17},
                {n:'Cliente 14', d:'8 May', amt:'25.000', late:10},
                {n:'Cliente 31', d:'12 May', amt:'25.000', late:6},
                {n:'Cliente 5', d:'15 May', amt:'25.000', late:3},
              ].map((p,i)=>(
                <tr key={i} style={{borderBottom:'1px solid var(--line-2)'}}>
                  <td style={{padding:'12px 0', display:'flex', alignItems:'center', gap:10}}>
                    <Avatar name={p.n} size={28}/>
                    <span>{p.n}</span>
                  </td>
                  <td style={{color:'var(--ink-3)', fontFamily:'var(--font-mono)', fontSize:12}}>{p.d}</td>
                  <td style={{fontFamily:'var(--font-mono)'}}>₡{p.amt}</td>
                  <td><span style={ownerStyles.pill(p.late>14?'danger':'warn')}>{p.late}d</span></td>
                  <td style={{textAlign:'right'}}>
                    <button style={{...ownerStyles.btn('secondary'), padding:'5px 10px', fontSize:12}}>Recordar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={ownerStyles.card}>
          <div style={ownerStyles.label}>Notificación masiva</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:16, fontWeight:600, marginTop:4, marginBottom:14}}>Avisar a tus clientes</div>
          <div style={{display:'flex', flexDirection:'column', gap:8, marginBottom:14}}>
            {['Todos los clientes (124)','Solo morosos (7)','Plan Mensual (89)'].map((s,i)=>(
              <label key={i} style={{display:'flex', alignItems:'center', gap:10, fontSize:13, cursor:'pointer'}}>
                <input type="radio" name="aud" defaultChecked={i===0} style={{accentColor:'var(--ink)'}}/>
                {s}
              </label>
            ))}
          </div>
          <textarea placeholder="Tu mensaje..." rows={3} style={{
            width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid var(--line)',
            background:'var(--bg-sunk)', fontFamily:'var(--font-ui)', fontSize:13,
            resize:'none', color:'var(--ink)',
          }}/>
          <button style={{...ownerStyles.btn('primary'), width:'100%', justifyContent:'center', marginTop:10}}>
            {ICON.send()} Enviar notificación
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CLIENTS ─────────────────────────────────────────────────
function OwnerClients() {
  const clients = Array.from({length:10}, (_,i)=>({
    n: `Cliente ${i+1}`,
    plan: ['Mensual','Trimestral','Anual','Mensual','Mensual','Trimestral','Mensual','Anual','Mensual','Mensual'][i],
    status: i===4?'overdue':i===7?'inactive':'active',
    routine: ['Push/Pull/Legs','Full Body 3x','Upper/Lower','Push/Pull/Legs','Sin asignar','Full Body 3x','Push/Pull/Legs','Bro split','Push/Pull/Legs','Upper/Lower'][i],
    last: ['hoy','hoy','ayer','hoy','hace 5 d','ayer','hoy','hace 12 d','hoy','ayer'][i],
    progress: [85, 72, 60, 91, 12, 68, 79, 5, 88, 65][i],
  }));
  return (
    <div style={ownerStyles.content}>
      {/* filters */}
      <div style={{display:'flex', gap:10, marginBottom:18, alignItems:'center'}}>
        <div style={{
          flex:1, maxWidth:340, display:'flex', alignItems:'center', gap:8,
          padding:'8px 14px', border:'1px solid var(--line)', borderRadius:8, background:'var(--bg-elev)',
        }}>
          <span style={{color:'var(--ink-3)'}}>{ICON.search(16)}</span>
          <input placeholder="Buscar cliente..." style={{flex:1, border:'none', outline:'none', background:'none', fontSize:13, color:'var(--ink)', fontFamily:'var(--font-ui)'}}/>
        </div>
        <button style={ownerStyles.btn('secondary')}>{ICON.filter()} Filtrar</button>
        <div style={{flex:1}}/>
        <button style={ownerStyles.btn('primary')}>{ICON.plus(14)} Nuevo cliente</button>
      </div>

      {/* table */}
      <div style={{...ownerStyles.card, padding:0, overflow:'hidden'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
          <thead>
            <tr style={{textAlign:'left', color:'var(--ink-3)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:1, background:'var(--bg-sunk)'}}>
              <th style={{padding:'12px 22px', fontWeight:500}}>CLIENTE</th>
              <th style={{padding:'12px 12px', fontWeight:500}}>PLAN</th>
              <th style={{padding:'12px 12px', fontWeight:500}}>RUTINA</th>
              <th style={{padding:'12px 12px', fontWeight:500}}>PROGRESO</th>
              <th style={{padding:'12px 12px', fontWeight:500}}>ÚLT. ASIST.</th>
              <th style={{padding:'12px 12px', fontWeight:500}}>ESTADO</th>
              <th style={{padding:'12px 22px', fontWeight:500, width:50}}></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c,i)=>(
              <tr key={i} style={{borderTop:'1px solid var(--line-2)'}}>
                <td style={{padding:'14px 22px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <Avatar name={c.n} size={32}/>
                    <div>
                      <div style={{fontWeight:500}}>{c.n}</div>
                      <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)', marginTop:1}}>cliente{(i+1).toString().padStart(2,'0')}@email</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:'14px 12px', color:'var(--ink-2)'}}>{c.plan}</td>
                <td style={{padding:'14px 12px', color:'var(--ink-2)'}}>
                  {c.routine==='Sin asignar'
                    ? <span style={{color:'var(--ink-4)', fontStyle:'italic'}}>{c.routine}</span>
                    : c.routine}
                </td>
                <td style={{padding:'14px 12px', minWidth:120}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <div style={{flex:1, height:5, background:'var(--bg-sunk)', borderRadius:3, overflow:'hidden'}}>
                      <div style={{height:'100%', width:`${c.progress}%`, background:c.progress<30?'var(--ink-4)':'var(--accent)'}}/>
                    </div>
                    <div style={{fontSize:11, fontFamily:'var(--font-mono)', color:'var(--ink-3)', width:28}}>{c.progress}%</div>
                  </div>
                </td>
                <td style={{padding:'14px 12px', color:'var(--ink-3)', fontSize:12, fontFamily:'var(--font-mono)'}}>{c.last}</td>
                <td style={{padding:'14px 12px'}}>
                  <span style={ownerStyles.pill(c.status==='active'?'ok':c.status==='overdue'?'danger':'warn')}>
                    {c.status==='active'?'Activo':c.status==='overdue'?'Vencido':'Inactivo'}
                  </span>
                </td>
                <td style={{padding:'14px 22px', textAlign:'right'}}>
                  <button style={{background:'none', border:'none', color:'var(--ink-3)', cursor:'pointer'}}>{ICON.dots()}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{padding:'12px 22px', display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--line)', fontSize:12, color:'var(--ink-3)'}}>
          <div>Mostrando 1–10 de 124</div>
          <div style={{display:'flex', gap:6}}>
            <button style={ownerStyles.btn('secondary')}>Anterior</button>
            <button style={ownerStyles.btn('secondary')}>Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROUTINES (owner) ───────────────────────────────────────
function OwnerRoutines() {
  const [selected, setSelected] = React.useState(0);
  const routines = [
    {n:'Push / Pull / Legs', days:5, exs:24, assigned:18, lvl:'Intermedio'},
    {n:'Full Body 3x', days:3, exs:18, assigned:42, lvl:'Principiante'},
    {n:'Upper / Lower', days:4, exs:22, assigned:28, lvl:'Intermedio'},
    {n:'Bro Split clásico', days:5, exs:28, assigned:14, lvl:'Avanzado'},
    {n:'HIIT + Fuerza', days:4, exs:16, assigned:9, lvl:'Intermedio'},
  ];
  const exsDetail = [
    {n:'Press de banca', g:'Pecho', s:'4 × 8-12'},
    {n:'Press inclinado mancuerna', g:'Pecho', s:'3 × 10-12'},
    {n:'Aperturas con polea', g:'Pecho', s:'3 × 12-15'},
    {n:'Press francés', g:'Tríceps', s:'3 × 8-10'},
    {n:'Extensión de tríceps polea', g:'Tríceps', s:'3 × 12-15'},
    {n:'Fondos en paralelas', g:'Tríceps', s:'3 × AMRAP'},
  ];
  return (
    <div style={{...ownerStyles.content, display:'grid', gridTemplateColumns:'320px 1fr', gap:14, padding:'20px 24px', height:'calc(100% - 0px)'}}>
      {/* list */}
      <div style={{...ownerStyles.card, padding:0, display:'flex', flexDirection:'column', overflow:'hidden'}}>
        <div style={{padding:'16px 18px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={ownerStyles.label}>Plantillas</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:16, fontWeight:600, marginTop:2}}>{routines.length} rutinas</div>
          </div>
          <button style={{...ownerStyles.btn('accent'), padding:'7px 12px'}}>{ICON.plus(14)}</button>
        </div>
        <div style={{flex:1, overflowY:'auto'}}>
          {routines.map((r,i)=>(
            <button key={i} onClick={()=>setSelected(i)} style={{
              width:'100%', textAlign:'left', padding:'14px 18px',
              background: selected===i?'var(--bg-sunk)':'none', border:'none',
              borderLeft: selected===i?'2px solid var(--accent)':'2px solid transparent',
              cursor:'pointer', display:'flex', flexDirection:'column', gap:6,
              borderBottom:'1px solid var(--line-2)',
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div style={{fontWeight:500, fontSize:14}}>{r.n}</div>
                <div style={ownerStyles.pill('default')}>{r.lvl}</div>
              </div>
              <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)', display:'flex', gap:10}}>
                <span>{r.days} días/sem</span>
                <span>{r.exs} ejs</span>
                <span>{r.assigned} clientes</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* editor */}
      <div style={{...ownerStyles.card, padding:0, display:'flex', flexDirection:'column', overflow:'hidden'}}>
        <div style={{padding:'18px 24px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={ownerStyles.label}>{routines[selected].lvl} · {routines[selected].days} días</div>
            <input defaultValue={routines[selected].n} key={selected} style={{
              fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, letterSpacing:-0.5,
              border:'none', outline:'none', background:'none', color:'var(--ink)',
              marginTop:2, width:400,
            }}/>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button style={ownerStyles.btn('secondary')}>Duplicar</button>
            <button style={ownerStyles.btn('accent')}>{ICON.plus(14)} Asignar a clientes</button>
          </div>
        </div>

        {/* day tabs */}
        <div style={{display:'flex', gap:6, padding:'14px 24px 0'}}>
          {['Día 1 — Push','Día 2 — Pull','Día 3 — Legs','Día 4 — Push','Día 5 — Pull'].map((d,i)=>(
            <button key={i} style={{
              padding:'7px 14px', borderRadius:8, border:'1px solid var(--line)',
              background: i===0?'var(--ink)':'var(--bg-elev)',
              color: i===0?'var(--bg)':'var(--ink-2)',
              cursor:'pointer', fontSize:12, fontWeight:500,
            }}>{d}</button>
          ))}
          <button style={{
            padding:'7px 12px', borderRadius:8, border:'1px dashed var(--line)',
            background:'transparent', color:'var(--ink-3)', cursor:'pointer', fontSize:12,
          }}>+ Día</button>
        </div>

        <div style={{flex:1, padding:'18px 24px', overflowY:'auto'}}>
          <div style={{...ownerStyles.label, marginBottom:10}}>Día 1 — Push (Pecho · Tríceps)</div>

          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {exsDetail.map((e,i)=>(
              <div key={i} style={{
                padding:'14px 16px', borderRadius:10, border:'1px solid var(--line)',
                display:'grid', gridTemplateColumns:'24px 1fr 110px 130px 30px', gap:12, alignItems:'center',
              }}>
                <div style={{fontFamily:'var(--font-mono)', color:'var(--ink-4)', fontSize:12}}>{(i+1).toString().padStart(2,'0')}</div>
                <div>
                  <div style={{fontWeight:500, fontSize:14}}>{e.n}</div>
                  <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)', marginTop:2}}>{e.g}</div>
                </div>
                <div style={{fontFamily:'var(--font-mono)', fontSize:13, color:'var(--ink-2)'}}>{e.s}</div>
                <input defaultValue="90s descanso" style={{
                  border:'1px solid var(--line)', borderRadius:6, padding:'6px 10px',
                  fontSize:12, fontFamily:'var(--font-mono)', background:'var(--bg-sunk)', color:'var(--ink-2)',
                }}/>
                <button style={{background:'none', border:'none', color:'var(--ink-3)', cursor:'pointer'}}>{ICON.dots()}</button>
              </div>
            ))}
            <button style={{
              padding:'14px', border:'1px dashed var(--line)', borderRadius:10,
              background:'transparent', color:'var(--ink-3)', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontSize:13,
            }}>{ICON.plus(14)} Añadir ejercicio</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER PAYMENT MODAL ─────────────────────────────────
function RegisterPaymentModal({ open, onClose }) {
  const [client, setClient] = React.useState('Cliente 5');
  const [showClientList, setShowClientList] = React.useState(false);
  const [plan, setPlan] = React.useState('mensual');
  const [method, setMethod] = React.useState('tarjeta');
  const [amount, setAmount] = React.useState(25000);
  const [date, setDate] = React.useState('2026-05-18');
  const [period, setPeriod] = React.useState({from:'2026-05-18', to:'2026-06-18'});
  const [note, setNote] = React.useState('');
  const [sendReceipt, setSendReceipt] = React.useState(true);

  const plans = [
    {id:'mensual', name:'Plan Mensual', price:25000, dur:'1 mes'},
    {id:'trimestral', name:'Plan Trimestral', price:67500, dur:'3 meses'},
    {id:'anual', name:'Plan Anual', price:250000, dur:'12 meses'},
    {id:'custom', name:'Personalizado', price:null, dur:'—'},
  ];
  const methods = [
    {id:'tarjeta', label:'Tarjeta', icon: ICON.card},
    {id:'transferencia', label:'Transferencia', icon: ICON.send},
    {id:'efectivo', label:'Efectivo', icon: ICON.money},
  ];
  const clientList = ['Cliente 1','Cliente 2','Cliente 3','Cliente 5','Cliente 7','Cliente 9','Cliente 14','Cliente 22','Cliente 31'];

  const onPick = (p) => {
    setPlan(p.id);
    if (p.price !== null) setAmount(p.price);
  };

  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, background:'rgba(14,14,12,0.55)',
      backdropFilter:'blur(4px)', WebkitBackdropFilter:'blur(4px)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:100,
      animation:'fadeIn .15s ease',
    }}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div onClick={e=>e.stopPropagation()} style={{
        width:560, maxHeight:'92%', background:'var(--bg-elev)',
        borderRadius:16, boxShadow:'0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px var(--line)',
        display:'flex', flexDirection:'column', overflow:'hidden',
        animation:'slideUp .2s ease',
      }}>
        {/* header */}
        <div style={{padding:'20px 24px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div>
            <div style={ownerStyles.label}>Nuevo movimiento</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, letterSpacing:-0.5, marginTop:2}}>Registrar pago</div>
          </div>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:8, border:'none', cursor:'pointer',
            background:'var(--bg-sunk)', color:'var(--ink-2)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{ICON.close()}</button>
        </div>

        {/* body */}
        <div style={{padding:'22px 24px', overflowY:'auto', display:'flex', flexDirection:'column', gap:18}}>

          {/* Client picker */}
          <div>
            <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Cliente</label>
            <div style={{position:'relative'}}>
              <button onClick={()=>setShowClientList(!showClientList)} style={{
                width:'100%', padding:'10px 14px', borderRadius:10, cursor:'pointer',
                border:'1px solid var(--line)', background:'var(--bg-sunk)',
                display:'flex', alignItems:'center', gap:12, textAlign:'left',
              }}>
                <Avatar name={client} size={32}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14, fontWeight:500, color:'var(--ink)'}}>{client}</div>
                  <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)', marginTop:1}}>Plan Mensual · vence 15 May</div>
                </div>
                <span style={{color:'var(--ink-3)', transform: showClientList?'rotate(90deg)':'none', transition:'transform .15s'}}>{ICON.arrow(14)}</span>
              </button>
              {showClientList && (
                <div style={{
                  position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:5,
                  background:'var(--bg-elev)', border:'1px solid var(--line)', borderRadius:10,
                  boxShadow:'var(--shadow-md)', maxHeight:200, overflowY:'auto',
                }}>
                  <div style={{padding:'8px 12px', borderBottom:'1px solid var(--line-2)', display:'flex', alignItems:'center', gap:8}}>
                    <span style={{color:'var(--ink-3)'}}>{ICON.search(14)}</span>
                    <input placeholder="Buscar..." autoFocus style={{
                      flex:1, border:'none', outline:'none', background:'none',
                      fontSize:12, color:'var(--ink)', fontFamily:'var(--font-ui)',
                    }}/>
                  </div>
                  {clientList.map(c=>(
                    <button key={c} onClick={()=>{setClient(c); setShowClientList(false);}} style={{
                      width:'100%', padding:'10px 12px', textAlign:'left',
                      background: c===client?'var(--bg-sunk)':'none', border:'none', cursor:'pointer',
                      display:'flex', alignItems:'center', gap:10, fontSize:13, color:'var(--ink)',
                    }}>
                      <Avatar name={c} size={24}/>
                      {c}
                      {c===client && <span style={{marginLeft:'auto', color:'var(--ink-2)'}}>{ICON.check(14)}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Plan */}
          <div>
            <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Concepto</label>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              {plans.map(p=>(
                <button key={p.id} onClick={()=>onPick(p)} style={{
                  padding:'12px 14px', borderRadius:10, cursor:'pointer', textAlign:'left',
                  border: plan===p.id?'2px solid var(--ink)':'1px solid var(--line)',
                  background: plan===p.id?'var(--bg-sunk)':'var(--bg-elev)',
                  marginTop: plan===p.id?-1:0, marginBottom: plan===p.id?-1:0,
                  marginLeft: plan===p.id?-1:0, marginRight: plan===p.id?-1:0,
                }}>
                  <div style={{fontSize:13, fontWeight:600, color:'var(--ink)'}}>{p.name}</div>
                  <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)', marginTop:4}}>
                    {p.price !== null ? `₡${p.price.toLocaleString('es-CR')}` : 'Definir monto'} · {p.dur}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount + Date row */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div>
              <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Monto</label>
              <div style={{
                display:'flex', alignItems:'center', border:'1px solid var(--line)',
                borderRadius:10, background:'var(--bg-sunk)', overflow:'hidden',
              }}>
                <div style={{padding:'10px 14px', color:'var(--ink-3)', fontFamily:'var(--font-mono)', fontSize:14, borderRight:'1px solid var(--line)'}}>₡</div>
                <input type="number" value={amount} onChange={e=>setAmount(+e.target.value||0)} style={{
                  flex:1, border:'none', outline:'none', background:'none',
                  padding:'10px 12px', fontFamily:'var(--font-mono)', fontSize:15,
                  fontWeight:600, color:'var(--ink)', minWidth:0,
                }}/>
              </div>
            </div>
            <div>
              <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Fecha del pago</label>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{
                width:'100%', padding:'10px 14px', borderRadius:10,
                border:'1px solid var(--line)', background:'var(--bg-sunk)',
                fontFamily:'var(--font-mono)', fontSize:13, color:'var(--ink)',
              }}/>
            </div>
          </div>

          {/* Method */}
          <div>
            <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Método de pago</label>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8}}>
              {methods.map(m=>(
                <button key={m.id} onClick={()=>setMethod(m.id)} style={{
                  padding:'14px 10px', borderRadius:10, cursor:'pointer',
                  border: method===m.id?'2px solid var(--ink)':'1px solid var(--line)',
                  background: method===m.id?'var(--bg-sunk)':'var(--bg-elev)',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                  color: method===m.id?'var(--ink)':'var(--ink-2)',
                  margin: method===m.id?-1:0,
                }}>
                  <div>{m.icon(20)}</div>
                  <div style={{fontSize:12, fontWeight:500}}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Period */}
          <div>
            <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Período cubierto</label>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <input type="date" value={period.from} onChange={e=>setPeriod({...period, from:e.target.value})} style={{
                flex:1, padding:'10px 14px', borderRadius:10,
                border:'1px solid var(--line)', background:'var(--bg-sunk)',
                fontFamily:'var(--font-mono)', fontSize:13, color:'var(--ink)',
              }}/>
              <span style={{color:'var(--ink-3)', fontFamily:'var(--font-mono)', fontSize:12}}>→</span>
              <input type="date" value={period.to} onChange={e=>setPeriod({...period, to:e.target.value})} style={{
                flex:1, padding:'10px 14px', borderRadius:10,
                border:'1px solid var(--line)', background:'var(--bg-sunk)',
                fontFamily:'var(--font-mono)', fontSize:13, color:'var(--ink)',
              }}/>
            </div>
          </div>

          {/* Note */}
          <div>
            <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Nota interna <span style={{textTransform:'none', color:'var(--ink-4)'}}>(opcional)</span></label>
            <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Ej. pagó en 2 partes, descuento por convenio..." style={{
              width:'100%', padding:'10px 14px', borderRadius:10,
              border:'1px solid var(--line)', background:'var(--bg-sunk)',
              fontFamily:'var(--font-ui)', fontSize:13, color:'var(--ink)',
            }}/>
          </div>

          {/* Send receipt */}
          <label style={{
            display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
            border:'1px solid var(--line)', borderRadius:10, cursor:'pointer',
            background: sendReceipt?'color-mix(in oklab, var(--accent) 15%, var(--bg-elev))':'var(--bg-elev)',
          }}>
            <div style={{
              width:18, height:18, borderRadius:5, flexShrink:0,
              border:'1.5px solid', borderColor: sendReceipt?'var(--ink)':'var(--ink-4)',
              background: sendReceipt?'var(--ink)':'transparent',
              color:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {sendReceipt && ICON.check(12)}
            </div>
            <input type="checkbox" checked={sendReceipt} onChange={e=>setSendReceipt(e.target.checked)} style={{display:'none'}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13, fontWeight:500}}>Enviar recibo al cliente</div>
              <div style={{fontSize:11, color:'var(--ink-3)', marginTop:2}}>Por email y notificación push en la app</div>
            </div>
          </label>

        </div>

        {/* footer */}
        <div style={{
          padding:'16px 24px', borderTop:'1px solid var(--line)',
          background:'var(--bg-sunk)',
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
        }}>
          <div>
            <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)', letterSpacing:0.5, textTransform:'uppercase'}}>Total a registrar</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, letterSpacing:-0.5}}>₡{amount.toLocaleString('es-CR')}</div>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button onClick={onClose} style={ownerStyles.btn('secondary')}>Cancelar</button>
            <button onClick={onClose} style={{...ownerStyles.btn('accent'), padding:'10px 18px'}}>
              {ICON.check(14)} Registrar pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MEMBERSHIPS (CRUD) ─────────────────────────────────────
function MembershipFormModal({ open, onClose, plan }) {
  const isEdit = !!plan;
  const [name, setName] = React.useState(plan?.name || '');
  const [price, setPrice] = React.useState(plan?.price || 25000);
  const [duration, setDuration] = React.useState(plan?.duration || 1);
  const [unit, setUnit] = React.useState(plan?.unit || 'mes');
  const [accessType, setAccessType] = React.useState(plan?.accessType || 'unlimited');
  const [classes, setClasses] = React.useState(plan?.classes || 12);
  const [active, setActive] = React.useState(plan?.active ?? true);
  const [features, setFeatures] = React.useState(plan?.features || ['Acceso a área de pesas','Rutinas personalizadas']);
  const [color, setColor] = React.useState(plan?.color || 'lime');

  React.useEffect(()=>{
    if (open) {
      setName(plan?.name || '');
      setPrice(plan?.price || 25000);
      setDuration(plan?.duration || 1);
      setUnit(plan?.unit || 'mes');
      setAccessType(plan?.accessType || 'unlimited');
      setClasses(plan?.classes || 12);
      setActive(plan?.active ?? true);
      setFeatures(plan?.features || ['Acceso a área de pesas','Rutinas personalizadas']);
      setColor(plan?.color || 'lime');
    }
  }, [open, plan]);

  const colors = [
    {id:'lime', v:'oklch(0.85 0.18 130)'},
    {id:'sand', v:'oklch(0.82 0.08 80)'},
    {id:'sky',  v:'oklch(0.82 0.10 230)'},
    {id:'rose', v:'oklch(0.80 0.10 20)'},
    {id:'ink',  v:'#0E0E0C'},
  ];

  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, background:'rgba(14,14,12,0.55)',
      backdropFilter:'blur(4px)', WebkitBackdropFilter:'blur(4px)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:100,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:600, maxHeight:'92%', background:'var(--bg-elev)',
        borderRadius:16, boxShadow:'0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px var(--line)',
        display:'flex', flexDirection:'column', overflow:'hidden',
      }}>
        <div style={{padding:'20px 24px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div>
            <div style={ownerStyles.label}>{isEdit?'Editar':'Nueva'}</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, letterSpacing:-0.5, marginTop:2}}>
              {isEdit?'Editar membresía':'Nueva membresía'}
            </div>
          </div>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:8, border:'none', cursor:'pointer',
            background:'var(--bg-sunk)', color:'var(--ink-2)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{ICON.close()}</button>
        </div>

        <div style={{padding:'22px 24px', overflowY:'auto', display:'flex', flexDirection:'column', gap:18}}>
          <div>
            <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Nombre del plan</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ej. Plan Mensual Pro" style={{
              width:'100%', padding:'10px 14px', borderRadius:10,
              border:'1px solid var(--line)', background:'var(--bg-sunk)',
              fontFamily:'var(--font-ui)', fontSize:14, color:'var(--ink)',
            }}/>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div>
              <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Precio</label>
              <div style={{display:'flex', alignItems:'center', border:'1px solid var(--line)', borderRadius:10, background:'var(--bg-sunk)', overflow:'hidden'}}>
                <div style={{padding:'10px 14px', color:'var(--ink-3)', fontFamily:'var(--font-mono)', fontSize:14, borderRight:'1px solid var(--line)'}}>₡</div>
                <input type="number" value={price} onChange={e=>setPrice(+e.target.value||0)} style={{
                  flex:1, border:'none', outline:'none', background:'none',
                  padding:'10px 12px', fontFamily:'var(--font-mono)', fontSize:15,
                  fontWeight:600, color:'var(--ink)', minWidth:0,
                }}/>
              </div>
            </div>
            <div>
              <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Duración</label>
              <div style={{display:'flex', gap:8}}>
                <input type="number" value={duration} onChange={e=>setDuration(+e.target.value||1)} style={{
                  width:80, padding:'10px 14px', borderRadius:10,
                  border:'1px solid var(--line)', background:'var(--bg-sunk)',
                  fontFamily:'var(--font-mono)', fontSize:14, color:'var(--ink)',
                }}/>
                <select value={unit} onChange={e=>setUnit(e.target.value)} style={{
                  flex:1, padding:'10px 14px', borderRadius:10,
                  border:'1px solid var(--line)', background:'var(--bg-sunk)',
                  fontFamily:'var(--font-ui)', fontSize:14, color:'var(--ink)',
                }}>
                  <option value="dia">día(s)</option>
                  <option value="semana">semana(s)</option>
                  <option value="mes">mes(es)</option>
                  <option value="año">año(s)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Tipo de acceso</label>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              {[
                {id:'unlimited', label:'Ilimitado', sub:'Acceso libre al gym'},
                {id:'limited', label:'Por clases', sub:'X visitas / período'},
              ].map(t=>(
                <button key={t.id} onClick={()=>setAccessType(t.id)} style={{
                  padding:'12px 14px', borderRadius:10, cursor:'pointer', textAlign:'left',
                  border: accessType===t.id?'2px solid var(--ink)':'1px solid var(--line)',
                  background: accessType===t.id?'var(--bg-sunk)':'var(--bg-elev)',
                  margin: accessType===t.id?-1:0,
                }}>
                  <div style={{fontSize:13, fontWeight:600, color:'var(--ink)'}}>{t.label}</div>
                  <div style={{fontSize:11, color:'var(--ink-3)', marginTop:4}}>{t.sub}</div>
                </button>
              ))}
            </div>
            {accessType==='limited' && (
              <div style={{marginTop:10, display:'flex', alignItems:'center', gap:10}}>
                <input type="number" value={classes} onChange={e=>setClasses(+e.target.value||0)} style={{
                  width:80, padding:'10px 14px', borderRadius:10,
                  border:'1px solid var(--line)', background:'var(--bg-sunk)',
                  fontFamily:'var(--font-mono)', fontSize:14, color:'var(--ink)',
                }}/>
                <span style={{fontSize:13, color:'var(--ink-3)'}}>visitas durante el período</span>
              </div>
            )}
          </div>

          <div>
            <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Beneficios incluidos</label>
            <div style={{display:'flex', flexDirection:'column', gap:6}}>
              {features.map((f,i)=>(
                <div key={i} style={{display:'flex', gap:8, alignItems:'center'}}>
                  <span style={{color:'var(--ink-3)'}}>{ICON.check(14)}</span>
                  <input value={f} onChange={e=>{const nf=[...features]; nf[i]=e.target.value; setFeatures(nf);}} style={{
                    flex:1, padding:'8px 12px', borderRadius:8,
                    border:'1px solid var(--line)', background:'var(--bg-sunk)',
                    fontFamily:'var(--font-ui)', fontSize:13, color:'var(--ink)',
                  }}/>
                  <button onClick={()=>setFeatures(features.filter((_,j)=>j!==i))} style={{
                    width:30, height:30, borderRadius:6, border:'none', cursor:'pointer',
                    background:'var(--bg-sunk)', color:'var(--ink-3)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>{ICON.close(12)}</button>
                </div>
              ))}
              <button onClick={()=>setFeatures([...features,''])} style={{
                marginTop:4, padding:'8px', border:'1px dashed var(--line)', borderRadius:8,
                background:'transparent', color:'var(--ink-3)', cursor:'pointer', fontSize:12,
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              }}>{ICON.plus(12)} Añadir beneficio</button>
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div>
              <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Color</label>
              <div style={{display:'flex', gap:8}}>
                {colors.map(c=>(
                  <button key={c.id} onClick={()=>setColor(c.id)} style={{
                    width:36, height:36, borderRadius:10, cursor:'pointer',
                    border: color===c.id?'2px solid var(--ink)':'1px solid var(--line)',
                    background: c.v, padding:0,
                  }}/>
                ))}
              </div>
            </div>
            <div>
              <label style={{...ownerStyles.label, display:'block', marginBottom:8}}>Estado</label>
              <button onClick={()=>setActive(!active)} style={{
                width:'100%', padding:'10px 14px', borderRadius:10, cursor:'pointer',
                border:'1px solid var(--line)', background:'var(--bg-sunk)',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                color:'var(--ink)', fontSize:13, fontWeight:500,
              }}>
                <span>{active?'Plan activo':'Plan oculto'}</span>
                <div style={{
                  width:36, height:20, borderRadius:20, padding:2,
                  background: active?'var(--accent)':'var(--ink-4)',
                  display:'flex', alignItems:'center',
                  justifyContent: active?'flex-end':'flex-start',
                }}>
                  <div style={{width:16, height:16, borderRadius:16, background:'#fff'}}/>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div style={{
          padding:'16px 24px', borderTop:'1px solid var(--line)', background:'var(--bg-sunk)',
          display:'flex', justifyContent:'space-between', gap:12,
        }}>
          {isEdit ? (
            <button style={{...ownerStyles.btn('secondary'), color:'var(--danger)'}}>Eliminar plan</button>
          ) : <span/>}
          <div style={{display:'flex', gap:8}}>
            <button onClick={onClose} style={ownerStyles.btn('secondary')}>Cancelar</button>
            <button onClick={onClose} style={{...ownerStyles.btn('accent'), padding:'10px 18px'}}>
              {ICON.check(14)} {isEdit?'Guardar cambios':'Crear plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnerMemberships() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState(null);

  const plans = [
    {id:1, name:'Plan Mensual', price:25000, duration:1, unit:'mes', accessType:'unlimited', subs:89, color:'lime', active:true,
      features:['Acceso ilimitado','Rutinas personalizadas','App móvil','Vestuario y duchas']},
    {id:2, name:'Plan Trimestral', price:67500, duration:3, unit:'mes', accessType:'unlimited', subs:24, color:'sand', active:true,
      features:['Todo del Mensual','10% descuento','1 evaluación corporal','Plan nutricional básico']},
    {id:3, name:'Plan Anual', price:250000, duration:12, unit:'mes', accessType:'unlimited', subs:8, color:'ink', active:true,
      features:['Todo del Trimestral','17% descuento','4 eval. corporales','Asesoría nutricional','Invitados gratis (2/mes)']},
    {id:4, name:'Pase 10 Visitas', price:18000, duration:2, unit:'mes', accessType:'limited', classes:10, subs:3, color:'sky', active:true,
      features:['10 visitas en 60 días','Sin compromiso mensual','Ideal para esporádicos']},
    {id:5, name:'Plan Estudiante', price:18000, duration:1, unit:'mes', accessType:'unlimited', subs:0, color:'rose', active:false,
      features:['28% descuento','Requiere carnet vigente','Acceso L-V hasta 17h']},
  ];

  const colorMap = {
    lime: 'oklch(0.85 0.18 130)',
    sand: 'oklch(0.82 0.08 80)',
    sky:  'oklch(0.82 0.10 230)',
    rose: 'oklch(0.80 0.10 20)',
    ink:  '#0E0E0C',
  };

  const totalRev = plans.reduce((s,p)=>s + (p.subs * p.price / p.duration), 0);
  const totalSubs = plans.reduce((s,p)=>s+p.subs, 0);
  const activePlans = plans.filter(p=>p.active).length;

  const openNew = () => { setEditingPlan(null); setModalOpen(true); };
  const openEdit = (p) => { setEditingPlan(p); setModalOpen(true); };

  return (
    <div style={{...ownerStyles.content, position:'relative'}}>
      <MembershipFormModal open={modalOpen} onClose={()=>setModalOpen(false)} plan={editingPlan}/>

      {/* summary */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:18}}>
        {[
          {label:'Planes activos', v:activePlans, sub:`de ${plans.length} totales`},
          {label:'Suscripciones', v:totalSubs, sub:'clientes con plan'},
          {label:'Ingreso recurrente', v:`₡${Math.round(totalRev/1000)}K`, sub:'mensualizado'},
          {label:'Plan más vendido', v:'Mensual', sub:'89 clientes · 71%'},
        ].map((k,i)=>(
          <div key={i} style={ownerStyles.card}>
            <div style={ownerStyles.label}>{k.label}</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:30, fontWeight:600, letterSpacing:-0.8, marginTop:6}}>{k.v}</div>
            <div style={{fontSize:12, color:'var(--ink-3)', marginTop:4}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* plans grid */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
        <div>
          <div style={ownerStyles.label}>Catálogo de planes</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:18, fontWeight:600, marginTop:2}}>{plans.length} membresías</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button style={ownerStyles.btn('secondary')}>{ICON.filter()} Filtrar</button>
          <button onClick={openNew} style={ownerStyles.btn('primary')}>{ICON.plus(14)} Nueva membresía</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14, marginBottom:18}}>
        {plans.map(p=>(
          <div key={p.id} style={{
            ...ownerStyles.card, padding:0, overflow:'hidden', position:'relative',
            opacity: p.active?1:0.55,
          }}>
            {/* color stripe */}
            <div style={{height:6, background: colorMap[p.color]}}/>

            <div style={{padding:'18px 20px 14px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div>
                  <div style={{fontFamily:'var(--font-display)', fontSize:18, fontWeight:600, letterSpacing:-0.3}}>{p.name}</div>
                  <div style={{display:'flex', alignItems:'baseline', gap:4, marginTop:8}}>
                    <span style={{fontFamily:'var(--font-display)', fontSize:32, fontWeight:600, letterSpacing:-1}}>₡{p.price.toLocaleString('es-CR')}</span>
                  </div>
                  <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)', marginTop:2, letterSpacing:0.5}}>
                    POR {p.duration} {p.unit.toUpperCase()}{p.duration>1?'ES':''}
                  </div>
                </div>
                <span style={ownerStyles.pill(p.active?'ok':'default')}>{p.active?'Activo':'Oculto'}</span>
              </div>

              <div style={{display:'flex', gap:14, marginTop:14, paddingTop:14, borderTop:'1px solid var(--line-2)', fontSize:11, fontFamily:'var(--font-mono)', color:'var(--ink-3)'}}>
                <div>
                  <div style={{letterSpacing:0.5}}>SUSCRIPTORES</div>
                  <div style={{color:'var(--ink)', fontFamily:'var(--font-display)', fontSize:18, fontWeight:600, marginTop:2}}>{p.subs}</div>
                </div>
                <div>
                  <div style={{letterSpacing:0.5}}>ACCESO</div>
                  <div style={{color:'var(--ink-2)', fontSize:13, marginTop:4}}>{p.accessType==='unlimited'?'Ilimitado':`${p.classes} visitas`}</div>
                </div>
              </div>

              <div style={{marginTop:14, display:'flex', flexDirection:'column', gap:6}}>
                {p.features.slice(0,3).map((f,i)=>(
                  <div key={i} style={{display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--ink-2)'}}>
                    <span style={{color:'var(--ink-3)', flexShrink:0}}>{ICON.check(12)}</span>
                    <span style={{textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap'}}>{f}</span>
                  </div>
                ))}
                {p.features.length>3 && (
                  <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)', marginLeft:20}}>+ {p.features.length-3} más</div>
                )}
              </div>
            </div>

            <div style={{
              padding:'10px 14px', borderTop:'1px solid var(--line)',
              background:'var(--bg-sunk)', display:'flex', gap:6,
            }}>
              <button onClick={()=>openEdit(p)} style={{
                flex:1, padding:'7px', borderRadius:6, border:'none', cursor:'pointer',
                background:'var(--bg-elev)', color:'var(--ink-2)', fontSize:12, fontWeight:500,
              }}>Editar</button>
              <button style={{
                flex:1, padding:'7px', borderRadius:6, border:'none', cursor:'pointer',
                background:'var(--bg-elev)', color:'var(--ink-2)', fontSize:12, fontWeight:500,
              }}>Duplicar</button>
              <button style={{
                width:32, padding:'7px', borderRadius:6, border:'none', cursor:'pointer',
                background:'var(--bg-elev)', color:'var(--ink-3)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>{ICON.dots(14)}</button>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <button onClick={openNew} style={{
          minHeight:340, border:'1.5px dashed var(--line)', borderRadius:14,
          background:'transparent', cursor:'pointer', color:'var(--ink-3)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10,
          fontFamily:'var(--font-ui)',
        }}>
          <div style={{
            width:46, height:46, borderRadius:46, background:'var(--bg-sunk)',
            display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink-2)',
          }}>{ICON.plus(20)}</div>
          <div style={{fontSize:14, fontWeight:500}}>Nueva membresía</div>
          <div style={{fontSize:11, color:'var(--ink-4)', maxWidth:160, textAlign:'center'}}>
            Crea un plan nuevo: precio, duración y beneficios
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── PAYMENTS ───────────────────────────────────────────────
function OwnerPayments() {
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <div style={{...ownerStyles.content, position:'relative'}}>
      <RegisterPaymentModal open={modalOpen} onClose={()=>setModalOpen(false)}/>
      {/* summary */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:18}}>
        {[
          {label:'Cobrado este mes', v:'₡3.005.000', sub:'117 pagos · +12% vs Abr'},
          {label:'Pendiente', v:'₡175.000', sub:'7 clientes morosos', warn:true},
          {label:'Proyectado Jun', v:'₡3.250.000', sub:'130 cobros activos'},
        ].map((k,i)=>(
          <div key={i} style={ownerStyles.card}>
            <div style={ownerStyles.label}>{k.label}</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:30, fontWeight:600, letterSpacing:-0.8, marginTop:6, color: k.warn?'var(--danger)':'var(--ink)'}}>{k.v}</div>
            <div style={{fontSize:12, color:'var(--ink-3)', marginTop:4}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* transactions */}
      <div style={{...ownerStyles.card, padding:0, overflow:'hidden'}}>
        <div style={{padding:'16px 22px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={ownerStyles.label}>Movimientos</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:16, fontWeight:600, marginTop:2}}>Mayo 2026</div>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button style={ownerStyles.btn('secondary')}>{ICON.download()} Exportar</button>
            <button onClick={()=>setModalOpen(true)} style={ownerStyles.btn('primary')}>{ICON.plus(14)} Registrar pago</button>
          </div>
        </div>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
          <thead>
            <tr style={{textAlign:'left', color:'var(--ink-3)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:1, background:'var(--bg-sunk)'}}>
              <th style={{padding:'10px 22px', fontWeight:500}}>FECHA</th>
              <th style={{padding:'10px 12px', fontWeight:500}}>CLIENTE</th>
              <th style={{padding:'10px 12px', fontWeight:500}}>CONCEPTO</th>
              <th style={{padding:'10px 12px', fontWeight:500}}>MÉTODO</th>
              <th style={{padding:'10px 12px', fontWeight:500, textAlign:'right'}}>MONTO</th>
              <th style={{padding:'10px 22px', fontWeight:500}}>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {[
              {d:'18 May', n:'Cliente 7', cn:'Plan Mensual', m:'Tarjeta', amt:'25.000', st:'ok'},
              {d:'17 May', n:'Cliente 9', cn:'Plan Trimestral', m:'Transferencia', amt:'67.500', st:'ok'},
              {d:'15 May', n:'Cliente 5', cn:'Plan Mensual', m:'Pendiente', amt:'25.000', st:'pending'},
              {d:'14 May', n:'Cliente 18', cn:'Plan Mensual', m:'Efectivo', amt:'25.000', st:'ok'},
              {d:'12 May', n:'Cliente 31', cn:'Plan Mensual', m:'Pendiente', amt:'25.000', st:'pending'},
              {d:'10 May', n:'Cliente 11', cn:'Plan Anual', m:'Tarjeta', amt:'250.000', st:'ok'},
              {d:'8 May', n:'Cliente 14', cn:'Plan Mensual', m:'Pendiente', amt:'25.000', st:'overdue'},
              {d:'6 May', n:'Cliente 2', cn:'Plan Mensual', m:'Efectivo', amt:'25.000', st:'ok'},
              {d:'1 May', n:'Cliente 22', cn:'Plan Mensual', m:'Pendiente', amt:'25.000', st:'overdue'},
            ].map((p,i)=>(
              <tr key={i} style={{borderTop:'1px solid var(--line-2)'}}>
                <td style={{padding:'12px 22px', color:'var(--ink-3)', fontFamily:'var(--font-mono)', fontSize:12}}>{p.d}</td>
                <td style={{padding:'12px 12px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <Avatar name={p.n} size={26}/>
                    <span>{p.n}</span>
                  </div>
                </td>
                <td style={{padding:'12px 12px', color:'var(--ink-2)'}}>{p.cn}</td>
                <td style={{padding:'12px 12px', color:'var(--ink-3)'}}>{p.m}</td>
                <td style={{padding:'12px 12px', textAlign:'right', fontFamily:'var(--font-mono)', fontWeight:500}}>₡{p.amt}</td>
                <td style={{padding:'12px 22px'}}>
                  <span style={ownerStyles.pill(p.st==='ok'?'ok':p.st==='overdue'?'danger':'warn')}>
                    {p.st==='ok'?'Pagado':p.st==='overdue'?'Vencido':'Pendiente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ROOT OWNER APP ─────────────────────────────────────────
function OwnerApp() {
  const [screen, setScreen] = React.useState('dashboard');
  const titles = {dashboard:'Dashboard', clients:'Clientes', routines:'Rutinas', memberships:'Membresías', payments:'Pagos'};
  const screens = {dashboard:<OwnerDashboard/>, clients:<OwnerClients/>, routines:<OwnerRoutines/>, memberships:<OwnerMemberships/>, payments:<OwnerPayments/>};
  return (
    <div data-screen-label={`Owner · ${screen}`} style={ownerStyles.shell}>
      <OwnerSidebar active={screen} onNav={setScreen}/>
      <div style={{display:'flex', flexDirection:'column', overflow:'hidden'}}>
        <div style={ownerStyles.topbar}>
          <div>
            <div style={{...ownerStyles.label, marginBottom:2}}>Gym 1 · Owner 1</div>
            <div style={ownerStyles.pageTitle}>{titles[screen]}</div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:14}}>
            <button style={{background:'none', border:'none', color:'var(--ink-3)', cursor:'pointer', position:'relative'}}>
              {ICON.bell(20)}
              <span style={{position:'absolute', top:0, right:0, width:7, height:7, borderRadius:7, background:'var(--accent)', border:'1.5px solid var(--bg-elev)'}}/>
            </button>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <Avatar name="Owner 1" size={32}/>
              <div>
                <div style={{fontSize:13, fontWeight:500}}>Owner 1</div>
                <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)'}}>Administrador</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{flex:1, overflowY:'auto', background:'var(--bg)'}}>
          {screens[screen]}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OwnerApp });
