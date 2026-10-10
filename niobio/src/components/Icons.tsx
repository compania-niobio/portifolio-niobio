const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

export const IconInstagram = () => (
  <svg {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
);

export const IconWhatsapp = () => (
  <svg {...base}>
    <path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 19L4 20z" />
    <path d="M9.2 8.6c-.5 2.6 3 6.300 6 6.200l1-1.400-2-1.100-.9.800c-.9-.3-2-1.400-2.300-2.300l.8-.9-1.100-2z" />
  </svg>
);

export const IconMail = () => (
  <svg {...base}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M4 7.500l8 6 8-6" />
  </svg>
);

export const IconCheck = () => (
  <svg {...base}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const IconArrowDown = () => (
  <svg {...base}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </svg>
);

export const IconArrowUpRight = () => (
  <svg {...base}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

export const IconArrowUp = () => (
  <svg {...base}>
    <path d="M12 20V4M6 10l6-6 6 6" />
  </svg>
);
