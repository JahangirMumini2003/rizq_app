// Shared components for Rizq
// Translation dictionary + helper
const RZ_DICT = {
  ru: {
    // app
    appTag: 'Доступ к зарплате 24/7',
    cont: 'Продолжить', next: 'Далее', back: 'Назад',
    // onboarding
    enterPhone: 'Войти по номеру', tos: 'Нажимая кнопку, вы соглашаетесь с условиями использования.',
    getCode: 'Получить SMS-код',
    enterCode: 'Введите код из СМС', sentTo: 'Мы отправили код на',
    resendIn: 'Отправить код повторно через', resend: 'Отправить ещё раз',
    kycTitle: 'Подтвердите личность',
    kycBody: 'Для защиты ваших данных и расчёта лимита зарплаты нам нужно подтвердить, что это вы.',
    kycBtn: 'Пройти верификацию через MyID',
    kycDone: 'Личность подтверждена', kycConfirm: 'Всё верно, перейти в кабинет',
    fio: 'ФИО', pinfl: 'ПИНФЛ', employer: 'Работодатель', position: 'Должность',
    // home
    hi: 'Привет', avail: 'Доступно к выводу', soum: 'сум',
    daysWorked: 'отработано дней', totalSalary: 'Общая зарплата', alreadyOut: 'Уже выведено',
    withdraw: 'Вывести деньги',
    nav_history: 'История', nav_cards: 'Карты', nav_profile: 'Профиль',
    recent: 'Последние операции', viewAll: 'Все',
    statusDone: 'Выполнено', statusPending: 'В обработке', statusError: 'Ошибка',
    howCalc: 'Как считается лимит',
    howCalcBody: 'Сумма рассчитывается автоматически:\n(Дневная ставка × Отработанные дни) × Лимит компании (60%) — налоги.',
    gotIt: 'Понятно',
    // withdraw
    chooseAmount: 'Сколько вывести?',
    available: 'Доступно',
    quickAll: 'Всё', quickSums: 'Быстрый выбор',
    commission: 'Комиссия системы', willReceive: 'Вы получите на карту',
    chooseCard: 'Куда зачислить?', cardsHint: 'Выберите карту — комиссия указана на каждой',
    cardCommission: 'Комиссия',
    addNewCard: 'Привязать новую карту',
    review: 'Проверьте детали',
    requested: 'Запрошено', recvCard: 'Карта получателя',
    salaryDate: 'Дата зарплаты (удержание)', returnAmount: 'Сумма возврата',
    agreeText1: 'Я ознакомлен и согласен с условиями ',
    agreeLoan: 'Договора микрозайма МФО',
    agreeText2: ', ',
    agreeOffer: 'Публичной офертой Rizq',
    agreeText3: ' и даю безусловное согласие на удержание суммы займа и комиссий из моей заработной платы в соответствии со ст. 271 ТК РУз.',
    signGet: 'Подписать договор и получить деньги',
    signTitle: 'Подписание договора займа',
    signBody: 'На ваш номер {phone} отправлен SMS-код. Ввод этого кода является официальным подписанием договора микрозайма с МФО-партнёром — аналог собственноручной подписи.',
    successTitle: 'Готово!', successSub: 'Отправлено на карту',
    successHome: 'На главную', successAgain: 'Вывести ещё',
    // history
    historyTitle: 'История',
    filterAll: 'Все', filterDone: 'Выполненные', filterPending: 'В обработке', filterError: 'Ошибки',
    period_month: 'Этот месяц', period_prev: 'Прошлый месяц', period_pick: 'Период',
    today: 'Сегодня', yesterday: 'Вчера',
    txDetails: 'Детали операции', txId: 'ID транзакции', txTime: 'Время',
    receipt: 'Скачать квитанцию',
    // profile
    verified: 'Верифицирован',
    personalData: 'Личные данные',
    department: 'Отдел', phoneLabel: 'Телефон',
    settings: 'Настройки', language: 'Язык', theme: 'Тема', light: 'Светлая', dark: 'Тёмная',
    notifications: 'Уведомления',
    notif_balance: 'Ежедневный баланс (09:00)',
    notif_balance_sub: 'Утренний пуш: сколько добавилось к лимиту за вчера',
    notif_confirm: 'Подтверждение вывода',
    notif_confirm_sub: 'SMS и пуш о статусе транзакций',
    logout: 'Выйти из аккаунта',
    // months
    months: ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],
    monthsFull: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
  },
  uz: {
    appTag: 'Maoshingizga 24/7 ruxsat',
    cont: 'Davom etish', next: 'Davom etish', back: 'Orqaga',
    enterPhone: 'Telefon raqami bilan kirish', tos: 'Tugmani bosib, foydalanish shartlariga rozilik bildirasiz.',
    getCode: 'SMS-kodni olish',
    enterCode: 'SMS-kodni kiriting', sentTo: 'Kod yuborildi',
    resendIn: 'Qayta yuborish', resend: 'Yana yuborish',
    kycTitle: 'Shaxsingizni tasdiqlang',
    kycBody: 'Maʼlumotlaringizni himoyalash va maosh limitini hisoblash uchun shaxsingizni tasdiqlashimiz kerak.',
    kycBtn: 'MyID orqali tasdiqlash',
    kycDone: 'Shaxs tasdiqlandi', kycConfirm: 'Hammasi toʻgʻri, kabinetga oʻtish',
    fio: 'F.I.Sh.', pinfl: 'JShShIR', employer: 'Ish beruvchi', position: 'Lavozim',
    hi: 'Salom', avail: 'Yechib olish mumkin', soum: 'soʻm',
    daysWorked: 'kun ishlandi', totalSalary: 'Umumiy maosh', alreadyOut: 'Yechib olingan',
    withdraw: 'Pul yechish',
    nav_history: 'Tarix', nav_cards: 'Kartalar', nav_profile: 'Profil',
    recent: 'Soʻnggi amallar', viewAll: 'Barchasi',
    statusDone: 'Bajarildi', statusPending: 'Jarayonda', statusError: 'Xato',
    howCalc: 'Limit qanday hisoblanadi',
    howCalcBody: 'Summa avtomatik hisoblanadi:\n(Kunlik stavka × Ishlangan kunlar) × Kompaniya limiti (60%) − soliqlar.',
    gotIt: 'Tushunarli',
    chooseAmount: 'Qancha yechmoqchisiz?',
    available: 'Mavjud',
    quickAll: 'Hammasi', quickSums: 'Tezkor tanlov',
    commission: 'Tizim komissiyasi', willReceive: 'Kartaga tushadi',
    chooseCard: 'Qaysi kartaga?', cardsHint: 'Kartani tanlang — komissiya har birida koʻrsatilgan',
    cardCommission: 'Komissiya',
    addNewCard: 'Yangi karta qoʻshish',
    review: 'Tafsilotlarni tekshiring',
    requested: 'Soʻralgan', recvCard: 'Qabul qiluvchi karta',
    salaryDate: 'Maosh sanasi (ushlash)', returnAmount: 'Qaytarish summasi',
    agreeText1: 'Men ',
    agreeLoan: 'MMTT mikroqarz shartnomasi',
    agreeText2: ' va ',
    agreeOffer: 'Rizq ommaviy oferti',
    agreeText3: ' shartlari bilan tanishdim va OʻzR MK 271-moddasiga muvofiq qarz va komissiyalarni maoshimdan ushlashga rozilik beraman.',
    signGet: 'Shartnomani imzolab pulni olish',
    signTitle: 'Qarz shartnomasini imzolash',
    signBody: '{phone} raqamiga SMS-kod yuborildi. Ushbu kodni kiritish — MMTT bilan mikroqarz shartnomasini rasmiy imzolash, qoʻl bilan imzolashga teng.',
    successTitle: 'Tayyor!', successSub: 'Kartaga yuborildi',
    successHome: 'Bosh sahifaga', successAgain: 'Yana yechish',
    historyTitle: 'Tarix',
    filterAll: 'Barchasi', filterDone: 'Bajarilgan', filterPending: 'Jarayonda', filterError: 'Xatolar',
    period_month: 'Bu oy', period_prev: 'Oʻtgan oy', period_pick: 'Davr',
    today: 'Bugun', yesterday: 'Kecha',
    txDetails: 'Amal tafsilotlari', txId: 'Tranzaksiya ID', txTime: 'Vaqt',
    receipt: 'Kvitansiyani yuklab olish',
    verified: 'Tasdiqlangan',
    personalData: 'Shaxsiy maʼlumotlar',
    department: 'Boʻlim', phoneLabel: 'Telefon',
    settings: 'Sozlamalar', language: 'Til', theme: 'Mavzu', light: 'Yorugʻ', dark: 'Qorongʻi',
    notifications: 'Bildirishnomalar',
    notif_balance: 'Kunlik balans (09:00)',
    notif_balance_sub: 'Ertalabki push: kecha limitga qancha qoʻshildi',
    notif_confirm: 'Yechishni tasdiqlash',
    notif_confirm_sub: 'Tranzaksiya holati boʻyicha SMS va push',
    logout: 'Akkauntdan chiqish',
    months: ['yan','fev','mar','apr','may','iyn','iyl','avg','sen','okt','noy','dek'],
    monthsFull: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],
  },
};

