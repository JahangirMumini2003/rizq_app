// Rizq — main app shell. Routes screens, holds state.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "ru",
  "dark": false,
  "startScreen": "home",
  "primary": "#4d8e5b",
  "simEmployerFound": true
}/*EDITMODE-END*/;

const DEMO_USER = {
  initials: 'ЮБ',
  firstName: 'Бобур',
  fio: 'Юлдашев Бобур',
  position: 'Старший менеджер',
  phone: '901234567',
};

const DEMO_CARDS = [
  { id: 'c1', brand: 'humo',   last4: '4218', name: 'KAPITALBANK' },
  { id: 'c2', brand: 'uzcard', last4: '9032', name: 'IPOTEKA' },
];

const DEMO_TXS = [
  {
    id: 'TX-2026-06-12-A8F1',
    amount: 800000, commission: 24000,
    cardBrand: 'humo', last4: '4218',
    status: 'done',
    timeShort: '12 июн · 09:14',
    timeFull: '12 июня 2026, 09:14:22',
    groupKey: '2026-06-12', groupLabel: { ru: 'Сегодня', uz: 'Bugun' },
  },
  {
    id: 'TX-2026-06-11-3E4D',
    amount: 350000, commission: 10500,
    cardBrand: 'uzcard', last4: '9032',
    status: 'pending',
    timeShort: '11 июн · 17:42',
    timeFull: '11 июня 2026, 17:42:10',
    groupKey: '2026-06-11', groupLabel: { ru: 'Вчера', uz: 'Kecha' },
  },
  {
    id: 'TX-2026-06-08-B201',
    amount: 1200000, commission: 36000,
    cardBrand: 'humo', last4: '4218',
    status: 'done',
    timeShort: '8 июн · 11:03',
    timeFull: '8 июня 2026, 11:03:45',
    groupKey: '2026-06-08', groupLabel: { ru: '8 июня', uz: '8 iyun' },
  },
  {
    id: 'TX-2026-05-29-FE1A',
    amount: 250000, commission: 7500,
    cardBrand: 'uzcard', last4: '9032',
    status: 'error',
    timeShort: '29 май · 20:18',
    timeFull: '29 мая 2026, 20:18:32',
    groupKey: '2026-05-29', groupLabel: { ru: '29 мая', uz: '29 may' },
  },
  {
    id: 'TX-2026-05-22-CC07',
    amount: 600000, commission: 18000,
    cardBrand: 'humo', last4: '4218',
    status: 'done',
    timeShort: '22 май · 10:05',
    timeFull: '22 мая 2026, 10:05:11',
    groupKey: '2026-05-22', groupLabel: { ru: '22 мая', uz: '22 may' },
  },
];

const DEMO_BALANCE = {
  available: 3450000,
  totalSalary: 9500000,
  withdrawn: 1450000,
  daysWorked: 14,
  daysTotal: 22,
};

const SALARY_DATE = { day: 30, month: 5 }; // 30 июня

