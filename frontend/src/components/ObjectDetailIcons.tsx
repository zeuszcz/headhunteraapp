/** Небольшие иконки для карточки объекта (stroke, currentColor). */

type IconProps = { className?: string };

export function IconPin({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-8-4.5-8-11a8 8 0 0 1 16 0c0 6.5-8 11-8 11z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconBriefcase({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconStatus({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBuilding({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 21V8l8-5 8 5v13" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 11h2M13 11h2M9 14h2M13 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 21v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 11a3 3 0 1 0 0-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M21 21v-1a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconUsersGroup({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="16" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M4 20v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1M12 20v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconCalendar({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconWallet({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V6z" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 12h3v4h-3a2 2 0 1 1 0-4z" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconZap({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconClipboard({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 4h6l1 2h3v14H5V6h3l1-2z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconWrench({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14.7 6.3a4 4 0 0 0-5.6 5.6L5 16v3h3l4.1-4.1a4 4 0 0 0 5.6-5.6l-2.1 2.1-2.8-2.8 2.1-2.1z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMessage({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function IconFileText({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M14 2v6h6M8 13h8M8 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
