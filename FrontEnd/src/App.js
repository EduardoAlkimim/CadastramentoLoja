import React, { useState } from 'react';
import CadastroProduto from './CadastroProdutos';
import Produtos from './Produtos';

function App() {
  const [novoProduto, setNovoProduto] = useState(null);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', background: '#f7f7f7', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Cadastramento de Itens</h1>
      <CadastroProduto onProdutoCadastrado={setNovoProduto} />
      <Produtos novoProduto={novoProduto} />
    </div>
  );
}

export default App;
