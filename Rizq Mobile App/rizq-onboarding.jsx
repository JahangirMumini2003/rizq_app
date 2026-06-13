// Onboarding flow:
//  phone → otp → pinfl → (employer found → kyc-intro → kyc-done → cabinet)
//                      (employer NOT found → employer-form → employer-submitted)

// ─────────────────────────────────────────────────────────────────────────
// Reusable atomic helpers
// ─────────────────────────────────────────────────────────────────────────

function OnbHero({ eyebrow, title, sub, sparkleTopRight = true }) {
  return (
    <div className="rz-fade-up" style={{ position: 'relative', paddingBottom: 4 }}>
      {sparkleTopRight && (
        <span style={{ position: 'absolute', right: -30, top: -10, zIndex: 0 }}>
          <RzSparkle size={120} color="oklch(0.96 0.04 148)"/>
        </span>
      )}
      <div style={{ position: 'relative' }}>
        {eyebrow && (
          <div style={{
            fontSize: 11, color: 'var(--rz-ink-400)',
            textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700,
            marginBottom: 8,
          }}>{eyebrow}</div>
        )}
        <h1 className="rz-display" style={{
          margin: 0, fontSize: 30, fontWeight: 700,
          color: 'var(--rz-ink-950)', letterSpacing: -1, lineHeight: 1.08,
        }}>{title}</h1>
        {sub && (
          <p style={{
            margin: '12px 0 0', color: 'var(--rz-ink-600)',
            fontSize: 14, lineHeight: 1.5,
          }}>{sub}</p>
        )}
      </div>
    </div>
  );
}

// Numeric "digit line" input — grouped, underlined, with a blinking caret.
// Reads like a real form field (not disconnected boxes).
function DigitField({ digits, groups = [4, 4, 4, 2], size = 26, gap = 12 }) {
  const cursor = digits.length;
  const total = groups.reduce((a, b) => a + b, 0);
  const complete = cursor >= total;
  let idx = 0;
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
      gap, flexWrap: 'wrap',
    }}>
      {groups.map((g, gi) => {
        const groupStart = idx;
        const cells = Array.from({ length: g }).map((_, i) => {
          const myIdx = idx++;
          const v = digits[myIdx];
          const isCursor = myIdx === cursor && !complete;
          return (
            <span key={i} style={{
              position: 'relative',
              minWidth: size * 0.62, textAlign: 'center',
              fontFamily: 'var(--font-display)', fontVariantNumeric: 'tabular-nums',
              fontSize: size, lineHeight: 1.15, fontWeight: 700, letterSpacing: 0.5,
              color: v ? 'var(--rz-ink-950)' : 'var(--rz-ink-200)',
              transition: 'color .12s',
            }}>
              {v || '•'}
              {isCursor && (
                <span className="rz-caret" style={{
                  position: 'absolute', left: '50%', bottom: 4,
                  transform: 'translateX(-50%)',
                  height: size * 0.78,
                }}/>
              )}
            </span>
          );
        });
        const groupEnd = idx;
        const isActive = !complete && cursor >= groupStart && cursor < groupEnd;
        const isFilled = cursor >= groupEnd;
        return (
          <div key={gi} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 9 }}>
            <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>{cells}</div>
            <div style={{
              height: isActive ? 2.5 : 2, borderRadius: 99,
              background: isActive
                ? 'var(--rz-green-600)'
                : (isFilled ? 'var(--rz-ink-300, var(--rz-ink-400))' : 'var(--rz-line)'),
              transition: 'background .15s, height .15s',
            }}/>
          </div>
        );
      })}
    </div>
  );
}

