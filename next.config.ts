import type { NextConfig } from 'next'

// GitHub Pages publica o site em /corretor-3d. Em desenvolvimento, na raiz.
const base = process.env.NODE_ENV === 'production' ? (process.env.BASE_PATH ?? '/corretor-3d') : ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath: base,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: base },
}

export default nextConfig
