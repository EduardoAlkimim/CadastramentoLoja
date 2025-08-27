import React, { useState } from 'react';
import axios from 'axios';

function CadastroProduto({ onProdutoCadastrado }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [tags, setTags] = useState('');
  const [imagem, setImagem] = useState(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('preco', preco);
    formData.append('tags', tags);
    formData.append('imagem', imagem);

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${apiUrl}/produtos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      onProdutoCadastrado(res.data); // Avisa o App.js sobre o novo produto
      setSucesso('Produto cadastrado com sucesso!');
      
      // Limpa o formulário
      setNome('');
      setPreco('');
      setTags('');
      setImagem(null);
      e.target.reset();
    } catch (err) {
      console.error('Erro ao cadastrar produto:', err);
      setErro('Falha ao cadastrar o produto.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-cadastro">
      <h2 style={{ textAlign: 'center' }}>Cadastrar Novo Produto</h2>
      <input type="text" placeholder="Nome do Produto" value={nome} onChange={e => setNome(e.target.value)} required />
      <input type="number" placeholder="Preço (ex: 29.99)" value={preco} onChange={e => setPreco(e.target.value)} required />
      <input type="text" placeholder="Tags (separadas por vírgula)" value={tags} onChange={e => setTags(e.target.value)} required />
      <input type="file" name="imagem" onChange={e => setImagem(e.target.files[0])} required />
      <button type="submit" className="botao-cadastrar">Cadastrar</button>
      {erro && <p className="mensagem-erro">{erro}</p>}
      {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}
    </form>
  );
}

export default CadastroProduto;