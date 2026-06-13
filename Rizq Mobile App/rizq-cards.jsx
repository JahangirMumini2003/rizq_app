// Cards screen — visual carousel + actions + add-card sheet flow

function CardsScreen({ t, lang, cards: cardsProp, onBack, onAddCard }) {
  // local cards state, with bound balances/holder for prototype
  const [cards, setCards] = React.useState(cardsProp.map((c, i) => ({
    ...c,
    holder: 'BOBUR YULDASHEV',
    exp: '12/28',
    balance: i === 0 ? 1450000 : 320000,
    frozen: false,
    primary: i === 0,
  })));
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [adding, setAdding] = React.useState(false);

  const active = cards[activeIdx];

  const togglePrimary = (idx) => setCards(cs => cs.map((c, i) => ({ ...c, primary: i === idx })));
  const toggleFrozen  = (idx) => setCards(cs => cs.map((c, i) => i === idx ? { ...c, frozen: !c.frozen } : c));
  const removeCard    = (idx) => setCards(cs => cs.filter((_, i) => i !== idx));

  const onCardAdded = (newCard) => {
    setCards(cs => [...cs, { ...newCard, balance: 0, frozen: false, primary: false }]);
    setActiveIdx(cards.length);
    setAdding(false);
  };

  return (
    <div className="rz-screen rz-paper-tex">
      <RzTopBar onBack={onBack} title={t.nav_cards}/>

      <div className="rz-scroll" style={{ padding: '8px 0 130px' }}>
        {/* Hero stack */}
        <div className="rz-fade-up" style={{
          position: 'relative', height: 270, margin: '8px 0 16px',
        }}>
          <HeroStack cards={cards} activeIdx={activeIdx} onSelect={setActiveIdx}/>
        </div>

        {/* Indicator dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 18 }}>
          {cards.map((_, i) => (
            <button key={i} onClick={() => setActiveIdx(i)} style={{
              width: i === activeIdx ? 22 : 6, height: 6, borderRadius: 99,
              background: i === activeIdx ? 'var(--rz-ink-950)' : 'var(--rz-ink-200)',
              transition: 'all .22s',
            }}/>
          ))}
        </div>

        {/* Active card actions */}
        {active && (
          <div style={{ padding: '0 20px' }}>
            <div className="rz-card rz-fade-up-2" style={{ padding: 16 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
              }}>
                <div>
                  <div style={{
                    fontSize: 11, color: 'var(--rz-ink-400)',
                    textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600,
                  }}>{lang === 'ru' ? 'Карта' : 'Karta'}</div>
                  <div style={{ marginTop: 2, fontSize: 15, fontWeight: 700, color: 'var(--rz-ink-950)' }}>
                    {BRAND_META[active.brand].label}{active.primary ? (lang === 'ru' ? ' · основная' : ' · asosiy') : ''}
                  </div>
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--rz-ink-600)',
                  background: 'var(--rz-green-50)', padding: '6px 10px', borderRadius: 10,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <Icon name="spark" size={13} color="var(--rz-green-700)"/>
                  {lang === 'ru' ? 'Комиссия' : 'Komissiya'} <span style={{ color: 'var(--rz-green-700)', fontWeight: 700 }}>3%</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                <ActionTile icon="check" label={lang === 'ru' ? 'Основная' : 'Asosiy'}
                  active={active.primary} onClick={() => togglePrimary(activeIdx)}/>
                <ActionTile icon="lock" label={lang === 'ru' ? 'Заморозить' : 'Muzlatish'}
                  active={active.frozen} onClick={() => toggleFrozen(activeIdx)}/>
                <ActionTile icon="spark" label={lang === 'ru' ? 'Лимиты' : 'Limitlar'}/>
                <ActionTile icon="close" label={lang === 'ru' ? 'Удалить' : 'Oʻchirish'} danger
                  onClick={() => { if (cards.length > 1) { removeCard(activeIdx); setActiveIdx(0); } }}/>
              </div>
            </div>

            {/* Add card button */}
            <button onClick={() => setAdding(true)} style={{
              marginTop: 18, width: '100%',
              height: 52, borderRadius: 16,
              background: 'var(--rz-paper-2)',
              border: '1.5px dashed var(--rz-line)',
              color: 'var(--rz-ink-800)',
              fontWeight: 600, fontSize: 15, letterSpacing: -0.2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Icon name="plus" size={18} stroke={2.2}/>
              {t.addNewCard}
            </button>

            {/* Recent on this card */}
            <div style={{ marginTop: 22 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                margin: '0 4px 10px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--rz-ink-950)' }}>
                  {lang === 'ru' ? 'Поступления' : 'Tushumlar'}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--rz-ink-400)', fontWeight: 600 }}>
                  {lang === 'ru' ? 'на эту карту' : 'shu kartaga'}
                </div>
              </div>
              <div className="rz-card">
                {[
                  { day: lang === 'ru' ? 'Сегодня' : 'Bugun',  amount: 780000, time: '09:14' },
                  { day: lang === 'ru' ? '8 июня' : '8 iyun',  amount: 1170000, time: '11:03' },
                  { day: lang === 'ru' ? '22 мая' : '22 may',  amount: 585000, time: '10:05' },
                ].map((r, i) => (
                  <div key={i} style={{
                    padding: '14px 16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderTop: i ? '1px solid var(--rz-line-soft)' : 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--rz-ink-950)' }}>{r.day}</div>
                      <div style={{ fontSize: 12, color: 'var(--rz-ink-400)', marginTop: 2 }}>Rizq · {r.time}</div>
                    </div>
                    <div className="rz-num" style={{ fontWeight: 700, color: 'var(--rz-green-700)', fontSize: 15 }}>
                      +{fmtSum(r.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>



      {/* Add card sheet */}
      {adding && (
        <AddCardFlow t={t} lang={lang} onClose={() => setAdding(false)} onDone={onCardAdded}/>
      )}
    </div>
  );
}

// Hero stack — large active card centered with siblings peeking
function HeroStack({ cards, activeIdx, onSelect }) {
  const total = cards.length;
  return (
    <div style={{
      position: 'relative', height: '100%',
      padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {cards.map((c, i) => {
        const off = i - activeIdx;
        const isActive = off === 0;
        const abs = Math.abs(off);
        return (
          <button key={c.id} onClick={() => onSelect(i)} style={{
            position: 'absolute',
            width: 'calc(100% - 48px)',
            transform: `translateX(${off * 38}px) translateY(${abs * 8}px) scale(${isActive ? 1 : 0.92 - abs * 0.05}) rotate(${off * -2.5}deg)`,
            opacity: abs > 2 ? 0 : 1 - abs * 0.18,
            zIndex: total - abs,
            transition: 'transform .35s cubic-bezier(.2,.7,.2,1), opacity .25s',
            pointerEvents: abs > 2 ? 'none' : 'auto',
          }}>
            <RzCardVisual
              brand={c.brand}
              last4={c.last4}
              holder={c.holder}
              balance={c.balance}
              label={c.primary ? 'Основная' : null}
              frozen={c.frozen}
              size="lg"
            />
          </button>
        );
      })}
    </div>
  );
}

function ActionTile({ icon, label, active, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 4px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      background: 'var(--rz-paper-2)',
      borderRadius: 14,
      color: danger ? 'var(--rz-red)' : (active ? 'var(--rz-green-700)' : 'var(--rz-ink-800)'),
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 999,
        background: active ? 'var(--rz-green-50)' : 'var(--rz-card)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: active ? '1px solid var(--rz-green-400)' : '1px solid var(--rz-line-soft)',
      }}>
        <Icon name={icon} size={15} stroke={2.2}/>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.1 }}>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Add card flow — bottom sheet, 3 steps
// ─────────────────────────────────────────────────────────────────────────

function AddCardFlow({ t, lang, onClose, onDone }) {
  const [step, setStep] = React.useState('brand'); // brand | form | otp | done
  const [brand, setBrand] = React.useState(null);
  const [digits, setDigits] = React.useState('');
  const [exp, setExp] = React.useState('');
  const [holder, setHolder] = React.useState('BOBUR YULDASHEV');

  const handleAutoBrand = (d) => {
    setDigits(d);
    const det = detectBrand(d);
    if (det && det !== brand) setBrand(det);
  };

  const submitOtp = (code) => {
    if (code.length === 4) {
      setStep('done');
      setTimeout(() => {
        onDone({
          id: 'c' + Date.now(),
          brand: brand || 'humo',
          last4: digits.slice(-4) || '0000',
          name: holder.split(' ')[0] || 'CARD',
          holder, exp: exp || '12/28',
        });
      }, 1100);
    }
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div className="rz-backdrop" onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(11,13,18,0.45)',
      }}/>
      <div className="rz-sheet" style={{
        position: 'relative', background: 'var(--rz-card)',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '12px 20px 24px',
        maxHeight: '92%',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 99,
          background: 'var(--rz-line)', margin: '0 auto 14px',
        }}/>

        {/* header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 14,
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--rz-ink-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2 }}>
              {lang === 'ru' ? 'Новая карта' : 'Yangi karta'}
            </div>
            <div className="rz-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--rz-ink-950)', marginTop: 2, letterSpacing: -0.8 }}>
              {step === 'brand' && (lang === 'ru' ? 'Выберите систему' : 'Tizimni tanlang')}
              {step === 'form'  && (lang === 'ru' ? 'Данные карты' : 'Karta maʼlumotlari')}
              {step === 'otp'   && (lang === 'ru' ? 'Подтверждение' : 'Tasdiqlash')}
              {step === 'done'  && (lang === 'ru' ? 'Карта добавлена' : 'Karta qoʻshildi')}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 12, background: 'var(--rz-paper-2)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="close" size={18}/></button>
        </div>

        {/* steps */}
        {step === 'brand' && (
          <BrandPicker onPick={(b) => { setBrand(b); setDigits(BRAND_META[b].binPrefix); setStep('form'); }}/>
        )}
        {step === 'form' && (
          <CardForm
            t={t} lang={lang}
            brand={brand} digits={digits} exp={exp} holder={holder}
            onDigits={handleAutoBrand} onExp={setExp} onHolder={setHolder}
            onBack={() => setStep('brand')}
            onNext={() => setStep('otp')}
          />
        )}
        {step === 'otp' && (
          <CardOtp t={t} lang={lang} onBack={() => setStep('form')} onSubmit={submitOtp}/>
        )}
        {step === 'done' && (
          <CardDone t={t} lang={lang} brand={brand} digits={digits} holder={holder}/>
        )}
      </div>
    </div>
  );
}

function BrandPicker({ onPick }) {
  const order = ['uzcard', 'humo', 'visa', 'mastercard'];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
      paddingBottom: 12,
    }}>
      {order.map(b => (
        <button key={b} onClick={() => onPick(b)} style={{
          padding: 14, borderRadius: 18,
          background: 'var(--rz-paper-2)',
          textAlign: 'left',
          transition: 'transform .15s',
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
        >
          <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 12 }}>
            <RzCardVisual brand={b} last4="••••" holder=" " exp="••/••" size="sm"/>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--rz-ink-950)' }}>{BRAND_META[b].label}</div>
          <div style={{ fontSize: 11.5, color: 'var(--rz-ink-600)', marginTop: 2 }}>
            {/* commission is flat 3% across all brands */}
            {'Комиссия 3%'}
          </div>
        </button>
      ))}
    </div>
  );
}

function CardForm({ t, lang, brand, digits, exp, holder, onDigits, onExp, onHolder, onBack, onNext }) {
  const formatted = formatCardNumber(digits.padEnd(16, '•').slice(0, 16));
  const expFmt = (() => {
    const e = (exp || '').padEnd(4, '•').slice(0, 4);
    return `${e.slice(0, 2)}/${e.slice(2, 4)}`;
  })();
  const last4 = digits.slice(-4) || '0000';
  const ready = digits.length >= 16 && exp.length === 4 && holder.length > 2;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', paddingBottom: 8 }}>
      {/* Preview */}
      <RzCardVisual
        brand={brand}
        last4={last4}
        holder={holder || 'CARDHOLDER'}
        exp={expFmt}
        size="md"
      />

      {/* Number */}
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--rz-ink-600)', marginBottom: 6, paddingLeft: 4 }}>
          {lang === 'ru' ? 'Номер карты' : 'Karta raqami'}
        </label>
        <div style={{
          height: 56, borderRadius: 16,
          border: '1.5px solid var(--rz-line)',
          background: 'var(--rz-card)',
          display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
        }}>
          <Icon name="card" size={18} color="var(--rz-ink-400)"/>
          <input
            value={formatCardNumber(digits)}
            onChange={(e) => onDigits(e.target.value.replace(/\D/g, '').slice(0, 16))}
            placeholder="•••• •••• •••• ••••"
            inputMode="numeric"
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 17, fontWeight: 600, letterSpacing: 1.5,
              fontVariantNumeric: 'tabular-nums',
              fontFamily: 'var(--font-display)',
              background: 'transparent', color: 'var(--rz-ink-950)',
            }}
          />
          {brand && <BrandBadge brand={brand}/>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--rz-ink-600)', marginBottom: 6, paddingLeft: 4 }}>
            {lang === 'ru' ? 'Срок' : 'Muddat'}
          </label>
          <input
            value={(() => { const e = exp; return e.length >= 2 ? `${e.slice(0,2)}/${e.slice(2,4)}` : e; })()}
            onChange={(e) => onExp(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="MM/YY"
            inputMode="numeric"
            className="rz-input"
            style={{ fontSize: 17, fontWeight: 600, letterSpacing: 1.5, fontFamily: 'var(--font-display)' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--rz-ink-600)', marginBottom: 6, paddingLeft: 4 }}>
            {lang === 'ru' ? 'CVC' : 'CVC'}
          </label>
          <input
            placeholder="•••"
            inputMode="numeric"
            maxLength={3}
            type="password"
            className="rz-input"
            style={{ fontSize: 17, fontWeight: 600, letterSpacing: 4, textAlign: 'center' }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--rz-ink-600)', marginBottom: 6, paddingLeft: 4 }}>
          {lang === 'ru' ? 'Держатель' : 'Karta egasi'}
        </label>
        <input
          value={holder}
          onChange={(e) => onHolder(e.target.value.toUpperCase().slice(0, 26))}
          placeholder="BOBUR YULDASHEV"
          className="rz-input"
          style={{ fontWeight: 600, letterSpacing: 0.5 }}
        />
      </div>

      <button onClick={onNext} disabled={!ready} className="rz-btn" style={{ marginTop: 4 }}>
        <Icon name="lock" size={16} stroke={2}/>
        {ready ? (lang === 'ru' ? 'Подтвердить через SMS' : 'SMS orqali tasdiqlash') : (lang === 'ru' ? 'Заполните карту' : 'Kartani toʻldiring')}
      </button>
      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--rz-ink-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
        <Icon name="shield" size={12} color="var(--rz-ink-400)"/>
        {lang === 'ru' ? 'Данные защищены сертификатом PCI DSS' : 'Maʼlumotlar PCI DSS bilan himoyalangan'}
      </div>
    </div>
  );
}

function BrandBadge({ brand }) {
  return (
    <div style={{
      padding: '4px 8px', borderRadius: 6,
      background: 'var(--rz-paper-2)',
      fontSize: 10, fontWeight: 700, color: 'var(--rz-ink-950)',
      letterSpacing: 0.5, textTransform: 'uppercase',
    }}>{BRAND_META[brand].label}</div>
  );
}

function CardOtp({ t, lang, onBack, onSubmit }) {
  const [code, setCode] = React.useState('');
  React.useEffect(() => { if (code.length === 4) setTimeout(() => onSubmit(code), 350); }, [code]);
  return (
    <div style={{ paddingBottom: 8 }}>
      <p style={{ fontSize: 13, color: 'var(--rz-ink-600)', lineHeight: 1.5, margin: '0 0 18px' }}>
        {lang === 'ru'
          ? 'Введите 4-значный код из SMS — мы отправили его на телефон, привязанный к карте.'
          : 'Kartaga bogʻlangan telefonga yuborilgan 4 xonali kodni kiriting.'}
      </p>
      <RzOtpInput value={code} onChange={setCode}/>
      <button onClick={() => setCode('1234')} style={{
        margin: '24px auto 0', display: 'block', padding: '10px 14px',
        border: '1px dashed var(--rz-line)', borderRadius: 12,
        fontSize: 12, color: 'var(--rz-ink-600)', fontWeight: 600,
      }}>{lang === 'ru' ? 'Демо' : 'Demo'} · 1 2 3 4</button>
    </div>
  );
}

function CardDone({ t, lang, brand, digits, holder }) {
  return (
    <div style={{ paddingBottom: 8 }}>
      <div className="rz-pop" style={{
        width: 64, height: 64, borderRadius: 999,
        background: 'var(--rz-green-600)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '8px auto 16px',
      }}>
        <svg className="rz-tick" width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ borderRadius: 18, overflow: 'hidden', marginBottom: 16 }}>
        <RzCardVisual brand={brand} last4={digits.slice(-4)} holder={holder} size="md"/>
      </div>
      <div style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--rz-ink-600)', marginBottom: 16 }}>
        {lang === 'ru' ? 'Карта добавлена и готова к зачислениям' : 'Karta qoʻshildi va tushumlarga tayyor'}
      </div>
    </div>
  );
}

Object.assign(window, { CardsScreen });
