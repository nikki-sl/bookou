import React, { useState } from "react";
import "./Preferencias.css";

import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import CardLivro from "../../components/CardLivro/CardLivro";
import CardGenero from "../../components/CardGenero/CardGenero";
import CardEscritor from "../../components/CardEscritor/CardEscritor";

// Importação do serviço isolado
import { salvarPreferenciasUsuario } from "../../services/preferenciasService";

export default function Preferencias({ aoNavegar, livros, generos, escritores }) {
  const [pesquisa, setPesquisa] = useState("");
  const [selecionadosLivros, setSelecionadosLivros] = useState([]);
  const [selecionadosGeneros, setSelecionadosGeneros] = useState([]);
  const [selecionadosEscritores, setSelecionadosEscritores] = useState([]);

  const alternarSelecao = (id, listaAtual, setLista) => {
    if (listaAtual.includes(id)) {
      setLista(listaAtual.filter((itemId) => itemId !== id));
    } else {
      setLista([...listaAtual, id]);
    }
  };

  // Filtros aplicados para a barra de pesquisa
  const livrosFiltrados = livros.filter((livro) => {
    if (!pesquisa.trim()) return true;
    return (livro.titulo || "").toLowerCase().includes(pesquisa.toLowerCase());
  });

  const generosFiltrados = generos.filter((genero) => {
    if (!pesquisa.trim()) return true;
    return (genero.nome || "").toLowerCase().includes(pesquisa.toLowerCase());
  });

  const escritoresFiltrados = escritores.filter((escritor) => {
    if (!pesquisa.trim()) return true;
    return (escritor.nome || "").toLowerCase().includes(pesquisa.toLowerCase());
  });

  const lidarComConcluir = async () => {
    if (selecionadosLivros.length === 0 && selecionadosGeneros.length === 0 && selecionadosEscritores.length === 0) {
      alert("Por favor, selecione pelo menos uma opção ou clique em 'Pular Etapa'.");
      return;
    }

    try {
      const dadosPreferencia = {
        livrosEscolhidos: selecionadosLivros,      
        generosEscolhidos: selecionadosGeneros,     
        escritoresEscolhidos: selecionadosEscritores, 
        dataCriacao: new Date()                    
      };

      // Chamada do serviço
      await salvarPreferenciasUsuario(dadosPreferencia);
      
      alert("Preferências salvas com sucesso!");
      aoNavegar("/home");
    } catch (error) {
      alert("Erro ao salvar preferências. Por favor, tente novamente.");
    }
  };

  return (
    <div className="appContainer">
      <Header onBack={() => aoNavegar("/home")} />
      <main className="content">
        <h2 className="title">Vamos definir suas preferências.</h2>
        <p className="subtitle">Escolha pelo menos 5 opções entre Livros, Gêneros, Autores...</p>
        <SearchBar value={pesquisa} onChange={setPesquisa} />
        
        <div className="sectionWrapper">
          <h3 className="dividerTitle">Sugestões</h3>
          
          {/* SECCÃO DE LIVROS */}
          {livrosFiltrados.length > 0 && (
            <>
              <h4 className="sectionTitle">Livros</h4>
              <div className="carouselHorizontal">
                {livrosFiltrados.map((livro) => (
                  <CardLivro 
                    key={livro.id} 
                    imagem={livro.foto_capa} 
                    titulo={livro.titulo} 
                    selecionado={selecionadosLivros.includes(livro.id)}
                    onSelect={() => alternarSelecao(livro.id, selecionadosLivros, setSelecionadosLivros)}
                  />
                ))}
              </div>
            </>
          )}

          {/* SECÇÃO DE GÊNEROS */}
          {generosFiltrados.length > 0 && (
            <>
              <h4 className="sectionTitle">Gêneros</h4>
              <div className="carouselHorizontal">
                {generosFiltrados.map((genero) => (
                  <CardGenero 
                    key={genero.id} 
                    nome={genero.nome} 
                    selecionado={selecionadosGeneros.includes(genero.id)}
                    onSelect={() => alternarSelecao(genero.id, selecionadosGeneros, setSelecionadosGeneros)}
                  />
                ))}
              </div>
            </>
          )}

          {/* SECÇÃO DE AUTORES */}
          {escritoresFiltrados.length > 0 && (
            <>
              <h4 className="sectionTitle">Autores</h4>
              <div className="carouselHorizontal">
                {escritoresFiltrados.map((escritor) => (
                  <CardEscritor 
                    key={escritor.id} 
                    imagem={escritor.foto} 
                    nome={escritor.nome} 
                    selecionado={selecionadosEscritores.includes(escritor.id)}
                    onSelect={() => alternarSelecao(escritor.id, selecionadosEscritores, setSelecionadosEscritores)}
                  />
                ))}
              </div>
            </>
          )}

        </div>

        <div className="buttonContainer">
          <button className="btnPrimary" onClick={lidarComConcluir}>Concluir</button>
          <button className="btnSecondary" onClick={() => aoNavegar("/home")}>Pular Etapa</button>
        </div>
      </main>
    </div>
  );
}