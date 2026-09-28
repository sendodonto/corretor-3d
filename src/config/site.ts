// ─────────────────────────────────────────────────────────────────────────────
// SITE DE DEMONSTRAÇÃO. A corretora, a marca, o CRECI, os números e os
// depoimentos abaixo são FICTÍCIOS: servem para mostrar o site pronto a
// corretores interessados. Para um cliente real, troque tudo por dados reais
// (depoimentos só com autorização) e desligue `demo.ativo`.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  marca: 'Prado Imóveis',
  /** Parte da marca em destaque no logotipo de texto. */
  marcaCurta: 'Prado',
  url: 'https://sendodonto.github.io/corretor-3d/',
  cidade: 'Porto Alegre',
  regiao: 'Porto Alegre e região',

  corretor: {
    nome: 'Helena Prado',
    cargo: 'Corretora de imóveis',
    /** CRECI fictício (demonstração). */
    creci: 'CRECI/RS 12.345-F',
    /** Foto de banco (Unsplash) para a demonstração. Aceita caminho local. */
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&h=1125&q=78&auto=format&fit=crop&crop=faces',
    bio: [
      'Atendo quem quer comprar bem, não rápido. Antes de marcar uma visita, envio o imóvel em 3D, a planta e o entorno, para que a visita sirva para confirmar e não para descobrir.',
      'Acompanho a negociação, a documentação e o financiamento até a entrega das chaves.',
    ],
    especialidades: ['Casas em condomínio', 'Coberturas', 'Primeiro imóvel', 'Financiamento', 'Zona Sul'],
    numeros: [
      { valor: '12 anos', rotulo: 'no mercado de Porto Alegre' },
      { valor: '280+', rotulo: 'imóveis negociados' },
      { valor: '4,9', rotulo: 'nota média dos clientes' },
    ],
  },

  contato: {
    /** Só dígitos, com DDI e DDD. Vazio = o WhatsApp abre para o visitante escolher o contato. */
    whatsapp: '',
    email: 'contato@pradoimoveis.com.br',
    instagram: '@pradoimoveis',
    horario: 'Seg a sáb, 9h às 19h',
    endereco: 'Rua Padre Chagas, 300 · Moinhos de Vento',
  },

  mensagens: {
    geral: 'Olá! Vi o site e quero conversar sobre imóveis.',
    imovel: (titulo: string, codigo?: string) =>
      `Olá! Tenho interesse no imóvel "${titulo}"${codigo ? ` (código ${codigo})` : ''}. Pode me passar mais informações?`,
  },

  depoimentos: [
    {
      texto: 'Vimos a casa inteira em 3D numa noite, de casa. Fomos à visita só para confirmar e fechamos na mesma semana.',
      nome: 'Mariana e Pedro',
      contexto: 'Compraram casa em condomínio na Zona Sul',
    },
    {
      texto: 'A Helena mandou planta, entorno e o tour antes de eu sair do trabalho. Visitei dois imóveis em vez de dez.',
      nome: 'Rafael T.',
      contexto: 'Primeiro apartamento, Petrópolis',
    },
    {
      texto: 'Cuidou do financiamento e da documentação do começo ao fim. Eu só assinei.',
      nome: 'Cláudia R.',
      contexto: 'Cobertura na Bela Vista',
    },
  ],

  /** Faixa "site de demonstração" com o contato de quem vende o site. */
  demo: {
    ativo: true,
    empresa: 'Módulo',
    /** WhatsApp da Módulo (só dígitos). Vazio = o visitante escolhe o contato. */
    whatsapp: '',
    mensagem: 'Olá! Vi o site de demonstração da Módulo e quero um site assim, com tour 3D.',
  },
}

export type Site = typeof site
