import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({ nome: '', preco: '', tags: '' });

  // Buscar todos os produtos do banco
  const fetchProdutos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/produtos');
      setProdutos(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  useEffect(() => { fetchProdutos(); }, []);

  // Excluir produto
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/produtos/${id}`);
      fetchProdutos(); // atualizar lista
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
    }
  };

  // Iniciar edição
  const startEdit = (produto) => {
    setEditando(produto.id);
    setFormEdit({ nome: produto.nome, preco: produto.preco, tags: produto.tags });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormEdit(prev => ({ ...prev, [name]: value }));
  };

  // Salvar edição
  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:3001/produtos/${id}`, formEdit);
      setEditando(null);
      fetchProdutos(); // atualizar lista
    } catch (err) {
      console.error('Erro ao editar produto:', err);
    }
  };

  if (!produtos.length) return <p style={{ textAlign: 'center' }}>Nenhum produto cadastrado.</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
      {produtos.map(prod => (
        <div key={prod.id} style={{ width: '250px', border: '1px solid #ddd', borderRadius: '10px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
          <img
            src={prod.imagem_url || '/placeholder.png'}
            alt={prod.nome}
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }}
          />

          {editando === prod.id ? (
            <div style={{ width: '100%' }}>
              <input type="text" name="nome" value={formEdit.nome} onChange={handleEditChange} style={{ width: '100%', marginBottom: '5px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input type="number" name="preco" value={formEdit.preco} onChange={handleEditChange} style={{ width: '100%', marginBottom: '5px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input type="text" name="tags" value={formEdit.tags} onChange={handleEditChange} style={{ width: '100%', marginBottom: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <button onClick={() => saveEdit(prod.id)} style={{ marginRight: '5px', padding: '7px 12px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Salvar</button>
              <button onClick={() => setEditando(null)} style={{ padding: '7px 12px', background: '#aaa', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          ) : (
            <div>
              <h3>{prod.nome}</h3>
              <p><strong>R$ {Number(prod.preco).toFixed(2)}</strong></p>
              <small>{prod.tags}</small>
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => startEdit(prod)} style={{ marginRight: '5px', padding: '5px 10px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => handleDelete(prod.id)} style={{ padding: '5px 10px', background: 'red', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Excluir</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Produtos;
