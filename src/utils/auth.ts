export interface AuthUser {
  email: string;
  name: string;
}

const AUTH_STORAGE_KEY = 'sdr_prospecting_auth_session_v1';

export function getStoredAuth(): { token: string; user: AuthUser } | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAuth(token: string, user: AuthUser): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
  } catch (err) {
    console.error('Erro ao salvar sessão auth', err);
  }
}

export function clearStoredAuth(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.error('Erro ao limpar sessão auth', err);
  }
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; message?: string; user?: AuthUser; token?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Credenciais inválidas ou acesso não autorizado.'
      };
    }

    setStoredAuth(data.token, data.user);
    return {
      success: true,
      token: data.token,
      user: data.user
    };
  } catch (err) {
    console.error('Erro na requisição de login:', err);
    return {
      success: false,
      message: 'Falha na comunicação com o servidor. Tente novamente.'
    };
  }
}

export async function verifySession(): Promise<boolean> {
  const current = getStoredAuth();
  if (!current?.token) return false;

  try {
    const res = await fetch('/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${current.token}`
      }
    });
    if (!res.ok) {
      clearStoredAuth();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
