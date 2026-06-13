// Profile screen — modern, visual

function ProfileScreen({ t, lang, user, onBack, settings, onSet, onLogout }) {
  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar onBack={onBack} title={t.nav_profile}/>
      <div className="rz-scroll" style={{ padding: '8px 20px 110px' }}>

        {/* Identity hero */}
        <IdentityHero user={user} lang={lang} t={t}/>

        {/* Personal data */}
        <Section icon="user" label={t.personalData}>
          <Row k={t.fio}        v={user.fio}/>
          <Row k={t.position}   v={lang === 'ru' ? 'Старший менеджер' : 'Katta menejer'}/>
          <Row k={t.department} v={lang === 'ru' ? 'Отдел продаж' : 'Sotuv boʻlimi'}/>
          <Row k={t.employer}   v="Texnomart"/>
          <Row k={t.pinfl}      v="*********0418" mono/>
          <Row k={t.phoneLabel} v="+998 90 123-45-67" mono/>
        </Section>

        {/* Settings */}
        <Section icon="spark" label={t.settings}>
          <RowSegmented
            k={t.language}
            value={settings.lang}
            options={[{ id: 'uz', label: 'Oʻzbekcha' }, { id: 'ru', label: 'Русский' }]}
            onChange={(v) => onSet('lang', v)}
          />
        </Section>

        {/* Notifications */}
        <Section icon="bell" label={t.notifications}>
          <ToggleRow
            k={t.notif_balance}
            sub={t.notif_balance_sub}
            value={settings.notifBalance}
            onChange={(v) => onSet('notifBalance', v)}
          />
          <ToggleRow
            k={t.notif_confirm}
            sub={t.notif_confirm_sub}
            value={settings.notifConfirm}
            onChange={(v) => onSet('notifConfirm', v)}
          />
        </Section>

        {/* Support links */}
        <Section icon="doc" label={lang === 'ru' ? 'Документы' : 'Hujjatlar'}>
          <LinkRow icon="doc"    label={lang === 'ru' ? 'Договор микрозайма' : 'Mikroqarz shartnomasi'}/>
          <LinkRow icon="shield" label={lang === 'ru' ? 'Публичная оферта' : 'Ommaviy oferta'}/>
          <LinkRow icon="lock"   label={lang === 'ru' ? 'Политика конфиденциальности' : 'Maxfiylik siyosati'}/>
        </Section>

        <button onClick={onLogout} style={{
          marginTop: 12, width: '100%', padding: '14px 0',
          fontWeight: 700, fontSize: 14, color: 'var(--rz-red)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          borderRadius: 16,
        }}>
          <Icon name="logout" size={16} stroke={2}/>
          {t.logout}
        </button>

        <div style={{
          textAlign: 'center', marginTop: 12,
          fontSize: 11, color: 'var(--rz-ink-400)', fontVariantNumeric: 'tabular-nums',
          fontFamily: 'var(--font-mono)',
        }}>rizq · v2.4.0 · build 20260612</div>
      </div>
    </div>
  );
}

function IdentityHero({ user, lang, t }) {
  return (
    <div className="rz-fade-up" style={{
      position: 'relative',
      borderRadius: 24, padding: 22,
      background: 'var(--rz-ink-950)', color: 'white',
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      {/* sparkle accents */}
      <span style={{ position: 'absolute', right: -30, top: -50 }}>
        <RzSparkle size={180} color="rgba(255,255,255,0.05)"/>
      </span>
      <span style={{ position: 'absolute', left: -40, bottom: -60 }}>
        <RzSparkle size={140} color="oklch(0.70 0.22 148 / 0.18)"/>
      </span>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: 'linear-gradient(135deg, var(--rz-green-500) 0%, var(--rz-green-700) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: 26, letterSpacing: -0.6,
          fontFamily: 'var(--font-display)',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 12px 28px oklch(0.62 0.22 148 / 0.45)',
        }}>
          <span style={{ position: 'absolute', top: -8, right: -8, opacity: 0.5 }}>
            <RzSparkle size={36} color="white"/>
          </span>
          <span style={{ position: 'relative' }}>{user.initials}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="rz-display" style={{
            fontSize: 22, fontWeight: 700, color: 'white', letterSpacing: -0.6,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{user.fio}</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
            {lang === 'ru' ? 'Старший менеджер' : 'Katta menejer'} · Texnomart
          </div>
          <div style={{
            marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'oklch(0.62 0.22 148 / 0.18)', color: 'var(--rz-green-500)',
            padding: '4px 10px 4px 8px', borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: -0.1,
          }}>
            <Icon name="shield" size={12} stroke={2.4}/>
            {t.verified} · MyID
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsRow({ lang, t }) {
  const stats = [
    {
      label: lang === 'ru' ? 'Получено за 2026' : '2026 yil',
      value: '14.2M',
      sub: t.soum,
      accent: 'green',
    },
    {
      label: lang === 'ru' ? 'Выводов' : 'Yechishlar',
      value: '38',
      sub: lang === 'ru' ? 'операций' : 'amal',
      accent: 'violet',
    },
    {
      label: lang === 'ru' ? 'Сэкономлено' : 'Tejaldi',
      value: '420K',
      sub: t.soum,
      accent: 'amber',
    },
  ];
  return (
    <div className="rz-fade-up-2" style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18,
    }}>
      {stats.map((s, i) => (
        <div key={i} className="rz-card" style={{ padding: 12, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            fontSize: 10, color: 'var(--rz-ink-400)', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: 0.6,
            lineHeight: 1.2,
          }}>{s.label}</div>
          <div className="rz-num" style={{
            marginTop: 8, fontSize: 22, fontWeight: 700, letterSpacing: -0.8, lineHeight: 1,
            color: 'var(--rz-ink-950)',
          }}>{s.value}</div>
          <div style={{
            marginTop: 4, fontSize: 11, color: 'var(--rz-ink-400)', fontWeight: 600,
          }}>{s.sub}</div>
          <span style={{
            position: 'absolute', top: 12, right: 12,
            width: 6, height: 6, borderRadius: 999,
            background: s.accent === 'green' ? 'var(--rz-green-500)' :
                        s.accent === 'violet' ? 'oklch(0.65 0.20 285)' :
                        'oklch(0.72 0.16 78)',
          }}/>
        </div>
      ))}
    </div>
  );
}

function Section({ label, icon, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 4px 10px',
      }}>
        {icon && <Icon name={icon} size={13} color="var(--rz-ink-400)" stroke={2}/>}
        <div style={{
          fontSize: 11.5, fontWeight: 700, color: 'var(--rz-ink-600)',
          textTransform: 'uppercase', letterSpacing: 1.4,
        }}>{label}</div>
      </div>
      <div className="rz-card">{children}</div>
    </div>
  );
}

