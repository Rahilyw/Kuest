export function getAdminAllowlist(): string[] {
  const raw = process.env.ADMIN_ALLOWED_EMAILS ?? ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false

  const allowlist = getAdminAllowlist()

  if (allowlist.length === 0) {
    if (process.env.NODE_ENV === 'production') {
      return false
    }
    // Dev fallback: warn and allow so local iteration isn't blocked.
    // Set ADMIN_ALLOWED_EMAILS before deploying.
    console.warn(
      '[admin-auth] ADMIN_ALLOWED_EMAILS is not set. Allowing all emails in development.'
    )
    return true
  }

  return allowlist.includes(email.toLowerCase())
}