// Format soum with thin spaces — 1 200 000
function fmtSum(n) {
  if (n == null || isNaN(n)) return '0';
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');
}

// Topbar with optional back + title + trailing
function RzTopBar({ left, title, right, onBack, t }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '14px 16px 10px', minHeight: 56,
    }}>
      <div style={{ width: 40, display: 'flex' }}>
        {onBack && (
          <button onClick={onBack} aria-label="Назад" style={{
            width: 40, height: 40, borderRadius: 12,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent',
          }}>
            <Icon name="arrow-left" size={22} />
          </button>
        )}
        {left}
      </div>
      <div style={{
        flex: 1, fontWeight: 700, fontSize: 17, letterSpacing: -0.2,
        textAlign: 'center', color: 'var(--rz-ink-950)',
      }}>{title}</div>
      <div style={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

// Bottom Sheet
function RzSheet({ open, onClose, children, height = 'auto' }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div className="rz-backdrop" onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(30,18,8,0.45)',
      }}/>
      <div className="rz-sheet" style={{
        position: 'relative', background: 'var(--rz-card)',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '12px 20px 28px', height,
        boxShadow: '0 -20px 60px rgba(40,20,0,0.18)',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 99,
          background: 'var(--rz-line)', margin: '0 auto 14px',
        }}/>
        {children}
      </div>
    </div>
  );
}

