import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Produtos({ novoProduto }) {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/produtos')
      .then(res => setProdutos(res.data));
  }, []);

  useEffect(() => {
    if (novoProduto) {
      setProdutos(prev => [...prev, novoProduto]);
    }
  }, [novoProduto]);

  return (
    <div className="produtos">
      {produtos.map(prod => (
        <div key={prod.id} className="card">
          <img src={prod.imagem_url} alt={prod.nome} width="150" />
          <h3>{prod.nome}</h3>
          <p>R$ {prod.preco}</p>
          <p>Tags: {prod.tags}</p>
        </div>
      ))}
    </div>
  );
}

export default Produtos;
