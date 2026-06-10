import React, { useState, useEffect } from "react";
import "./Home.css";

import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import CardLivro from "../../components/CardLivro/CardLivro";

export default function Home({ aoNavegar }) {
  const [livros, setLivros] = useState([]);
  const [livrosLendo, setLivrosLendo] = useState([]); 
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    const buscarDados = async () => {
      try {
        // 1. Busca todos os livros do catálogo
        const queryLivros = await getDocs(collection(db, "Livro"));
        const listaLivros = queryLivros.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLivros(listaLivros);

        // 2. Busca os livros salvos na biblioteca do usuário
        const queryBiblioteca = await getDocs(collection(db, "MinhaBiblioteca"));
        const listaBiblioteca = queryBiblioteca.docs.map((doc) => doc.data());
        
        // Filtra para pegar apenas os que possuem status "Lendo"
        const apenasLendo = listaBiblioteca.filter(item => item.status === "Lendo");
        setLivrosLendo(apenasLendo);

      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
      }
    };

    buscarDados();
  }, []);

  const livrosFiltrados = livros.filter((livro) =>
    (livro.titulo || "").toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="homeContainer">
      <Header onBack={() => aoNavegar("/")} />

      <main className="homeContent">
        {/* HERO */}
        <section className="heroSection">
          <div className="heroText">
            <h1>Bem-vindo ao Bookou 📚</h1>
            <p>Descubra novos livros, acompanhe sua jornada literária e encontre histórias que combinam com você.</p>
          </div>

          <div className="heroStats">
            <div className="statCard">
              <span>{livros.length}</span>
              <p>Livros</p>
            </div>

            <div className="statCard">
              <span>{livrosLendo.length}</span>
              <p>Lendo</p>
            </div>

            <div className="statCard">
              <span>0</span>
              <p>Destaques</p>
            </div>
          </div>
        </section>

        {/* PESQUISA */}
        <SearchBar value={pesquisa} onChange={setPesquisa} />

        {/* MODO DE BUSCA ATIVA */}
        {pesquisa.trim() !== "" ? (
          <section className="homeSection">
            <div className="sectionHeader">
              <h2>Resultados da Pesquisa ({livrosFiltrados.length})</h2>
            </div>
            <div className="resultadoPesquisaGrid">
              {livrosFiltrados.length > 0 ? (
                livrosFiltrados.map((livro) => (
                  <div key={livro.id} onClick={() => aoNavegar("/livro", livro.id)} style={{ cursor: "pointer" }}>
                    <CardLivro imagem={livro.foto_capa} titulo={livro.titulo} />
                  </div>
                ))
              ) : (
                <p className="semResultados">Nenhum livro corresponde à sua busca.</p>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* BIBLIOTECA */}
            <div className="atalhoBiblioteca" onClick={() => aoNavegar("/biblioteca")}>
              <div>
                <h3>Minha Biblioteca</h3>
                <p>Veja seus livros salvos, acompanhe seu progresso e organize suas leituras.</p>
              </div>
              <button>Ver Biblioteca</button>
            </div>

            {/* SEÇÃO DINÂMICA: SE ESTIVER LENDO, MOSTRA O PROGRESSO. SE NÃO, MOSTRA AS NOVIDADES DO APP */}
            {livrosLendo.length > 0 ? (
              <section className="homeSection">
                <div className="sectionHeader">
                  <h2>Continue Lendo</h2>
                  <span>📖</span>
                </div>
                <div className="carouselHome">
                  {livrosLendo.map((livro) => (
                    <div key={livro.livroId} onClick={() => aoNavegar("/livro", livro.livroId)} style={{ cursor: "pointer" }}>
                      <CardLivro imagem={livro.foto_capa} titulo={livro.titulo} />
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="homeSection">
                <div className="sectionHeader">
                  <h2>Populares no Bookou</h2>
                </div>
                <div className="carouselHome">
                  {/* Pega os últimos 5 livros adicionados invertendo a lista */}
                  {[...livros].reverse().slice(0, 5).map((livro) => (
                    <div key={livro.id} onClick={() => aoNavegar("/livro", livro.id)} style={{ cursor: "pointer" }}>
                      <CardLivro imagem={livro.foto_capa} titulo={livro.titulo} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SUGESTÕES */}
            <section className="homeSection">
              <div className="sectionHeader">
                <h2>Sugestões para Você</h2>
              </div>
              <div className="carouselHome">
                {livros.map((livro) => (
                  <div key={livro.id} onClick={() => aoNavegar("/livro", livro.id)} style={{ cursor: "pointer" }}>
                    <CardLivro imagem={livro.foto_capa} titulo={livro.titulo} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}