// Brand sparkle mark — 4-pointed concave star
function RzSparkle({ size = 28, color = 'var(--rz-green-600)', bg, radius = 0 }) {
  const sparkle = (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M32 2 Q32 26 8 32 Q32 38 32 62 Q32 38 56 32 Q32 26 32 2 Z" fill={bg ? 'white' : color}/>
    </svg>
  );
  if (!bg) return sparkle;
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: bg, display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 64 64" fill="none" aria-hidden>
        <path d="M32 2 Q32 26 8 32 Q32 38 32 62 Q32 38 56 32 Q32 26 32 2 Z" fill="white"/>
      </svg>
    </div>
  );
}

function RzLogo({ size = 28, color = 'var(--rz-green-600)', withWord = true }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <RzSparkle size={size} bg={color} radius={size * 0.28} />
      {withWord && (
        <span className="rz-display" style={{
          fontSize: size * 0.95,
          color: 'var(--rz-ink-950)', fontWeight: 700,
          letterSpacing: -1,
        }}>rizq</span>
      )}
    </div>
  );
}

// Bottom tab bar — premium floating pill, glassy dark + green-glow active state
function RzTabBar({ active, onNav, t }) {
  const tabs = [
    { id: 'home',    icon: 'home',    label: t.nav_home || (t === RZ_DICT.ru ? 'Главная' : 'Bosh') },
    { id: 'history', icon: 'history', label: t.nav_history },
    { id: 'cards',   icon: 'card',    label: t.nav_cards },
    { id: 'profile', icon: 'user',    label: t.nav_profile },
  ];
  return (
    <div style={{
      position: 'absolute', left: 16, right: 16,
      bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
      padding: 6,
      background: 'linear-gradient(180deg, #1a1f29 0%, #0b0d12 100%)',
      borderRadius: 999,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      boxShadow:
        '0 1px 0 rgba(255,255,255,0.10) inset, ' +
        '0 0 0 1px rgba(255,255,255,0.04), ' +
        '0 18px 44px rgba(11,13,18,0.40), ' +
        '0 4px 14px rgba(11,13,18,0.28)',
      zIndex: 50,
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        return (
          <button key={tab.id} onClick={() => onNav(tab.id)} style={{
            flex: isActive ? '0 0 auto' : 1,
            height: 46,
            padding: isActive ? '0 18px 0 14px' : 0,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: isActive
              ? 'linear-gradient(135deg, oklch(0.76 0.20 148) 0%, oklch(0.55 0.20 150) 100%)'
              : 'transparent',
            color: isActive ? 'white' : 'rgba(255,255,255,0.50)',
            borderRadius: 999,
            boxShadow: isActive
              ? '0 1px 0 rgba(255,255,255,0.30) inset, ' +
                '0 0 0 1px oklch(0.80 0.18 148 / 0.30), ' +
                '0 6px 18px oklch(0.62 0.22 148 / 0.55), ' +
                '0 0 22px oklch(0.70 0.22 148 / 0.35)'
              : 'none',
            transition: 'all .28s cubic-bezier(.2,.7,.2,1)',
            position: 'relative',
          }}>
            <Icon name={tab.icon} size={20} stroke={isActive ? 2.4 : 1.8}
              color={isActive ? 'white' : 'rgba(255,255,255,0.55)'}/>
            {isActive && (
              <span style={{
                fontSize: 13, fontWeight: 700, letterSpacing: -0.2,
                textShadow: '0 1px 0 oklch(0.40 0.18 152 / 0.35)',
              }}>{tab.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Bank card visual
function RzBankCard({ brand, last4, name, commission, selected, onClick, t, lang, soumSize = 22 }) {
  const isHumo = brand === 'humo';
  const bg = isHumo
    ? 'linear-gradient(135deg, oklch(0.50 0.13 155), oklch(0.36 0.10 158))'
    : 'linear-gradient(135deg, oklch(0.45 0.14 252), oklch(0.32 0.13 258))';
  const brandLabel = isHumo ? 'Humo' : 'Uzcard';
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left',
      borderRadius: 18, padding: 0,
      boxShadow: selected ? '0 0 0 2.5px var(--rz-ink-950)' : '0 1px 2px rgba(40,20,0,0.05), 0 6px 16px rgba(40,20,0,0.08)',
      transition: 'box-shadow .15s',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        background: bg, color: 'white', padding: '16px 18px 14px',
        position: 'relative', minHeight: 132,
      }}>
        {/* decorative arcs */}
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', right: -30, top: -20, opacity: 0.18 }}>
          <circle cx="80" cy="40" r="60" stroke="white" strokeWidth="1" fill="none"/>
          <circle cx="80" cy="40" r="40" stroke="white" strokeWidth="1" fill="none"/>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, opacity: .8, textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 600 }}>{name}</div>
            <div className="rz-num" style={{ marginTop: 6, fontSize: 15, fontWeight: 600, letterSpacing: 2 }}>
              •••• {last4}
            </div>
          </div>
          <div style={{
            fontWeight: 700,
            background: 'rgba(255,255,255,0.16)', padding: '4px 10px',
            borderRadius: 8, fontSize: 11, letterSpacing: 0.4,
            textTransform: 'uppercase',
          }}>{brandLabel}</div>
        </div>
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 10, opacity: .7, textTransform: 'uppercase', letterSpacing: 1.2 }}>{t.cardCommission}</div>
          <div className="rz-num" style={{ fontWeight: 700, fontSize: soumSize }}>
            {fmtSum(commission)} <span style={{ fontSize: 12, opacity: .8, fontWeight: 600 }}>{t.soum}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// Status badge for transactions
function RzStatusBadge({ status, t, mini }) {
  const cfg = {
    done:    { bg: 'var(--rz-green-50)', fg: 'var(--rz-green-700)', icon: 'check',  label: t.statusDone },
    pending: { bg: 'var(--rz-amber-50)', fg: 'oklch(0.40 0.13 70)', icon: 'clock',  label: t.statusPending },
    error:   { bg: 'var(--rz-red-50)',   fg: 'var(--rz-red)',       icon: 'close',  label: t.statusError },
  }[status];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: mini ? '4px 9px' : '6px 12px', borderRadius: 999,
      background: cfg.bg, color: cfg.fg,
      fontWeight: 600, fontSize: mini ? 11 : 12,
    }}>
      <Icon name={cfg.icon} size={mini ? 12 : 14} stroke={2} />
      {cfg.label}
    </div>
  );
}

