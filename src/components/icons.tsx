import React from "react";

type IProps = { size?: number; color?: string };

const S: React.FC<{ size: number; children: React.ReactNode; vb?: string }> = ({
  size,
  children,
  vb = "0 0 24 24",
}) => (
  <svg width={size} height={size} viewBox={vb} fill="none" xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

export const Globe: React.FC<IProps> = ({ size = 26, color = "#111" }) => (
  <S size={size}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" />
    <path
      d="M3 12h18M12 3c2.5 2.4 3.8 5.5 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.5-3.8-9S9.5 5.4 12 3Z"
      stroke={color}
      strokeWidth="1.7"
    />
  </S>
);

export const Instagram: React.FC<IProps> = ({ size = 26, color = "#111" }) => (
  <S size={size}>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke={color} strokeWidth="1.7" />
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.7" />
    <circle cx="17.2" cy="6.8" r="1.15" fill={color} />
  </S>
);

export const Facebook: React.FC<IProps> = ({ size = 26, color = "#111" }) => (
  <S size={size}>
    <path
      d="M14.5 8.5V6.9c0-.9.3-1.4 1.5-1.4H17.5V2.6C17 2.5 16 2.4 15 2.4c-2.4 0-3.9 1.4-3.9 4V8.5H8.4v3.2h2.7V21.5h3.4v-9.8h2.6l.4-3.2h-3Z"
      fill={color}
    />
  </S>
);

export const Linkedin: React.FC<IProps> = ({ size = 26, color = "#111" }) => (
  <S size={size}>
    <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="1.7" />
    <path
      d="M7 10v7M7 7.2v.01M11 17v-4c0-1.4 1-2.4 2.3-2.4S15.6 11.6 15.6 13v4M11 17v-7"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </S>
);

export const Youtube: React.FC<IProps> = ({ size = 26, color = "#111" }) => (
  <S size={size}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke={color} strokeWidth="1.7" />
    <path d="M10.4 9.3l4.4 2.7-4.4 2.7V9.3Z" fill={color} />
  </S>
);

export const Whatsapp: React.FC<IProps> = ({ size = 26, color = "#111" }) => (
  <S size={size}>
    <path
      d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M9 8.4c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.5l-.5.6c-.1.1-.2.3-.1.5.2.5.7 1.2 1.3 1.7.7.6 1.3.8 1.6.9.2.1.4 0 .5-.1l.5-.6c.2-.2.4-.2.5-.1l1.5.7c.3.1.4.3.4.5s0 .9-.4 1.4c-.4.5-1.2.9-1.9.9-1.3 0-3.2-.7-4.7-2.2S8.2 12 8.2 10.7c0-.7.4-1.5.8-1.9Z"
      fill={color}
    />
  </S>
);

export const Pin: React.FC<IProps> = ({ size = 26, color = "#111" }) => (
  <S size={size}>
    <path
      d="M12 21c4-4.2 6-7.3 6-10a6 6 0 1 0-12 0c0 2.7 2 5.8 6 10Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="11" r="2.3" stroke={color} strokeWidth="1.7" />
  </S>
);

export const Phone: React.FC<IProps> = ({ size = 26, color = "#111" }) => (
  <S size={size}>
    <path
      d="M6.2 3.5h2.8l1.4 3.5-1.8 1.3a11 11 0 0 0 4.6 4.6l1.3-1.8 3.5 1.4v2.8c0 1-.8 1.7-1.8 1.6C13 20.1 3.9 11 3.6 5.3c-.1-1 .7-1.8 1.6-1.8Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </S>
);

export const Chat: React.FC<IProps> = ({ size = 26, color = "#111" }) => (
  <S size={size}>
    <path
      d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 16.5H9l-4 3.5V16.5H4A1.5 1.5 0 0 1 2.5 15V7A1.5 1.5 0 0 1 4 5.5Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M7 10h10M7 12.6h6" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </S>
);
