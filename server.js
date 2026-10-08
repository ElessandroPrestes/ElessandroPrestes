const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const README_PATH = path.join(__dirname, 'README.md');

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>README Preview - Elessandro Prestes</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css">
  <script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
  <style>
    :root {
      color-scheme: light dark;
    }
    body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #0d1117;
      transition: background-color 0.2s ease;
    }
    @media (prefers-color-scheme: light) {
      body {
        background-color: #ffffff;
      }
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 1px solid #30363d;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 13px;
      color: #8b949e;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      background: #21262d;
      color: #58a6ff;
      font-weight: 500;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3fb950;
      box-shadow: 0 0 6px #3fb950;
    }
    .markdown-body {
      box-sizing: border-box;
    }
    .markdown-body table {
      display: table;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="status-badge">
      <span class="status-dot"></span>
      <span>Live Preview Ativo (atualização automática a cada 2s)</span>
    </div>
    <div>README.md • ElessandroPrestes</div>
  </div>

  <article id="content" class="markdown-body">
    Carregando visualização...
  </article>

  <script>
    let lastContent = '';
    marked.setOptions({
      gfm: true,
      breaks: true
    });

    async function updateMarkdown() {
      try {
        const response = await fetch('/raw?t=' + Date.now());
        if (!response.ok) return;
        const text = await response.text();
        if (text !== lastContent) {
          lastContent = text;
          document.getElementById('content').innerHTML = marked.parse(text);
        }
      } catch (err) {
        console.error('Erro ao atualizar markdown:', err);
      }
    }

    updateMarkdown();
    setInterval(updateMarkdown, 2000);
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/raw') {
    if (fs.existsSync(README_PATH)) {
      const content = fs.readFileSync(README_PATH, 'utf-8');
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(content);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('README.md não encontrado');
    }
    return;
  }

  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  // Página principal de visualização
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache'
  });
  res.end(HTML_TEMPLATE);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor de preview rodando em http://0.0.0.0:${PORT}`);
});