function useIsMobile(query = '(max-width: 640px)') {
  const [m, setM] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    if (new URLSearchParams(window.location.search).has('mobile')) return true;
    return window.matchMedia(query).matches;
  });
  React.useEffect(() => {
    if (new URLSearchParams(window.location.search).has('mobile')) return;
    const mq = window.matchMedia(query);
    const fn = (e) => setM(e.matches);
    mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn);
    return () => mq.removeEventListener ? mq.removeEventListener('change', fn) : mq.removeListener(fn);
  }, [query]);
  return m;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const lang = t.lang;
  const tr = RZ_DICT[lang];
  const isMobile = useIsMobile();
  React.useEffect(() => {
    document.documentElement.classList.toggle('is-mobile', isMobile);
  }, [isMobile]);

  // navigation stack — first item is current
  const [stack, setStack] = React.useState(['phone']);
  const current = stack[stack.length - 1];

  // jump to start screen when tweak changes (only on first load tweak change)
  const startRef = React.useRef(t.startScreen);
  React.useEffect(() => {
    if (t.startScreen !== startRef.current) {
      startRef.current = t.startScreen;
      setStack([t.startScreen]);
    }
  }, [t.startScreen]);

  // user / data
  const [phoneDigits, setPhoneDigits] = React.useState(DEMO_USER.phone);
  // withdrawal state
  const [wAmount, setWAmount] = React.useState(0);
  const [wCardId, setWCardId] = React.useState(DEMO_CARDS[0].id);

  // sheets
  const [openTx, setOpenTx] = React.useState(null);
  const [howCalcOpen, setHowCalcOpen] = React.useState(false);

  // profile settings
  const [settings, setSettings] = React.useState({
    lang: lang, dark: t.dark, notifBalance: true, notifConfirm: true,
  });
  React.useEffect(() => { setSettings(s => ({ ...s, lang, dark: t.dark })); }, [lang, t.dark]);

  const push = (s) => setStack(st => [...st, s]);
  const pop  = () => setStack(st => st.length > 1 ? st.slice(0, -1) : st);
  const reset = (s) => setStack([s]);
  // dev helper for screenshot verification
  React.useEffect(() => { window.__rzGo = (s) => setStack([s]); }, []);

  const onSet = (k, v) => {
    setSettings(s => ({ ...s, [k]: v }));
    if (k === 'lang') setTweak('lang', v);
    if (k === 'dark') setTweak('dark', v);
  };

  const selectedCard = DEMO_CARDS.find(c => c.id === wCardId) || DEMO_CARDS[0];

  let screen = null;
  switch (current) {
    case 'phone':
      screen = <PhoneScreen
        t={tr} lang={lang}
        onSubmit={(d) => { setPhoneDigits(d); push('otp'); }}
        onLangToggle={() => setTweak('lang', lang === 'ru' ? 'uz' : 'ru')}
      />;
      break;
    case 'otp':
      screen = <OtpScreen
        t={tr} lang={lang} phone={phoneDigits}
        onBack={pop}
        onSubmit={() => push('pinfl')}
      />;
      break;
    case 'pinfl':
      screen = <PinflScreen
        t={tr} lang={lang}
        simFound={t.simEmployerFound}
        onBack={pop}
        onResult={({ found }) => push(found ? 'employer-found' : 'employer-not-found')}
      />;
      break;
    case 'employer-found':
      screen = <EmployerFoundScreen t={tr} lang={lang} onBack={pop} onSubmit={() => push('kyc-intro')}/>;
      break;
    case 'employer-not-found':
      screen = <EmployerNotFoundScreen t={tr} lang={lang} onBack={pop} onSubmit={() => push('employer-submitted')}/>;
      break;
    case 'employer-submitted':
      screen = <EmployerSubmittedScreen t={tr} lang={lang} employer={{ name: '' }} onRestart={() => reset('phone')}/>;
      break;
    case 'kyc-intro':
      screen = <KycIntroScreen t={tr} lang={lang} onBack={pop} onSubmit={() => push('kyc-done')}/>;
      break;
    case 'kyc-done':
      screen = <KycDoneScreen t={tr} lang={lang} onSubmit={() => reset('home')}/>;
      break;
    case 'home':
      screen = <HomeScreen
        t={tr} lang={lang} user={DEMO_USER} balance={DEMO_BALANCE}
        recentTxs={DEMO_TXS.slice(0, 3)}
        onAction={(a) => { if (a === 'withdraw') { setWAmount(0); push('w-amount'); } }}
        onTx={setOpenTx}
        onOpenInfo={() => setHowCalcOpen(true)}
        onNav={(n) => n === 'home' ? reset('home') : push(n)}
      />;
      break;
    case 'w-amount':
      screen = <WithdrawAmount
        t={tr} lang={lang} balance={DEMO_BALANCE}
        value={wAmount} onChange={setWAmount}
        onBack={pop} onNext={() => push('w-card')}
      />;
      break;
    case 'w-card':
      screen = <WithdrawCard
        t={tr} lang={lang} amount={wAmount}
        cards={DEMO_CARDS} selectedId={wCardId} onSelect={setWCardId}
        onBack={pop} onNext={() => push('w-review')}
        onAddCard={() => {}}
      />;
      break;
    case 'w-review':
      screen = <WithdrawReview
        t={tr} lang={lang} amount={wAmount} card={selectedCard}
        salaryDate={SALARY_DATE}
        onBack={pop} onNext={() => push('w-sign')}
        onOpenLoan={() => {}} onOpenOffer={() => {}}
      />;
      break;
    case 'w-sign':
      screen = <WithdrawSign
        t={tr} lang={lang} phone={phoneDigits}
        onBack={pop} onSubmit={() => push('w-success')}
      />;
      break;
    case 'w-success':
      screen = <WithdrawSuccess
        t={tr} lang={lang} amount={wAmount} card={selectedCard}
        onHome={() => reset('home')}
        onAgain={() => { setWAmount(0); reset('home'); push('w-amount'); }}
      />;
      break;
    case 'history':
      screen = <HistoryScreen
        t={tr} lang={lang} txs={DEMO_TXS}
        onBack={() => reset('home')} onTx={setOpenTx}
      />;
      break;
    case 'profile':
      screen = <ProfileScreen
        t={tr} lang={lang} user={DEMO_USER}
        onBack={() => reset('home')} settings={settings} onSet={onSet}
        onLogout={() => reset('phone')}
      />;
      break;
    case 'cards':
      screen = <CardsScreen
        t={tr} lang={lang} cards={DEMO_CARDS} onBack={() => reset('home')}
      />;
      break;
    default:
      screen = <PhoneScreen t={tr} lang={lang} onSubmit={() => push('home')}/>;
  }

  const TAB_SCREENS = new Set(['home', 'history', 'cards', 'profile']);
  const showTabs = TAB_SCREENS.has(current);

  // Inner content (screens + tabs + sheets)
  const content = (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {screen}
      {showTabs && <RzTabBar active={current} t={tr} onNav={(n) => n === 'home' ? reset('home') : (current !== n && reset(n))}/>}
      <TxDetailsSheet tx={openTx} t={tr} lang={lang} onClose={() => setOpenTx(null)}/>
      <HowCalcSheet open={howCalcOpen} t={tr} lang={lang} onClose={() => setHowCalcOpen(false)}/>
    </div>
  );

  return (
    <div className={t.dark ? 'rz-dark' : ''} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: isMobile ? '100%' : 'auto', height: isMobile ? '100%' : 'auto',
    }}>
      {isMobile ? (
        <div className="rz-mobile-shell">{content}</div>
      ) : (
        <IOSDevice dark={t.dark} width={402} height={874}>
          {content}
        </IOSDevice>
      )}

      {!isMobile && (
      <TweaksPanel title="Tweaks">
        <TweakSection label={tr === RZ_DICT.ru ? 'Старт' : 'Boshlanish'}/>
        <TweakSelect
          label={lang === 'ru' ? 'Экран' : 'Ekran'}
          value={t.startScreen}
          options={[
            { value: 'phone', label: lang === 'ru' ? '1. Вход (телефон)' : '1. Kirish (telefon)' },
            { value: 'otp', label: lang === 'ru' ? '2. OTP' : '2. OTP' },
            { value: 'pinfl', label: lang === 'ru' ? '3. ПИНФЛ' : '3. PINFL' },
            { value: 'employer-found', label: lang === 'ru' ? '4a. Работодатель найден' : '4a. Topildi' },
            { value: 'employer-not-found', label: lang === 'ru' ? '4b. Работодателя нет' : '4b. Topilmadi' },
            { value: 'employer-submitted', label: lang === 'ru' ? '4b+. Запрос отправлен' : '4b+. Yuborildi' },
            { value: 'kyc-intro', label: lang === 'ru' ? '5. MyID' : '5. MyID' },
            { value: 'kyc-done', label: lang === 'ru' ? '6. Данные KYC' : '6. KYC' },
            { value: 'home', label: lang === 'ru' ? '7. Главная' : '7. Bosh sahifa' },
            { value: 'w-amount', label: lang === 'ru' ? '8. Вывод: сумма' : '8. Yechish: summa' },
            { value: 'w-card', label: lang === 'ru' ? '9. Вывод: карта' : '9. Yechish: karta' },
            { value: 'w-review', label: lang === 'ru' ? '10. Вывод: проверка' : '10. Yechish: tekshirish' },
            { value: 'w-sign', label: lang === 'ru' ? '11. Подписание' : '11. Imzolash' },
            { value: 'w-success', label: lang === 'ru' ? '12. Готово' : '12. Tayyor' },
            { value: 'history', label: lang === 'ru' ? '13. История' : '13. Tarix' },
            { value: 'profile', label: lang === 'ru' ? '14. Профиль' : '14. Profil' },
            { value: 'cards', label: lang === 'ru' ? '15. Карты' : '15. Kartalar' },
          ]}
          onChange={(v) => setTweak('startScreen', v)}
        />
        <TweakSection label={lang === 'ru' ? 'Симуляция' : 'Simulyatsiya'}/>
        <TweakRadio
          label={lang === 'ru' ? 'Работодатель в базе' : 'Ish beruvchi bazada'}
          value={t.simEmployerFound ? 'yes' : 'no'}
          options={[{ value: 'yes', label: lang === 'ru' ? 'Да' : 'Ha' }, { value: 'no', label: lang === 'ru' ? 'Нет' : 'Yoʻq' }]}
          onChange={(v) => setTweak('simEmployerFound', v === 'yes')}
        />
        <TweakSection label={lang === 'ru' ? 'Тема' : 'Mavzu'}/>
        <TweakRadio
          label={lang === 'ru' ? 'Язык' : 'Til'}
          value={lang}
          options={[{ value: 'ru', label: 'RU' }, { value: 'uz', label: 'UZ' }]}
          onChange={(v) => setTweak('lang', v)}
        />
        <TweakToggle
          label={lang === 'ru' ? 'Тёмная тема' : 'Qorongʻi mavzu'}
          value={t.dark}
          onChange={(v) => setTweak('dark', v)}
        />
      </TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
