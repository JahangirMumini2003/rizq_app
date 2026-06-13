// Rizq line icons — single set, hand-feel stroke
const Icon = ({ name, size = 24, stroke = 1.7, color = 'currentColor', style }) => {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth: stroke,
    strokeLinecap: 'round', strokeLinejoin: 'round', style,
  };
  switch (name) {
    case 'arrow-up':    return <svg {...p}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case 'arrow-down':  return <svg {...p}><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
    case 'arrow-right': return <svg {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'arrow-left':  return <svg {...p}><path d="M19 12H5M11 19l-7-7 7-7"/></svg>;
    case 'chevron-right': return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case 'chevron-down':  return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>;
    case 'chevron-up':    return <svg {...p}><path d="M18 15l-6-6-6 6"/></svg>;
    case 'close': return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'check': return <svg {...p}><path d="M5 12l5 5L20 7"/></svg>;
    case 'info':  return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 8v.01"/></svg>;
    case 'bell':  return <svg {...p}><path d="M12 3a5 5 0 0 0-5 5v3.5c0 1.6-.7 3.1-1.9 4.1L4 17h16l-1.1-1.4A5.4 5.4 0 0 1 17 12.2V8a5 5 0 0 0-5-5Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>;
    case 'home':  return <svg {...p}><path d="M4 11l8-7 8 7v8a2 2 0 0 1-2 2h-3v-6h-6v6H6a2 2 0 0 1-2-2Z"/></svg>;
    case 'history': return <svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>;
    case 'card':  return <svg {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/></svg>;
    case 'user':  return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case 'wallet': return <svg {...p}><path d="M3 7a2 2 0 0 1 2-2h12v4"/><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="16.5" cy="13.5" r="1.2" fill={color}/></svg>;
    case 'download': return <svg {...p}><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></svg>;
    case 'shield':   return <svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'lock':     return <svg {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>;
    case 'doc':      return <svg {...p}><path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M9 14h6M9 18h4"/></svg>;
    case 'phone':    return <svg {...p}><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg>;
    case 'clock':    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'plus':     return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'sun':      return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>;
    case 'moon':     return <svg {...p}><path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/></svg>;
    case 'logout':   return <svg {...p}><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="M15 8l4 4-4 4M19 12H9"/></svg>;
    case 'globe':    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'filter':   return <svg {...p}><path d="M4 5h16l-6 8v6l-4-2v-4Z"/></svg>;
    case 'calendar': return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case 'spark':    return <svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/></svg>;
    case 'eye':      return <svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'leaf':     return <svg {...p}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z"/><path d="M5 19c4-4 8-8 14-14"/></svg>;
    default: return null;
  }
};

window.Icon = Icon;
