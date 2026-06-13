// History screen + transaction details — modern, visual

function HistoryScreen({ t, lang, txs, onBack, onTx }) {
  const [filter, setFilter] = React.useState('all');
  const [period, setPeriod] = React.useState('month');
  const filters = [
    { id: 'all',     label: t.filterAll,     icon: null },
    { id: 'done',    label: t.filterDone,    icon: 'check' },
    { id: 'pending', label: t.filterPending, icon: 'clock' },
    { id: 'error',   label: t.filterError,   icon: 'close' },
  ];
  const periods = [
    { id: 'month', label: t.period_month },
    { id: 'prev',  label: t.period_prev },
    { id: 'pick',  label: t.period_pick, icon: 'calendar' },
  ];
  const filtered = txs.filter(x => filter === 'all' || x.status === filter);
  const groups = groupByDate(filtered, lang);

  // Stats
  const total = filtered.filter(x => x.status === 'done').reduce((s, x) => s + x.amount, 0);
  const count = filtered.length;
  const doneCount = filtered.filter(x => x.status === 'done').length;
  const successPct = count ? Math.round((doneCount / count) * 100) : 0;

  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar onBack={onBack} title={t.historyTitle}/>

      <div className="rz-scroll" style={{ padding: '8px 20px 110px' }}>
        {/* Stats hero */}
        <StatsHero t={t} lang={lang} total={total} count={count} successPct={successPct} period={period}/>

        {/* Period filter (segmented) */}
        <Segmented
          value={period}
          onChange={setPeriod}
          options={periods}
        />

        {/* Status filter (pill) */}
        <div style={{
          display: 'flex', gap: 8, marginTop: 12,
          overflowX: 'auto', paddingBottom: 4,
        }}>
          {filters.map(f => {
            const isActive = filter === f.id;
            const count = f.id === 'all' ? txs.length : txs.filter(x => x.status === f.id).length;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                height: 36, padding: '0 12px',
                background: isActive ? 'var(--rz-ink-950)' : 'var(--rz-card)',
                border: isActive ? 'none' : '1px solid var(--rz-line-soft)',
                color: isActive ? 'white' : 'var(--rz-ink-800)',
                borderRadius: 12,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600, letterSpacing: -0.1,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {f.icon && <Icon name={f.icon} size={13} stroke={2.2}/>}
                {f.label}
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: isActive ? 'rgba(255,255,255,0.16)' : 'var(--rz-paper-2)',
                  color: isActive ? 'white' : 'var(--rz-ink-600)',
                  padding: '1px 7px', borderRadius: 99,
                  fontVariantNumeric: 'tabular-nums',
                }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* List */}
        <div style={{ marginTop: 18 }}>
          {groups.length === 0 && <EmptyHistory lang={lang}/>}
          {groups.map((g, gi) => (
            <div key={gi} style={{ marginBottom: 18 }}>
              <div style={{
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                padding: '0 4px 10px',
              }}>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: 'var(--rz-ink-600)',
                  letterSpacing: -0.2,
                }}>{g.label}</div>
                <div className="rz-num" style={{
                  fontSize: 11.5, color: 'var(--rz-ink-400)', fontWeight: 600,
                }}>
                  −{fmtSum(g.items.reduce((s, x) => s + (x.status === 'done' ? x.amount : 0), 0))} {t.soum}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {g.items.map(tx => (
                  <RzTxRowBig key={tx.id} tx={tx} t={t} lang={lang} onClick={() => onTx(tx)}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsHero({ t, lang, total, count, successPct, period }) {
  const periodLabel = {
    month: lang === 'ru' ? 'Этот месяц' : 'Bu oy',
    prev:  lang === 'ru' ? 'Прошлый месяц' : 'Oʻtgan oy',
    pick:  lang === 'ru' ? 'Выбранный период' : 'Tanlangan davr',
  }[period] || '';
  // Mini bar chart - last 8 days
  const bars = [12, 28, 18, 36, 22, 0, 30, 42];
  const max = Math.max(...bars);
  return (
    <div className="rz-fade-up" style={{
      position: 'relative',
      borderRadius: 24, padding: 18,
      background: 'var(--rz-ink-950)', color: 'white',
      overflow: 'hidden', marginBottom: 14,
    }}>
      {/* decorative sparkle */}
      <span style={{ position: 'absolute', right: -22, top: -22 }}>
        <RzSparkle size={140} color="rgba(255,255,255,0.045)"/>
      </span>

      <div style={{ position: 'relative' }}>
        <div style={{
          fontSize: 11, color: 'rgba(255,255,255,0.6)',
          fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2,
        }}>{periodLabel}</div>

        <div className="rz-num" style={{
          marginTop: 8, fontSize: 32, fontWeight: 700, letterSpacing: -1, lineHeight: 1,
        }}>
          {fmtSum(total)} <span style={{ fontSize: 14, opacity: 0.55, fontWeight: 600, letterSpacing: 0 }}>{t.soum}</span>
        </div>

        <div style={{ marginTop: 6, fontSize: 12.5, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
          {count} {lang === 'ru' ? (count === 1 ? 'операция' : count > 1 && count < 5 ? 'операции' : 'операций') : 'amal'}
          <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
          <span style={{ color: 'var(--rz-green-500)', fontWeight: 700 }}>{successPct}%</span> {lang === 'ru' ? 'успешно' : 'muvaffaqiyatli'}
        </div>

        {/* Mini bars */}
        <div style={{
          marginTop: 16,
          display: 'flex', alignItems: 'flex-end', gap: 6, height: 36,
        }}>
          {bars.map((v, i) => (
            <div key={i} style={{
              flex: 1,
              height: `${Math.max(8, (v / max) * 100)}%`,
              background: i === bars.length - 1 ? 'var(--rz-green-500)' : 'rgba(255,255,255,0.18)',
              borderRadius: 4,
              transition: 'background .2s',
            }}/>
          ))}
        </div>
        <div style={{
          marginTop: 8, display: 'flex', justifyContent: 'space-between',
          fontSize: 9.5, color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600,
        }}>
          <span>{lang === 'ru' ? '8 дн. назад' : '8 kun oldin'}</span>
          <span>{lang === 'ru' ? 'сегодня' : 'bugun'}</span>
        </div>
      </div>
    </div>
  );
}

function Segmented({ value, options, onChange }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      background: 'var(--rz-paper-2)', borderRadius: 12, padding: 3, gap: 3,
    }}>
      {options.map(o => {
        const isActive = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            height: 36, borderRadius: 10,
            background: isActive ? 'var(--rz-card)' : 'transparent',
            boxShadow: isActive ? '0 1px 2px rgba(11,13,18,0.06), 0 4px 10px rgba(11,13,18,0.04)' : 'none',
            fontSize: 13, fontWeight: 600,
            color: isActive ? 'var(--rz-ink-950)' : 'var(--rz-ink-600)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            transition: 'all .15s',
            letterSpacing: -0.1,
          }}>
            {o.icon && <Icon name={o.icon} size={13} stroke={2}/>}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function EmptyHistory({ lang }) {
  return (
    <div className="rz-card" style={{
      padding: '40px 20px', textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 18,
        background: 'var(--rz-paper-2)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px',
      }}>
        <RzSparkle size={28} color="var(--rz-ink-200)"/>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--rz-ink-950)', marginBottom: 4 }}>
        {lang === 'ru' ? 'Нет операций' : 'Amallar yoʻq'}
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--rz-ink-600)' }}>
        {lang === 'ru' ? 'По выбранным фильтрам пока пусто' : 'Tanlangan filtrlar boʻyicha boʻsh'}
      </div>
    </div>
  );
}

function groupByDate(txs, lang) {
  const out = [];
  const map = new Map();
  txs.forEach(tx => {
    const key = tx.groupKey;
    if (!map.has(key)) { map.set(key, []); out.push({ key, label: tx.groupLabel[lang] || tx.groupLabel.ru, items: map.get(key) }); }
    map.get(key).push(tx);
  });
  return out;
}

// Transaction Details bottom sheet — updated visual
function TxDetailsSheet({ tx, t, lang, onClose }) {
  if (!tx) return null;
  const commission = tx.commission || 0;
  return (
    <RzSheet open={!!tx} onClose={onClose}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 14, marginBottom: 18,
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--rz-ink-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2 }}>
            {t.txDetails}
          </div>
          <div className="rz-num rz-display" style={{
            marginTop: 6, fontSize: 34, fontWeight: 700, color: 'var(--rz-ink-950)', letterSpacing: -1.2, lineHeight: 1.05,
          }}>
            {fmtSum(tx.amount)} <span style={{ fontSize: 15, color: 'var(--rz-ink-400)', letterSpacing: 0, fontWeight: 600 }}>{t.soum}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <RzStatusBadge status={tx.status} t={t}/>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close" style={{
          width: 36, height: 36, borderRadius: 12, background: 'var(--rz-paper-2)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}><Icon name="close" size={18}/></button>
      </div>

      <div className="rz-card" style={{ padding: 0, overflow: 'hidden' }}>
        {[
          { k: t.requested,  v: `${fmtSum(tx.amount)} ${t.soum}`, mono: true },
          { k: t.commission, v: `−${fmtSum(commission)} ${t.soum}`, mono: true },
          { k: t.willReceive, v: `${fmtSum(tx.amount - commission)} ${t.soum}`, mono: true, bold: true },
          { k: t.recvCard,   v: (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 28, height: 18, borderRadius: 4,
                background: tx.cardBrand === 'humo' ? 'var(--rz-humo)' : 'var(--rz-uzcard)',
                color: 'white', fontSize: 9, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{tx.cardBrand === 'humo' ? 'H' : 'UC'}</span>
              <span className="rz-num">{tx.cardBrand === 'humo' ? 'Humo' : 'Uzcard'} · •••• {tx.last4}</span>
            </span>
          ) },
          { k: t.txTime,     v: tx.timeFull, mono: true },
          { k: t.txId,       v: tx.id, mono: true, small: true },
        ].map((r, i) => (
          <div key={i} style={{
            padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
            borderTop: i ? '1px solid var(--rz-line-soft)' : 'none',
          }}>
            <div style={{ fontSize: 13, color: 'var(--rz-ink-600)', fontWeight: 500 }}>{r.k}</div>
            <div style={{
              fontSize: r.small ? 12 : 14,
              fontWeight: r.bold ? 800 : 600,
              color: r.bold ? 'var(--rz-green-700)' : 'var(--rz-ink-950)',
              fontVariantNumeric: r.mono ? 'tabular-nums' : 'normal',
              letterSpacing: r.mono ? 0.2 : 0,
              textAlign: 'right',
              maxWidth: '60%',
              wordBreak: 'break-all',
            }}>{r.v}</div>
          </div>
        ))}
      </div>

      <button className="rz-btn rz-btn-ghost" style={{ marginTop: 16 }}>
        <Icon name="download" size={18} stroke={2}/>
        {t.receipt}
      </button>
    </RzSheet>
  );
}

// Info sheet — how the limit is calculated
function HowCalcSheet({ open, onClose, t, lang }) {
  if (!open) return null;
  return (
    <RzSheet open={open} onClose={onClose}>
      <div style={{
        width: 56, height: 56, borderRadius: 18,
        background: 'var(--rz-green-50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
      }}><Icon name="spark" size={26} color="var(--rz-green-700)"/></div>
      <h3 className="rz-display" style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: 'var(--rz-ink-950)', letterSpacing: -0.5 }}>{t.howCalc}</h3>
      <p style={{
        margin: '0 0 16px', color: 'var(--rz-ink-600)',
        fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-line',
      }}>{t.howCalcBody}</p>
      <div className="rz-card" style={{ padding: 14, marginBottom: 14, background: 'var(--rz-paper-2)' }}>
        <div className="rz-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--rz-ink-800)', lineHeight: 1.8 }}>
          {lang === 'ru' ? 'дневная ставка' : 'kunlik stavka'} <span style={{ color: 'var(--rz-ink-400)' }}>×</span> {lang === 'ru' ? 'дни' : 'kunlar'}<br/>
          <span style={{ color: 'var(--rz-ink-400)' }}>×</span> {lang === 'ru' ? 'лимит 60%' : '60% limit'}<br/>
          <span style={{ color: 'var(--rz-ink-400)' }}>−</span> {lang === 'ru' ? 'налоги' : 'soliqlar'}
        </div>
      </div>
      <button className="rz-btn" onClick={onClose}>{t.gotIt}</button>
    </RzSheet>
  );
}

Object.assign(window, { HistoryScreen, TxDetailsSheet, HowCalcSheet });
