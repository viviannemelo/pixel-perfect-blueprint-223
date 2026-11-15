# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Publicar o portfólio no GitHub Pages

A automação em `.github/workflows/deploy-portfolio.yml` publica somente o site estático de `public/portfolio`, sem precisar gerar ou enviar ZIPs. O projeto completo continua sincronizado com o Lovable; a publicação não usa o aplicativo de pré-visualização.

1. No Lovable, abra **Project settings → Git → Connect GitHub** para criar e sincronizar um novo repositório. No celular, use **Chat → ... → Settings → Git**. Não envie o ZIP para outro repositório esperando que ele seja sincronizado.
2. Mantenha a sincronização do Lovable na **branch padrão** desse repositório: a automação só publica essa branch, nunca branches de rascunhos.
3. No GitHub, abra o repositório em **Settings → Pages → Build and deployment → Source** e escolha **GitHub Actions**. No celular, use o navegador e, se necessário, ative a versão para computador.
4. Para a primeira publicação, abra **Actions → Publish portfolio to GitHub Pages → Run workflow**, selecione a branch padrão e execute. Depois, cada alteração em `public/portfolio` sincronizada nessa branch será publicada automaticamente.
5. Aguarde a execução terminar. O endereço publicado aparece em **Settings → Pages** e no ambiente **github-pages** da execução.

Se o GitHub não permitir ativar Pages no repositório privado, será necessário um plano do GitHub que ofereça essa opção ou tornar o repositório público (o que também expõe o código). A publicação só estará confirmada após uma execução bem-sucedida no GitHub; conectar o repositório e ativar Pages são passos feitos por você.
