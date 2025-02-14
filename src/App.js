import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        // Ajuste para a URL real do seu backend:
        const response = await fetch('http://localhost:5000/api/feeds');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Erro ao buscar feeds do backend:', error);
      }
    }
    fetchNews();
  }, []);

  if (news.length === 0) {
    return <p>Carregando notícias...</p>;
  }

  return (
    <div className="news-container">
      {news.map((item, index) => (
        <div key={index} className="news-item">
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <img src={item.image} alt={item.title} className="news-image" />
          </a>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
