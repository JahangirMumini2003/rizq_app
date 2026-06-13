// Visual card — used on Cards screen, Add Card preview, Wallet, etc.

const BRAND_META = {
  uzcard: {
    label: 'Uzcard',
    gradient: 'linear-gradient(135deg, oklch(0.55 0.18 252) 0%, oklch(0.32 0.16 258) 70%)',
    accent: 'oklch(0.85 0.10 252)',
    binPrefix: '8600',
    rate: '3%',
  },
  humo: {
    label: 'Humo',
    gradient: 'linear-gradient(135deg, oklch(0.68 0.22 148) 0%, oklch(0.40 0.18 152) 70%)',
    accent: 'oklch(0.92 0.06 148)',
    binPrefix: '9860',
    rate: '3%',
  },
  visa: {
    label: 'VISA',
    gradient: 'linear-gradient(135deg, oklch(0.40 0.16 268) 0%, oklch(0.18 0.10 268) 70%)',
    accent: 'oklch(0.92 0.04 60)',
    binPrefix: '4',
    rate: '3%',
  },
  mastercard: {
    label: 'Mastercard',
    gradient: 'linear-gradient(135deg, oklch(0.32 0.06 60) 0%, oklch(0.18 0.04 60) 70%)',
    accent: '#ff8a00',
    binPrefix: '5',
    rate: '3%',
  },
};

// Auto-detect brand from card number digits string
function detectBrand(digits) {
  if (!digits) return null;
  if (digits.startsWith('8600')) return 'uzcard';
  if (digits.startsWith('9860')) return 'humo';
  if (digits.startsWith('4'))    return 'visa';
  if (digits.startsWith('5') || digits.startsWith('2')) return 'mastercard';
  return null;
}

function formatCardNumber(digits) {
  return (digits || '').replace(/(.{4})/g, '$1 ').trim();
}

// Beautiful card visual — used everywhere we show a card
function RzCardVisual({
  brand = 'humo', last4 = '0000', holder = 'CARDHOLDER',
  exp = '12/29', balance, label,
  size = 'lg',          // 'lg' | 'md' | 'sm'
  style, frozen,
}) {
  const meta = BRAND_META[brand] || BRAND_META.humo;
  const dims = size === 'lg' ? { w: '100%', h: 200, pad: 22, num: 19, brand: 24 }
              : size === 'md' ? { w: '100%', h: 168, pad: 18, num: 17, brand: 20 }
              : { w: '100%', h: 132, pad: 16, num: 14, brand: 16 };

  return (
    <div style={{
      width: dims.w, height: dims.h, borderRadius: 22,
      background: meta.gradient,
      color: 'white', padding: dims.pad,
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 14px 36px rgba(11,13,18,0.30)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      ...style,
    }}>
      {/* organic shapes */}
      <svg width="280" height="280" viewBox="0 0 280 280" style={{
        position: 'absolute', right: -50, top: -80, opacity: 0.22,
      }} aria-hidden>
        <circle cx="180" cy="100" r="100" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="180" cy="100" r="60" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="100" cy="200" r="80" fill={meta.accent} opacity="0.5"/>
      </svg>

      {/* Top row: chip + balance/label + NFC */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div>
          {/* Chip */}
          <div style={{
            width: 36, height: 26, borderRadius: 6,
            background: 'linear-gradient(135deg, oklch(0.88 0.06 80), oklch(0.72 0.10 80))',
            position: 'relative',
            boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
          }}>
            <div style={{
              position: 'absolute', inset: 4, borderRadius: 3,
              background: 'repeating-linear-gradient(90deg, oklch(0.72 0.10 80) 0 4px, oklch(0.62 0.10 80) 4px 5px)',
              opacity: 0.7,
            }}/>
          </div>
          {label && (
            <div style={{ marginTop: 12, fontSize: 11, opacity: 0.78, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2 }}>
              {label}
            </div>
          )}
          {balance != null && (
            <div className="rz-num" style={{
              marginTop: 4, fontSize: dims.brand, fontWeight: 700, letterSpacing: -0.6,
            }}>
              {fmtSum(balance)} <span style={{ fontSize: dims.brand * 0.55, opacity: 0.85, fontWeight: 600, letterSpacing: 0 }}>сум</span>
            </div>
          )}
        </div>
        <Icon name="phone" size={20} color="white" style={{ opacity: 0.65, transform: 'rotate(90deg)' }} />
      </div>

      {/* Bottom row: number, name, brand */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="rz-num" style={{
          fontSize: dims.num, fontWeight: 600,
          letterSpacing: 3, opacity: 0.95,
        }}>•••• {last4}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10, gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 9.5, opacity: 0.65, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>Cardholder</div>
            <div style={{
              marginTop: 2, fontSize: 11.5, fontWeight: 600, letterSpacing: 0.5,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{holder}</div>
          </div>
          <BrandMark brand={brand} size={dims.brand * 1.1}/>
        </div>
      </div>

      {frozen && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(20,30,50,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: 14, letterSpacing: -0.2,
          gap: 8,
        }}>
          <Icon name="lock" size={18}/> Заморожена
        </div>
      )}
    </div>
  );
}

// Brand mark — text wordmark in style of the brand
function BrandMark({ brand, size = 22 }) {
  if (brand === 'visa') {
    return <div style={{
      fontFamily: 'var(--font-display)', fontWeight: 800,
      fontSize: size * 0.9, letterSpacing: -0.5,
      color: 'white',
      fontStyle: 'italic',
    }}>VISA</div>;
  }
  if (brand === 'mastercard') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: -size * 0.16 }}>
        <span style={{
          display: 'block', width: size, height: size, borderRadius: 999,
          background: '#eb001b', opacity: 0.95,
        }}/>
        <span style={{
          display: 'block', width: size, height: size, borderRadius: 999,
          background: '#f79e1b', opacity: 0.95,
          marginLeft: -size * 0.4, mixBlendMode: 'screen',
        }}/>
      </div>
    );
  }
  if (brand === 'humo') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: size, height: size * 0.6, borderRadius: 999,
          background: 'oklch(0.85 0.18 148)',
          border: '2px solid white',
        }}/>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: size * 0.6, letterSpacing: 0.3,
          color: 'white',
        }}>HUMO</span>
      </div>
    );
  }
  // uzcard
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <svg width={size * 0.9} height={size * 0.9} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: size * 0.6, letterSpacing: 0.3,
        color: 'white',
      }}>UZCARD</span>
    </div>
  );
}

Object.assign(window, { RzCardVisual, BRAND_META, detectBrand, formatCardNumber, BrandMark });
