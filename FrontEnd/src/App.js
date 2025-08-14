import React, { useState } from 'react';
import CadastroProduto from './CadastroProdutos';
import Produtos from './Produtos';

function App() {
  const [novoProduto, setNovoProduto] = useState(null);

  return (
    <div>
      <h1>Minha Loja</h1>
      <CadastroProduto onProdutoCadastrado={setNovoProduto} />
      <Produtos novoProduto={novoProduto} />
    </div>
  );
}

export default App;
