// Caminho base do site (GitHub Pages publica em /corretor-3d). Links do Next
// já recebem o basePath; arquivos lidos por <img>, fetch ou three.js não.
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const asset = (p: string) => (/^https?:/.test(p) ? p : `${BASE}${p}`)
