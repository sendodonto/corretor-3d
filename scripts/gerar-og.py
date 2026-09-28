"""Gera public/og.jpg (1200×630): a imagem que aparece na prévia do link
(WhatsApp, Instagram, LinkedIn). Usa o pôster do 3D e o logo da Módulo.

Uso: python scripts/gerar-og.py
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
PAPEL = (247, 246, 243)
TINTA = (29, 29, 31)
SUAVE = (110, 110, 115)
ACENTO = (30, 95, 78)
F = 'C:/Windows/Fonts/'

og = Image.new('RGB', (W, H), PAPEL)

# Casa (pôster do 3D, fundo off-white igual ao da imagem)
casa = Image.open('public/posters/casa-hero.webp').convert('RGB')
esc = 700 / casa.width
casa = casa.resize((700, int(casa.height * esc)), Image.LANCZOS)
og.paste(casa, (W - 700 + 40, (H - casa.height) // 2 + 10))

d = ImageDraw.Draw(og)
titulo = ImageFont.truetype(F + 'seguisb.ttf', 58)
texto = ImageFont.truetype(F + 'segoeui.ttf', 26)
selo = ImageFont.truetype(F + 'seguisb.ttf', 20)

# Selo "Demonstração"
x, y = 64, 78
d.rounded_rectangle((x, y, x + 214, y + 40), radius=20, fill=(229, 239, 235))
d.ellipse((x + 16, y + 16, x + 24, y + 24), fill=ACENTO)
d.text((x + 34, y + 7), 'Site para corretores', font=selo, fill=ACENTO)

# Título e texto
d.multiline_text((64, 150), 'Seu site com\ntour 3D dos\nseus imóveis', font=titulo, fill=TINTA, spacing=6)
d.multiline_text((64, 380), 'O cliente explora a casa por fora,\npor cima e por dentro antes da visita.', font=texto, fill=SUAVE, spacing=8)

# Logo da Módulo (máscara → tinta)
logo = Image.open('public/marca/modulo-logo.png').convert('RGBA')
alt = 38
logo = logo.resize((int(logo.width * alt / logo.height), alt), Image.LANCZOS)
tinta = Image.new('RGBA', logo.size, TINTA + (255,))
tinta.putalpha(logo.getchannel('A'))
og.paste(tinta, (64, 510), tinta)

og.save('public/og.jpg', quality=88, optimize=True)
print('public/og.jpg', og.size)
