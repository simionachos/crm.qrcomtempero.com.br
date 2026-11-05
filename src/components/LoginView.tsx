import React, { useState, useEffect } from 'react';
import { loginUser, AuthUser } from '../utils/auth';
import {
  isBiometricsAvailable,
  hasBiometricSaved,
  getSavedBiometricEmail,
  loginWithBiometrics,
  registerDeviceBiometrics,
  getPreferredDuration,
  setPreferredDuration
} from '../utils/biometrics';
import {
  Footprints,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Fingerprint,
  Check,
  Smartphone,
  ChevronDown
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
}

const DURATION_OPTIONS = [
  { days: 7, label: '7 dias' },
  { days: 15, label: '15 dias' },
  { days: 30, label: '30 dias', recommended: true },
  { days: 90, label: '90 dias' }
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [saveBiometricsOnLogin, setSaveBiometricsOnLogin] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [hasRegisteredBiometric, setHasRegisteredBiometric] = useState(false);
  const [savedBioEmail, setSavedBioEmail] = useState<string | null>(null);
  const [usePasswordMode, setUsePasswordMode] = useState(false);

  useEffect(() => {
    // Carrega duração preferida
    const pref = getPreferredDuration();
    setDurationDays(pref);

    // Detecta suporte do aparelho a biometria nativa (Android / iOS / Computador)
    const checkBio = async () => {
      const available = await isBiometricsAvailable();
      setBiometricsAvailable(available);

      const registered = hasBiometricSaved();
      setHasRegisteredBiometric(registered);

      if (registered) {
        const bioEmail = getSavedBiometricEmail();
        setSavedBioEmail(bioEmail);
        if (bioEmail) {
          setEmail(bioEmail);
        }
      }
    };
    checkBio();
  }, []);

  const handleDurationChange = (days: number) => {
    setDurationDays(days);
    setPreferredDuration(days);
  };

  // Login via Digital / Face ID do celular
  const handleBiometricLogin = async () => {
    setErrorMessage(null);
    setIsBiometricLoading(true);

    try {
      const res = await loginWithBiometrics(durationDays);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.message || 'Falha na leitura da digital. Tente novamente ou use sua senha.');
      }
    } catch {
      setErrorMessage('Erro inesperado na leitura biométrica.');
    } finally {
      setIsBiometricLoading(false);
    }
  };

  // Login tradicional por Email e Senha
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Preencha seu e-mail e senha.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser(email, password, durationDays);
      if (result.success && result.user) {
        // Se usuário optou por ativar a digital no celular e o aparelho suporta
        if (biometricsAvailable && saveBiometricsOnLogin) {
          try {
            await registerDeviceBiometrics(result.user.email);
          } catch {
            // Se o usuário cancelar a leitura da digital, o login ainda prossegue normalmente
            console.log('Registro biométrico dispensado pelo usuário');
          }
        }
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.message || 'Credenciais inválidas ou acesso não autorizado.');
      }
    } catch {
      setErrorMessage('Erro ao conectar ao servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-black flex flex-col justify-center px-4 py-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Identidade Monocromática Minimalista */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-black text-white mx-auto flex items-center justify-center shadow-md">
            <Footprints className="w-7 h-7" />
          </div>

          <div className="pt-2">
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              SDR PROSPECÇÃO COMERCIAL
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight mt-0.5">
              Acesso ao Roteiro
            </h1>
            <p className="text-xs text-zinc-600 mt-1">
              Roteiro de campo na Zona Sul de São Paulo
            </p>
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-3xl border-2 border-black p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-4">
          {errorMessage && (
            <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-2xl text-xs font-medium text-black flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-zinc-800" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Opção Biometria Salva (Estilo App Android / Apple) */}
          {hasRegisteredBiometric && !usePasswordMode ? (
            <div className="space-y-4 py-2">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-zinc-100 border-2 border-black mx-auto flex items-center justify-center">
                  <Fingerprint className="w-8 h-8 text-black animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-zinc-500 uppercase">
                    Dispositivo Reconhecido
                  </div>
                  <div className="text-sm font-black text-black mt-0.5">
                    {savedBioEmail}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    Toque no botão abaixo para desbloquear com a digital salva no seu aparelho.
                  </div>
                </div>
              </div>

              {/* Seletor de Duração da Sessão */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                  MANTER CONECTADO POR
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.days}
                      type="button"
                      onClick={() => handleDurationChange(opt.days)}
                      className={`h-9 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center border ${
                        durationDays === opt.days
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão de Digital */}
              <button
                type="button"
                onClick={handleBiometricLogin}
                disabled={isBiometricLoading}
                className="w-full h-14 rounded-2xl bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-400 font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-sm transition active:scale-95"
              >
                <Fingerprint className="w-5 h-5" />
                <span>{isBiometricLoading ? 'Lendo biometria...' : 'Entrar com Digital / Face ID'}</span>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setUsePasswordMode(true)}
                  className="text-xs font-bold text-zinc-600 hover:text-black underline transition"
                >
                  Entrar com senha ou outro e-mail
                </button>
              </div>
            </div>
          ) : (
            /* Formulário Tradicional de Email & Senha */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo E-mail */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                  E-MAIL CORPORATIVO
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@empresa.com.br"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    disabled={isLoading}
                    className="w-full h-13 pl-10 pr-3.5 rounded-2xl border border-zinc-300 text-sm font-medium focus:outline-none focus:border-black disabled:bg-zinc-100 transition"
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                  SENHA DE ACESSO
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full h-13 pl-10 pr-11 rounded-2xl border border-zinc-300 text-sm font-medium focus:outline-none focus:border-black disabled:bg-zinc-100 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-10 h-10 absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-zinc-400 hover:text-black transition"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Seletor de Duração da Sessão (Manter conectado por) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                    MANTER CONECTADO POR
                  </label>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {durationDays} dias ativos
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.days}
                      type="button"
                      onClick={() => handleDurationChange(opt.days)}
                      className={`h-9 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center border ${
                        durationDays === opt.days
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opção de Salvar Biometria no Celular */}
              {biometricsAvailable && (
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveBiometricsOnLogin}
                      onChange={(e) => setSaveBiometricsOnLogin(e.target.checked)}
                      className="w-4 h-4 rounded text-black accent-black cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-black flex items-center gap-1.5">
                        <Fingerprint className="w-3.5 h-3.5" />
                        <span>Ativar digital neste celular</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                        Permite entrar com impressão digital ou Face ID nas próximas vezes.
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* Botão Entrar */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-400 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <span>{isLoading ? 'Autenticando...' : 'Entrar no Sistema'}</span>
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

              {/* Opção de voltar para a biometria se já havia sido registrada */}
              {hasRegisteredBiometric && (
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => setUsePasswordMode(false)}
                    className="text-xs font-bold text-zinc-600 hover:text-black underline transition flex items-center justify-center gap-1 mx-auto"
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Usar biometria salva</span>
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Rodapé Seguro */}
        <div className="text-center text-[11px] font-mono text-zinc-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
          <span>Autenticação Segura • WebAuthn & Criptografia</span>
        </div>
      </div>
    </div>
  );
};
