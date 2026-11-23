// Нимгэн шугаман icon-ууд — бүгдийг өөрөө SVG-ээр зурсан.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Svg = ({ size = 20, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    {children}
  </svg>
);

const glyphs = {
  about: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  projects: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="3.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="3.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </>
  ),
  contact: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M15.5 12v1.5a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.3 6.7" />
    </>
  ),
  terminal: (
    <>
      <path d="M5 7l5 5-5 5" />
      <path d="M12.5 17h6.5" />
    </>
  ),
  cipher: (
    <>
      <circle cx="8" cy="15" r="4.5" />
      <path d="M11.5 12.5L20 4M16.5 7.5l2.5 2.5M14 10l2 2" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
};

export function AppIcon({ id, size }) {
  return <Svg size={size}>{glyphs[id]}</Svg>;
}

export const Mark = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true">
    <rect width="14" height="14" fill="var(--accent)" />
    <rect x="4" y="4" width="6" height="6" fill="var(--bg)" />
  </svg>
);

export const SunIcon = () => (
  <Svg size={16}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </Svg>
);
export const MoonIcon = () => (
  <Svg size={16}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </Svg>
);
export const SoundIcon = ({ on }) => (
  <Svg size={16}>
    <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
    {on ? <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10" /> : <path d="M16 10l4 4M20 10l-4 4" />}
  </Svg>
);
export const PowerIcon = ({ size = 16 }) => (
  <Svg size={size}>
    <path d="M12 3.5v8M6.6 6.6a7.5 7.5 0 1 0 10.8 0" />
  </Svg>
);
export const ArrowIcon = ({ size = 16 }) => (
  <Svg size={size}>
    <path d="M7 17L17 7M8 7h9v9" />
  </Svg>
);
export const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
  </svg>
);
export const BackIcon = () => (
  <Svg size={16}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
);
export const SearchIcon = () => (
  <Svg size={18}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4 4" />
  </Svg>
);
export const ActionIcon = () => (
  <Svg size={18}>
    <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />
  </Svg>
);
export const LinkIcon = () => (
  <Svg size={18}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </Svg>
);
