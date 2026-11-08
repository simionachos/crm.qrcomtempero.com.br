import { RouteLead, MetroStation, GeneralLead, RouteMode } from '../types';

export const STARTING_POINT = {
  name: 'Ponto de Partida',
  address: 'Rua São Benedito, 1474 – Santo Amaro / Alto da Boa Vista, São Paulo - SP',
  lat: -23.6373,
  lng: -46.7028,
  description: 'Início fixo da jornada de prospecção a pé (Zona Sul de SP).'
};

export const ROUTE_LEADS: RouteLead[] = [
  {
    id: 1,
    order: 1,
    name: 'Porto Da Gula 1',
    category: 'Restaurante self-service',
    address: 'Rua São Benedito, 1081 – Santo Amaro, São Paulo - SP',
    lat: -23.6338,
    lng: -46.7032,
    targetContact: 'Fernando',
    bestTime: 'A partir das 09h30 / Manhã',
    bestTimeNote: 'Informaram para procurar o Fernando assim que ele chegar no restaurante.',
    distanceFromStart: '~400 m',
    walkingTimeFromStart: '~5 min a pé',
    walkingFromPrev: {
      distance: '~400 m',
      duration: '~5 min',
      notes: 'Descendo a mesma calçada da Rua São Benedito a partir do número 1474.'
    },
    stage: {
      number: 1,
      title: 'Etapa 1: Eixo Santo Amaro & Alto da Boa Vista',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    phone: '55 11 5524-7360',
    whatsapp: '551155247360',
    instagram: 'portodagula1',
    rating: 4.5,
    reviewsCount: 566,
    googleMapsUrl: 'https://maps.google.com/?cid=11469584104616243211',
    contactHistory: '26/10 (09h27): Enviada mensagem no WhatsApp. Disseram para procurar o Fernando assim que ele chegar.',
    pitchTips: {
      gatekeeper: 'Olá! Sou [Seu Nome], me orientaram pelo WhatsApp a procurar o Fernando assim que ele chegasse. Ele já está na casa?',
      decisionMakerPitch: 'Fernando, tudo bem? Fui orientado a falar direto com você aqui no Porto Da Gula. Sei que seu movimento de almoço é intenso, vim pessoalmente bater um papo rápido de 3 minutos antes da abertura sobre aumento de margem e atração de clientes da região corporativa.',
      hook: 'Restaurante por quilo / self-service com alto fluxo local na São Benedito.'
    }
  },
  {
    id: 2,
    order: 2,
    name: 'Padaria Santa Clara',
    category: 'Padaria e Confeitaria',
    address: 'Rua Darwin, 435 – Santo Amaro, São Paulo - SP',
    lat: -23.6421,
    lng: -46.7058,
    targetContact: 'William',
    bestTime: 'Entre 06h00 e 14h00',
    bestTimeNote: 'Turno de trabalho presencial do William no local (contato indicado pela Jake).',
    distanceFromStart: '~950 m',
    walkingTimeFromStart: '~12 min a pé',
    walkingFromPrev: {
      distance: '~1,1 km',
      duration: '~14 min',
      notes: 'Caminhada plana conectando São Benedito até a Rua Darwin.'
    },
    stage: {
      number: 1,
      title: 'Etapa 1: Eixo Santo Amaro & Alto da Boa Vista',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    phone: '55 11 5687-2391',
    whatsapp: '551156872391',
    site: 'https://www.santaclarapaesedoces.com.br/',
    instagram: 'panificadora_santaclaraoficial',
    rating: 4.4,
    reviewsCount: 820,
    googleMapsUrl: 'https://maps.google.com/?q=Rua+Darwin+435+Santo+Amaro',
    contactHistory: '23/10 (17h43): Das 06h às 14h — falar com o William (contato passado por Jake).',
    pitchTips: {
      gatekeeper: 'Bom dia! O William está por aí? A Jake me indicou falar diretamente com ele sobre uma solução para a padaria.',
      decisionMakerPitch: 'William, bom dia! A Jake me pediu para dar um pulo aqui e falar com você pessoalmente. A Santa Clara tem uma tradição forte na Darwin e queremos apresentar como estamos impulsionando o ticket médio no café da manhã e encomendas.',
      hook: 'Referência da Jake é o gatilho perfeito de confiança logo na abordagem.'
    }
  },
  {
    id: 3,
    order: 3,
    name: 'Restaurante Strike Grill',
    category: 'Restaurante & Hamburgueria',
    address: 'Rua Amador Bueno, 763 – Santo Amaro, São Paulo - SP',
    lat: -23.6515,
    lng: -46.7118,
    targetContact: 'Francisco',
    bestTime: 'Manhã (entre 10h30 e 11h30)',
    bestTimeNote: 'Horário padrão de contato antes do pico de almoço. Francisco estava viajando em 21/10.',
    distanceFromStart: '~1,5 km',
    walkingTimeFromStart: '~19 min a pé',
    walkingFromPrev: {
      distance: '~1,2 km',
      duration: '~15 min',
      notes: 'Seguindo rumo ao coração comercial de Santo Amaro.'
    },
    stage: {
      number: 1,
      title: 'Etapa 1: Eixo Santo Amaro & Alto da Boa Vista',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    phone: '55 11 2609-5667',
    site: 'https://pedido.zesto.menu/pt-BR/store/hamburgueria-strike-grill/qhqiajwogafsxmddc',
    rating: 4.5,
    reviewsCount: 906,
    googleMapsUrl: 'https://maps.google.com/?cid=234698541537175421',
    contactHistory: '20/10 (10h31): Ninguém atendeu. 21/10 (11h31): Ligar e falar com Francisco (que estava viajando).',
    pitchTips: {
      gatekeeper: 'Olá! O Francisco já retornou de viagem? Soube que ele estava fora semana passada e combinei de passar pessoalmente.',
      decisionMakerPitch: 'Francisco, prazer! Passei na semana passada quando você estava em viagem. Como você comanda a operação aqui no Strike Grill, vim antes do almoço para apresentar como você pode blindar sua margem de delivery e salão.',
      hook: 'Reconhecer que ele estava viajando mostra persistência e pesquisa prévia.'
    }
  },
  {
    id: 4,
    order: 4,
    name: "Bueno's Bar",
    category: 'Restaurante & Bar',
    address: 'Rua Amador Bueno, 801 – Santo Amaro, São Paulo - SP',
    lat: -23.6519,
    lng: -46.7121,
    targetContact: 'Fabio',
    bestTime: 'Após as 14h00',
    bestTimeNote: 'Quarta-feira após às 14h ou confirmando por telefone no período da manhã.',
    distanceFromStart: '~1,5 km',
    walkingTimeFromStart: '~19 min a pé',
    conflictWarning: '⚠️ Conflito no roteiro linear: Fabio só chega após as 14h00. Na Opção A / Dia 1, visite às 14h00 após o almoço.',
    walkingFromPrev: {
      distance: '~50 m',
      duration: '~1 min',
      notes: 'Vizinho imediato do Strike Grill! Porta com porta na Amador Bueno.'
    },
    stage: {
      number: 1,
      title: 'Etapa 1: Eixo Santo Amaro & Alto da Boa Vista',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    phone: '55 11 2691-6872',
    instagram: 'buenosbar801',
    rating: 4.3,
    reviewsCount: 986,
    googleMapsUrl: 'https://maps.google.com/?cid=13152242464131777740',
    contactHistory: '20/10 (10h27): Falar com Fabio 11h30. 21/10 (11h30): Estava na inauguração de outro estabelecimento. 27/10 (16h27): Quarta-feira após às 14h procurar o Fabio.',
    pitchTips: {
      gatekeeper: 'Oi! O Fabio está no salão? Ficou combinado de procurá-lo nesta tarde após as 14h.',
      decisionMakerPitch: 'Fabio, boa tarde! Soube que você estava corrido com inauguração semana passada, parabéns pela expansão! Estou passando rapidamente pelos estabelecimentos de destaque da Amador Bueno para te mostrar algo pontual que vai economizar custos operacionais.',
      hook: 'Elogiar o momento de expansão e abertura de novos estabelecimentos.'
    }
  },
  {
    id: 5,
    order: 5,
    name: 'Terraço Gastronomia - Alexandre Dumas',
    category: 'Restaurante Executivo',
    address: 'Rua Alexandre Dumas, 1708 – Santo Amaro / Chácara Santo Antônio, São Paulo - SP',
    lat: -23.6358,
    lng: -46.7011,
    targetContact: 'Josélia (Gestores: Priscila Kiliotaitis / Paulo Santos)',
    bestTime: 'Manhã (entre 10h00 e 11h30)',
    bestTimeNote: 'Antes da abertura do salão para o grande almoço corporativo da Chácara Santo Antônio.',
    distanceFromStart: '~1,8 km',
    walkingTimeFromStart: '~22 min a pé',
    walkingFromPrev: {
      distance: '~1,8 km',
      duration: '~22 min',
      notes: 'Subindo da Amador Bueno para a Alexandre Dumas, cruzando a Av. Adolfo Pinheiro.'
    },
    stage: {
      number: 2,
      title: 'Etapa 2: Chácara Santo Antônio, Brooklin & Campo Belo',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    phone: '55 11 5182-6633',
    whatsapp: '5511941501111',
    site: 'http://terracogastronomia.com.br/',
    instagram: 'terracogastronomia',
    rating: 4.6,
    reviewsCount: 2356,
    googleMapsUrl: 'https://maps.google.com/?cid=7600116745132396087',
    contactHistory: '20/10: Josélia passou os e-mails dos gestores: priscila.kiliotaitis@terracogastronomia.com.br e paulo.santos@terracogastronomia.com.br.',
    pitchTips: {
      gatekeeper: 'Oi Josélia! Consegui passar aqui pessoalmente como combinamos pelo WhatsApp. A Priscila ou o Paulo estão hoje no restaurante?',
      decisionMakerPitch: 'Olá! A Josélia nos direcionou os contatos da Priscila e do Paulo para envio da apresentação corporativa. Como estava na Dumas visitando os polos executivos, preferi vir pessoalmente para resumir a proposta em 2 minutos.',
      hook: 'Já possui validação de contato com Josélia e e-mails oficiais de Priscila e Paulo.'
    }
  },
  {
    id: 6,
    order: 6,
    name: 'Tempero das Gerais',
    category: 'Restaurante Mineiro',
    address: 'Rua Princesa Isabel, 385 – Brooklin Novo, São Paulo - SP',
    lat: -23.6262,
    lng: -46.6895,
    targetContact: 'Roberto',
    bestTime: 'A partir das 09h00',
    bestTimeNote: 'Horário orientado expressamente pela equipe para encontrá-lo com disponibilidade.',
    distanceFromStart: '~2,1 km',
    walkingTimeFromStart: '~26 min a pé',
    walkingFromPrev: {
      distance: '~1,7 km',
      duration: '~21 min',
      notes: 'Caminhada plana entrando no Brooklin Novo pela Princesa Isabel.'
    },
    stage: {
      number: 2,
      title: 'Etapa 2: Chácara Santo Antônio, Brooklin & Campo Belo',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    phone: '55 11 5093-9950',
    site: 'https://www.temperodasgerais.com.br/',
    instagram: 'temperodasgerais',
    rating: 4.7,
    reviewsCount: 6505,
    googleMapsUrl: 'https://maps.google.com/?cid=2262702491410091387',
    contactHistory: '20/10: Orientaram ligar no dia seguinte e falar com o Roberto a partir das 09h. 21/10 (10h05): Ninguém atendeu ligação.',
    pitchTips: {
      gatekeeper: 'Bom dia! O Roberto já está na cozinha ou no escritório? A equipe me avisou que o melhor momento para conversar com ele é logo no início da manhã.',
      decisionMakerPitch: 'Roberto, bom dia! Mais de 6.500 avaliações no Google mostram que o Tempero das Gerais é o coração da comida mineira no Brooklin. Vim pessoalmente porque o telefone costuma ser bem concorrido pela manhã. Tenho uma oportunidade focada no fluxo corporativo da Berrini/Brooklin.',
      hook: 'Mais de 6.500 avaliações! É um dos gigantes gastronômicos do bairro.'
    }
  },
  {
    id: 7,
    order: 7,
    name: 'Padaria Santa Marcelina',
    category: 'Padaria & Confeitaria Nobre',
    address: 'Rua Vieira de Morais, 328 / Barão do Triunfo – Campo Belo, São Paulo - SP',
    lat: -23.6225,
    lng: -46.6781,
    targetContact: 'Sr. Renato',
    bestTime: 'Parte da manhã (08h00 às 11h30)',
    bestTimeNote: 'Janela exata indicada internamente para falar com o Sr. Renato.',
    distanceFromStart: '~3,4 km',
    walkingTimeFromStart: '~42 min a pé',
    walkingFromPrev: {
      distance: '~1,4 km',
      duration: '~18 min',
      notes: 'Avançando do Brooklin Novo para o miolo residencial nobre do Campo Belo.'
    },
    stage: {
      number: 2,
      title: 'Etapa 2: Chácara Santo Antônio, Brooklin & Campo Belo',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    phone: '55 11 5091-8444',
    whatsapp: '551155489950',
    instagram: 'padariasantamarcelina',
    rating: 4.3,
    reviewsCount: 4721,
    googleMapsUrl: 'https://maps.google.com/?cid=9933653484709758066',
    contactHistory: '23/10 (17h51): Ligar na parte da manhã e falar com o Sr. Renato.',
    pitchTips: {
      gatekeeper: 'Olá! O Sr. Renato está no escritório ou na gerência? Me orientaram a encontrá-lo neste horário da manhã.',
      decisionMakerPitch: 'Sr. Renato, muito prazer! A Santa Marcelina é um ícone no Campo Belo. Sei que sua operação matinal exige precisão, por isso vim no horário exato que me passaram. Gostaria de 3 minutos para apresentar um comparativo de resultados com padarias de alto padrão em SP.',
      hook: 'Tom respeitoso ("Sr. Renato") e menção à tradição da Vieira de Morais.'
    },
    metroTip: {
      station: 'Estação Campo Belo (Linha 5-Lilás)',
      line: 'Linha 5 - Lilás',
      advice: 'Aqui termina a Etapa 2! Para a próxima parada (Comino na Vila Olímpia, a 2.6 km), você pode caminhar ou pegar o Metrô em Campo Belo até Borba/Eucaliptos ou transferir para poupar pernas.'
    }
  },
  {
    id: 8,
    order: 8,
    name: 'Comino',
    category: 'Restaurante de gastronomia Tex-Mex',
    address: 'Rua Fiandeiras, 862 – Vila Olímpia, São Paulo - SP',
    lat: -23.5995,
    lng: -46.6811,
    targetContact: 'Matheus ou Rodrigo',
    bestTime: 'Entre 10h00 e 11h00',
    bestTimeNote: 'Janela exata informada pela equipe antes de abrir o movimento do almoço.',
    distanceFromStart: '~4,8 km',
    walkingTimeFromStart: '~59 min a pé (ou Metrô L5 Alto da Boa Vista ➔ Eucaliptos)',
    walkingFromPrev: {
      distance: '~2,6 km',
      duration: '~33 min',
      notes: 'Trecho longo cruzando do Campo Belo para a Vila Olímpia. Dica: pode ser apoiado por metrô ou caminhada reta.'
    },
    stage: {
      number: 3,
      title: 'Etapa 3: Vila Olímpia & Moema',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    phone: '55 11 3045-5542',
    instagram: 'cominotexmex',
    rating: 4.7,
    reviewsCount: 561,
    googleMapsUrl: 'https://maps.google.com/?cid=1657429884150462441',
    contactHistory: '20/10: Procurar por Matheus ou Rodrigo (melhor horário: 10h às 11h). 21/10 (10h17): Ligação indisponível.',
    pitchTips: {
      gatekeeper: 'Olá! O Matheus ou o Rodrigo estão? A equipe me indicou vir especificamente nessa janela das 10h às 11h antes de abrirem o salão.',
      decisionMakerPitch: 'Matheus/Rodrigo, tudo bem? A equipe de vocês foi muito prestativa ao indicar vir antes das 11h. A Comino se destaca bastante aqui na Fiandeiras na gastronomia Tex-Mex. Vim apresentar algo rápido sobre fidelização do público tech/corporativo da Faria Lima e Vila Olímpia.',
      hook: 'Citar que veio exatamente na janela pré-almoço sugerida pela equipe.'
    }
  },
  {
    id: 9,
    order: 9,
    name: 'Yohiro Sushi',
    category: 'Restaurante japonês',
    address: 'Rua Min. Jesuíno Cardoso, 525 – Vila Olímpia, São Paulo - SP',
    lat: -23.5958,
    lng: -46.6802,
    targetContact: 'Denise (indicação da Mariana)',
    bestTime: '15h30 às 17h00',
    bestTimeNote: 'Período entre turnos, após o almoço, ideal para visita presencial sem pressa.',
    distanceFromStart: '~5,2 km',
    walkingTimeFromStart: '~65 min a pé',
    walkingFromPrev: {
      distance: '~600 m',
      duration: '~7 min',
      notes: 'Super rápido! Mesmo miolo da Vila Olímpia a poucos quarteirões da Fiandeiras.'
    },
    stage: {
      number: 3,
      title: 'Etapa 3: Vila Olímpia & Moema',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    phone: '55 11 3846-9327',
    instagram: 'yohirosushioficial',
    rating: 4.6,
    reviewsCount: 1611,
    googleMapsUrl: 'https://maps.google.com/?cid=1792210272785433531',
    contactHistory: '20/10 (16h00): Mariana pediu para falar com a Denise pelo WhatsApp (mensagem enviada). 23/10 (18h09): Ninguém respondeu no WhatsApp do restaurante. Indicação de passar presencialmente e procurar pela Denise.',
    pitchTips: {
      gatekeeper: 'Olá, boa tarde! A Denise está? A Mariana pediu para eu procurá-la pessoalmente aqui no Yohiro.',
      decisionMakerPitch: 'Denise, que bom te encontrar! A Mariana me indicou falar diretamente com você. Mandei um zap mas sei como restaurante japonês é movimentado no almoço, por isso fiz questão de passar presencialmente agora no entre-turnos.',
      hook: 'Usar o nome da Mariana como porta de entrada e valorizar a visita presencial.'
    }
  },
  {
    id: 10,
    order: 10,
    name: 'Koi Restaurante',
    category: 'Restaurante japonês tradicional',
    address: 'Rua Canário, 683 – Moema Pássaros, São Paulo - SP',
    lat: -23.6041,
    lng: -46.6661,
    targetContact: 'Ricardo (ou Doris na recepção/atendimento)',
    bestTime: '15h00 às 16h30',
    bestTimeNote: 'Período da tarde após o serviço de almoço de Moema Pássaros.',
    distanceFromStart: '~4,9 km',
    walkingTimeFromStart: '~60 min a pé',
    walkingFromPrev: {
      distance: '~1,9 km',
      duration: '~24 min',
      notes: 'Cruzando da Vila Olímpia para Moema Pássaros (Rua Canário).'
    },
    stage: {
      number: 3,
      title: 'Etapa 3: Vila Olímpia & Moema',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    phone: '55 11 5051-0664',
    rating: 4.5,
    reviewsCount: 1200,
    googleMapsUrl: 'https://maps.google.com/?q=Rua+Canario+683+Moema+Sao+Paulo',
    contactHistory: '20/10 (15h53): Doris informou que ia transferir para o Ricardo, mas a ligação caiu. 21/10: Não atenderam ligação.',
    pitchTips: {
      gatekeeper: 'Olá Doris, tudo bem? Falei com você por telefone semana passada e a ligação caiu quando você ia me transferir para o Ricardo. Como estava em Moema, vim pessoalmente!',
      decisionMakerPitch: 'Ricardo, boa tarde! A Doris quase me passou para você no telefone semana passada mas caiu a linha. O Koi é um dos nomes mais fortes de culinária japonesa em Moema Pássaros. Trouxe uma proposta visual rápida para você avaliar em 2 minutos.',
      hook: 'Citar o nome da Doris imediatamente quebra a barreira da recepção.'
    },
    metroTip: {
      station: 'Estação Moema ou Eucaliptos (Linha 5-Lilás)',
      line: 'Linha 5 - Lilás',
      advice: 'ALERTA DE DESLOCAMENTO LONGO: Daqui para a Parada 11 (Villa Klabin) são ~4,7 km a pé (~58 min). A Estação Moema fica a 600m: pegue o metrô Linha 5 até a Estação Chácara Klabin (direto, 6 paradas, 12 min)!'
    }
  },
  {
    id: 11,
    order: 11,
    name: 'Restaurante e Pizzaria Villa Klabin',
    category: 'Restaurante self-service & Pizzaria',
    address: 'Rua Embuaçu, 210 – Vila Mariana / Chácara Klabin, São Paulo - SP',
    lat: -23.5901,
    lng: -46.6293,
    targetContact: 'Manoel (Gerente) ou Jéssica',
    bestTime: 'Próximo às 08h00 / Manhã cedo',
    bestTimeNote: 'Horário específico informado pela Jéssica para encontrar o Gerente Manoel disponível.',
    distanceFromStart: '~9,4 km',
    walkingTimeFromStart: '~1h50 a pé ou ~25 min via Metrô Linha 5 Lilás',
    conflictWarning: '⚠️ Conflito Crítico no roteiro linear: Manoel atende às 08h00 na Chácara Klabin. No fim da tarde o contato já terá saído. Recomendado agendar no Dia 2 às 08h00!',
    walkingFromPrev: {
      distance: '~4,7 km',
      duration: '~58 min (a pé) ou ~14 min (Metrô L5 Moema -> Chácara Klabin)',
      notes: 'Perna mais longa do roteiro. Recomendadíssimo metrô Linha Lilás direto Moema -> Chácara Klabin!'
    },
    stage: {
      number: 4,
      title: 'Etapa 4: Destino Final (Vila Mariana / Klabin)',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
    },
    phone: '55 11 3294-6827',
    site: 'http://inktr.ee/villaklabin',
    instagram: 'villaklabin',
    rating: 4.2,
    reviewsCount: 1088,
    googleMapsUrl: 'https://maps.google.com/?cid=6395790514799270874',
    contactHistory: '26/10 (16h21): Falou com Jéssica; pediu para falar com o Gerente Manoel próximo às 08h.',
    pitchTips: {
      gatekeeper: 'Olá Jéssica! Vim aqui falar com o Gerente Manoel conforme você me orientou. Ele está no salão?',
      decisionMakerPitch: 'Manoel, muito prazer! A Jéssica me indicou vir falar com você pessoalmente. O Villa Klabin é a referência de self-service e almoço nessa região da Embuaçu. Vim apresentar como podemos trazer mais clientes das empresas e condomínios da Klabin.',
      hook: 'Jéssica passou o nome do Gerente Manoel e horário das 08h.'
    },
    metroTip: {
      station: 'Estação Chácara Klabin (Linha 5-Lilás / Linha 2-Verde)',
      line: 'Linha 5 - Lilás',
      advice: 'O restaurante fica a apenas 350 metros da Estação Chácara Klabin! Saída fácil pela Rua Vergueiro / Embuaçu.'
    }
  }
];

export interface ConflictItem {
  id: string;
  title: string;
  severity: 'high' | 'medium';
  targetLead: string;
  timeSlot: string;
  description: string;
  impact: string;
  solution: string;
}

export const CONFLICT_ANALYSIS: ConflictItem[] = [
  {
    id: 'villa-klabin',
    title: 'Villa Klabin (Parada 11) às 08h00',
    severity: 'high',
    targetLead: 'Villa Klabin (Rua Embuaçu, 210)',
    timeSlot: 'Próximo às 08h00',
    description: 'O contato-chave (Manoel, Gerente) está no local pontualmente próximo às 08h00. Na rota linear original ele é a última parada.',
    impact: 'Se visitado no fim da tarde seguindo a ordem geográfica, você perderá a visita pois o Manoel não estará mais lá.',
    solution: 'Opção A: Fazer contato por telefone/WhatsApp ou Dia 2 (Opção B): Iniciar pontualmente às 08h00 na Chácara Klabin.'
  },
  {
    id: 'buenos-bar',
    title: "Bueno's Bar (Parada 4) só após as 14h00",
    severity: 'high',
    targetLead: "Bueno's Bar (Rua Amador Bueno, 801)",
    timeSlot: 'Após as 14h00',
    description: 'Fábio só chega após as 14h00, mas o Strike Grill (vizinho porta com porta no número 763) pede visita entre 10h30 e 11h30.',
    impact: 'Se entrar no Bueno\'s Bar pela manhã junto com o Strike Grill, Fábio não estará lá.',
    solution: 'Fazer as visitas de Santo Amaro e Brooklin pela manhã, pausar para almoço às 12h30 e voltar ao Bueno\'s Bar pontualmente às 14h00.'
  },
  {
    id: 'morning-bottleneck',
    title: 'Gargalo Matinal (10h00 às 11h30)',
    severity: 'medium',
    targetLead: 'Strike Grill, Terraço, Santa Marcelina e Comino',
    timeSlot: '10h00 às 11h30',
    description: '4 estabelecimentos pedem visita estritamente nessa janela de 90 minutos antes do pico do almoço.',
    impact: 'Fisicamente impossível atender 4 locais com deslocamento a pé e abordagem consultiva em 90 minutos.',
    solution: 'Focar na manhã em Santo Amaro e Brooklin (Strike e Terraço) e mover Santa Marcelina/Comino para a tarde ou Dia 2.'
  }
];

export interface RouteModeConfig {
  id: RouteMode;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  stopsCount: number;
  estimatedTime: string;
  departureNote: string;
  recommended?: boolean;
}

export const ROUTE_MODE_CONFIGS: Record<RouteMode, RouteModeConfig> = {
  one_day_optimized: {
    id: 'one_day_optimized',
    name: '1 Dia Otimizado (Por Horários)',
    shortName: '1 Dia (Por Horários)',
    badge: 'Recomendado',
    description: 'Sequência ajustada ao relógio para eliminar os 3 choques de horário. Almoço e Bueno\'s Bar às 14h.',
    stopsCount: 9,
    estimatedTime: '09h00 às 17h00',
    departureNote: 'Partida: Rua São Benedito, 1474 às 08h45 rumo à Padaria Santa Clara.',
    recommended: true
  },
  two_days_day1: {
    id: 'two_days_day1',
    name: 'Dia 1: Santo Amaro & Brooklin',
    shortName: 'Dia 1 (Santo Amaro)',
    badge: '6 Paradas',
    description: 'Foco na Zona Sul imediata saindo da Rua São Benedito, 1474. Visita ao Bueno\'s Bar pontual às 14h.',
    stopsCount: 6,
    estimatedTime: '09h00 às 14h45',
    departureNote: 'Partida: Rua São Benedito, 1474 às 08h45 rumo à Padaria Santa Clara.'
  },
  two_days_day2: {
    id: 'two_days_day2',
    name: 'Dia 2: Klabin, Moema & Vila Olímpia',
    shortName: 'Dia 2 (Klabin & Moema)',
    badge: '5 Paradas',
    description: 'Início pontual às 08h00 no Villa Klabin com Manoel, descendo por Campo Belo, Comino, Koi e Yohiro.',
    stopsCount: 5,
    estimatedTime: '08h00 às 17h00',
    departureNote: 'Partida: Estação Chácara Klabin (Metrô Linha 5) às 07h50 para encontrar Manoel às 08h00.'
  },
  linear_geo: {
    id: 'linear_geo',
    name: 'Linear Geográfico (Original)',
    shortName: 'Linear Geográfico',
    badge: '11 Paradas',
    description: 'Sequência geográfica pura de 1 a 11 partindo da Rua São Benedito, 1474 (com avisos nos pontos de conflito).',
    stopsCount: 11,
    estimatedTime: '~18,5 km a pé',
    departureNote: 'Partida: Rua São Benedito, 1474 às 09h00 rumo ao Porto Da Gula 1.'
  }
};

/**
 * Retorna os leads formatados e reordenados para o modo de rota selecionado
 */
export function getRouteLeadsForMode(mode: RouteMode): RouteLead[] {
  const leadMap = new Map<number, RouteLead>();
  ROUTE_LEADS.forEach(l => leadMap.set(l.id, l));

  if (mode === 'one_day_optimized') {
    // Opção A: 1 Dia Otimizado pelo Relógio
    const orderedIds = [2, 1, 3, 5, 6, 4, 7, 10, 9];
    const timeSlots = ['09h00', '09h30', '10h15', '11h00', '11h45', '14h00', '14h45', '15h30', '16h15'];
    const notes = [
      'Primeira parada: William está no turno da manhã (06h–14h). Caminhada plana a 950m da São Benedito 1474.',
      'Fernando chega a partir das 09h30. Rua São Benedito, 1081 (a 400m da partida).',
      'Francisco no Strike Grill antes do pico de almoço (10h30–11h30).',
      'Josélia e gestores do Terraço antes de abrir o salão corporativo (10h–11h30).',
      'Roberto no Tempero das Gerais (ótimo horário antes do fluxo da Berrini).',
      '✨ Conflito #2 resolvido: Fábio chega pontual após as 14h! Retorno estratégico após o almoço.',
      'Padaria Santa Marcelina no Campo Belo.',
      'Ricardo / Doris no Koi Restaurante entre-turnos (15h00–16h30).',
      'Denise no Yohiro Sushi entre-turnos (15h30–17h00).'
    ];
    const walkNotes = [
      { distance: '~950 m', duration: '~12 min', notes: 'Partida: Rua São Benedito, 1474 ➔ Rua Darwin, 435.' },
      { distance: '~600 m', duration: '~7 min', notes: 'Rua Darwin ➔ Rua São Benedito, 1081.' },
      { distance: '~1,2 km', duration: '~15 min', notes: 'São Benedito ➔ Rua Amador Bueno, 763.' },
      { distance: '~1,8 km', duration: '~22 min', notes: 'Amador Bueno ➔ Rua Alexandre Dumas, 1708.' },
      { distance: '~1,7 km', duration: '~21 min', notes: 'Alexandre Dumas ➔ Rua Princesa Isabel, 385.' },
      { distance: '~2,3 km', duration: '~28 min (ou Metrô Borba Gato)', notes: 'Pausa Almoço 12h30–14h ➔ Retorno Amador Bueno, 801.' },
      { distance: '~2,5 km', duration: '~30 min', notes: 'Amador Bueno ➔ Rua Vieira de Morais, 328.' },
      { distance: '~2,2 km', duration: '~26 min', notes: 'Campo Belo ➔ Rua Canário, 683 (Moema).' },
      { distance: '~1,2 km', duration: '~15 min', notes: 'Rua Canário ➔ Rua Min. Jesuíno Cardoso, 525.' }
    ];

    return orderedIds.map((id, index) => {
      const base = leadMap.get(id)!;
      return {
        ...base,
        order: index + 1,
        suggestedTimeSlot: timeSlots[index],
        modeNote: notes[index],
        walkingFromPrev: walkNotes[index],
        conflictWarning: id === 4 ? '✨ Conflito resolvido: Fábio visitado pontualmente às 14h após o almoço!' : undefined
      };
    });
  }

  if (mode === 'two_days_day1') {
    // Opção B: Dia 1 (Santo Amaro & Brooklin)
    const orderedIds = [2, 1, 3, 5, 6, 4];
    const timeSlots = ['09h00', '09h30', '10h30', '11h15', '12h00', '14h00'];
    const notes = [
      'William na Padaria Santa Clara (turno 06h–14h).',
      'Fernando no Porto Da Gula (a partir das 09h30).',
      'Francisco no Strike Grill antes da abertura do salão.',
      'Josélia e gestores no Terraço Gastronomia.',
      'Roberto no Tempero das Gerais.',
      'Fábio no Bueno\'s Bar pontual às 14h após o almoço!'
    ];

    return orderedIds.map((id, index) => {
      const base = leadMap.get(id)!;
      return {
        ...base,
        order: index + 1,
        suggestedTimeSlot: timeSlots[index],
        modeNote: notes[index]
      };
    });
  }

  if (mode === 'two_days_day2') {
    // Opção B: Dia 2 (Klabin, Moema & Vila Olímpia)
    const orderedIds = [11, 7, 8, 10, 9];
    const timeSlots = ['08h00', '09h30', '10h30', '15h00', '16h15'];
    const notes = [
      '🎯 Conflito #1 resolvido: Início pontual às 08h00 na Chácara Klabin com o Gerente Manoel!',
      'Sr. Renato na Padaria Santa Marcelina (Campo Belo, 08h00 às 11h30).',
      'Matheus / Rodrigo no Comino (Vila Olímpia, janela exata 10h00 às 11h00).',
      'Ricardo / Doris no Koi Restaurante em Moema Pássaros (15h00 às 16h30).',
      'Denise no Yohiro Sushi na Vila Olímpia (15h30 às 17h00).'
    ];
    const walkNotes = [
      { distance: '~350 m da Estação Klabin', duration: '~4 min', notes: 'Início na Estação Chácara Klabin (Linha 5-Lilás / Linha 2-Verde).' },
      { distance: '~6,8 km (Metrô L5: Klabin ➔ Campo Belo)', duration: '~16 min de metrô', notes: 'Pegue o metrô Linha 5 direto até a Estação Campo Belo.' },
      { distance: '~2,6 km', duration: '~32 min', notes: 'Campo Belo ➔ Rua Fiandeiras, 862 (Vila Olímpia).' },
      { distance: '~1,9 km', duration: '~24 min', notes: 'Pausa Almoço 11h30–14h30 ➔ Rua Canário, 683 (Moema).' },
      { distance: '~1,2 km', duration: '~15 min', notes: 'Rua Canário ➔ Rua Min. Jesuíno Cardoso, 525.' }
    ];

    return orderedIds.map((id, index) => {
      const base = leadMap.get(id)!;
      return {
        ...base,
        order: index + 1,
        suggestedTimeSlot: timeSlots[index],
        modeNote: notes[index],
        walkingFromPrev: walkNotes[index],
        conflictWarning: id === 11 ? '🎯 Conflito resolvido: Manoel visitado pontualmente às 08h00!' : undefined
      };
    });
  }

  // Linear Geográfico (Original)
  return ROUTE_LEADS.map(l => ({
    ...l,
    conflictWarning:
      l.id === 4
        ? "⚠️ Conflito de Horário: Fábio só chega após as 14h00, mas a Parada 3 (Strike Grill) é às 10h30. Na Opção A / Dia 1, visite às 14h00."
        : l.id === 11
        ? "⚠️ Conflito Crítico: Manoel atende às 08h00 na Chácara Klabin. No fim da tarde o contato já terá saído. Recomendado agendar no Dia 2 às 08h00!"
        : undefined
  }));
}

export interface OfficialMetroLine {
  code: string;
  name: string;
  color: string;
  textColor: string;
  route: string;
  operator: string;
  type: 'metro' | 'cptm' | 'monotrilho';
}

export const OFFICIAL_METRO_LINES: OfficialMetroLine[] = [
  {
    code: '1',
    name: 'Linha 1 - Azul',
    color: '#0153A0',
    textColor: '#FFFFFF',
    route: 'Jabaquara ⇄ Tucuruvi',
    operator: 'Metrô SP',
    type: 'metro'
  },
  {
    code: '2',
    name: 'Linha 2 - Verde',
    color: '#008060',
    textColor: '#FFFFFF',
    route: 'Vila Madalena ⇄ Vila Prudente',
    operator: 'Metrô SP',
    type: 'metro'
  },
  {
    code: '3',
    name: 'Linha 3 - Vermelha',
    color: '#EE3E34',
    textColor: '#FFFFFF',
    route: 'Palmeiras-Barra Funda ⇄ Corinthians-Itaquera',
    operator: 'Metrô SP',
    type: 'metro'
  },
  {
    code: '4',
    name: 'Linha 4 - Amarela',
    color: '#FED304',
    textColor: '#000000',
    route: 'Luz ⇄ Vila Sônia',
    operator: 'ViaQuatro',
    type: 'metro'
  },
  {
    code: '5',
    name: 'Linha 5 - Lilás',
    color: '#9B3894',
    textColor: '#FFFFFF',
    route: 'Capão Redondo ⇄ Chácara Klabin',
    operator: 'ViaMobilidade',
    type: 'metro'
  },
  {
    code: '15',
    name: 'Linha 15 - Prata',
    color: '#808285',
    textColor: '#FFFFFF',
    route: 'Vila Prudente ⇄ Jardim Colonial',
    operator: 'Metrô SP',
    type: 'monotrilho'
  },
  {
    code: '9',
    name: 'Linha 9 - Esmeralda',
    color: '#00A88E',
    textColor: '#FFFFFF',
    route: 'Osasco ⇄ Bruno Covas/Mendes-Vila Natal',
    operator: 'ViaMobilidade',
    type: 'cptm'
  }
];

export const METRO_STATIONS: MetroStation[] = [
  {
    id: 'alto-boa-vista',
    name: 'Estação Alto da Boa Vista',
    line: 'Linha 5 - Lilás',
    lineCode: '5',
    lineColor: '#9B3894',
    lat: -23.6394,
    lng: -46.7011,
    nearbyStops: [1, 2],
    tip: 'Próxima ao ponto de partida fixo (Rua São Benedito, 1474), Porto Da Gula (400m) e Padaria Santa Clara (950m).',
    address: 'Av. Santo Amaro, 6936 - Santo Amaro'
  },
  {
    id: 'borba-gato',
    name: 'Estação Borba Gato',
    line: 'Linha 5 - Lilás',
    lineCode: '5',
    lineColor: '#9B3894',
    lat: -23.6306,
    lng: -46.6975,
    nearbyStops: [3, 4, 5],
    tip: 'Acesso rápido para Alexandre Dumas (Terraço Gastronomia) e polo comercial de Santo Amaro.',
    address: 'Av. Santo Amaro / Rua Bela Vista'
  },
  {
    id: 'brooklin',
    name: 'Estação Brooklin',
    line: 'Linha 5 - Lilás',
    lineCode: '5',
    lineColor: '#9B3894',
    lat: -23.6236,
    lng: -46.6936,
    nearbyStops: [6],
    tip: 'Conecta ao Tempero das Gerais (Rua Princesa Isabel, 385) e polo corporativo da Berrini.',
    address: 'Av. Santo Amaro / Av. Roque Petroni Jr.'
  },
  {
    id: 'campo-belo',
    name: 'Estação Campo Belo',
    line: 'Linha 5 - Lilás',
    lineCode: '5',
    lineColor: '#9B3894',
    lat: -23.6186,
    lng: -46.6853,
    nearbyStops: [7],
    tip: 'Acesso à Padaria Santa Marcelina (Vieira de Morais). Excelente transição entre Brooklin e Vila Olímpia.',
    address: 'Av. Santo Amaro / Rua Vieira de Morais',
    transfers: [
      { code: '17', name: 'Linha 17 - Ouro', color: '#CCA827', textColor: '#000000' }
    ]
  },
  {
    id: 'eucaliptos',
    name: 'Estação Eucaliptos',
    line: 'Linha 5 - Lilás',
    lineCode: '5',
    lineColor: '#9B3894',
    lat: -23.6094,
    lng: -46.6711,
    nearbyStops: [8, 10],
    tip: 'Shopping Ibirapuera. Acesso ao Comino (Fiandeiras) e divisa Moema / Vila Olímpia.',
    address: 'Av. Ibirapuera, 3103 - Moema'
  },
  {
    id: 'moema',
    name: 'Estação Moema',
    line: 'Linha 5 - Lilás',
    lineCode: '5',
    lineColor: '#9B3894',
    lat: -23.6042,
    lng: -46.6625,
    nearbyStops: [10],
    tip: 'A 600m do Koi Restaurante (Rua Canário). Ponto de embarque direto de 12 min até a Chácara Klabin (-46 min a pé)!',
    address: 'Av. Ibirapuera / Av. Jamaris - Moema'
  },
  {
    id: 'santa-cruz',
    name: 'Estação Santa Cruz',
    line: 'Linha 5 - Lilás',
    lineCode: '5',
    lineColor: '#9B3894',
    lat: -23.5989,
    lng: -46.6366,
    nearbyStops: [],
    tip: 'Grande hub de conexão com a Linha 1 - Azul do Metrô SP.',
    address: 'Rua Domingos de Morais, 2564 - Vila Mariana',
    transfers: [
      { code: '1', name: 'Linha 1 - Azul', color: '#0153A0', textColor: '#FFFFFF' }
    ]
  },
  {
    id: 'chacara-klabin',
    name: 'Estação Chácara Klabin',
    line: 'Linha 5 - Lilás',
    lineCode: '5',
    lineColor: '#9B3894',
    lat: -23.5925,
    lng: -46.6300,
    nearbyStops: [11],
    tip: 'Destino final! O Restaurante e Pizzaria Villa Klabin fica a apenas 350m a pé da saída (Rua Embuaçu, 210).',
    address: 'Rua Vergueiro / Rua Embuaçu - Chácara Klabin',
    transfers: [
      { code: '2', name: 'Linha 2 - Verde', color: '#008060', textColor: '#FFFFFF' }
    ]
  }
];

export const ALL_DATABASE_LEADS: GeneralLead[] = [
  // 11 Rota Principal (Marcados como Prioridade)
  {
    id: 'rot-1',
    name: 'Porto Da Gula 1',
    category: 'Restaurante self-service',
    address: 'Rua São Benedito, 1081 - Santo Amaro, São Paulo - SP',
    neighborhood: 'Santo Amaro',
    phone: '55 11 5524-7360',
    whatsapp: '551155247360',
    cnpj: '66500773000145',
    partners: 'RICARDO COELHO SILVA',
    rating: 4.5,
    reviews: 566,
    mapsUrl: 'https://maps.google.com/?cid=11469584104616243211',
    notes: '26/10: Mensagem enviada por WhatsApp; avisaram para procurar o Fernando assim que ele chegar.',
    isPriority: true
  },
  {
    id: 'rot-2',
    name: 'Padaria Santa Clara',
    category: 'Padaria e Confeitaria',
    address: 'Rua Darwin, 435 - Santo Amaro, São Paulo - SP',
    neighborhood: 'Santo Amaro',
    phone: '55 11 5687-2391',
    site: 'https://www.santaclarapaesedoces.com.br/',
    instagram: 'panificadora_santaclaraoficial',
    rating: 4.4,
    reviews: 820,
    mapsUrl: 'https://maps.google.com/?q=Rua+Darwin+435+Santo+Amaro',
    notes: '23/10: Horário das 06h às 14h — falar com o William (contato passado por Jake).',
    isPriority: true
  },
  {
    id: 'rot-3',
    name: 'Restaurante Strike Grill',
    category: 'Restaurante',
    address: 'R. Amador Bueno, 763 - Santo Amaro, São Paulo - SP',
    neighborhood: 'Santo Amaro',
    phone: '55 11 2609-5667',
    cnpj: '11995946000151',
    partners: 'MARIA GESSILDA ALVES OLIVEIRA',
    site: 'https://pedido.zesto.menu/pt-BR/store/hamburgueria-strike-grill/qhqiajwogafsxmddc',
    rating: 4.5,
    reviews: 906,
    mapsUrl: 'https://maps.google.com/?cid=234698541537175421',
    notes: '21/10: Falar com Francisco (estava viajando). Manhã entre 10h30 e 11h30.',
    isPriority: true
  },
  {
    id: 'rot-4',
    name: "Bueno's Bar",
    category: 'Restaurante',
    address: 'R. Amador Bueno, 801 - Santo Amaro, São Paulo - SP',
    neighborhood: 'Santo Amaro',
    phone: '55 11 2691-6872',
    instagram: 'buenosbar801',
    cnpj: '10867138000146',
    partners: 'PEDRO NONATO DE CARVALHO, FRANCISCO FABIO DO NASCIMENTO',
    rating: 4.3,
    reviews: 986,
    mapsUrl: 'https://maps.google.com/?cid=13152242464131777740',
    notes: '27/10: Procurar Fabio na quarta-feira após às 14h (ligar na terça para confirmar).',
    isPriority: true
  },
  {
    id: 'rot-5',
    name: 'Terraço Gastronomia - Alexandre Dumas',
    category: 'Restaurante',
    address: 'Rua Alexandre Dumas, 1708 - Santo Amaro, São Paulo - SP',
    neighborhood: 'Santo Amaro / Chácara Sto Antônio',
    phone: '55 11 5182-6633',
    whatsapp: '5511941501111',
    site: 'http://terracogastronomia.com.br/',
    instagram: 'terracogastronomia',
    cnpj: '5335541000194',
    rating: 4.6,
    reviews: 2356,
    mapsUrl: 'https://maps.google.com/?cid=7600116745132396087',
    notes: '20/10: Josélia passou e-mails dos gestores: priscila.kiliotaitis@terracogastronomia.com.br e paulo.santos@terracogastronomia.com.br.',
    isPriority: true
  },
  {
    id: 'rot-6',
    name: 'Tempero das Gerais',
    category: 'Restaurante Mineiro',
    address: 'R. Princesa Isabel, 385 - Brooklin Novo, São Paulo - SP',
    neighborhood: 'Brooklin Novo',
    phone: '55 11 5093-9950',
    site: 'https://www.temperodasgerais.com.br/',
    instagram: 'temperodasgerais',
    cnpj: '4309411000114',
    partners: 'JOSE ROBERTO DA SILVA, HELIO ANDRE DA SILVA',
    rating: 4.7,
    reviews: 6505,
    mapsUrl: 'https://maps.google.com/?cid=2262702491410091387',
    notes: '20/10: Ligar para falar com o Roberto a partir das 09h.',
    isPriority: true
  },
  {
    id: 'rot-7',
    name: 'Padaria Santa Marcelina',
    category: 'Padaria',
    address: 'R. Vieira de Morais, 328 - Campo Belo, São Paulo - SP',
    neighborhood: 'Campo Belo',
    phone: '55 11 5091-8444',
    instagram: 'padariasantamarcelina',
    cnpj: '48438250000134',
    partners: 'CLECIO DIAS SILVA',
    rating: 4.3,
    reviews: 4721,
    mapsUrl: 'https://maps.google.com/?cid=9933653484709758066',
    notes: '23/10: Ligar no período da manhã e falar com o Sr. Renato.',
    isPriority: true
  },
  {
    id: 'rot-8',
    name: 'Comino',
    category: 'Restaurante Tex-Mex',
    address: 'Rua Fiandeiras, 862 - Vila Olímpia, São Paulo - SP',
    neighborhood: 'Vila Olímpia',
    phone: '55 11 3045-5542',
    instagram: 'cominotexmex',
    cnpj: '57056884000113',
    partners: 'ANDRE COMINO RODRIGUES',
    rating: 4.7,
    reviews: 561,
    mapsUrl: 'https://maps.google.com/?cid=1657429884150462441',
    notes: '20/10: Procurar por Matheus ou Rodrigo (melhor horário: entre 10h e 11h).',
    isPriority: true
  },
  {
    id: 'rot-9',
    name: 'Yohiro Sushi',
    category: 'Restaurante japonês',
    address: 'R. Min. Jesuíno Cardoso, 525 - Vila Olímpia, São Paulo - SP',
    neighborhood: 'Vila Olímpia',
    phone: '55 11 3846-9327',
    instagram: 'yohirosushioficial',
    cnpj: '41985090000102',
    rating: 4.6,
    reviews: 1611,
    mapsUrl: 'https://maps.google.com/?cid=1792210272785433531',
    notes: '23/10: Ninguém respondeu no WhatsApp; passar presencialmente e procurar pela Denise (15h30 às 17h00).',
    isPriority: true
  },
  {
    id: 'rot-10',
    name: 'Koi Restaurante',
    category: 'Restaurante japonês',
    address: 'Rua Canário, 683 - Moema Pássaros, São Paulo - SP',
    neighborhood: 'Moema',
    phone: '55 11 5051-0664',
    rating: 4.5,
    reviews: 1200,
    mapsUrl: 'https://maps.google.com/?q=Rua+Canario+683+Moema',
    notes: '20/10: Doris informou que ia transferir para o Ricardo, mas a ligação caiu. Tarde 15h às 16h30.',
    isPriority: true
  },
  {
    id: 'rot-11',
    name: 'Restaurante e Pizzaria Villa Klabin',
    category: 'Restaurante self-service',
    address: 'Rua Embuaçu, 210 - Vila Mariana, São Paulo - SP',
    neighborhood: 'Vila Mariana / Chácara Klabin',
    phone: '55 11 3294-6827',
    site: 'http://inktr.ee/villaklabin',
    instagram: 'villaklabin',
    cnpj: '38153944000171',
    partners: 'MANOEL ERASMO VASCONCELOS FEIJAO FILHO',
    rating: 4.2,
    reviews: 1088,
    mapsUrl: 'https://maps.google.com/?cid=6395790514799270874',
    notes: '26/10: Falou com Jéssica; pediu para falar com o Gerente Manoel próximo às 08h.',
    isPriority: true
  },

  // Outros Leads Valiosos da Planilha no Eixo Vila Mariana
  {
    id: 'vm-1',
    name: 'Zino Ristorante',
    category: 'Restaurante italiano',
    address: 'R. Joaquim Távora, 1317 - Vila Mariana, São Paulo - SP',
    neighborhood: 'Vila Mariana',
    phone: '55 11 99366-8070',
    site: 'http://www.zinoadegaerestaurante.com.br/',
    instagram: 'zino_ristorante',
    partners: 'THOMAS RADESCA MIGLIANO',
    rating: 4.6,
    reviews: 932,
    notes: 'Fechado seg e ter. 21/10: 11:35 - chamei no whatsapp.'
  },
  {
    id: 'vm-2',
    name: 'PASTA NOSTRA RISTORANTE',
    category: 'Restaurante italiano',
    address: 'R. Joaquim Távora, 1355 - Vila Mariana, São Paulo - SP',
    neighborhood: 'Vila Mariana',
    phone: '55 11 99302-3643',
    site: 'http://pastanostrarestaurante.com.br/',
    instagram: 'pastanostraristorante',
    partners: 'CLAUDIO LUIZ GUGLIELMETTO NOGUEIRA',
    rating: 4.5,
    reviews: 2406
  },
  {
    id: 'vm-3',
    name: 'ae! cozinha',
    category: 'Restaurante brasileiro',
    address: 'R. Áurea, 343 - Vila Mariana, São Paulo - SP',
    neighborhood: 'Vila Mariana',
    phone: '55 11 3476-8521',
    whatsapp: '551134768521',
    site: 'https://aecozinha.com.br/',
    instagram: 'walkyriafagundes',
    rating: 4.7,
    reviews: 1658
  },
  {
    id: 'vm-4',
    name: 'Mapu Baos e comidinhas',
    category: 'Restaurante taiwanês',
    address: 'R. Áurea, 267 - Vila Mariana, São Paulo - SP',
    neighborhood: 'Vila Mariana',
    phone: '55 11 3384-8535',
    whatsapp: '551133848535',
    site: 'https://linktr.ee/mapubaos',
    instagram: 'mapubaos',
    rating: 4.8,
    reviews: 2183
  },
  {
    id: 'vm-5',
    name: 'Bistrot de Ville',
    category: 'Restaurante francês',
    address: 'R. Rio Grande, 218 - Vila Mariana, São Paulo - SP',
    neighborhood: 'Vila Mariana',
    phone: '55 11 98348-3472',
    site: 'https://bistrotdeville.com.br/',
    instagram: 'bistrot.deville',
    rating: 4.8,
    reviews: 3325
  },
  {
    id: 'vm-6',
    name: 'Fortunato Bar',
    category: 'Restaurante e Bar',
    address: 'R. Joaquim Távora, 1356 - Vila Mariana, São Paulo - SP',
    neighborhood: 'Vila Mariana',
    whatsapp: '+551146802966',
    site: 'http://www.fortunatobar.com.br/',
    instagram: 'fortunatobarsp',
    rating: 4.4,
    reviews: 3229
  },
  {
    id: 'vm-7',
    name: 'Rancho Rio Doce',
    category: 'Restaurante de peixe',
    address: 'R. Machado de Assis, 556 - Vila Mariana, São Paulo - SP',
    neighborhood: 'Vila Mariana',
    phone: '55 11 5571-3051',
    whatsapp: '551155713051',
    site: 'http://www.ranchoriodoce.com.br/',
    instagram: 'ranchoriodoceoficial',
    rating: 4.4,
    reviews: 1770,
    notes: '26/10: 13h42 - enviado msg de whatsapp.'
  },
  {
    id: 'vm-8',
    name: 'Restaurante Graça Mineira',
    category: 'Restaurante Mineiro',
    address: 'Rua Machado Bitencourt, 51 - Vila Mariana, São Paulo - SP',
    neighborhood: 'Vila Mariana',
    phone: '55 11 5579-9686',
    site: 'https://gracamineira.com.br/',
    instagram: 'gracamineira',
    rating: 4.7,
    reviews: 5986,
    notes: '26/10: 13h40 - enviado msg de whatsapp.'
  },
  {
    id: 'vm-9',
    name: 'Don Pancho',
    category: 'Restaurante mexicano',
    address: 'R. Joaquim Távora, 1315 - Vila Mariana, São Paulo - SP',
    neighborhood: 'Vila Mariana',
    phone: '55 11 2538-7494',
    instagram: 'donpanchomexicano',
    rating: 4.5,
    reviews: 2483,
    notes: '26/10: 16h25 - enviado msg de whatsapp.'
  },

  // Leads em Santo Amaro / Chácara Santo Antônio
  {
    id: 'sa-1',
    name: 'Carmen La Loca',
    category: 'Restaurante espanhol',
    address: 'Rua Alexandre Dumas, 1162 - Santo Amaro, São Paulo - SP',
    neighborhood: 'Santo Amaro',
    phone: '55 11 3539-9724',
    instagram: 'restaurantecarmenlaloca',
    rating: 4.5,
    reviews: 1687,
    notes: 'Agendado reunião para 28/10 às 14h30 - Procurar Leandro e/ou João!'
  },
  {
    id: 'sa-2',
    name: 'Restaurante Boa Vista',
    category: 'Restaurante',
    address: 'Rua São Benedito, 1762 - Alto da Boa Vista, São Paulo - SP',
    neighborhood: 'Santo Amaro',
    phone: '55 11 5521-5707',
    instagram: 'restaurante.boavista',
    rating: 4.5,
    reviews: 306,
    notes: 'Fica na mesma rua do Ponto de Partida (São Benedito)!'
  },
  {
    id: 'sa-3',
    name: 'Au Gratin',
    category: 'Restaurante self-service',
    address: 'R. Amador Bueno, 771 - Santo Amaro, São Paulo - SP',
    neighborhood: 'Santo Amaro',
    phone: '55 11 5548-1492',
    instagram: 'augratinrestaurante',
    rating: 4.7,
    reviews: 851,
    notes: 'Vizinho imediato do Strike Grill e Bueno\'s Bar na Amador Bueno!'
  },
  {
    id: 'sa-4',
    name: 'Restaurante Navegantes',
    category: 'Frutos do mar',
    address: 'Rua Alexandre Dumas, 770 - Chácara Santo Antônio, São Paulo - SP',
    neighborhood: 'Chácara Santo Antônio',
    phone: '55 11 5181-5331',
    site: 'http://www.restaurantenavegantes.com.br/',
    rating: 4.5,
    reviews: 2829
  },
  {
    id: 'sa-5',
    name: 'Viareggio Ristorante',
    category: 'Restaurante italiano',
    address: 'R. Fernandes Moreira, 1244 - Chácara Santo Antônio, São Paulo - SP',
    neighborhood: 'Chácara Santo Antônio',
    phone: '55 11 5181-2196',
    whatsapp: '+5511945161590',
    site: 'http://www.viareggioristorante.com.br/',
    rating: 4.6,
    reviews: 1645
  },

  // Leads no Campo Belo
  {
    id: 'cb-1',
    name: 'La Cucina di Casa',
    category: 'Restaurante italiano',
    address: 'Rua Gabriele D\'Annunzio, 1324 - Campo Belo, São Paulo - SP',
    neighborhood: 'Campo Belo',
    phone: '55 11 5093-0002',
    site: 'http://lacucinadicasa.com.br/',
    instagram: 'lacucinadicasa',
    rating: 4.6,
    reviews: 902
  },
  {
    id: 'cb-2',
    name: 'Urban Kitchen - Campo Belo',
    category: 'Restaurante saudável',
    address: 'Rua Gabriele D\'Annunzio, 1334 - Campo Belo, São Paulo - SP',
    neighborhood: 'Campo Belo',
    phone: '55 11 99498-3336',
    site: 'https://www.urbankitchen.com.br/',
    rating: 4.6,
    reviews: 906
  },
  {
    id: 'cb-3',
    name: 'Churrascaria Estância Campo Belo',
    category: 'Churrascaria',
    address: 'Av. Ver. José Diniz, 3271 - Campo Belo, São Paulo - SP',
    neighborhood: 'Campo Belo',
    phone: '55 11 5093-3717',
    site: 'http://estanciachurrascariaeventos.com/',
    rating: 4.7,
    reviews: 26450
  },
  {
    id: 'cb-4',
    name: 'Sensi',
    category: 'Restaurante',
    address: 'Rua Gabriele D\'Annunzio, 1345 - Campo Belo, São Paulo - SP',
    neighborhood: 'Campo Belo',
    phone: '55 11 2478-5099',
    site: 'http://www.sensigastronomiaoficial.com.br/',
    rating: 4.4,
    reviews: 1134
  },
  {
    id: 'cb-5',
    name: 'Restaurante Meu Gourmet',
    category: 'Restaurante',
    address: 'R. Vieira de Morais, 1074 - Campo Belo, São Paulo - SP',
    neighborhood: 'Campo Belo',
    phone: '55 11 91002-8182',
    rating: 5.0,
    reviews: 87
  },

  // Leads em Brooklin
  {
    id: 'bk-1',
    name: 'Portucho - Brooklin',
    category: 'Restaurante argentino',
    address: 'Rua Pássaros e Flores, 239 - Brooklin Novo, São Paulo - SP',
    neighborhood: 'Brooklin Novo',
    phone: '55 11 5542-3139',
    site: 'http://www.portucho.com.br/',
    rating: 4.5,
    reviews: 1968
  },
  {
    id: 'bk-2',
    name: 'Zur Alten Mühle',
    category: 'Restaurante alemão',
    address: 'R. Princesa Isabel, 102 - Brooklin, São Paulo - SP',
    neighborhood: 'Brooklin Novo',
    phone: '55 11 5044-4669',
    site: 'http://barzur.com.br/',
    rating: 4.6,
    reviews: 2286,
    notes: 'Na mesma rua do Tempero das Gerais (Princesa Isabel)!'
  },
  {
    id: 'bk-3',
    name: 'Lolla Osteria',
    category: 'Restaurante italiano',
    address: 'R. Michigan, 682 - Brooklin, São Paulo - SP',
    neighborhood: 'Brooklin Novo',
    phone: '55 11 5041-6987',
    instagram: 'lollaosteria',
    rating: 4.7,
    reviews: 2729
  },

  // Leads na Vila Olímpia & Moema
  {
    id: 'vo-1',
    name: 'Peixe ao Cubo Vila Olímpia',
    category: 'Restaurante japonês',
    address: 'R. Min. Jesuíno Cardoso, 539 - Vila Olímpia, São Paulo - SP',
    neighborhood: 'Vila Olímpia',
    phone: '55 11 3045-0014',
    site: 'https://www.peixeaocubo.com.br/',
    rating: 4.7,
    reviews: 1042,
    notes: 'Porta com porta do Yohiro Sushi na Ministro Jesuíno Cardoso!'
  },
  {
    id: 'vo-2',
    name: 'Frangaria | Grelhados na Brasa',
    category: 'Restaurante',
    address: 'R. Gomes de Carvalho, 955 - Vila Olímpia, São Paulo - SP',
    neighborhood: 'Vila Olímpia',
    phone: '55 11 3045-8828',
    rating: 4.3,
    reviews: 2762
  },
  {
    id: 'vo-3',
    name: 'Praça São Lourenço',
    category: 'Restaurante gastronômico',
    address: 'R. Casa do Ator, 608 - Vila Olímpia, São Paulo - SP',
    neighborhood: 'Vila Olímpia',
    phone: '55 11 3053-9300',
    site: 'http://www.pracasaolourenco.com.br/',
    rating: 4.7,
    reviews: 7013
  },
  {
    id: 'mo-1',
    name: 'Djapa Moema',
    category: 'Restaurante japonês',
    address: 'R. Gaivota, 168 - Moema, São Paulo - SP',
    neighborhood: 'Moema',
    phone: '55 11 2691-2003',
    site: 'https://www.djapa.com.br/',
    rating: 4.7,
    reviews: 13022
  },
  {
    id: 'mo-2',
    name: 'Fogo de Chão Moema',
    category: 'Churrascaria',
    address: 'Av. Moreira Guimarães, 964 - Moema, São Paulo - SP',
    neighborhood: 'Moema',
    phone: '55 11 5056-1795',
    rating: 4.8,
    reviews: 33942
  },
  {
    id: 'mo-3',
    name: 'Restaurante Sapporo',
    category: 'Restaurante japonês',
    address: 'Praça Nossa Sra. Aparecida, 114 - Moema, São Paulo - SP',
    neighborhood: 'Moema',
    phone: '55 11 5054-5140',
    site: 'http://www.restaurantesapporo.com.br/',
    rating: 4.8,
    reviews: 5661
  }
];
