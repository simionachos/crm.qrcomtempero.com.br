import React, { useState, useEffect } from 'react';
import { AuthUser } from '../utils/auth';
import {
  isBiometricsAvailable,
  hasBiometricSaved,
  registerDeviceBiometrics,
  clearBiometrics,
  getPreferredDuration,
  setPreferredDuration
} from '../utils/biometrics';
import {
  X,
  Shield,
  Fingerprint,
  CheckCircle2,
  Trash2,
  Smartphone,
  AlertCircle
} from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
}

const DURATION_OPTIONS = [
  { days: 7, label: '7 dias' },
  { days: 15, label: '15 dias' },
  { days: 30, label: '30 dias' },
  { days: 90, label: '90 dias' }
];

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose, user }) => {
  const [deviceBioSupported, setDeviceBioSupported] = useState(false);
  const [isBioRegistered, setIsBioRegistered] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [duration, setDuration] = useState<number>(30);

  useEffect(() => {
    if (isOpen) {
      const check = async () => {
        const supported = await isBiometricsAvailable();
        setDeviceBioSupported(supported);
        setIsBioRegistered(hasBiometricSaved());
        setDuration(getPreferredDuration());
      };
      check();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegister = async () => {
    setStatusMessage(null);
    setErrorMessage(null);
    setIsRegistering(true);

    try {
      const success = await registerDeviceBiometrics(user.email);
      if (success) {
        setIsBioRegistered(true);
        setStatusMessage('Digital / Face ID registrada com sucesso neste aparelho!');
      }
    } catch (err: any) {
      console.warn(err);
      setErrorMessage('Registro biométrico cancelado ou não reconhecido.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRemove = () => {
    clearBiometrics();
    setIsBioRegistered(false);
    setStatusMessage('Biometria removida deste aparelho.');
  };

  const handleDurationChange = (days: number) => {
    setDuration(days);
    setPreferredDuration(days);
    setStatusMessage(`Duração padrão de sessão ajustada para ${days} dias.`);
  };

  return (
    <div className="fixed inset-0 z-[1500] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white text-black w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-black p-5 shadow-2xl space-y-5 animate-in slide-in-from-bottom duration-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-black">
                Segurança & Biometria
              </h2>
              <p className="text-[11px] font-mono text-zinc-500">
                Dispositivo móvel e sessão de acesso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-zinc-600" />
          </button>
        </div>

        {/* Mensagens de Feedback */}
        {statusMessage && (
          <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-2xl text-xs font-medium text-black flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-zinc-100 border border-zinc-400 rounded-2xl text-xs font-medium text-black flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-black shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Card do Usuário Logado */}
        <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200 space-y-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
            USUÁRIO AUTENTICADO
          </div>
          <div className="text-sm font-black text-black">
            {user.name}
          </div>
          <div className="text-xs font-mono text-zinc-600">
            {user.email}
          </div>
        </div>

        {/* Configuração de Biometria Nativa */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 font-mono flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-black" />
              BIOMETRIA NO APARELHO
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Android / iOS
            </span>
          </div>

          {deviceBioSupported ? (
            <div className="p-3.5 rounded-2xl border border-zinc-200 bg-white space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-300 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-black flex items-center gap-1">
                    {isBioRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                        <span>Digital cadastrada neste celular</span>
                      </>
                    ) : (
                      <span>Sensor de digital disponível</span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">
                    {isBioRegistered
                      ? 'Você pode entrar rapidamente tocando no botão biométrico sem redigitar a senha.'
                      : 'Cadastre sua impressão digital ou Face ID para acesso rápido de 1 toque.'}
                  </p>
                </div>
              </div>

              <div className="pt-1 flex gap-2">
                {!isBioRegistered ? (
                  <button
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="flex-1 h-11 rounded-xl bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-400 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <Fingerprint className="w-4 h-4" />
                    <span>{isRegistering ? 'Aguardando sensor...' : 'Cadastrar Digital'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRemove}
                    className="flex-1 h-11 rounded-xl border border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remover Biometria do Aparelho</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-600">
              Sensor biométrico não suportado ou bloqueado no navegador deste aparelho.
            </div>
          )}
        </div>

        {/* Configuração de Duração da Sessão */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 font-mono">
              MANTER CONECTADO POR
            </span>
            <span className="text-xs font-mono font-bold text-black">
              {duration} dias
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                type="button"
                onClick={() => handleDurationChange(opt.days)}
                className={`h-9 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center border ${
                  duration === opt.days
                    ? 'bg-black text-white border-black'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Botão Fechar */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-2xl bg-black text-white hover:bg-zinc-800 font-bold text-xs uppercase tracking-wider transition active:scale-95"
          >
            Salvar e Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
