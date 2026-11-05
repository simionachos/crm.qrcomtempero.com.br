/**
 * Utilitário de áudio e síntese de voz (TTS) para prospecção em campo.
 * Permite que o SDR ouça o briefing de quem procurar e melhor horário com fones de ouvido.
 */

class AudioTtsService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(text: string, onEnd?: () => void): boolean {
    if (!this.synth) {
      console.warn('SpeechSynthesis não suportado neste navegador.');
      return false;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05; // Levemente dinâmico para fala profissional
    utterance.pitch = 1.0;

    // Tentar selecionar voz brasileira de qualidade se disponível
    const voices = this.synth.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt-BR') || v.lang.startsWith('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error('Erro na síntese de voz:', e);
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.isSpeakingState = true;
    this.synth.speak(utterance);
    return true;
  }

  public stop(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const audioTts = new AudioTtsService();

/**
 * Utilitário para gravação rápida de voz em texto (Speech-to-Text)
 * usando SpeechRecognition padrão do navegador móvel (WebKit / Chrome / Android / Safari)
 */
export function startVoiceRecognition(
  onResult: (text: string) => void,
  onError?: (err: string) => void,
  onEnd?: () => void
): { stop: () => void } | null {
  if (typeof window === 'undefined') return null;

  // @ts-expect-error browser prefix
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) onError('Reconhecimento de voz não suportado neste navegador. Digite suas notas.');
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      console.warn('Erro recognition:', event.error);
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      }
    };
  } catch (err) {
    console.error('Falha ao iniciar SpeechRecognition', err);
    if (onError) onError('Não foi possível iniciar o microfone.');
    return null;
  }
}
