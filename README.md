# 🖼️ ImgSanitizer

Aplicação web open-source para remover metadados sensíveis de imagens antes do compartilhamento, incluindo EXIF, GPS, informações de câmera, autor e timestamps.

## 🌐 Live Preview

Teste a versão publicada na Vercel:

**https://imgsanitizer.vercel.app**

> No live preview, a imagem é enviada por HTTPS para uma Vercel Function, processada em memória e devolvida imediatamente. O código da aplicação não salva a imagem em banco de dados, disco ou armazenamento persistente. Para máxima privacidade e limites maiores, execute o projeto localmente.

## ✨ Características

- **🧹 Remoção de metadados**: reprocessa a imagem com Sharp sem preservar EXIF e outros metadados.
- **📍 Privacidade**: remove informações como GPS, câmera, autor, timestamps, thumbnails e descrições embutidas quando presentes.
- **⚡ Processamento em lote**: a interface aceita até 20 arquivos por seleção e processa um por vez para reduzir consumo de memória.
- **🧠 Sem retenção pela aplicação**: cada imagem existe apenas em memória durante a requisição e o resultado é devolvido na mesma resposta.
- **🔐 Respostas sem cache**: endpoints de processamento usam `Cache-Control: no-store`.
- **🛡️ Hardening HTTP**: CSP, proteção contra framing, `nosniff`, política de referência e restrições de câmera/microfone/geolocalização.
- **🎨 Interface simples**: HTML, Tailwind CSS e JavaScript sem framework no frontend.
- **♿ Acessibilidade básica**: área de upload operável por teclado e mensagens de status via `aria-live`.

## 🚀 Como começar

### Pré-requisitos

- Node.js 18+
- npm

### Instalação

```bash
git clone https://github.com/contatodiegobianchini/imgsanitizer.git
cd imgsanitizer
npm install
```

### Desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

### Build e execução

```bash
npm run build
npm start
```

### Verificação de tipos

```bash
npm run check
```

## 📖 Como usar

1. Selecione ou arraste imagens JPG, PNG, WebP ou GIF.
2. Clique em **Sanitizar imagens**.
3. Cada arquivo é enviado individualmente para o backend.
4. O backend remove os metadados e devolve o arquivo sanitizado na mesma requisição.
5. O navegador cria o link de download localmente e libera o objeto quando ele não é mais necessário.

## 📏 Limites de upload

O limite é calculado pelo backend e informado automaticamente à interface:

- **Vercel / Live Preview:** 3 MB por imagem.
- **Execução local:** 50 MB por imagem.
- **Quantidade por seleção:** até 20 imagens.

A margem de 3 MB no preview existe porque Vercel Functions impõem limites de payload para requisições e respostas. Em uma instalação própria, o limite pode ser alterado com:

```bash
IMG_SANITIZER_MAX_MB=25 npm start
```

O valor configurado é limitado a no máximo 100 MB pela aplicação.

## 🛠️ Stack

- **Frontend:** HTML5, JavaScript e Tailwind CSS
- **Backend:** Node.js + Express
- **Upload multipart:** Multer
- **Linguagem do backend:** TypeScript
- **Processamento de imagens:** Sharp
- **Deploy de demonstração:** Vercel

## 📋 Estrutura

```text
imgsanitizer/
├── api/
│   └── index.ts           # Entrada serverless para Vercel
├── public/
│   ├── index.html         # Interface
│   ├── app.js             # Lógica do frontend
│   └── style.css          # Estilos complementares
├── src/
│   ├── server.ts          # Servidor e API
│   ├── sanitizer.ts       # Sanitização via Sharp
│   └── utils.ts           # Validação de arquivos
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md
```

## 🔐 Segurança e privacidade

### Versão hospedada

Na versão publicada, os arquivos precisam chegar ao backend para serem processados. A aplicação:

- não grava os arquivos em banco de dados;
- não cria arquivos temporários em disco;
- não mantém um armazenamento de downloads;
- não gera URLs públicas persistentes para as imagens;
- processa apenas um arquivo por requisição;
- devolve o resultado imediatamente;
- não usa cookies de rastreamento.

Isso descreve o comportamento do **código do ImgSanitizer**. O provedor de hospedagem e a infraestrutura de rede podem possuir suas próprias políticas operacionais.

### Execução local

Quando executado em `localhost`, o processamento continua passando pelo servidor Node.js da sua própria máquina, sem enviar a imagem ao deploy público.

## 🧯 Proteção contra vazamento de segredos

O `.gitignore` cobre, entre outros:

- `.env` e variantes;
- configuração local da Vercel;
- certificados e chaves privadas;
- arquivos comuns de credenciais e service accounts;
- artefatos de build, logs e configurações locais de IDE.

Nunca coloque tokens, senhas ou credenciais reais em arquivos versionados, mesmo que sejam removidos em um commit posterior: o Git mantém histórico.

## 📊 Formatos suportados

- JPEG / JPG
- PNG
- WebP
- GIF

> Alguns formatos animados podem ter comportamento dependente do suporte do Sharp e do arquivo de origem. Sempre valide o resultado antes de substituir o original.

## 🤝 Contribuindo

1. Faça um fork.
2. Crie uma branch de feature.
3. Faça suas alterações.
4. Rode `npm run check` e `npm run build`.
5. Abra um Pull Request.

## 📝 Licença

MIT. Consulte [LICENSE](LICENSE).

## 💡 Roadmap

- [ ] Preview antes/depois dos metadados
- [ ] Testes automatizados de remoção de EXIF/GPS
- [ ] Suporte adicional a TIFF e BMP
- [ ] PWA
- [ ] Compressão opcional
- [ ] Sanitização de metadados de vídeo

## 🐛 Bugs

Encontrou um problema? Abra uma issue no GitHub.

## 📬 Contato

Diego Bianchini — [@contatodiegobianchini](https://github.com/contatodiegobianchini)
