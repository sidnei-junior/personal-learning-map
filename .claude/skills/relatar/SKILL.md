---
name: relatar
description: Registra um estudo no mapa (src/data/studies.json) conduzindo o usuário passo a passo — link, anotações e metadados (trilha, série, tags, posição) — e abre o PR. Serve para estudo novo ou para adicionar anotação a um estudo existente. Use quando o usuário chamar /relatar ou disser que estudou/assistiu algo e quer registrar.
---

# /relatar — registrar um estudo no Personal Learning Map

Conduza a coleta **uma etapa por vez**, em português do Brasil, tom informal.
Faça só a pergunta da etapa atual e espere a resposta antes de seguir.
Se o usuário já trouxe alguma informação na chamada (ex.: link + anotação), não pergunte de novo: confirme e pule a etapa.

Antes de tudo, leia `src/data/studies.json` e `src/data/types.ts` para conhecer as trilhas, estudos e séries atuais.

## Etapa 0 — Novo ou existente?

Pergunte se é um **estudo novo** ou uma **anotação nova em um estudo existente**.
Liste os estudos existentes (título + trilha) para facilitar a escolha.

- Existente → vá para a **Etapa 2** (só anotação) e depois direto para a **Etapa 5**.
- Novo → siga a ordem normal.

## Etapa 1 — Link

Peça o link (ou "sem link").

- **YouTube**: extraia o `videoId` (aceita `youtube.com/watch?v=`, `youtu.be/`, ignore `list`, `index`, `si`).
  Busque título e canal via `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json`
  e mostre ao usuário para confirmar.
- **Curso** (página de compra/plataforma): vai no campo `course` (`name`, `url`, `closed`, `endDate: null`).
  Um curso pode ter também um vídeo do YouTube em `source`.
- **Outro link** (artigo, doc, repo): hoje o card só tem embed de YouTube e link de curso.
  Avise isso e pergunte se quer registrar sem o link ou se prefere que eu adicione suporte a um link genérico (mudança de código, PR à parte).

## Etapa 2 — Anotações

Peça o texto das anotações.

- Corrija português (ortografia, acentos, pontuação) **sem mudar o sentido** e mostre a versão final para aprovação.
- Formato do campo `notes`:
  - aula/vídeo avulso: texto simples (`string`);
  - curso, ou estudo existente que ganha anotação nova: lista de `{ "date": "YYYY-MM-DD", "text": "..." }`, a mais nova **no fim**.
    Se o estudo existente tinha `notes` em texto, converta para lista (a entrada antiga recebe a data do estudo).
- Se o usuário disser que concluiu um curso, preencha `course.endDate` com a data.

## Etapa 3 — Metadados

Pergunte em um único bloco curto, já com sugestões preenchidas para o usuário só confirmar ou ajustar:

1. **Tipo**: aula, curso ou outro.
2. **Trilha**: liste as existentes ou ofereça criar uma nova (título em CAIXA ALTA, subtítulo curto, cor: `pink`, `cyan`, `amber`, `lime`, `violet` — sugira uma cor ainda não usada).
3. **Série / agrupamento**: o estudo continua uma série existente? Liste as séries (cadeias formadas por `links`) mostrando o **último** estudo de cada uma.
   - Continua uma série → `links: ["<id do último estudo da série>"]` (só o primeiro da série liga na trilha; os demais se ligam em corrente).
   - Começa algo novo → `links: []` (liga direto na placa da trilha).
4. **Tags**: sugira 3 a 5 em minúsculas (inclua autor/canal se fizer parte de uma série, ex.: `renato augusto`).
5. **Data**: padrão = hoje. Para curso, é a data de início.

## Etapa 4 — Posição no mapa

Calcule `x`/`y` (centro do card) sem perguntar coordenadas ao usuário:

- Card ≈ **340 × 450 px**; placa de trilha ≈ **400 × 130 px**. Mantenha ≥ **120 px** de folga entre objetos e espaço para o tooltip (~170 px acima do card).
- Continuação de série → à **direita** do último da série (`x + 460`, mesmo `y`); se ocupado, logo abaixo (`y + 560`).
- Primeiro estudo de uma trilha/série nova → à direita da placa da trilha, ou abaixo dos estudos já ligados a ela.
- Trilha nova → abaixo das trilhas existentes (`y + 700` em relação à mais baixa), mesmo `x` da primeira trilha.
- Confira colisão com **todos** os objetos existentes. O mundo tem 2400 × 1600 (`WORLD_W`/`WORLD_H` em `src/components/StudyMap.tsx`); se precisar passar disso, aumente essas constantes.
- `id` do estudo: `<prefixo-da-trilha>-<slug-curto>` (ex.: `sd-cache-aside`). `id` de trilha: slug do título.

## Etapa 5 — Resumo e PR

Mostre um resumo curto com o trecho JSON que será adicionado/alterado e peça OK. Com o OK:

1. `git checkout main && git pull`, depois `git checkout -b feat/<slug>` (ou `notes/<slug>` para anotação em estudo existente).
2. Edite `src/data/studies.json` (mantenha a formatação de 2 espaços).
3. `npm run build` e `npm run lint` — se falhar, pare e explique.
4. Commit em português (`feat: adiciona aula de ...` / `docs: nova anotação em ...`) e push.
5. `gh pr create --base main` com título e descrição em português (o que entrou + anotação).
6. Termine com o link do PR e um resumo de 2–3 linhas.
