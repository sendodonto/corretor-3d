// Fotos das prévias personalizadas (/gerar-link): ficam num bucket público do
// Supabase ("previas-corretor"), que só aceita imagens de até 2 MB. O link leva
// apenas o nome do arquivo (?f=…), e o site monta o endereço público.
//
// A chave abaixo é a chave pública (publishable) do projeto: feita para ficar
// no navegador. As regras de acesso do bucket limitam o que ela permite.
export const FOTOS = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  chave: process.env.NEXT_PUBLIC_SUPABASE_CHAVE ?? '',
  bucket: 'previas-corretor',
}

export const fotoDisponivel = () => !!FOTOS.url && !!FOTOS.chave

/** Endereço público de uma foto enviada (pelo nome do arquivo). */
export const urlDaFoto = (arquivo: string) =>
  /^[\w-]+\.(jpe?g|png|webp)$/i.test(arquivo) ? `${FOTOS.url}/storage/v1/object/public/${FOTOS.bucket}/${arquivo}` : ''

/** Reduz a foto no navegador (até 1000 px no lado maior, JPEG) antes de enviar. */
async function comprimir(arquivo: File): Promise<Blob> {
  const imagem = await createImageBitmap(arquivo)
  const escala = Math.min(1, 1000 / Math.max(imagem.width, imagem.height))
  const w = Math.round(imagem.width * escala)
  const h = Math.round(imagem.height * escala)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d')!.drawImage(imagem, 0, 0, w, h)
  imagem.close()
  return new Promise((ok, erro) => canvas.toBlob((b) => (b ? ok(b) : erro(new Error('Não foi possível ler a imagem.'))), 'image/jpeg', 0.85))
}

/** Envia a foto e devolve o nome do arquivo guardado. */
export async function enviarFoto(arquivo: File): Promise<string> {
  if (!arquivo.type.startsWith('image/')) throw new Error('Escolha um arquivo de imagem.')
  const blob = await comprimir(arquivo)
  const nome = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}.jpg`
  const r = await fetch(`${FOTOS.url}/storage/v1/object/${FOTOS.bucket}/${nome}`, {
    method: 'POST',
    headers: {
      apikey: FOTOS.chave,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'false',
    },
    body: blob,
  })
  if (!r.ok) throw new Error(`O envio falhou (${r.status}). Tente de novo.`)
  return nome
}
