import { setStoredAuth, AuthUser } from './auth';

const STORAGE_BIOMETRIC_KEY = 'sdr_biometric_credential_v1';
const STORAGE_BIOMETRIC_EMAIL = 'sdr_biometric_email_v1';
const STORAGE_DURATION_KEY = 'sdr_login_duration_days_v1';

export function getSavedBiometricEmail(): string | null {
  try {
    return localStorage.getItem(STORAGE_BIOMETRIC_EMAIL);
  } catch {
    return null;
  }
}

export function hasBiometricSaved(): boolean {
  try {
    return Boolean(localStorage.getItem(STORAGE_BIOMETRIC_KEY) && localStorage.getItem(STORAGE_BIOMETRIC_EMAIL));
  } catch {
    return false;
  }
}

export function getPreferredDuration(): number {
  try {
    const val = localStorage.getItem(STORAGE_DURATION_KEY);
    return val ? parseInt(val, 10) : 30; // 30 dias padrão
  } catch {
    return 30;
  }
}

export function setPreferredDuration(days: number): void {
  try {
    localStorage.setItem(STORAGE_DURATION_KEY, String(days));
  } catch {
    // ignore
  }
}

/**
 * Verifica se o dispositivo do usuário (Android, iPhone, Mac, Windows) suporta biometria (Digital / Face ID)
 */
export async function isBiometricsAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!window.PublicKeyCredential) return false;

  try {
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Registra a digital / biometria no aparelho usando WebAuthn
 */
export async function registerDeviceBiometrics(email: string): Promise<boolean> {
  if (!window.PublicKeyCredential || !navigator.credentials) {
    throw new Error('Biometria não suportada neste navegador.');
  }

  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);
  const userId = new TextEncoder().encode(email);

  try {
    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'SDR Rota SP',
          id: window.location.hostname
        },
        user: {
          id: userId,
          name: email,
          displayName: email.split('@')[0]
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },  // ES256
          { type: 'public-key', alg: -257 } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred',
          requireResidentKey: false
        },
        timeout: 60000
      }
    })) as PublicKeyCredential;

    if (credential && credential.id) {
      localStorage.setItem(STORAGE_BIOMETRIC_KEY, credential.id);
      localStorage.setItem(STORAGE_BIOMETRIC_EMAIL, email);
      return true;
    }
    return false;
  } catch (err: any) {
    console.warn('Registro de biometria cancelado ou falhou:', err);
    // Se for erro de permissão ou cancelamento do usuário
    throw err;
  }
}

/**
 * Autentica com a digital / Face ID salva no aparelho
 */
export async function loginWithBiometrics(durationDays: number = 30): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
  const savedEmail = getSavedBiometricEmail();
  const credentialId = localStorage.getItem(STORAGE_BIOMETRIC_KEY);

  if (!savedEmail || !credentialId) {
    return {
      success: false,
      message: 'Nenhuma digital registrada neste aparelho. Faça login com senha primeiro para ativar.'
    };
  }

  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  try {
    // Converte o base64Url / string para Uint8Array para WebAuthn
    const rawId = Uint8Array.from(atob(credentialId.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

    // Aciona o sensor nativo de biometria (Digital no Android ou Touch ID / Face ID no iPhone)
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [
          {
            type: 'public-key',
            id: rawId
          }
        ],
        userVerification: 'preferred',
        timeout: 60000
      }
    });

    if (!assertion) {
      return { success: false, message: 'Autenticação biométrica não concluída.' };
    }

    // Chama backend para emitir novo token de sessão com a validade desejada
    const res = await fetch('/api/auth/biometric-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: savedEmail,
        credentialId,
        durationDays
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Falha ao autenticar com a biometria.'
      };
    }

    setStoredAuth(data.token, data.user);
    return {
      success: true,
      user: data.user
    };
  } catch (err: any) {
    console.warn('Erro na autenticação biométrica:', err);
    if (err.name === 'NotAllowedError') {
      return { success: false, message: 'Leitura da digital cancelada ou não reconhecida.' };
    }
    return { success: false, message: 'Não foi possível ler a digital. Use sua senha.' };
  }
}

export function clearBiometrics(): void {
  try {
    localStorage.removeItem(STORAGE_BIOMETRIC_KEY);
    localStorage.removeItem(STORAGE_BIOMETRIC_EMAIL);
  } catch {
    // ignore
  }
}
