'use client'

// Prévia personalizada da demonstração: o link leva o nome do corretor que vai
// recebê-lo, e o site aparece com a marca dele.
//   ?para=Ana%20Ferreira            nome (obrigatório)
//   &marca=Ferreira                 nome no logotipo de texto (padrão: sobrenome)
//   &f=abc123.jpg                   foto enviada em /gerar-link (padrão: iniciais)
//   &foto=https://...               ou o endereço de uma foto
//   &creci=CRECI/RS%2000000-F       CRECI real (padrão: não mostra)
//   &cargo=Corretora%20de%20imóveis (padrão: "Corretagem de imóveis")
// A personalização fica guardada na aba (sessionStorage) enquanto a pessoa navega.
// Dados fictícios da demonstração (CRECI, números de atuação) nunca aparecem
// junto do nome de uma pessoa real.
import { useMemo, useSyncExternalStore } from 'react'
import { site } from '@/config/site'
import { urlDaFoto } from './fotos'

const CHAVE = 'previa-corretor'

export interface Corretor {
  nome: string
  primeiroNome: string
  marcaCurta: string
  cargo: string
  creci: string
  foto: string
  numeros: { valor: string; rotulo: string }[]
  personalizado: boolean
}

function ler(): string {
  try {
    const q = new URLSearchParams(location.search)
    const nome = q.get('para')?.trim()
    if (nome) {
      const dados = JSON.stringify({
        nome,
        marca: q.get('marca')?.trim() ?? '',
        // ?f=arquivo.jpg: foto enviada em /gerar-link; ?foto=https://…: endereço direto
        foto: (q.get('f') ? urlDaFoto(q.get('f')!.trim()) : '') || (q.get('foto')?.trim() ?? ''),
        creci: q.get('creci')?.trim() ?? '',
        cargo: q.get('cargo')?.trim() ?? '',
      })
      sessionStorage.setItem(CHAVE, dados)
      return dados
    }
    return sessionStorage.getItem(CHAVE) ?? ''
  } catch {
    return ''
  }
}

const assinar = (aviso: () => void) => {
  addEventListener('popstate', aviso)
  return () => removeEventListener('popstate', aviso)
}

function montar(bruto: string): Corretor {
  const c = site.corretor
  if (!bruto) {
    return {
      nome: c.nome,
      primeiroNome: c.nome.split(' ')[0],
      marcaCurta: site.marcaCurta,
      cargo: c.cargo,
      creci: c.creci,
      foto: c.foto,
      numeros: c.numeros,
      personalizado: false,
    }
  }
  const d = JSON.parse(bruto) as { nome: string; marca: string; foto: string; creci: string; cargo: string }
  const partes = d.nome.split(/\s+/)
  return {
    nome: d.nome,
    primeiroNome: partes[0],
    marcaCurta: d.marca || partes[partes.length - 1],
    cargo: d.cargo || 'Corretagem de imóveis',
    creci: d.creci,
    foto: d.foto,
    numeros: [],
    personalizado: true,
  }
}

/** Corretor exibido no site: o da demonstração ou o do link personalizado. */
export function useCorretor(): Corretor {
  const bruto = useSyncExternalStore(assinar, ler, () => '')
  return useMemo(() => montar(bruto), [bruto])
}
