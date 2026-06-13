// Home dashboard

function HomeScreen({ t, lang, user, balance, onAction, onTx, recentTxs, onOpenInfo, onNav }) {
  const pct = Math.round((balance.daysWorked / balance.daysTotal) * 100);
  return (
    <div className="rz-screen rz-paper-tex">
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px 6px',
      }}>
        <RzLogo size={28} />
        <button style={{
          width: 44, height: 44, borderRadius: 14,
          background: 'var(--rz-card)',
          border: '1px solid var(--rz-line-soft)', position: 'relative',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="bell" size={20} stroke={1.8} />
          <span style={{
            position: 'absolute', top: 9, right: 9,
            width: 8, height: 8, borderRadius: 999,
            background: 'var(--rz-green-500)',
            boxShadow: '0 0 0 2px var(--rz-card)',
          }}/>
        </button>
      </div>

      <div className="rz-scroll" style={{ padding: '14px 20px 110px' }}>
        {/* Main balance card */}
        <BalanceCard t={t} lang={lang} balance={balance} pct={pct} onWithdraw={() => onAction('withdraw')} onOpenInfo={onOpenInfo} />

        {/* Quick actions — colored tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
          <QuickAction icon="card"     onClick={() => onNav('cards')}
            title={lang === 'ru' ? 'Карты' : 'Kartalar'}
            sub="2 шт"
            tint="green"/>
          <QuickAction icon="download" onClick={() => onNav('history')}
            title={lang === 'ru' ? 'Квитанции' : 'Kvitansiyalar'}
            sub={lang === 'ru' ? 'PDF' : 'PDF'}
            tint="violet"/>
          <QuickAction icon="spark"    onClick={onOpenInfo}
            title={lang === 'ru' ? 'Лимит' : 'Limit'}
            sub="60%"
            tint="amber"/>
        </div>

        {/* Insight strip — runway / next salary */}
        <InsightStrip t={t} lang={lang} balance={balance}/>

        {/* Recent transactions */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          margin: '24px 4px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div className="rz-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--rz-ink-950)', letterSpacing: -0.4 }}>{t.recent}</div>
            <div style={{ fontSize: 12, color: 'var(--rz-ink-400)', fontWeight: 600 }}>{recentTxs.length}</div>
          </div>
          <button onClick={() => onNav('history')} style={{
            fontSize: 12.5, fontWeight: 600, color: 'var(--rz-ink-600)',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'var(--rz-paper-2)', padding: '6px 10px 6px 12px', borderRadius: 10,
          }}>
            {t.viewAll} <Icon name="chevron-right" size={13} stroke={2.4}/>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recentTxs.map((tx) => (
            <RzTxRowBig key={tx.id} tx={tx} t={t} lang={lang} onClick={() => onTx(tx)}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, title, sub, tint = 'green', onClick }) {
  const tints = {
    green:  { bg: 'oklch(0.96 0.04 148)', fg: 'var(--rz-green-700)' },
    violet: { bg: 'oklch(0.96 0.04 285)', fg: 'oklch(0.42 0.18 285)' },
    amber:  { bg: 'oklch(0.97 0.05 78)',  fg: 'oklch(0.42 0.14 70)' },
  }[tint];
  return (
    <button onClick={onClick} className="rz-card" style={{
      padding: '14px 14px 12px',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
      background: 'var(--rz-card)',
      position: 'relative', overflow: 'hidden',
      minHeight: 88,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 11,
        background: tints.bg, color: tints.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={18} stroke={2}/>
      </div>
      <div className="rz-num rz-display" style={{
        fontSize: 15, fontWeight: 700, color: 'var(--rz-ink-950)',
        letterSpacing: -0.3, lineHeight: 1,
      }}>{title}</div>
    </button>
  );
}

function InsightStrip({ t, lang, balance }) {
  const left = balance.daysTotal - balance.daysWorked;
  const dailyRate = Math.round(balance.totalSalary / balance.daysTotal);
  // simple sparkline values
  const points = [10, 22, 18, 30, 26, 38, 34, 46];
  const max = Math.max(...points);
  const W = 80, H = 28;
  const path = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * W} ${H - (v / max) * H}`).join(' ');
  return (
    <div className="rz-fade-up-3" style={{
      marginTop: 14, padding: 14,
      borderRadius: 18,
      background: 'var(--rz-ink-950)', color: 'white',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0 }}>
        <defs>
          <linearGradient id="rz-spark-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="oklch(0.70 0.22 148)" stopOpacity="0.5"/>
            <stop offset="1" stopColor="oklch(0.70 0.22 148)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={`${path} L ${W} ${H} L 0 ${H} Z`} fill="url(#rz-spark-fill)"/>
        <path d={path} stroke="var(--rz-green-500)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        {points.map((v, i) => i === points.length - 1 && (
          <circle key={i} cx={(i / (points.length - 1)) * W} cy={H - (v / max) * H} r="3" fill="var(--rz-green-500)"/>
        ))}
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2 }}>
          {lang === 'ru' ? 'Ежедневно копится' : 'Har kuni qoʻshiladi'}
        </div>
        <div className="rz-num" style={{
          marginTop: 2, fontSize: 18, fontWeight: 700, letterSpacing: -0.4,
        }}>
          +{fmtSum(dailyRate)} <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, letterSpacing: 0 }}>{t.soum}/{lang === 'ru' ? 'день' : 'kun'}</span>
        </div>
      </div>
      <div style={{
        padding: '6px 10px', borderRadius: 10,
        background: 'rgba(255,255,255,0.10)',
        fontSize: 11.5, fontWeight: 600,
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        <span style={{ color: 'var(--rz-green-500)', fontWeight: 700 }}>{left}</span> {lang === 'ru' ? 'дн.' : 'kun'}
      </div>
    </div>
  );
}

// Big modern tx row — used on home recent list
function RzTxRowBig({ tx, t, lang, onClick }) {
  const brandColor = tx.cardBrand === 'humo' ? 'var(--rz-humo)' : 'var(--rz-uzcard)';
  const brandBg = tx.cardBrand === 'humo'
    ? 'linear-gradient(135deg, oklch(0.68 0.22 148), oklch(0.40 0.18 152))'
    : 'linear-gradient(135deg, oklch(0.55 0.18 252), oklch(0.32 0.16 258))';
  return (
    <button onClick={onClick} className="rz-card" style={{
      padding: '14px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      textAlign: 'left',
    }}>
      {/* Mini card chip */}
      <div style={{
        width: 44, height: 32, borderRadius: 8,
        background: brandBg,
        color: 'white', flexShrink: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
        padding: 4,
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(11,13,18,0.12)',
      }}>
        <span style={{
          position: 'absolute', top: 5, left: 5,
          width: 10, height: 7, borderRadius: 2,
          background: 'oklch(0.85 0.06 80)',
        }}/>
        <span style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: 0.4, opacity: 0.9 }}>
          {tx.cardBrand === 'humo' ? 'HUMO' : 'UC'}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <div style={{
            fontWeight: 700, fontSize: 14.5, color: 'var(--rz-ink-950)', letterSpacing: -0.2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {tx.cardBrand === 'humo' ? 'Humo' : 'Uzcard'} <span style={{ color: 'var(--rz-ink-400)', fontWeight: 500 }} className="rz-num">•••{tx.last4}</span>
          </div>
          <div className="rz-num" style={{
            fontWeight: 700, fontSize: 15,
            color: tx.status === 'error' ? 'var(--rz-ink-400)' : 'var(--rz-ink-950)',
            textDecoration: tx.status === 'error' ? 'line-through' : 'none',
            whiteSpace: 'nowrap',
            letterSpacing: -0.3,
          }}>
            −{fmtSum(tx.amount)}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, alignItems: 'center' }}>
          <RzStatusBadge status={tx.status} t={t} mini/>
          <div style={{ fontSize: 11.5, color: 'var(--rz-ink-400)', fontWeight: 500 }}>{tx.timeShort}</div>
        </div>
      </div>
    </button>
  );
}

function BalanceCard({ t, lang, balance, pct, onWithdraw, onOpenInfo }) {
  return (
    <div className="rz-fade-up-2" style={{
      borderRadius: 28, padding: 22,
      background: 'radial-gradient(at 0% 0%, oklch(0.72 0.22 148) 0%, transparent 50%), linear-gradient(165deg, oklch(0.56 0.22 148) 0%, oklch(0.38 0.20 152) 100%)',
      color: 'white', position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 18px 36px oklch(0.55 0.22 148 / 0.30)',
    }}>
      {/* organic blobs */}
      <svg width="280" height="280" viewBox="0 0 280 280" style={{
        position: 'absolute', right: -80, top: -100, opacity: 0.18,
      }} aria-hidden>
        <circle cx="180" cy="100" r="100" fill="white"/>
        <circle cx="100" cy="180" r="60" fill="white"/>
      </svg>
      {/* sparkle accent */}
      <span style={{ position: 'absolute', right: -10, bottom: -20 }}>
        <RzSparkle size={160} color="rgba(255,255,255,0.10)" />
      </span>

      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, opacity: 0.85, textTransform: 'uppercase',
          letterSpacing: 1.2, fontWeight: 600,
        }}>
          {t.avail}
          <button onClick={onOpenInfo} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 18, height: 18, borderRadius: 99,
            background: 'rgba(255,255,255,0.18)',
          }} aria-label={t.howCalc}>
            <Icon name="info" size={12} stroke={2.2} color="white"/>
          </button>
        </div>
        <div className="rz-num" style={{
          marginTop: 8, fontSize: 44, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1,
        }}>
          {fmtSum(balance.available)}
          <span style={{ fontSize: 18, fontWeight: 600, marginLeft: 8, opacity: 0.85, letterSpacing: 0 }}>{t.soum}</span>
        </div>

        {/* progress bar */}
        <div style={{ marginTop: 22 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            fontSize: 12, opacity: 0.88, fontWeight: 600,
          }}>
            <span>{t.daysWorked}</span>
            <span className="rz-num"><strong style={{ fontSize: 14 }}>{balance.daysWorked}</strong> / {balance.daysTotal}</span>
          </div>
          <div style={{
            marginTop: 8, height: 8, borderRadius: 99,
            background: 'rgba(255,255,255,0.18)', overflow: 'hidden',
          }}>
            <div style={{
              width: `${pct}%`, height: '100%',
              background: 'linear-gradient(90deg, white, oklch(0.92 0.04 90))',
              borderRadius: 99,
            }}/>
          </div>
        </div>

        {/* small stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          marginTop: 18,
        }}>
          <MiniStat label={t.totalSalary} value={`${fmtSum(balance.totalSalary)}`} unit={t.soum} />
          <MiniStat label={t.alreadyOut}  value={`${fmtSum(balance.withdrawn)}`}    unit={t.soum} />
        </div>

        {/* withdraw button */}
        <button onClick={onWithdraw} style={{
          marginTop: 18, width: '100%', height: 54,
          borderRadius: 16, background: 'white', color: 'var(--rz-ink-950)',
          fontWeight: 700, fontSize: 16, letterSpacing: -0.1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 1px 0 rgba(255,255,255,0.4) inset, 0 6px 16px rgba(0,0,0,0.18)',
        }}>
          <Icon name="arrow-up" size={18} stroke={2.4} />
          {t.withdraw}
        </button>
      </div>
    </div>
  );
}

function MiniStat({ label, value, unit }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(4px)',
      borderRadius: 14, padding: '10px 12px',
    }}>
      <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>{label}</div>
      <div className="rz-num" style={{ marginTop: 4, fontSize: 15, fontWeight: 700 }}>
        {value} <span style={{ fontSize: 10, opacity: 0.75, fontWeight: 600 }}>{unit}</span>
      </div>
    </div>
  );
}

function NavTile({ icon, label, onClick }) {
  // legacy — no longer used (replaced by bottom tab bar + QuickAction)
  return null;
}

function RzTxRow({ tx, t, lang, onClick, divider }) {
  const colorByStatus = { done: 'var(--rz-green-700)', pending: 'oklch(0.40 0.13 70)', error: 'var(--rz-red)' };
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left',
      padding: '14px 14px',
      borderTop: divider ? '1px solid var(--rz-line-soft)' : 'none',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: 'var(--rz-paper-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name="arrow-up" size={18} color="var(--rz-ink-800)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <div style={{
            fontWeight: 700, fontSize: 14.5, color: 'var(--rz-ink-950)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {lang === 'ru' ? 'Вывод на ' : ''}{tx.cardBrand === 'humo' ? 'Humo' : 'Uzcard'} · •••{tx.last4}
          </div>
          <div className="rz-num" style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--rz-ink-950)', whiteSpace: 'nowrap' }}>
            {fmtSum(tx.amount)}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, alignItems: 'center' }}>
          <RzStatusBadge status={tx.status} t={t} mini/>
          <div style={{ fontSize: 11.5, color: 'var(--rz-ink-400)' }}>{tx.timeShort}</div>
        </div>
      </div>
    </button>
  );
}

Object.assign(window, { HomeScreen, RzTxRow });
