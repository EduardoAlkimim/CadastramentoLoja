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

    const res = await axios.post('http://localhost:3001/produtos', formData);
    onProdutoCadastrado(res.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input type="number" placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} />
      <input type="text" placeholder="Tags (ex: promoção,verão)" value={tags} onChange={e => setTags(e.target.value)} />
      <input type="file" onChange={e => setImagem(e.target.files[0])} />
      <button type="submit">Cadastrar Produto</button>
    </form>
  );
}

export default CadastroProduto;
