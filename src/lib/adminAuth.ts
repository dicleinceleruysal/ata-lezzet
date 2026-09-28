export const ADMIN_COOKIE_NAME = 'admin_session';

const DEFAULT_PASSWORD = 'atalezzet2026';
const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || 'ata-lezzet-secure-salt-2026';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

export async function hashString(str: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function getExpectedAdminToken(): Promise<string> {
  const password = getAdminPassword();
  return hashString(`${password}:${AUTH_SECRET}`);
}

export async function verifyAdminToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const expected = await getExpectedAdminToken();
  return token === expected;
}
