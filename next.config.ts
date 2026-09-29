import type { NextConfig } from 'next'

// GitHub Pages publica o site em /corretor-3d. Em desenvolvimento, na raiz.
const base = process.env.NODE_ENV === 'production' ? (process.env.BASE_PATH ?? '/corretor-3d') : ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath: base,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: base,
    // Fotos das prévias (/gerar-link): projeto Supabase da Vello, bucket "previas-corretor".
    // A chave é a pública (publishable), feita para o navegador; o bucket só aceita envio de imagens.
    NEXT_PUBLIC_SUPABASE_URL: 'https://scqlyropbykktnzlsdwh.supabase.co',
    NEXT_PUBLIC_SUPABASE_CHAVE: 'sb_publishable_Cz7swhcvYp4183x-OprW9Q_RvQ0oNHa',
  },
}

export default nextConfig
