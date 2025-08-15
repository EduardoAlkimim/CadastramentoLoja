import React, { useState } from 'react';
import axios from 'axios';

function CadastroProduto({ onProdutoCadastrado }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [tags, setTags] = useState('');
  const [imagem, setImagem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('preco', preco);
    formData.append('tags', tags);
    formData.append('imagem', imagem);

    try {
      const res = await axios.post('http://localhost:3001/produtos', formData);
      onProdutoCadastrado(res.data);
      setNome('');
      setPreco('');
      setTags('');
      setImagem(null);
    } catch (err) {
      console.error('Erro ao cadastrar produto:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: '20px auto', gap: '10px', background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
      <input type="number" placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} required />
      <input type="text" placeholder="Tags (ex: promoção, verão)" value={tags} onChange={e => setTags(e.target.value)} required />
      <input type="file" onChange={e => setImagem(e.target.files[0])} required />
      <button type="submit" style={{ padding: '10px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cadastrar Produto</button>
    </form>
  );
}

export default CadastroProduto;
