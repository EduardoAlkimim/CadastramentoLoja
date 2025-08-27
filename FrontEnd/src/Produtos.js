import React, { useState } from 'react';
import axios from 'axios';

// O Modal de Edição pode ser um componente separado, mas para simplificar,
// vamos mantê-lo dentro deste arquivo por enquanto.
function ModalEdicao({ produto, onClose, onSave }) {
  const [produtoEditado, setProdutoEditado] = useState(produto);

  const handleSave = (e) => {
    e.preventDefault();
    onSave(produtoEditado);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Produto</h2>
        <form onSubmit={handleSave} className="modal-form">
          <input type="text" value={produtoEditado.nome} onChange={(e) => setProdutoEditado({ ...produtoEditado, nome: e.target.value })} />
          <input type="number" value={produtoEditado.preco} onChange={(e) => setProdutoEditado({ ...produtoEditado, preco: e.target.value })} />
          <input type="text" value={produtoEditado.tags} onChange={(e) => setProdutoEditado({ ...produtoEditado, tags: e.target.value })} />
          <div className="modal-actions">
            <button type="submit" className="botao-salvar">Salvar</button>
            <button type="button" onClick={onClose} className="botao-cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}


function Produtos({ produtos, onProdutoApagado, onProdutoAtualizado }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleApagar = async (id) => {
    if (window.confirm('Tem certeza?')) {
      try {
        await axios.delete(`${apiUrl}/produtos/${id}`);
        onProdutoApagado(id); // Avisa o App.js para remover da lista
      } catch (err) {
        alert('Erro ao apagar produto.');
      }
    }
  };

  const handleSalvarEdicao = async (produtoAtualizado) => {
    try {
      const dados = { nome: produtoAtualizado.nome, preco: produtoAtualizado.preco, tags: produtoAtualizado.tags };
      const response = await axios.put(`${apiUrl}/produtos/${produtoAtualizado.id}`, dados);
      onProdutoAtualizado(response.data); // Avisa o App.js para atualizar a lista
      setIsModalOpen(false);
    } catch (err) {
      alert('Erro ao salvar edição.');
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Produtos Cadastrados</h2>
      <div className="lista-container">
        {produtos.map((produto) => (
          <div key={produto.id} className="produto-card">
            <img src={produto.imagem_url} alt={produto.nome} className="produto-imagem" />
            <div className="produto-info">
              <h3>{produto.nome}</h3>
              <p>R$ {parseFloat(produto.preco).toFixed(2)}</p>
              <span>Tags: {produto.tags}</span>
            </div>
            <div className="botoes-acao">
              <button onClick={() => { setProdutoEmEdicao(produto); setIsModalOpen(true); }} className="botao-editar">Editar</button>
              <button onClick={() => handleApagar(produto.id)} className="botao-apagar">Apagar</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ModalEdicao 
          produto={produtoEmEdicao}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSalvarEdicao}
        />
      )}
    </div>
  );
}

export default Produtos;
