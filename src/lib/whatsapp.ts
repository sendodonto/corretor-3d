import { site } from '@/config/site'

/** Link do WhatsApp com mensagem preenchida. Sem número configurado, o
 *  WhatsApp abre a mensagem para o visitante escolher o contato. */
export function linkWhatsApp(mensagem: string = site.mensagens.geral) {
  const numero = site.contato.whatsapp.replace(/\D/g, '')
  const texto = encodeURIComponent(mensagem)
  return numero ? `https://wa.me/${numero}?text=${texto}` : `https://wa.me/?text=${texto}`
}