// OTP input — 4 cells
function RzOtpInput({ value, onChange, length = 4, autoFocus = true, error }) {
  const inputsRef = React.useRef([]);
  const handle = (i, v) => {
    const ch = v.replace(/\D/g, '').slice(-1);
    const next = (value + '').padEnd(length, ' ').split('');
    next[i] = ch || ' ';
    const joined = next.join('').replace(/ /g, '');
    onChange(joined);
    if (ch && i < length - 1) inputsRef.current[i + 1]?.focus();
  };
  const back = (i, e) => {
    if (e.key === 'Backspace') {
      if (!value[i] && i > 0) inputsRef.current[i - 1]?.focus();
      const arr = (value + '').split('');
      arr.splice(i, 1);
      onChange(arr.join(''));
    }
  };
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      {Array.from({ length }).map((_, i) => {
        const ch = (value || '')[i] || '';
        return (
          <input
            key={i}
            ref={el => inputsRef.current[i] = el}
            value={ch}
            onChange={e => handle(i, e.target.value)}
            onKeyDown={e => back(i, e)}
            inputMode="numeric"
            autoFocus={autoFocus && i === 0}
            style={{
              width: 60, height: 72,
              borderRadius: 16,
              border: `1.5px solid ${error ? 'var(--rz-red)' : (ch ? 'var(--rz-ink-950)' : 'var(--rz-line)')}`,
              background: 'var(--rz-card)',
              fontSize: 28, fontWeight: 700,
              textAlign: 'center', color: 'var(--rz-ink-950)',
              outline: 'none', fontFamily: 'var(--font-sans)',
              transition: 'border-color .15s',
            }}
          />
        );
      })}
    </div>
  );
}

// expose
Object.assign(window, {
  RZ_DICT, fmtSum,
  RzTopBar, RzSheet, RzLogo, RzSparkle, RzTabBar, RzBankCard, RzStatusBadge, RzOtpInput,
});
