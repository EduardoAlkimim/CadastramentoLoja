import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import CadastroProduto from './CadastroProdutos';
import Produtos from './Produtos'; // Renomeado para ListaProdutos para clareza
import './App.css'; // Estilos específicos do App

function App() {
  const [produtos, setProdutos] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Função para buscar os produtos, passada para o componente Produtos
  const fetchProdutos = useCallback(async () => {
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/produtos`);
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setError("Não foi possível carregar os produtos.");
    }
  }, [apiUrl]);

  // Busca os produtos assim que a aplicação carrega
  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  // Adiciona um novo produto à lista sem recarregar a página
  const handleProdutoCadastrado = (novoProduto) => {
    setProdutos(estadoAnterior => [...estadoAnterior, novoProduto]);
  };

  // Remove um produto da lista
  const handleProdutoApagado = (idProdutoApagado) => {
    setProdutos(estadoAnterior => estadoAnterior.filter(p => p.id !== idProdutoApagado));
  };

  // Atualiza um produto na lista
  const handleProdutoAtualizado = (produtoAtualizado) => {
    setProdutos(estadoAnterior => 
      estadoAnterior.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p)
    );
  };

  return (
    <div className="container">
      <h1 className="header">Gerenciamento de Loja</h1>
      <CadastroProduto onProdutoCadastrado={handleProdutoCadastrado} />
      <hr style={{margin: '40px 0', border: '1px solid #eee'}} />
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <Produtos 
        produtos={produtos} 
        onProdutoApagado={handleProdutoApagado}
        onProdutoAtualizado={handleProdutoAtualizado}
      />
    </div>
  );
}

export default App;