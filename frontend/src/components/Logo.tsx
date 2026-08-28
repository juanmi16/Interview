type LogoProps = { size?: number; className?: string }

// Atenea's owl (goddess of wisdom). Indigo badge + gold accents.
export default function Logo({ size = 56, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Atenea"
    >
      {/* Indigo rounded badge */}
      <rect width="64" height="64" rx="15" fill="#4F46E5" />

      {/* Gold ear tufts */}
      <path d="M15 13 L26 21 L14 24 Z" fill="#F59E0B" />
      <path d="M49 13 L38 21 L50 24 Z" fill="#F59E0B" />

      {/* White owl eyes */}
      <circle cx="24" cy="30" r="10" fill="#FFFFFF" />
      <circle cx="40" cy="30" r="10" fill="#FFFFFF" />

      {/* Deep-indigo pupils (looking inward) */}
      <circle cx="27" cy="30" r="4.5" fill="#312E81" />
      <circle cx="37" cy="30" r="4.5" fill="#312E81" />

      {/* Gold beak */}
      <path d="M32 35 L28 41 L36 41 Z" fill="#F59E0B" />
    </svg>
  )
}
