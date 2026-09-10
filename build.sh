#!/usr/bin/env bash
# Regenera assets do site (variantes de imagem + CSS/JS minificados).
#
# Dependencias:
#   brew install webp        # cwebp / dwebp
#   node (para npx esbuild)
#
# Uso: ./build.sh
set -euo pipefail
cd "$(dirname "$0")"

echo "==> variantes responsivas de imagem (400w / 800w)"
mkdir -p img/projetos

gen() { # $1 = arquivo origem   $2 = slug de saida
  for w in 400 800; do
    cwebp -quiet -q 78 -m 6 -resize "$w" 0 "$1" -o "img/projetos/$2-${w}.webp"
  done
  echo "    $2"
}

gen "img/comoda.webp"                                  "comoda-14-gavetas-branca"
gen "img/cozinhaBranco.webp"                           "cozinha-planejada-branca-mdf"
gen "img/gabinete.webp"                                "gabinete-cozinha-mdf-amadeirado"
gen "img/guardaRoupaBrancoParede.webp"                 "guarda-roupa-embutido-portas-correr"
gen "img/guardaRoupa.webp"                             "guarda-roupa-planejado-amadeirado-nicho"
gen "img/guardaRoupa2.webp"                            "guarda-roupa-6-portas-amadeirado"
gen "img/guardaRoupaBranco.webp"                       "guarda-roupa-embutido-branco-6-portas"
gen "img/guardaRoupaBrancoParedeComoda.webp"           "guarda-roupa-correr-comoda-branca"
gen "img/Office.webp"                                  "home-office-planejado-nogueira"
gen "img/WhatsApp Image 2023-09-18 at 8.53.54 PM.webp" "home-office-escrivaninha-nichos-nogueira"
gen "img/WhatsApp Image 2023-09-18 at 8.53.53 PM.webp" "guarda-roupa-interior-prateleiras-gaveteiro"
gen "img/sala.webp"                                    "balcao-sala-marmore-branco"
gen "img/banheiro.webp"                                "gabinete-banheiro-marmore-espelheira"

echo "==> imagem Open Graph (1200x630)"
cwebp -quiet -q 84 -m 6 -crop 0 480 1200 628 -resize 1200 630 \
      img/gabinete.webp -o img/og-rgm-marcenaria.webp
dwebp -quiet img/og-rgm-marcenaria.webp -o /tmp/og-rgm.png
sips -s format jpeg -s formatOptions 80 /tmp/og-rgm.png --out img/og-rgm-marcenaria.jpg >/dev/null
rm -f /tmp/og-rgm.png

echo "==> minificando CSS e JS"
npx -y esbuild@0.24.0 style/style.css  --minify --outfile=style/style.min.css  --allow-overwrite
npx -y esbuild@0.24.0 script/script.js --minify --target=es2019 --outfile=script/script.min.js --allow-overwrite

echo "==> pronto"
