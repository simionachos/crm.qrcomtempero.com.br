import React, { useState } from 'react';
import { loginUser, AuthUser } from '../utils/auth';
import { Footprints, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Preencha seu e-mail e senha.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser(email, password);
      if (result.success && result.user) {
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
              Acesso Restrito
            </h1>
            <p className="text-xs text-zinc-600 mt-1">
              Informe suas credenciais para acessar o roteiro de prospecção.
            </p>
          </div>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white rounded-3xl border-2 border-black p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-4">
          {errorMessage && (
            <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-2xl text-xs font-medium text-black flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-zinc-800" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

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

            {/* Botão Entrar (Largo, ergonômico, min 52px) */}
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
          </form>
        </div>

        {/* Rodapé Seguro */}
        <div className="text-center text-[11px] font-mono text-zinc-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
          <span>Autenticação Segura • SDR Campo</span>
        </div>
      </div>
    </div>
  );
};
