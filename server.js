// server.js

const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');

const app = express();
const parser = new Parser();
app.use(cors());

// Aqui estão as URLs dos feeds que você quer buscar
const FEED_URLS = [
  'https://opovodazl.com.br/feed',
  'http://explosaomanauara.com.br/feed'
];

app.get('/api/feeds', async (req, res) => {
  try {
    let allNews = [];

    // Para cada feed da lista
    for (let url of FEED_URLS) {
      // Usa o rss-parser para obter o feed
      const feed = await parser.parseURL(url);

      // Percorre cada item (notícia) do feed
      feed.items.forEach(item => {
        // 1) Declaramos a variável image
        let image = '';

        // 2) Se houver <enclosure> com URL, usamos essa imagem
        if (item.enclosure && item.enclosure.url) {
          image = item.enclosure.url;
        }

        // 3) Se não houver imagem no enclosure, tentamos extrair de <img> no conteúdo
        if (!image && item.content) {
          // Expressão regular para achar a primeira tag <img src="...">
          const imgMatch = item.content.match(/<img.*?src=["'](.*?)["']/);
          if (imgMatch && imgMatch[1]) {
            image = imgMatch[1];
          }
        }

        // 4) Se ainda não encontramos imagem, usamos placeholder
        if (!image) {
          image = 'https://via.placeholder.com/300';
        }

        // 5) Montamos o objeto final da notícia
        allNews.push({
          title: item.title,
          summary: item.contentSnippet || item.content || '',
          image: image,
          link: item.link
        });
      });
    }

    // Envia a lista de notícias em formato JSON
    res.json(allNews);

  } catch (error) {
    console.error('Erro ao buscar feeds:', error);
    res.status(500).json({ error: 'Erro ao buscar feeds' });
  }
});
// evita parse toda hora
let cacheNews = [];
let lastFetchTime = 0;

app.get('/api/feeds', async (req, res) => {
  const now = Date.now();
  // se passou menos de 5 minutos desde o último fetch, retorna o cache
  if (now - lastFetchTime < 5 * 60 * 1000 && cacheNews.length) {
    return res.json(cacheNews);
  }

  // caso contrário, faz o fetch real
  // ... parse feeds
  // no final:
  cacheNews = allNews;
  lastFetchTime = now;
  return res.json(allNews);
});

// Inicia o servidor na porta 5000
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
