import { site } from '@/config/site'

/** Link do WhatsApp com mensagem preenchida. Sem número configurado, o
 *  WhatsApp abre a mensagem para o visitante escolher o contato. */
export function linkWhatsApp(mensagem: string = site.mensagens.geral, numero: string = site.contato.whatsapp) {
  const n = numero.replace(/\D/g, '')
  const texto = encodeURIComponent(mensagem)
  return n ? `https://wa.me/${n}?text=${texto}` : `https://wa.me/?text=${texto}`
}

/** WhatsApp de quem vende o site (faixa de demonstração). */
export const linkDemo = () => linkWhatsApp(site.demo.mensagem, site.demo.whatsapp)
