// Withdrawal flow: amount → card → review → sign → success

// Flat 3% of amount, regardless of card brand
const COMMISSION_RATE = 0.03;
const COMMISSION = (amount) => Math.round((amount || 0) * COMMISSION_RATE);

function StepHeader({ step, total, onBack, title }) {
  return (
    <>
      <RzTopBar onBack={onBack} title={title} right={
        <div className="rz-num" style={{
          fontSize: 12, fontWeight: 700, color: 'var(--rz-ink-400)',
          letterSpacing: 0.5,
          background: 'var(--rz-paper-2)',
          padding: '6px 10px', borderRadius: 10,
        }}>{step} / {total}</div>
      }/>
      <div className="rz-progress">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={i < step ? 'is-done' : ''} />
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Step 1 — amount
// ─────────────────────────────────────────────────────────────────────────
function WithdrawAmount({ t, lang, balance, value, onChange, onNext, onBack }) {
  const quick = [500000, 1000000];
  const max = balance.available;
  const commission = COMMISSION(value || 0);
  const receive = Math.max(0, (value || 0) - commission);
  const valid = value > 0 && value <= max;
  const pctUsed = Math.min(100, (value / max) * 100);

  const keyHandler = (k) => {
    if (k === '⌫') onChange(Math.floor((value || 0) / 10));
    else if (k === '000') {
      const next = (value || 0) * 1000;
      if (next <= 99999999) onChange(next);
    } else {
      const next = (value || 0) * 10 + parseInt(k, 10);
      if (next <= 99999999) onChange(next);
    }
  };

  return (
    <div className="rz-screen rz-paper-tex">
      <StepHeader step={1} total={3} onBack={onBack} title={t.chooseAmount}/>
      <div className="rz-scroll" style={{ padding: '12px 24px 16px' }}>
        {/* Amount display */}
        <div className="rz-fade-up" style={{ textAlign: 'center', margin: '24px 0 6px', position: 'relative' }}>
          <div className="rz-display" style={{
            fontSize: value > 9999999 ? 44 : 56, fontWeight: 700,
            color: 'var(--rz-ink-950)',
            letterSpacing: -2.5, lineHeight: 1,
          }}>
            {value ? fmtSum(value) : <span style={{ color: 'var(--rz-ink-200)' }}>0</span>}
            <span style={{ fontSize: 22, color: 'var(--rz-ink-400)', marginLeft: 8, letterSpacing: 0, fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{t.soum}</span>
            <span style={{
              display: 'inline-block',
              width: 2, height: value > 9999999 ? 32 : 42,
              background: 'var(--rz-green-600)',
              verticalAlign: 'middle',
              marginLeft: 4, marginBottom: 4,
              animation: 'rz-blink 1s infinite',
            }}/>
          </div>

          {/* Available + usage */}
          <div style={{
            marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'var(--rz-paper-2)',
            borderRadius: 12, padding: '8px 14px',
          }}>
            <div style={{
              width: 60, height: 4, borderRadius: 99,
              background: 'var(--rz-ink-200)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pctUsed}%`,
                background: value > max ? 'var(--rz-red)' : 'var(--rz-green-600)',
                borderRadius: 99,
                transition: 'width .2s',
              }}/>
            </div>
            <div style={{ fontSize: 12, color: 'var(--rz-ink-600)', fontWeight: 500 }}>
              {t.available} <span className="rz-num" style={{ color: 'var(--rz-ink-950)', fontWeight: 700 }}>{fmtSum(max)}</span>
            </div>
          </div>
          {value > max && (
            <div style={{
              marginTop: 10, fontSize: 12, color: 'var(--rz-red)', fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              <Icon name="info" size={14}/>
              {lang === 'ru' ? 'Превышает лимит' : 'Limitdan oshib ketdi'}
            </div>
          )}
        </div>

        {/* Quick chips */}
        <div style={{
          display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20,
        }}>
          {quick.map(q => (
            <button key={q} className={`rz-chip ${value === q ? 'rz-chip-active' : ''}`} onClick={() => onChange(q)}>
              {fmtSum(q)}
            </button>
          ))}
          <button className={`rz-chip ${value === max ? 'rz-chip-active' : ''}`} onClick={() => onChange(max)}>
            <Icon name="spark" size={12}/>
            {t.quickAll}
          </button>
        </div>

        {/* Numpad */}
        <div style={{ marginTop: 24, padding: '0 8px' }}>
          {[['1','2','3'],['4','5','6'],['7','8','9'],['000','0','⌫']].map((row, ri) => (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
              {row.map(k => (
                <button key={k} onClick={() => keyHandler(k)} style={{
                  height: 52, borderRadius: 14,
                  background: 'transparent',
                  fontSize: k === '⌫' ? 20 : k === '000' ? 18 : 22, fontWeight: 600,
                  color: 'var(--rz-ink-950)',
                  fontFamily: 'var(--font-display)', fontVariantNumeric: 'tabular-nums',
                  transition: 'background .12s',
                }}
                  onTouchStart={(e) => e.currentTarget.style.background = 'var(--rz-paper-2)'}
                  onTouchEnd={(e) => e.currentTarget.style.background = 'transparent'}
                >{k === '⌫' ? '⌫' : k}</button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown + CTA */}
      <div style={{ padding: '0 20px 24px' }}>
        <div className="rz-card" style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
            <span style={{ color: 'var(--rz-ink-600)', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              {t.commission}
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: 'var(--rz-green-50)', color: 'var(--rz-green-700)' }}>
                {lang === 'ru' ? 'фикс · 3% от суммы' : 'fiks · summadan 3%'}
              </span>
            </span>
            <span className="rz-num" style={{ fontWeight: 700, color: 'var(--rz-ink-950)' }}>−{fmtSum(commission)}</span>
          </div>
          <div className="rz-divider" style={{ margin: '10px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--rz-ink-950)' }}>{t.willReceive}</span>
            <span className="rz-num" style={{ fontWeight: 800, fontSize: 20, color: 'var(--rz-green-700)', letterSpacing: -0.5 }}>
              {fmtSum(receive)} <span style={{ fontSize: 12, color: 'var(--rz-ink-600)', fontWeight: 600, letterSpacing: 0 }}>{t.soum}</span>
            </span>
          </div>
        </div>
        <button className="rz-btn" disabled={!valid} onClick={onNext}>
          {t.next}
          <Icon name="arrow-right" size={18} stroke={2.2}/>
        </button>
      </div>
      <style>{`@keyframes rz-blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Step 2 — card selection (stacked carousel)
// ─────────────────────────────────────────────────────────────────────────
function WithdrawCard({ t, lang, amount, cards, selectedId, onSelect, onNext, onBack, onAddCard }) {
  const activeIdx = Math.max(0, cards.findIndex(c => c.id === selectedId));
  // Commission is flat 3% — same for every card
  const commissionAll = COMMISSION(amount);

  return (
    <div className="rz-screen rz-paper-tex">
      <StepHeader step={2} total={3} onBack={onBack} title={t.chooseCard}/>

      <div className="rz-scroll" style={{ padding: '8px 0 24px' }}>
        {/* Card stack */}
        <div className="rz-fade-up" style={{ position: 'relative', height: 260, margin: '4px 0 12px' }}>
          <div style={{
            position: 'relative', height: '100%',
            padding: '0 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {cards.map((c, i) => {
              const off = i - activeIdx;
              const isActive = off === 0;
              const abs = Math.abs(off);
              const commission = commissionAll;
              return (
                <button key={c.id} onClick={() => onSelect(c.id)} style={{
                  position: 'absolute',
                  width: 'calc(100% - 48px)',
                  transform: `translateX(${off * 38}px) translateY(${abs * 8}px) scale(${isActive ? 1 : 0.92 - abs * 0.05}) rotate(${off * -2.5}deg)`,
                  opacity: abs > 2 ? 0 : 1 - abs * 0.18,
                  zIndex: cards.length - abs,
                  transition: 'transform .35s cubic-bezier(.2,.7,.2,1), opacity .25s',
                  pointerEvents: abs > 2 ? 'none' : 'auto',
                }}>
                  <div style={{ position: 'relative' }}>
                    <RzCardVisual
                      brand={c.brand}
                      last4={c.last4}
                      holder="BOBUR YULDASHEV"
                      exp="12/28"
                      label={`${t.cardCommission}`}
                      balance={commission}
                      size="lg"
                    />

                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 18 }}>
          {cards.map((_, i) => (
            <button key={i} onClick={() => onSelect(cards[i].id)} style={{
              width: i === activeIdx ? 22 : 6, height: 6, borderRadius: 99,
              background: i === activeIdx ? 'var(--rz-ink-950)' : 'var(--rz-ink-200)',
              transition: 'all .22s',
            }}/>
          ))}
        </div>

        {/* Selected card commission breakdown */}
        <div style={{ padding: '0 20px' }}>
          <div className="rz-card rz-fade-up-2" style={{ padding: 16 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 10,
            }}>
              <div style={{ fontSize: 11, color: 'var(--rz-ink-400)', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>
                {lang === 'ru' ? 'Расчёт' : 'Hisob'}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 6,
                background: 'var(--rz-green-50)', color: 'var(--rz-green-700)',
              }}>
                {lang === 'ru' ? 'фикс 3% от суммы' : 'fiks 3% summadan'}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, color: 'var(--rz-ink-600)' }}>{t.requested}</span>
              <span className="rz-num" style={{ fontWeight: 700, fontSize: 14, color: 'var(--rz-ink-950)' }}>{fmtSum(amount)} {t.soum}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--rz-ink-600)' }}>{t.commission}</span>
              <span className="rz-num" style={{ fontWeight: 600, color: 'var(--rz-ink-800)' }}>−{fmtSum(commissionAll)} {t.soum}</span>
            </div>
            <div className="rz-divider" style={{ margin: '12px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--rz-ink-950)' }}>{t.willReceive}</span>
              <span className="rz-num" style={{ fontWeight: 800, fontSize: 20, color: 'var(--rz-green-700)', letterSpacing: -0.4 }}>
                {fmtSum(amount - commissionAll)} <span style={{ fontSize: 12, color: 'var(--rz-ink-600)', fontWeight: 600 }}>{t.soum}</span>
              </span>
            </div>
          </div>

          <button onClick={onAddCard} className="rz-fade-up-3" style={{
            marginTop: 12, width: '100%', height: 56,
            borderRadius: 16, border: '1.5px dashed var(--rz-line)',
            background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            color: 'var(--rz-ink-800)', fontWeight: 600, fontSize: 14,
          }}>
            <Icon name="plus" size={18} stroke={2.2}/>
            {t.addNewCard}
          </button>
        </div>
      </div>

      <div style={{ padding: '12px 20px 24px' }}>
        <button className="rz-btn" disabled={!selectedId} onClick={onNext}>
          {t.next}
          <Icon name="arrow-right" size={18} stroke={2.2}/>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Step 3 — review + compliance
// ─────────────────────────────────────────────────────────────────────────
function WithdrawReview({ t, lang, amount, card, salaryDate, onNext, onBack, onOpenLoan, onOpenOffer }) {
  const [agreed, setAgreed] = React.useState(false);
  const commission = COMMISSION(amount);
  const receive = amount - commission;
  return (
    <div className="rz-screen rz-paper-tex">
      <StepHeader step={3} total={3} onBack={onBack} title={t.review}/>
      <div className="rz-scroll" style={{ padding: '8px 20px 24px' }}>
        {/* Card destination */}
        <div className="rz-fade-up" style={{
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 12px 28px rgba(11,13,18,0.12)',
          marginBottom: 16,
        }}>
          <RzCardVisual brand={card.brand} last4={card.last4} holder="BOBUR YULDASHEV" exp="12/28" size="md"/>
        </div>

        {/* Receipt */}
        <div className="rz-card rz-fade-up-2" style={{ padding: '20px 18px' }}>
          <div className="rz-display" style={{
            fontSize: 11, fontWeight: 700, color: 'var(--rz-ink-600)',
            textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6,
          }}>{t.willReceive}</div>
          <div className="rz-num" style={{
            textAlign: 'center', fontSize: 42, fontWeight: 700,
            color: 'var(--rz-ink-950)', letterSpacing: -1.8, lineHeight: 1,
          }}>
            {fmtSum(receive)} <span style={{ fontSize: 18, color: 'var(--rz-ink-400)', letterSpacing: 0, fontFamily: 'var(--font-sans)' }}>{t.soum}</span>
          </div>

          <div className="rz-divider" style={{ margin: '18px 0 8px' }}/>

          {[
            { k: t.requested,  v: `${fmtSum(amount)} ${t.soum}` },
            { k: `${t.commission} · 3%`, v: `−${fmtSum(commission)} ${t.soum}` },
            { k: t.recvCard,   v: `•••• ${card.last4}` },
          ].map((r, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '8px 0',
            }}>
              <span style={{ fontSize: 13, color: 'var(--rz-ink-600)' }}>{r.k}</span>
              <span className="rz-num" style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--rz-ink-950)' }}>{r.v}</span>
            </div>
          ))}
        </div>

        {/* Repayment callout */}
        <div className="rz-fade-up-2" style={{
          marginTop: 14, padding: 16, borderRadius: 18,
          background: 'var(--rz-ink-950)', color: 'white',
          display: 'flex', alignItems: 'center', gap: 14,
          position: 'relative', overflow: 'hidden',
        }}>
          <span style={{ position: 'absolute', right: -16, bottom: -20 }}>
            <RzSparkle size={100} color="rgba(255,255,255,0.05)"/>
          </span>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(255,255,255,0.10)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 8, opacity: 0.65, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: -2 }}>
              {RZ_DICT[lang].months[salaryDate.month]}
            </div>
            <div className="rz-num" style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1 }}>
              {salaryDate.day}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2 }}>
              {t.salaryDate}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4 }}>
              {lang === 'ru' ? 'С зарплаты удержим ' : 'Maoshdan ushlanadi: '}
              <span className="rz-num" style={{ color: 'var(--rz-green-500)', fontWeight: 700 }}>{fmtSum(amount)}</span> {t.soum}
            </div>
          </div>
        </div>

        {/* Compliance */}
        <label className="rz-fade-up-3" style={{
          display: 'flex', gap: 12, alignItems: 'flex-start',
          marginTop: 14, padding: 14, borderRadius: 16,
          background: agreed ? 'oklch(0.96 0.04 148)' : 'var(--rz-card)',
          border: `1.5px solid ${agreed ? 'var(--rz-green-400)' : 'var(--rz-line)'}`,
          cursor: 'pointer',
          transition: 'all .15s',
        }}>
          <button
            type="button"
            onClick={() => setAgreed(a => !a)}
            style={{
              width: 22, height: 22, borderRadius: 7,
              border: `1.5px solid ${agreed ? 'var(--rz-green-600)' : 'var(--rz-ink-400)'}`,
              background: agreed ? 'var(--rz-green-600)' : 'transparent',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 1,
              transition: 'all .15s',
            }}
            aria-pressed={agreed}
          >
            {agreed && <Icon name="check" size={14} stroke={3} color="white"/>}
          </button>
          <div style={{ fontSize: 12, color: 'var(--rz-ink-800)', lineHeight: 1.5 }}>
            {t.agreeText1}
            <a onClick={(e) => { e.stopPropagation(); onOpenLoan(); }}
               style={{ color: 'var(--rz-green-700)', fontWeight: 700, borderBottom: '1px solid var(--rz-green-400)' }}>{t.agreeLoan}</a>
            {t.agreeText2}
            <a onClick={(e) => { e.stopPropagation(); onOpenOffer(); }}
               style={{ color: 'var(--rz-green-700)', fontWeight: 700, borderBottom: '1px solid var(--rz-green-400)' }}>{t.agreeOffer}</a>
            {t.agreeText3}
          </div>
        </label>
      </div>

      <div style={{ padding: '12px 20px 24px' }}>
        <button className="rz-btn rz-btn-green" disabled={!agreed} onClick={onNext}>
          <Icon name="lock" size={16} stroke={2.2} color="white"/>
          {t.signGet}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Step 4 — sign (OTP for loan agreement)
// ─────────────────────────────────────────────────────────────────────────
function WithdrawSign({ t, lang, phone, onBack, onSubmit }) {
  const [code, setCode] = React.useState('');
  const [signing, setSigning] = React.useState(false);
  React.useEffect(() => {
    if (code.length === 4 && !signing) {
      setSigning(true);
      setTimeout(() => { onSubmit(); }, 1400);
    }
  }, [code]);
  const masked = `+998 ${phone.slice(0,2)} *** ${phone.slice(-2)}`;
  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar onBack={onBack} title={t.signTitle}/>
      <div className="rz-scroll" style={{ padding: '12px 24px 24px' }}>
        <div className="rz-fade-up" style={{
          width: 96, height: 96, borderRadius: 28,
          background: 'var(--rz-ink-950)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '24px auto 24px', position: 'relative', overflow: 'hidden',
        }}>
          <span style={{ position: 'absolute', top: -10, right: -10 }}>
            <RzSparkle size={56} color="oklch(0.70 0.22 148 / 0.50)"/>
          </span>
          <Icon name="lock" size={38} stroke={1.6} color="white" />
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            width: 30, height: 30, borderRadius: 999,
            background: 'var(--rz-green-500)', color: 'var(--rz-ink-950)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid var(--rz-ink-950)',
          }}>
            <Icon name="check" size={14} stroke={3.4}/>
          </div>
        </div>
        <h2 className="rz-display rz-fade-up" style={{
          margin: '0 0 12px', fontSize: 24, fontWeight: 700, textAlign: 'center', letterSpacing: -0.6,
        }}>{lang === 'ru' ? 'Подпишите договор займа' : 'Qarz shartnomasini imzolang'}</h2>
        <p className="rz-fade-up-2" style={{
          color: 'var(--rz-ink-600)', fontSize: 13.5, lineHeight: 1.5,
          margin: '0 0 28px', textAlign: 'center',
        }}>{t.signBody.replace('{phone}', masked)}</p>
        <div className="rz-fade-up-3">
          <RzOtpInput value={code} onChange={setCode}/>
        </div>
        {signing && (
          <div style={{
            marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, fontSize: 13, color: 'var(--rz-ink-600)',
          }}>
            <svg className="rz-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="var(--rz-ink-200)" strokeWidth="2.5"/>
              <path d="M21 12a9 9 0 0 0-9-9" stroke="var(--rz-ink-950)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            {lang === 'ru' ? 'Подписываем договор и отправляем платёж…' : 'Shartnoma imzolanmoqda va toʻlov yuborilmoqda…'}
          </div>
        )}
        {!signing && (
          <button
            onClick={() => setCode('1234')}
            style={{
              margin: '28px auto 0', display: 'block',
              padding: '10px 14px',
              border: '1px dashed var(--rz-line)', borderRadius: 12,
              fontSize: 12, color: 'var(--rz-ink-600)', fontWeight: 600,
            }}
          >{lang === 'ru' ? 'Демо-код' : 'Demo kod'} · 1 2 3 4</button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Step 5 — success
// ─────────────────────────────────────────────────────────────────────────
function WithdrawSuccess({ t, lang, amount, card, onHome, onAgain }) {
  const commission = COMMISSION(amount);
  const receive = amount - commission;
  return (
    <div className="rz-screen rz-paper-tex" style={{ background: 'var(--rz-paper)' }}>
      <Confetti />
      <div className="rz-scroll" style={{
        padding: '40px 24px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div className="rz-pop" style={{
          width: 92, height: 92, borderRadius: 999,
          background: 'var(--rz-green-600)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 36px oklch(0.62 0.22 148 / 0.50)',
          position: 'relative',
        }}>
          <svg className="rz-tick" width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* concentric ripples */}
          <span style={{
            position: 'absolute', inset: -12, borderRadius: 999,
            border: '2px solid oklch(0.62 0.22 148 / 0.30)',
            animation: 'rz-ripple 1.8s ease-out infinite',
          }}/>
        </div>
        <div className="rz-display rz-fade-up-2" style={{
          margin: '24px 0 4px', fontSize: 30, fontWeight: 700, letterSpacing: -0.8,
        }}>{t.successTitle}</div>
        <p className="rz-fade-up-2" style={{
          color: 'var(--rz-ink-600)', fontSize: 13.5, margin: 0,
        }}>{t.successSub}</p>

        <div className="rz-num rz-fade-up-3" style={{
          marginTop: 22,
          fontSize: 48, fontWeight: 700, color: 'var(--rz-ink-950)',
          letterSpacing: -1.8, lineHeight: 1,
        }}>
          {fmtSum(receive)}
          <span style={{ fontSize: 18, color: 'var(--rz-ink-400)', marginLeft: 8, letterSpacing: 0, fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{t.soum}</span>
        </div>

        {/* Card destination preview */}
        <div className="rz-fade-up-3" style={{
          marginTop: 22, width: '100%', position: 'relative',
        }}>
          <div style={{
            borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(11,13,18,0.12)',
          }}>
            <RzCardVisual brand={card.brand} last4={card.last4} holder="BOBUR YULDASHEV" exp="12/28" size="sm"/>
          </div>
          {/* Money-in indicator */}
          <div style={{
            position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
            background: 'white', border: '1px solid var(--rz-line-soft)',
            borderRadius: 99, padding: '4px 12px 4px 8px',
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 700, color: 'var(--rz-green-700)',
            boxShadow: '0 4px 12px rgba(11,13,18,0.08)',
          }}>
            <Icon name="arrow-down" size={12} stroke={2.4}/>
            {lang === 'ru' ? 'Зачислено' : 'Tushdi'}
          </div>
        </div>

        {/* Receipt summary */}
        <div className="rz-fade-up-3" style={{
          marginTop: 16, width: '100%',
          padding: '12px 14px', borderRadius: 14,
          background: 'var(--rz-paper-2)',
          fontSize: 12, color: 'var(--rz-ink-600)',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>{lang === 'ru' ? 'Возврат' : 'Qaytarish'}: <span className="rz-num" style={{ color: 'var(--rz-ink-950)', fontWeight: 700 }}>{fmtSum(amount)} {t.soum}</span></span>
          <span>{lang === 'ru' ? '30 июн' : '30 iyn'}</span>
        </div>
      </div>
      <div style={{ padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="rz-btn rz-btn-green" onClick={onHome}>
          {t.successHome}
          <Icon name="arrow-right" size={18} stroke={2.2} color="white"/>
        </button>
        <button className="rz-btn rz-btn-ghost" onClick={onAgain}>{t.successAgain}</button>
      </div>
      <style>{`
        @keyframes rz-ripple {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Confetti() {
  const colors = ['var(--rz-green-500)', 'oklch(0.72 0.16 78)', 'var(--rz-green-700)', 'oklch(0.65 0.20 285)', 'white', 'var(--rz-ink-950)'];
  const pieces = Array.from({ length: 32 });
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
      {pieces.map((_, i) => {
        const ang = (Math.PI * 2 * i) / pieces.length + Math.random() * 0.4;
        const dist = 180 + Math.random() * 160;
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist - 100;
        const r = (Math.random() - 0.5) * 720;
        return (
          <span key={i} className="rz-confetti-piece" style={{
            '--dx': `${dx}px`, '--dy': `${dy}px`, '--r': `${r}deg`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.2}s`,
          }}/>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  WithdrawAmount, WithdrawCard, WithdrawReview, WithdrawSign, WithdrawSuccess,
  COMMISSION,
});
