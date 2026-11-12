# Personal Learning Map

Diário de estudos em formato de canvas: pixel art, placas neon de cafeteria e chuva caindo no fundo.
Cada trilha vira uma placa neon e cada estudo vira um card ligado a ela por fios de neon.
Passe o mouse num card para ver a anotação; clique em "ver anotações" para ver o texto completo.

## Rodando

```bash
npm install
npm run dev
```

## Adicionando estudos

Tudo está em [`src/data/studies.json`](src/data/studies.json):

- `tracks`: trilhas (placas neon). Cores disponíveis: `pink`, `cyan`, `amber`, `lime`, `violet`.
- `studies`: estudos, cada um com `trackId`, `date` (YYYY-MM-DD), `tags`, `notes`, `source` (YouTube, opcional), `links` (ids de outros estudos) e posição `x`/`y` no mapa.
  - `notes` pode ser um texto ou uma lista de `{ "date", "text" }` (diário de anotações; a mais nova vai no fim).
  - `course` (opcional): `{ "name", "url", "closed", "endDate" }`. Nesse caso, `date` é a data de início e `endDate: null` indica que o curso está em andamento.

## Capa

A capa é `public/cover.png` (16:10, ~1600×1000, pixel art). Para trocar, basta substituir o arquivo; se ele não existir, aparece um placeholder.

## Deploy

Projeto Vite padrão, então o Vercel detecta sozinho (build `npm run build`, saída `dist`).
