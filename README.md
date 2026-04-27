# 🖼️ ImgSanitizer

Uma aplicação web open-source, 100% local, para limpeza em massa de metadados de imagens. Prepare suas imagens para postagem perfeita em redes sociais removendo EXIF, GPS, dados de câmera e outros metadados sensíveis.

## ✨ Características

- **🔒 Completamente Local**: Todos os arquivos são processados no seu navegador e servidor local. Nenhum upload para a nuvem.
- **⚡ Processamento em Massa**: Limpe múltiplas imagens simultaneamente.
- **🧹 Limpeza Completa**: Remove:
  - Dados EXIF (câmera, configurações)
  - Coordenadas GPS e localização
  - Informações de autor
  - Timestamps
  - Thumbnails embutidas
  - Comentários e descrições

- **💾 Armazenamento Temporário Persistente**: Imagens mantidas em memória por até 48 horas com auto-limpeza.
- **📱 Social Media Ready**: Otimiza imagens para Instagram, Twitter, TikTok, Facebook, etc.
- **🎨 Interface Intuitiva**: UI moderna com Tailwind CSS.
- **📦 Zero Dependências Externas**: Tudo roda localmente no Node.js.

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
git clone https://github.com/contatodiegobianchini/imgsanitizer.git
cd imgsanitizer
npm install
```

### Executar Desenvolvimento

```bash
npm run dev
```
A aplicação estará disponível em http://localhost:3000

### Build para Produção

```bash
npm run build
npm start
```

## 📖 Como Usar

1. Acesse a aplicação em http://localhost:3000
2. Faça upload de uma ou múltiplas imagens (JPG, PNG, WebP)
3. Clique em "Sanitizar" para remover todos os metadados
4. Baixe as imagens limpas, prontas para redes sociais

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3, Tailwind CSS
- **Backend**: Node.js + Express
- **Linguagem**: TypeScript
- **Processamento de Imagens**: Sharp
- **Armazenamento**: In-memory com auto-limpeza (48h)

## 📋 Estrutura do Projeto

```text
imgsanitizer/
├── src/
│   ├── server.ts          # Servidor Express
│   ├── storage.ts         # Gerenciador de armazenamento temporário
│   ├── sanitizer.ts       # Lógica de limpeza de metadados
│   └── utils.ts           # Funções utilitárias
├── public/
│   ├── index.html         # Página principal
│   └── style.css          # Estilos Tailwind
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Segurança e Privacidade

- ✅ Nenhum arquivo é enviado para servidores remotos
- ✅ Processamento 100% local
- ✅ Limpeza automática de arquivos antigos
- ✅ Sem cookies de rastreamento
- ✅ Código aberto e auditável

## 📊 Limitações Conhecidas

- **Tamanho máximo de arquivo**: 50MB (configurável)
- **Armazenamento temporário**: 48 horas
- **Formatos suportados**: JPG, PNG, WebP, GIF

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 💡 Roadmap

- [ ] Suporte para mais formatos (TIFF, BMP)
- [ ] Preview antes/depois de metadados
- [ ] Batch processing com fila
- [ ] API REST para integração
- [ ] PWA (Progressive Web App)
- [ ] Compressão de imagem optativa
- [ ] Suporte a video (remover metadados)

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma issue

## 📬 Contato

Diego Bianchini - @contatodiegobianchini

⭐ Se este projeto foi útil, considere dar uma estrela!