function NumPad({ onDigit, onBack, style }) {
  const rows = [['1','2','3'],['4','5','6'],['7','8','9'],['','0','⌫']];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, ...style }}>
      {rows.flat().map((k, i) => (
        <button
          key={i}
          onClick={() => { if (k === '⌫') onBack(); else if (k) onDigit(k); }}
          disabled={!k}
          style={{
            height: 50, borderRadius: 14,
            background: k ? 'transparent' : 'transparent',
            fontSize: k === '⌫' ? 20 : 22, fontWeight: 600,
            color: 'var(--rz-ink-950)',
            fontFamily: 'var(--font-display)', fontVariantNumeric: 'tabular-nums',
            cursor: k ? 'pointer' : 'default',
            transition: 'background .12s',
          }}
          onTouchStart={(e) => k && (e.currentTarget.style.background = 'var(--rz-paper-2)')}
          onTouchEnd={(e) => k && (e.currentTarget.style.background = 'transparent')}
        >{k}</button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Screen 1 — Phone
// ─────────────────────────────────────────────────────────────────────────
function PhoneScreen({ t, lang, onSubmit, onLangToggle }) {
  const [digits, setDigits] = React.useState('');
  const valid = digits.length === 9;
  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar
        title=""
        left={<RzLogo size={28}/>}
        right={
          <button onClick={onLangToggle} className="rz-chip" style={{ height: 32, padding: '0 10px' }}>
            <Icon name="globe" size={14} stroke={2} />
            {lang === 'ru' ? 'RU' : 'UZ'}
          </button>
        }
      />
      <div className="rz-scroll" style={{ padding: '8px 24px 16px' }}>
        <div style={{ marginTop: 16 }}>
          <OnbHero
            eyebrow={lang === 'ru' ? 'Шаг 1 из 3' : '1 / 3'}
            title={lang === 'ru' ? <>Зарплата —<br/>каждый день.</> : <>Maoshingiz —<br/>har kuni.</>}
            sub={t.appTag}
          />
        </div>

        {/* Phone display */}
        <div className="rz-fade-up-2" style={{ marginTop: 44 }}>
          <div style={{
            fontSize: 11, color: 'var(--rz-ink-400)',
            textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700,
            marginBottom: 18, textAlign: 'center',
          }}>{lang === 'ru' ? 'Номер телефона' : 'Telefon raqami'}</div>
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26,
                color: 'var(--rz-ink-400)', letterSpacing: 0.5, lineHeight: 1.15,
              }}>+998</span>
              <div style={{ height: 2, borderRadius: 99, background: 'var(--rz-line)' }}/>
            </div>
            <DigitField digits={digits} groups={[2, 3, 2, 2]} size={26}/>
          </div>
        </div>
      </div>

      {/* Numpad + CTA */}
      <div style={{ padding: '0 28px 16px' }}>
        <NumPad
          onDigit={(d) => setDigits(s => s.length < 9 ? s + d : s)}
          onBack={() => setDigits(s => s.slice(0, -1))}
          style={{ marginBottom: 12 }}
        />
        <button className="rz-btn" disabled={!valid} onClick={() => onSubmit(digits)}>
          {t.getCode}
          <Icon name="arrow-right" size={18} stroke={2.2}/>
        </button>
        <p style={{
          margin: '12px 4px 0', fontSize: 11, color: 'var(--rz-ink-400)',
          lineHeight: 1.45, textAlign: 'center',
        }}>{t.tos}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Screen 2 — OTP
// ─────────────────────────────────────────────────────────────────────────
function OtpScreen({ t, lang, phone, onBack, onSubmit }) {
  const [code, setCode] = React.useState('');
  const [seconds, setSeconds] = React.useState(59);
  React.useEffect(() => {
    const id = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(id);
  }, []);
  React.useEffect(() => {
    if (code.length === 4) setTimeout(() => onSubmit(code), 350);
  }, [code]);
  const masked = `+998 ${phone.slice(0,2)} ${phone.slice(2,5)} ${phone.slice(5,7)} ${phone.slice(7,9)}`;
  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar onBack={onBack} title="" right={
        <div className="rz-chip" style={{ height: 28, fontSize: 11, padding: '0 8px' }}>
          {lang === 'ru' ? 'Шаг 2 / 3' : '2 / 3'}
        </div>
      }/>
      <div className="rz-scroll" style={{ padding: '8px 24px 24px' }}>
        <div style={{ marginTop: 8 }}>
          <OnbHero
            eyebrow={lang === 'ru' ? 'SMS-код' : 'SMS-kod'}
            title={t.enterCode}
            sub={<>{t.sentTo} <strong style={{ color: 'var(--rz-ink-950)', fontFamily: 'var(--font-display)' }}>{masked}</strong></>}
          />
        </div>

        <div className="rz-fade-up-2" style={{ marginTop: 36 }}>
          <RzOtpInput value={code} onChange={setCode}/>
        </div>

        <div className="rz-fade-up-3" style={{
          marginTop: 28, textAlign: 'center', fontSize: 13, color: 'var(--rz-ink-600)',
        }}>
          {seconds > 0 ? (
            <>{t.resendIn} <span className="rz-num" style={{ color: 'var(--rz-ink-950)', fontWeight: 700 }}>00:{seconds.toString().padStart(2, '0')}</span></>
          ) : (
            <button onClick={() => setSeconds(59)} style={{
              color: 'var(--rz-green-700)', fontWeight: 700, fontSize: 14,
            }}>{t.resend}</button>
          )}
        </div>

        <button
          onClick={() => { setCode('1234'); }}
          style={{
            margin: '32px auto 0', display: 'block',
            padding: '10px 14px',
            border: '1px dashed var(--rz-line)', borderRadius: 12,
            fontSize: 12, color: 'var(--rz-ink-600)', fontWeight: 600,
          }}
        >{lang === 'ru' ? 'Демо-код' : 'Demo kod'} · 1 2 3 4</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Screen 3 — PINFL (employer lookup)
// ─────────────────────────────────────────────────────────────────────────
function PinflScreen({ t, lang, onBack, onResult, simFound = true }) {
  const [digits, setDigits] = React.useState('');
  const [checking, setChecking] = React.useState(false);
  const [error, setError] = React.useState(false);
  const valid = digits.length === 14;

  const check = () => {
    setError(false);
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      // simulation: if last digit is even AND simFound is true → found; otherwise not found
      const found = simFound;
      onResult({ found, pinfl: digits });
    }, 1600);
  };

  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar onBack={onBack} title="" right={
        <div className="rz-chip" style={{ height: 28, fontSize: 11, padding: '0 8px' }}>
          {lang === 'ru' ? 'Шаг 3 / 3' : '3 / 3'}
        </div>
      }/>

      <div className="rz-scroll" style={{ padding: '8px 24px 16px' }}>
        <OnbHero
          eyebrow={lang === 'ru' ? 'Идентификация' : 'Identifikatsiya'}
          title={lang === 'ru' ? 'Введите ваш ПИНФЛ' : 'PINFL kiriting'}
          sub={lang === 'ru'
            ? 'Найдём вашего работодателя в базе Rizq и подключим зарплату 24/7.'
            : 'Ish beruvchingizni Rizq bazasidan topib, 24/7 maoshni ulaymiz.'}
        />

        {/* 14-digit PINFL display */}
        <div className="rz-fade-up-2" style={{ marginTop: 34 }}>
          <div style={{
            fontSize: 11, color: 'var(--rz-ink-400)',
            textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700,
            marginBottom: 18, textAlign: 'center',
          }}>{lang === 'ru' ? '14 цифр паспорта' : 'Pasportdagi 14 raqam'}</div>
          <DigitField digits={digits} groups={[5, 7, 2]} size={21} gap={10}/>
        </div>

        {/* Helper */}
        <div className="rz-fade-up-3" style={{
          marginTop: 22, padding: 12, borderRadius: 14,
          background: 'var(--rz-paper-2)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="info" size={16} color="var(--rz-ink-600)" stroke={2}/>
          <div style={{ flex: 1, fontSize: 12, color: 'var(--rz-ink-600)', lineHeight: 1.45 }}>
            {lang === 'ru'
              ? 'ПИНФЛ — 14-значный номер на обороте паспорта.'
              : 'PINFL — pasport orqasidagi 14 xonali raqam.'}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 28px 16px' }}>
        <NumPad
          onDigit={(d) => setDigits(s => s.length < 14 ? s + d : s)}
          onBack={() => setDigits(s => s.slice(0, -1))}
          style={{ marginBottom: 12 }}
        />
        <button className="rz-btn" disabled={!valid || checking} onClick={check}>
          {checking ? (
            <>
              <svg className="rz-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
                <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              {lang === 'ru' ? 'Ищем работодателя…' : 'Ish beruvchi izlanmoqda…'}
            </>
          ) : (
            <>
              {lang === 'ru' ? 'Проверить' : 'Tekshirish'}
              <Icon name="arrow-right" size={18} stroke={2.2}/>
            </>
          )}
        </button>
        <button
          onClick={() => setDigits('30912345678901')}
          style={{
            margin: '12px auto 0', display: 'block', padding: '8px 12px',
            border: '1px dashed var(--rz-line)', borderRadius: 12,
            fontSize: 11.5, color: 'var(--rz-ink-600)', fontWeight: 600,
          }}
        >{lang === 'ru' ? 'Демо ПИНФЛ' : 'Demo PINFL'}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Screen 4A — Employer FOUND
// ─────────────────────────────────────────────────────────────────────────
function EmployerFoundScreen({ t, lang, onBack, onSubmit }) {
  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar onBack={onBack} title="" right={
        <div className="rz-chip" style={{ height: 28, fontSize: 11, padding: '0 8px' }}>
          {lang === 'ru' ? 'Шаг 3 / 3' : '3 / 3'}
        </div>
      }/>
      <div className="rz-scroll" style={{ padding: '4px 24px 16px' }}>

        {/* ── Premium match card ─────────────────────────────── */}
        <div className="rz-fade-up" style={{
          marginTop: 8, borderRadius: 26, overflow: 'hidden',
          background: 'linear-gradient(160deg, #14181f 0%, #0b0d12 60%)',
          color: 'white', position: 'relative',
          boxShadow: '0 20px 44px rgba(11,13,18,0.30)',
        }}>
          <span style={{ position: 'absolute', right: -28, top: -28, zIndex: 0 }}>
            <RzSparkle size={150} color="oklch(0.70 0.22 148 / 0.16)"/>
          </span>
          <span style={{ position: 'absolute', left: -24, bottom: -34, zIndex: 0 }}>
            <RzSparkle size={92} color="oklch(0.70 0.22 148 / 0.08)"/>
          </span>

          <div style={{ position: 'relative', padding: '22px 22px 24px' }}>
            <div style={{
              fontSize: 10.5, fontWeight: 800, letterSpacing: 1.6,
              textTransform: 'uppercase', color: 'var(--rz-green-400)',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <Icon name="spark" size={13} color="var(--rz-green-400)"/>
              {lang === 'ru' ? 'Совпадение в базе Rizq' : 'Rizq bazasida topildi'}
            </div>

            {/* connection: you ←✓→ employer */}
            <div style={{
              marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 0, position: 'relative',
            }}>
              {/* you */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 84, zIndex: 1 }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 18,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'white',
                }}>ЮБ</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
                  {lang === 'ru' ? 'Вы' : 'Siz'}
                </div>
              </div>

              {/* link line */}
              <div style={{ flex: 1, position: 'relative', height: 54, margin: '0 -8px' }}>
                <svg width="100%" height="2" viewBox="0 0 100 2" preserveAspectRatio="none"
                  style={{ position: 'absolute', top: 21, left: 0 }}>
                  <line className="rz-link-line" x1="0" y1="1" x2="100" y2="1"
                    stroke="oklch(0.70 0.22 148)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className="rz-pop" style={{
                  position: 'absolute', top: 22, left: '50%', transform: 'translate(-50%,-50%)',
                  width: 28, height: 28, borderRadius: 999, background: 'var(--rz-green-500)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px oklch(0.62 0.22 148 / 0.55)', zIndex: 2,
                }}>
                  <Icon name="check" size={15} stroke={3.2} color="#0b0d12"/>
                </div>
              </div>

              {/* employer */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 84, zIndex: 1, position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <span className="rz-pulse-ring" style={{
                    position: 'absolute', inset: 0, borderRadius: 18,
                    border: '2px solid oklch(0.70 0.22 148)',
                  }}/>
                  <div style={{
                    width: 54, height: 54, borderRadius: 18,
                    background: 'linear-gradient(150deg, var(--rz-green-500), var(--rz-green-700))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'white',
                    boxShadow: '0 6px 18px oklch(0.62 0.22 148 / 0.40)',
                  }}>T</div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
                  {lang === 'ru' ? 'Работодатель' : 'Ish beruvchi'}
                </div>
              </div>
            </div>

            {/* employer name */}
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <div className="rz-display" style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.6, color: 'white' }}>
                Texnomart LLC
              </div>
              <div style={{
                marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '6px 12px', borderRadius: 999,
                background: 'oklch(0.70 0.22 148 / 0.14)', color: 'var(--rz-green-400)',
                fontSize: 11.5, fontWeight: 700,
              }}>
                <Icon name="check" size={13} stroke={3}/>
                {lang === 'ru' ? 'Подключён · зарплата 24/7' : 'Ulangan · maosh 24/7'}
              </div>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div style={{ marginTop: 22 }}>
          <OnbHero
            eyebrow={lang === 'ru' ? 'Остался один шаг' : 'Bitta qadam qoldi'}
            title={lang === 'ru' ? 'Подтвердите личность' : 'Shaxsingizni tasdiqlang'}
            sub={t.kycBody}
            sparkleTopRight={false}
          />
        </div>

        {/* What we'll pull */}
        <div className="rz-card rz-fade-up-3" style={{ marginTop: 18 }}>
          {[
            { ic: 'shield', tr: lang === 'ru' ? 'Госуслуги MyID' : 'Davlat xizmati MyID', sub: lang === 'ru' ? 'Биометрия и паспорт' : 'Biometriya va pasport' },
            { ic: 'doc',    tr: lang === 'ru' ? 'Подгрузим из 1С' : '1S dan yuklab olamiz',  sub: lang === 'ru' ? 'Должность, ставка, ПИНФЛ' : 'Lavozim, stavka, PINFL' },
            { ic: 'lock',   tr: lang === 'ru' ? 'Ничего не передадим третьим лицам' : 'Uchinchi shaxslarga bermaymiz', sub: lang === 'ru' ? 'PCI DSS, 152-ФЗ' : 'PCI DSS' },
          ].map((r, i) => (
            <div key={i} style={{
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
              borderTop: i ? '1px solid var(--rz-line-soft)' : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 11,
                background: 'var(--rz-paper-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}><Icon name={r.ic} size={18} color="var(--rz-ink-800)" stroke={1.8}/></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--rz-ink-950)' }}>{r.tr}</div>
                <div style={{ fontSize: 12, color: 'var(--rz-ink-600)', marginTop: 2 }}>{r.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 24px 24px' }}>
        <button className="rz-btn rz-btn-green" onClick={onSubmit}>
          <Icon name="shield" size={18} stroke={2} color="white"/>
          {t.kycBtn}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Screen 4B — Employer NOT found
// ─────────────────────────────────────────────────────────────────────────
function EmployerNotFoundScreen({ t, lang, onBack, onSubmit }) {
  const [name, setName] = React.useState('');
  const [inn, setInn] = React.useState('');
  const [contact, setContact] = React.useState('');
  const valid = name.trim().length > 1;

  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar onBack={onBack} title=""/>
      <div className="rz-scroll" style={{ padding: '8px 24px 16px' }}>
        {/* Empty/sorry state */}
        <div className="rz-fade-up" style={{
          padding: 20, borderRadius: 22,
          background: 'var(--rz-ink-950)', color: 'white',
          position: 'relative', overflow: 'hidden',
          marginTop: 12,
        }}>
          <span style={{ position: 'absolute', right: -30, top: -30 }}>
            <RzSparkle size={140} color="rgba(255,255,255,0.05)"/>
          </span>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'oklch(0.72 0.16 78 / 0.18)', color: 'oklch(0.85 0.14 78)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
            }}>
              <Icon name="info" size={22}/>
            </div>
            <div className="rz-display" style={{
              fontSize: 22, fontWeight: 700, letterSpacing: -0.6, lineHeight: 1.15,
            }}>{lang === 'ru'
              ? <>Ваш работодатель ещё<br/>не подключён к Rizq</>
              : <>Ish beruvchingiz hali<br/>Rizq ga ulanmagan</>}</div>
            <p style={{ margin: '10px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
              {lang === 'ru'
                ? 'Оставьте его контакты — наши менеджеры свяжутся в течение 3 дней и предложат подключение бесплатно.'
                : 'Uning kontaktlarini qoldiring — menejerlarimiz 3 kun ichida bog‘lanib, bepul ulanishni taklif qiladi.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="rz-fade-up-2" style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field
            label={lang === 'ru' ? 'Название компании' : 'Kompaniya nomi'}
            placeholder="Texnomart LLC"
            value={name} onChange={setName}
            icon="doc"
          />
          <Field
            label={lang === 'ru' ? 'ИНН (необязательно)' : 'INN (ixtiyoriy)'}
            placeholder="•••• •••• ••"
            value={inn} onChange={(v) => setInn(v.replace(/\D/g, '').slice(0, 9))}
            mono inputMode="numeric"
            icon="card"
          />
          <Field
            label={lang === 'ru' ? 'Телефон HR / отдела кадров' : 'HR telefoni'}
            placeholder="+998 ••"
            value={contact} onChange={setContact}
            icon="phone"
          />
        </div>

        {/* What happens next */}
        <div style={{
          marginTop: 18,
          padding: 14, borderRadius: 14,
          background: 'var(--rz-paper-2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="clock" size={14} color="var(--rz-ink-600)" stroke={2}/>
            <div style={{
              fontSize: 11, color: 'var(--rz-ink-400)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1.2,
            }}>{lang === 'ru' ? 'Что дальше' : 'Keyin nima'}</div>
          </div>
          <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--rz-ink-600)', lineHeight: 1.5 }}>
            {lang === 'ru' ? (
              <>Менеджер свяжется по указанному номеру, презентует Rizq и подключит работодателя за <strong style={{ color: 'var(--rz-ink-950)' }}>2–5 рабочих дней</strong>. Вы получите push, когда станете доступны.</>
            ) : (
              <>Menejer ko‘rsatilgan raqamga bog‘lanib, Rizq ni taqdim qiladi va ish beruvchini <strong style={{ color: 'var(--rz-ink-950)' }}>2–5 ish kunida</strong> ulaydi. Mavjud bo‘lganingizda push olasiz.</>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 24px 24px' }}>
        <button className="rz-btn" disabled={!valid} onClick={() => onSubmit({ name, inn, contact })}>
          <Icon name="arrow-right" size={18} stroke={2.2} color={valid ? 'white' : 'var(--rz-ink-400)'}/>
          {lang === 'ru' ? 'Отправить запрос' : 'Soʻrov yuborish'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, icon, mono, inputMode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--rz-ink-600)', marginBottom: 6, paddingLeft: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </label>
      <div style={{
        height: 56, borderRadius: 14,
        border: '1.5px solid var(--rz-line)',
        background: 'var(--rz-card)',
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
        transition: 'border-color .15s',
      }}>
        {icon && <Icon name={icon} size={18} color="var(--rz-ink-400)" stroke={1.8}/>}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 16, fontWeight: 600,
            background: 'transparent', color: 'var(--rz-ink-950)',
            fontFamily: mono ? 'var(--font-display)' : 'inherit',
            fontVariantNumeric: mono ? 'tabular-nums' : 'normal',
            letterSpacing: mono ? 0.5 : -0.1,
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Screen 5B — Employer onboarding request submitted
// ─────────────────────────────────────────────────────────────────────────
function EmployerSubmittedScreen({ t, lang, employer, onRestart }) {
  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar title=""/>
      <div className="rz-scroll" style={{
        padding: '24px 24px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div className="rz-pop" style={{
          width: 96, height: 96, borderRadius: 999,
          background: 'var(--rz-green-600)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '20px 0 24px',
          boxShadow: '0 12px 30px oklch(0.62 0.22 148 / 0.45)',
          position: 'relative',
        }}>
          <svg className="rz-tick" width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ position: 'absolute', inset: -10, borderRadius: 999, border: '2px solid oklch(0.62 0.22 148 / 0.30)', animation: 'rz-ripple 1.8s ease-out infinite' }}/>
        </div>
        <h1 className="rz-display rz-fade-up-2" style={{
          fontSize: 28, fontWeight: 700, margin: '0 0 8px', textAlign: 'center', letterSpacing: -0.8,
        }}>{lang === 'ru' ? 'Запрос отправлен' : 'Soʻrov yuborildi'}</h1>
        <p className="rz-fade-up-2" style={{
          margin: '0 0 22px', textAlign: 'center', color: 'var(--rz-ink-600)',
          fontSize: 14, lineHeight: 1.5, maxWidth: 320,
        }}>
          {lang === 'ru'
            ? <>Спасибо! Мы свяжемся с <strong style={{ color: 'var(--rz-ink-950)' }}>{employer.name || 'вашим работодателем'}</strong> в ближайшие дни и пришлём push, когда вы сможете пользоваться Rizq.</>
            : <>Rahmat! <strong style={{ color: 'var(--rz-ink-950)' }}>{employer.name || 'Ish beruvchingiz'}</strong> bilan kunlar ichida bog‘lanamiz.</>
          }
        </p>

        {/* Timeline */}
        <div className="rz-card rz-fade-up-3" style={{ width: '100%', padding: 18 }}>
          {[
            { ok: true,  k: lang === 'ru' ? 'Запрос принят' : 'Soʻrov qabul qilindi', sub: lang === 'ru' ? 'Сейчас' : 'Hozir' },
            { ok: false, k: lang === 'ru' ? 'Связываемся с HR' : 'HR bilan bogʻlanish', sub: '2–3 ' + (lang === 'ru' ? 'дн.' : 'kun') },
            { ok: false, k: lang === 'ru' ? 'Подключение Rizq' : 'Rizq ulanmoqda',      sub: '2–5 ' + (lang === 'ru' ? 'дн.' : 'kun') },
            { ok: false, k: lang === 'ru' ? 'Push: можно пользоваться' : 'Push: foydalanish mumkin', sub: lang === 'ru' ? 'когда готово' : 'tayyor boʻlganda' },
          ].map((s, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              position: 'relative',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 999,
                background: s.ok ? 'var(--rz-green-600)' : 'var(--rz-paper-2)',
                color: 'white',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 2,
                border: s.ok ? 'none' : '1.5px solid var(--rz-line)',
                position: 'relative', zIndex: 1,
              }}>
                {s.ok && <Icon name="check" size={12} stroke={3} color="white"/>}
              </div>
              {i < arr.length - 1 && (
                <span style={{
                  position: 'absolute', left: 10.5, top: 22,
                  width: 1, height: 36,
                  background: 'var(--rz-line)',
                }}/>
              )}
              <div style={{ paddingBottom: i < arr.length - 1 ? 18 : 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.ok ? 'var(--rz-ink-950)' : 'var(--rz-ink-600)' }}>{s.k}</div>
                <div style={{ fontSize: 11.5, color: 'var(--rz-ink-400)', marginTop: 2, fontWeight: 600 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '12px 24px 24px' }}>
        <button className="rz-btn rz-btn-ghost" onClick={onRestart}>
          {lang === 'ru' ? 'Выйти' : 'Chiqish'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Screen 5A — KYC intro (MyID)
// ─────────────────────────────────────────────────────────────────────────
function KycIntroScreen({ t, lang, onBack, onSubmit }) {
  const [loading, setLoading] = React.useState(false);
  const start = () => { setLoading(true); setTimeout(onSubmit, 1600); };
  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar onBack={onBack} title=""/>
      <div className="rz-scroll" style={{
        padding: '24px 24px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div className="rz-fade-up" style={{
          width: 116, height: 116, borderRadius: 32,
          background: 'var(--rz-ink-950)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          margin: '12px 0 22px',
        }}>
          <span style={{ position: 'absolute', top: -16, right: -16 }}>
            <RzSparkle size={72} color="oklch(0.70 0.22 148 / 0.5)"/>
          </span>
          <span style={{ position: 'absolute', bottom: -20, left: -20 }}>
            <RzSparkle size={56} color="oklch(0.70 0.22 148 / 0.25)"/>
          </span>
          <Icon name="shield" size={52} stroke={1.4} color="white"/>
        </div>
        <div className="rz-display rz-fade-up-2" style={{
          fontSize: 26, fontWeight: 700, letterSpacing: -0.8, textAlign: 'center', margin: 0, lineHeight: 1.15,
        }}>{lang === 'ru' ? 'Верификация через MyID' : 'MyID orqali verifikatsiya'}</div>
        <p className="rz-fade-up-2" style={{
          margin: '12px 0 0', fontSize: 14, color: 'var(--rz-ink-600)', textAlign: 'center', lineHeight: 1.5, maxWidth: 320,
        }}>{lang === 'ru'
          ? 'Сейчас перейдём в приложение MyID — нужно подтвердить себя биометрией. Это займёт меньше минуты.'
          : 'Hozir MyID ilovasiga oʻtamiz — oʻzingizni biometriya bilan tasdiqlash kerak.'}</p>

        {/* MyID badge */}
        <div className="rz-card rz-fade-up-3" style={{ marginTop: 22, padding: 16, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'oklch(0.55 0.18 252)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, letterSpacing: -0.5,
            }}>ID</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--rz-ink-950)' }}>MyID</div>
              <div style={{ fontSize: 12, color: 'var(--rz-ink-600)', marginTop: 2 }}>
                {lang === 'ru' ? 'Официальный сервис госуслуг РУз' : 'Rasmiy davlat xizmati'}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--rz-green-700)', fontWeight: 700 }}>
              <Icon name="lock" size={12} stroke={2.4}/>
              SSL
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 24px 24px' }}>
        <button className="rz-btn" onClick={start} disabled={loading}>
          {loading ? (
            <>
              <svg className="rz-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
                <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              {lang === 'ru' ? 'Открываем MyID…' : 'MyID ochilmoqda…'}
            </>
          ) : (
            <>{t.kycBtn}<Icon name="arrow-right" size={18} stroke={2.2} color="white"/></>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Screen 6A — KYC done (data pulled)
// ─────────────────────────────────────────────────────────────────────────
function KycDoneScreen({ t, lang, onSubmit }) {
  const fields = [
    { k: t.employer, v: 'Texnomart LLC' },
    { k: t.position, v: lang === 'ru' ? 'Старший менеджер' : 'Katta menejer' },
  ];
  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar title=""/>
      <div className="rz-scroll" style={{ padding: '14px 24px 16px' }}>

        {/* verified badge + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="rz-pop" style={{
            width: 52, height: 52, borderRadius: 999,
            background: 'var(--rz-green-600)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 22px oklch(0.62 0.22 148 / 0.40)', position: 'relative',
          }}>
            <span className="rz-pulse-ring" style={{
              position: 'absolute', inset: 0, borderRadius: 999,
              border: '2px solid var(--rz-green-500)',
            }}/>
            <svg className="rz-tick" width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="rz-fade-up">
            <h1 className="rz-display" style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: -0.7 }}>
              {t.kycDone}
            </h1>
            <div style={{ fontSize: 13, color: 'var(--rz-ink-600)', marginTop: 3 }}>
              {lang === 'ru' ? 'Данные из MyID и 1С' : 'MyID va 1S maʼlumotlari'}
            </div>
          </div>
        </div>

        {/* ── Digital ID credential ──────────────────────────── */}
        <div className="rz-fade-up-2 rz-sheen" style={{
          marginTop: 20, borderRadius: 24, overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(155deg, #1a2620 0%, #0b0d12 58%)',
          color: 'white', padding: '20px 22px 18px',
          boxShadow: '0 20px 44px rgba(11,13,18,0.32)',
        }}>
          <span style={{ position: 'absolute', right: -26, top: -30, zIndex: 0 }}>
            <RzSparkle size={150} color="oklch(0.70 0.22 148 / 0.14)"/>
          </span>
          <div style={{ position: 'relative' }}>
            {/* card header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <RzSparkle size={26} bg="var(--rz-green-500)" radius={8}/>
                <span className="rz-display" style={{
                  fontSize: 13, fontWeight: 700, letterSpacing: 2.5,
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)',
                }}>Rizq&nbsp;ID</span>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 9px', borderRadius: 999,
                background: 'oklch(0.70 0.22 148 / 0.18)', color: 'var(--rz-green-400)',
                fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
              }}>
                <Icon name="shield" size={12} stroke={2.4}/>
                {t.verified}
              </div>
            </div>

            {/* name */}
            <div style={{ marginTop: 22 }}>
              <div style={{
                fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 1.4,
              }}>{t.fio}</div>
              <div className="rz-display" style={{
                fontSize: 23, fontWeight: 700, letterSpacing: -0.4, marginTop: 4, color: 'white',
              }}>{lang === 'ru' ? 'Юлдашев Бобур' : 'Yoʻldashev Bobur'}</div>
            </div>

            {/* pinfl */}
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 1.4,
              }}>{t.pinfl}</div>
              <div className="rz-num" style={{
                fontSize: 18, fontWeight: 700, marginTop: 4, letterSpacing: 2,
                color: 'rgba(255,255,255,0.92)',
              }}>•••• •••• •••• 18</div>
            </div>

            {/* employer + position */}
            <div style={{
              marginTop: 18, paddingTop: 16, display: 'flex', gap: 18,
              borderTop: '1px solid rgba(255,255,255,0.10)',
            }}>
              {fields.map((f, i) => (
                <div key={i} style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: 1.2,
                  }}>{f.k}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, color: 'white' }}>{f.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Limit reveal ───────────────────────────────────── */}
        <div className="rz-fade-up-3" style={{
          marginTop: 14, borderRadius: 20, padding: '16px 18px',
          background: 'var(--rz-green-50)',
          border: '1px solid oklch(0.88 0.08 148)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: 'var(--rz-green-600)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="spark" size={20} color="white"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 11, color: 'var(--rz-green-700)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1,
            }}>{lang === 'ru' ? 'Лимит уже рассчитан' : 'Limit hisoblandi'}</div>
            <div className="rz-num" style={{
              fontSize: 22, fontWeight: 800, color: 'var(--rz-ink-950)', marginTop: 2,
            }}>{fmtSum(3450000)} <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--rz-ink-600)' }}>{t.soum}</span></div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 24px 24px' }}>
        <button className="rz-btn rz-btn-green" onClick={onSubmit}>
          {t.kycConfirm}
          <Icon name="arrow-right" size={18} stroke={2.2} color="white"/>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  PhoneScreen, OtpScreen, PinflScreen,
  EmployerFoundScreen, EmployerNotFoundScreen, EmployerSubmittedScreen,
  KycIntroScreen, KycDoneScreen,
});
