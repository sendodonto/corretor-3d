// O export estático do Next 16 grava os segmentos de prefetch em pastas
// (__next.imoveis/$d$slug/__PAGE__.txt), mas o navegador pede o nome com
// pontos (__next.imoveis.$d$slug.__PAGE__.txt). Sem servidor para reescrever
// a URL (GitHub Pages), criamos a cópia com o nome esperado.
import { readdirSync, statSync, copyFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

let copias = 0
function andar(dir) {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome)
    if (!statSync(p).isDirectory()) continue
    if (nome.startsWith('__next.')) achatar(p, dir)
    else andar(p)
  }
}
function achatar(pasta, destino) {
  const arquivos = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? arquivos(join(d, n)) : [join(d, n)]))
  for (const f of arquivos(pasta)) {
    const nome = relative(destino, f).split(sep).join('.')
    copyFileSync(f, join(destino, nome))
    copias++
  }
}
andar('out')
console.log(`pós-build: ${copias} segmentos de prefetch copiados`)
