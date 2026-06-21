# Anamnese da Família 🩺🔒

Página estática para guardar a **anamnese completa** (histórico médico) dos membros de
**várias famílias**, **criptografada de ponta a ponta no navegador**. Pensada para acesso
rápido em emergências e para ser hospedada no **GitHub Pages**.

Cada família tem seu **próprio arquivo criptografado e sua própria senha** (o sobrenome).
Quem digita a senha vê **apenas os dados da sua família** — o visualizador testa a senha
contra cada família e abre só a que corresponder. Apenas os arquivos **criptografados**
vão para o GitHub; o texto puro nunca sai do seu computador.

Famílias já incluídas (dados de exemplo):

| Família | Senha | Arquivo |
|---|---|---|
| Hatanaka (lado materno) | `hatanaka` | `dados-hatanaka.json` |
| Bussinati (lado paterno) | `bussinati` | `dados-bussinati.json` |
| Rapariga (sua família atual) | `rapariga` | `dados-rapariga.json` |

## ⚠️ Leia antes (segurança)

- O GitHub Pages é **público**. Qualquer pessoa pode baixar os `dados-*.json`. Eles só são
  úteis para quem tiver a senha, mas alguém poderia tentar **adivinhar a senha por força bruta**.
- Sobrenomes (`hatanaka`, `bussinati`, `rapariga`) são **fáceis de adivinhar**. Para dados médicos reais, recomendo
  fortemente usar uma senha mais forte (ex.: `hatanaka-uma-frase-secreta-da-familia-2026`).
  A senha é **trocável a qualquer momento** (veja abaixo), sem mexer no código.
- Usamos **AES-256-GCM** com **PBKDF2-SHA256 (250.000 iterações)** para dificultar ataques.
- Não compartilhe a senha por canais inseguros. Combine-a pessoalmente com a família.

## Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | **Visualizador**: pede a senha e mostra os dados da família correspondente. |
| `editor.html` | **Editor**: escolhe a família, cadastra/edita membros e exames, criptografa e baixa o `dados-<familia>.json`. |
| `cripto.js` | Funções de criptografia (compartilhadas). |
| `estilo.css` | Estilos. |
| `familias.json` | **Manifesto**: lista as famílias e seus arquivos (não é secreto). |
| `dados-<familia>.json` | Os dados **criptografados** de cada família. |
| `gerar-exemplo.js` | Script Node opcional que gerou os dados de exemplo das 3 famílias. |

> Os arquivos `dados-*.json` atuais contêm **dados de exemplo** (membros fictícios).
> Substitua pelos dados reais usando o editor.

## Como adicionar uma nova família

1. No `editor.html`, escolha **"+ Nova família..."**, informe um identificador (ex.: `silva`)
   e o nome de exibição. A senha padrão será o identificador.
2. Cadastre os membros e clique em **Gerar** — será baixado `dados-silva.json`.
3. Adicione a família ao `familias.json`:
   ```json
   { "id": "silva", "nome": "Silva", "arquivo": "dados-silva.json" }
   ```
4. Suba os dois arquivos (`dados-silva.json` e `familias.json`) para o GitHub.

## Como usar

### 1. Editar os dados (local)
1. Abra `editor.html` (melhor via servidor local — veja abaixo — para conseguir carregar do servidor).
2. Em **"Escolher a família"**, selecione a família desejada.
3. (Opcional) Para editar dados existentes, digite a senha e clique em **"Carregar do servidor"**
   (ou selecione o arquivo manualmente).
4. Preencha/edite os membros, exames etc.
5. Em **"Gerar arquivo criptografado"**, confirme a senha e salve:
   - **💾 Salvar na pasta do projeto** (Chrome/Edge): conecte a pasta do projeto **uma vez**
     (botão "Conectar pasta do projeto") e o arquivo passa a ser salvo **direto na pasta certa**,
     sempre no mesmo lugar — sem passar pela pasta Downloads. O navegador lembra a pasta entre
     sessões (pode pedir permissão de novo ao salvar). O visualizador local reflete na hora.
   - **⬇️ Baixar** (qualquer navegador): baixa em `~/Downloads`; mova/substitua manualmente.
6. Para publicar para todos, faça **commit e push** do `dados-<familia>.json` no GitHub.

> A opção de salvar direto na pasta usa a *File System Access API*, disponível em navegadores
> baseados em Chromium (Chrome/Edge) em `http://localhost` ou `https://`. No Safari/Firefox,
> use o botão de baixar.

> 💾 **Edição aos poucos (rascunho automático):** tudo que você preenche é salvo
> automaticamente no seu navegador (por família) e **volta sozinho** quando você reabre o
> editor — mesmo sem ter gerado o arquivo. Assim dá para completar os dados ao longo do tempo
> sem perder nada. Quando terminar uma rodada de edição, gere o arquivo e suba no GitHub.
> O rascunho é local e **não é criptografado**; em dispositivo compartilhado, use o botão
> **"Descartar rascunho"** ao terminar.

### 2. Visualizar
- **Online (GitHub Pages):** abra a URL do site, digite a senha da sua família.
- **Local:** o navegador bloqueia ler os arquivos via duplo clique. Use um servidor local:
  ```bash
  python3 -m http.server 8000
  ```
  e acesse `http://localhost:8000`. (Ou, na tela de senha, selecione os `dados-*.json`
  manualmente.)

### 3. Trocar a senha de uma família no futuro 🔑
1. Abra `editor.html`, escolha a família e carregue com a **senha antiga**.
2. Na seção "Gerar arquivo", digite a **senha nova**.
3. Baixe o `dados-<familia>.json` e suba no GitHub. Agora só a senha nova abre aquela família.

## Publicar no GitHub Pages

```bash
# dentro desta pasta
git add .
git commit -m "Anamnese da família"
# crie um repositório no GitHub e conecte:
git remote add origin https://github.com/SEU_USUARIO/anamnese-familia.git
git branch -M main
git push -u origin main
```

No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch →
Branch: `main` / `/root` → Save**. Em ~1 min o site fica em
`https://SEU_USUARIO.github.io/anamnese-familia/`.

Compartilhe essa URL + a senha com a família.

### Dica de privacidade
Mesmo criptografado, você pode deixar o **repositório privado** (Settings → General →
Danger Zone → Change visibility). Repositórios privados podem publicar no GitHub Pages em
planos pagos; no plano gratuito, deixe público — a segurança vem da criptografia, não do
sigilo do repositório.
