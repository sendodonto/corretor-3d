import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { site } from '@/config/site'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { AgendamentoProvider } from '@/components/ScheduleVisit'

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: `${site.marca} — Explore seu próximo imóvel em 3D`, template: `%s · ${site.marca}` },
  description: 'Imóveis em Porto Alegre com tour 3D: explore a casa por dentro e por fora antes mesmo da visita.',
  metadataBase: new URL(site.url),
  openGraph: { locale: 'pt_BR', type: 'website', siteName: site.marca },
}

export const viewport: Viewport = { themeColor: '#f7f6f3', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      className={geist.variable}
      // Altura do topo fixo: cabeçalho (64 px) + faixa de demonstração (36 px).
      style={{ '--topo': site.demo.ativo ? '100px' : '64px' } as React.CSSProperties}
    >
      <body className="min-h-dvh">
        <AgendamentoProvider>
          <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-full focus:bg-tinta focus:px-4 focus:py-2 focus:text-white">
            Pular para o conteúdo
          </a>
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <WhatsAppCTA />
        </AgendamentoProvider>
      </body>
    </html>
  )
}
