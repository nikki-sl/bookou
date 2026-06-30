import React, { useState, useEffect } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import MenuOpcoes from "../../components/MenuOpcoes/MenuOpcoes";
import SecaoLivros from "../../components/SecaoLivros/SecaoLivros";
import ResultadoPesquisa from "../../components/ResultadoPesquisa/ResultadoPesquisa";
import { buscarDadosHome, obterLivrosPopulares, limparCacheHome } from "../../services/livrosService";

export default function Home({ aoNavegar }) {
  const [livros, setLivros] = useState([]);
  const [livrosLendo, setLivrosLendo] = useState([]);
  const [livrosQueroLer, setLivrosQueroLer] = useState([]);
  const [livrosLidos, setLivrosLidos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        limparCacheHome();
        const dados = await buscarDadosHome();
        setLivros(dados.todosLivros || []);
        setLivrosLendo(dados.lendo || []);
        setLivrosQueroLer(dados.queroLer || []);
        setLivrosLidos(dados.lidos || []);
      } catch (error) {
        console.error("Erro ao carregar dados na Home:", error);
      }
    };
    carregarDados();
  }, []);

  const livrosFiltrados = livros.filter((livro) =>
    (livro.titulo || "").toLowerCase().includes(pesquisa.toLowerCase())
  );

  const livrosPopulares = obterLivrosPopulares(livros);

  return (
    <div className="homeContainer">
      <Header onBack={() => aoNavegar("/")} />

      <main className="homeContent">
        {/* HERO */}
        <section className="heroSection">
          <MenuOpcoes aoNavegar={aoNavegar} />

          <div className="heroText">
            <h1>Bem-vindo ao Bookou</h1>
            <p>Descubra novos livros, acompanhe sua jornada literária e encontre histórias que combinam com você.</p>
          </div>

          <div className="heroStats">
            <div className="statCard">
              <span>{livrosLendo.length}</span>
              <p>Lendo</p>
            </div>
            <div className="statCard">
              <span>{livrosQueroLer.length}</span>
              <p>Quero Ler</p>
            </div>
            <div className="statCard">
              <span>{livrosLidos.length}</span>
              <p>Lidos</p>
            </div>
          </div>
        </section>

        <SearchBar value={pesquisa} onChange={setPesquisa} />

        {pesquisa.trim() !== "" ? (
          <ResultadoPesquisa livros={livrosFiltrados} aoNavegar={aoNavegar} />
        ) : (
          <>
            <div className="atalhoBiblioteca" onClick={() => aoNavegar("/biblioteca")}>
              <div>
                <h3>Minha Biblioteca</h3>
                <p>Veja seus livros salvos, acompanhe seu progresso e organize suas leituras.</p>
              </div>
              <button>Ver Biblioteca</button>
            </div>

            {livrosLendo.length > 0 && (
              <SecaoLivros titulo="Continue Lendo" icone="📖" livros={livrosLendo} aoNavegar={aoNavegar} />
            )}
            <SecaoLivros titulo="Populares no Bookou" livros={livrosPopulares} aoNavegar={aoNavegar} />
            <SecaoLivros titulo="Sugestões para Você" livros={livros} aoNavegar={aoNavegar} />
          </>
        )}
      </main>
    </div>
  );
}