function Row({ k, v, mono }) {
  return (
    <div style={{
      padding: '14px 16px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
      borderTop: '1px solid var(--rz-line-soft)',
    }} className="rz-row">
      <div style={{ fontSize: 13.5, color: 'var(--rz-ink-600)' }}>{k}</div>
      <div style={{
        fontSize: 14, fontWeight: 600, color: 'var(--rz-ink-950)',
        fontVariantNumeric: mono ? 'tabular-nums' : 'normal',
        letterSpacing: mono ? 0.3 : -0.1,
        fontFamily: mono ? 'var(--font-display)' : 'inherit',
      }}>{v}</div>
    </div>
  );
}

function RowSegmented({ k, value, options, onChange }) {
  return (
    <div style={{
      padding: '14px 14px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      borderTop: '1px solid var(--rz-line-soft)',
    }}>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--rz-ink-600)', flexShrink: 0 }}>{k}</div>
      <div style={{
        display: 'inline-grid', gridTemplateColumns: `repeat(${options.length}, auto)`,
        background: 'var(--rz-paper-2)', borderRadius: 10, padding: 3, gap: 3,
      }}>
        {options.map(o => {
          const isActive = value === o.id;
          return (
            <button key={o.id} onClick={() => onChange(o.id)} style={{
              padding: '6px 12px', borderRadius: 8,
              background: isActive ? 'var(--rz-card)' : 'transparent',
              boxShadow: isActive ? '0 1px 2px rgba(11,13,18,0.06), 0 3px 8px rgba(11,13,18,0.04)' : 'none',
              fontSize: 12.5, fontWeight: 600,
              color: isActive ? 'var(--rz-ink-950)' : 'var(--rz-ink-600)',
              transition: 'all .15s',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              letterSpacing: -0.1,
            }}>
              {o.icon && <Icon name={o.icon} size={12} stroke={2}/>}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleRow({ k, sub, value, onChange }) {
  return (
    <div style={{
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      borderTop: '1px solid var(--rz-line-soft)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--rz-ink-950)', letterSpacing: -0.1 }}>{k}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--rz-ink-600)', marginTop: 2, lineHeight: 1.4 }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!value)} role="switch" aria-checked={value} style={{
        width: 46, height: 28, borderRadius: 99,
        background: value ? 'var(--rz-green-600)' : 'var(--rz-ink-200)',
        position: 'relative', transition: 'background .2s',
        flexShrink: 0,
      }}>
        <span style={{
          position: 'absolute', top: 3, left: value ? 21 : 3,
          width: 22, height: 22, borderRadius: 99, background: 'white',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)',
          transition: 'left .2s',
        }}/>
      </button>
    </div>
  );
}

function LinkRow({ icon, label }) {
  return (
    <button style={{
      width: '100%', padding: '14px 16px', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 12,
      borderTop: '1px solid var(--rz-line-soft)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'var(--rz-paper-2)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}><Icon name={icon} size={15} color="var(--rz-ink-800)"/></div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--rz-ink-950)', letterSpacing: -0.1 }}>{label}</div>
      <Icon name="chevron-right" size={16} color="var(--rz-ink-400)"/>
    </button>
  );
}

// Stub screen for unimplemented nav
function StubScreen({ t, lang, title, onBack, icon = 'card', label }) {
  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar onBack={onBack} title={title}/>
      <div className="rz-scroll" style={{
        padding: 24, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 22,
          background: 'var(--rz-paper-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}><Icon name={icon} size={36} stroke={1.5} color="var(--rz-ink-400)"/></div>
        <div style={{ fontSize: 14, color: 'var(--rz-ink-600)', textAlign: 'center', maxWidth: 240 }}>
          {label || (lang === 'ru' ? 'Этот раздел в прототипе свёрнут' : 'Bu boʻlim prototipda yopilgan')}
        </div>
      </div>
    </div>
  );
}

// First row in section should not have top border
const rowFirstStyle = document.createElement('style');
rowFirstStyle.textContent = `.rz-card > .rz-row:first-child, .rz-card > div:first-child { border-top: none !important; } .rz-card > button:first-child { border-top: none !important; }`;
if (!document.getElementById('rz-row-first-style')) {
  rowFirstStyle.id = 'rz-row-first-style';
  document.head.appendChild(rowFirstStyle);
}

Object.assign(window, { ProfileScreen, StubScreen });
