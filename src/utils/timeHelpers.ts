export type TimeWindowStatus = 'in_window' | 'upcoming' | 'past' | 'anytime';

export interface TimeCheckResult {
  status: TimeWindowStatus;
  badgeText: string;
  badgeClass: string;
  description: string;
}

/**
 * Avalia se o horário atual está dentro, antes ou depois da janela ideal de prospecção do lead.
 * Formato monocromático: preto, branco e tons de cinza.
 */
export function checkLeadTimeWindow(bestTimeStr: string, currentHoursMinutes?: { h: number; m: number }): TimeCheckResult {
  const now = new Date();
  const currentH = currentHoursMinutes ? currentHoursMinutes.h : now.getHours();
  const currentM = currentHoursMinutes ? currentHoursMinutes.m : now.getMinutes();
  const currentTotal = currentH * 60 + currentM;

  const lower = bestTimeStr.toLowerCase();

  // Caso: Villa Klabin ("Próximo às 08h00 / Manhã cedo")
  if (lower.includes('08h00') && !lower.includes('às 11h30')) {
    const start = 7 * 60 + 30; // 07:30
    const end = 9 * 60;        // 09:00
    if (currentTotal >= start && currentTotal <= end) {
      return {
        status: 'in_window',
        badgeText: '● JANELA IDEAL AGORA',
        badgeClass: 'bg-black text-white border-black font-bold',
        description: 'Momento ideal para encontrar o Manoel antes do movimento do dia.'
      };
    } else if (currentTotal < start) {
      return {
        status: 'upcoming',
        badgeText: '○ EM BREVE (08h00)',
        badgeClass: 'bg-zinc-100 text-zinc-900 border-zinc-300 font-semibold',
        description: 'Recomendado chegar próximo às 08h00.'
      };
    } else {
      return {
        status: 'past',
        badgeText: '△ JANELA DAS 08h ENCERROU',
        badgeClass: 'bg-zinc-100 text-zinc-600 border-zinc-200',
        description: 'Horário de pico de preparação da manhã.'
      };
    }
  }

  // Caso: Porto da Gula ("A partir das 09h30 / Manhã")
  if (lower.includes('09h30')) {
    const start = 9 * 60 + 30;
    const end = 11 * 60 + 30;
    if (currentTotal >= start && currentTotal <= end) {
      return {
        status: 'in_window',
        badgeText: '● FERNANDO NO LOCAL',
        badgeClass: 'bg-black text-white border-black font-bold',
        description: 'Fernando costuma chegar por volta das 09h30.'
      };
    } else if (currentTotal < start) {
      return {
        status: 'upcoming',
        badgeText: '○ CHEGADA ÀS 09h30',
        badgeClass: 'bg-zinc-100 text-zinc-900 border-zinc-300 font-semibold',
        description: 'Avisaram para procurar Fernando assim que ele chegar.'
      };
    } else {
      return {
        status: 'anytime',
        badgeText: '● NO RESTAURANTE',
        badgeClass: 'bg-zinc-900 text-white border-zinc-900',
        description: 'Fernando já deve estar no restaurante.'
      };
    }
  }

  // Caso: Padaria Santa Clara ("Entre 06h00 e 14h00")
  if (lower.includes('06h00') && lower.includes('14h00')) {
    const start = 6 * 60;
    const end = 14 * 60;
    if (currentTotal >= start && currentTotal <= end) {
      return {
        status: 'in_window',
        badgeText: '● TURNO ATIVO (WILLIAM)',
        badgeClass: 'bg-black text-white border-black font-bold',
        description: 'William trabalha no turno das 06h às 14h no local.'
      };
    } else {
      return {
        status: 'past',
        badgeText: '△ TURNO ENCERRADO (PÓS 14h)',
        badgeClass: 'bg-zinc-100 text-zinc-500 border-zinc-300',
        description: 'Turno do William encerrou às 14h00.'
      };
    }
  }

  // Caso: Strike Grill ("Manhã (entre 10h30 e 11h30)")
  if (lower.includes('10h30') && lower.includes('11h30')) {
    const start = 10 * 60 + 30;
    const end = 11 * 60 + 30;
    if (currentTotal >= start && currentTotal <= end) {
      return {
        status: 'in_window',
        badgeText: '● JANELA DE OURO (10h30-11h30)',
        badgeClass: 'bg-black text-white border-black font-bold',
        description: 'Antes do pico de almoço. Francisco costuma estar disponível.'
      };
    } else if (currentTotal < start) {
      return {
        status: 'upcoming',
        badgeText: '○ AGUARDAR 10h30',
        badgeClass: 'bg-zinc-100 text-zinc-900 border-zinc-300 font-semibold',
        description: 'Aguarde até as 10h30 para contato antes do almoço.'
      };
    } else {
      return {
        status: 'past',
        badgeText: '△ PICO DE ALMOÇO',
        badgeClass: 'bg-zinc-100 text-zinc-600 border-zinc-300',
        description: 'Salão ocupado com almoço; prefira o fim da tarde.'
      };
    }
  }

  // Caso: Bueno's Bar ("Após as 14h00")
  if (lower.includes('14h00') && lower.includes('após')) {
    const start = 14 * 60;
    if (currentTotal >= start) {
      return {
        status: 'in_window',
        badgeText: '● DISPONÍVEL (APÓS 14h)',
        badgeClass: 'bg-black text-white border-black font-bold',
        description: 'Horário indicado para encontrar o Fabio.'
      };
    } else {
      return {
        status: 'upcoming',
        badgeText: '○ APÓS AS 14h00',
        badgeClass: 'bg-zinc-100 text-zinc-900 border-zinc-300 font-semibold',
        description: 'Fabio só estará disponível no período da tarde.'
      };
    }
  }

  // Caso: Terraço Gastronomia ou Comino ("10h00 às 11h00/11h30")
  if (lower.includes('10h00') && (lower.includes('11h00') || lower.includes('11h30'))) {
    const start = 10 * 60;
    const end = lower.includes('11h30') ? 11 * 60 + 30 : 11 * 60;
    if (currentTotal >= start && currentTotal <= end) {
      return {
        status: 'in_window',
        badgeText: '● JANELA PRÉ-ALMOÇO',
        badgeClass: 'bg-black text-white border-black font-bold',
        description: 'Antes da abertura do salão para clientes.'
      };
    } else if (currentTotal < start) {
      return {
        status: 'upcoming',
        badgeText: '○ JANELA ÀS 10h00',
        badgeClass: 'bg-zinc-100 text-zinc-900 border-zinc-300 font-semibold',
        description: 'Equipe em preparação do dia.'
      };
    } else {
      return {
        status: 'past',
        badgeText: '△ HORÁRIO DE ALMOÇO',
        badgeClass: 'bg-zinc-100 text-zinc-500 border-zinc-300',
        description: 'Salão operando almoço.'
      };
    }
  }

  // Caso: Tempero das Gerais ("A partir das 09h00")
  if (lower.includes('09h00')) {
    const start = 9 * 60;
    if (currentTotal >= start && currentTotal <= 11 * 60 + 30) {
      return {
        status: 'in_window',
        badgeText: '● ROBERTO NO LOCAL',
        badgeClass: 'bg-black text-white border-black font-bold',
        description: 'Equipe confirmou que Roberto chega a partir das 09h.'
      };
    } else if (currentTotal < start) {
      return {
        status: 'upcoming',
        badgeText: '○ CHEGADA ÀS 09h00',
        badgeClass: 'bg-zinc-100 text-zinc-900 border-zinc-300 font-semibold',
        description: 'Aguardar as 09h para falar direto com ele.'
      };
    } else {
      return {
        status: 'anytime',
        badgeText: '● PRESENTE',
        badgeClass: 'bg-zinc-900 text-white border-zinc-900',
        description: 'Roberto costuma permanecer no restaurante.'
      };
    }
  }

  // Caso: Santa Marcelina ("08h00 às 11h30")
  if (lower.includes('08h00') && lower.includes('11h30')) {
    const start = 8 * 60;
    const end = 11 * 60 + 30;
    if (currentTotal >= start && currentTotal <= end) {
      return {
        status: 'in_window',
        badgeText: '● SR. RENATO DISPONÍVEL',
        badgeClass: 'bg-black text-white border-black font-bold',
        description: 'Melhor horário informado para falar com ele.'
      };
    } else if (currentTotal < start) {
      return {
        status: 'upcoming',
        badgeText: '○ A PARTIR DAS 08h00',
        badgeClass: 'bg-zinc-100 text-zinc-900 border-zinc-300 font-semibold',
        description: 'Sr. Renato atende no período da manhã.'
      };
    } else {
      return {
        status: 'past',
        badgeText: '△ JANELA MATINAL PASSOU',
        badgeClass: 'bg-zinc-100 text-zinc-500 border-zinc-300',
        description: 'Janela matinal recomendada foi até 11h30.'
      };
    }
  }

  // Caso: Yohiro Sushi / Koi ("15h00 às 16h30" ou "15h30 às 17h00")
  if (lower.includes('15h') || lower.includes('16h') || lower.includes('17h')) {
    const start = lower.includes('15h30') ? 15 * 60 + 30 : 15 * 60;
    const end = lower.includes('17h00') ? 17 * 60 : 16 * 60 + 30;
    if (currentTotal >= start && currentTotal <= end) {
      return {
        status: 'in_window',
        badgeText: '● ENTRE-TURNOS IDEAL',
        badgeClass: 'bg-black text-white border-black font-bold',
        description: 'Almoço finalizado e equipe receptiva antes do jantar.'
      };
    } else if (currentTotal < start) {
      return {
        status: 'upcoming',
        badgeText: '○ APÓS AS 15h00',
        badgeClass: 'bg-zinc-100 text-zinc-900 border-zinc-300 font-semibold',
        description: 'Restaurante reabre para o entre-turnos às 15h.'
      };
    } else {
      return {
        status: 'past',
        badgeText: '△ MONTAGEM DO JANTAR',
        badgeClass: 'bg-zinc-100 text-zinc-500 border-zinc-300',
        description: 'A partir das 17h/18h a cozinha foca no jantar.'
      };
    }
  }

  return {
    status: 'anytime',
    badgeText: '● HORÁRIO COMERCIAL',
    badgeClass: 'bg-zinc-900 text-white border-zinc-900 font-medium',
    description: bestTimeStr
  };
}
