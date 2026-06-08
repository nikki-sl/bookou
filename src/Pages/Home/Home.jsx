import React, { useState, useEffect } from "react";
import "./Home.css";

import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import CardLivro from "../../components/CardLivro/CardLivro";

export default function Home({ aoNavegar }) {
  const [livros, setLivros] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarLivros = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Livro"));

        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLivros(lista);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarLivros();
  }, []);

  const livrosFiltrados = livros.filter((livro) =>
    (livro.titulo || "")
      .toLowerCase()
      .includes(pesquisa.toLowerCase())
  );

  if (carregando) {
    return (
      <div className="loading">
        <h2>📚 Carregando sua próxima leitura...</h2>
      </div>
    );
  }

  return (
    <div className="homeContainer">
      <Header onBack={() => aoNavegar("/")} />

      <main className="homeContent">

        {/* HERO */}
        <section className="heroSection">
          <div className="heroText">
            <h1>Bem-vindo ao Bookou 📚</h1>

            <p>
              Descubra novos livros, acompanhe sua jornada literária
              e encontre histórias que combinam com você.
            </p>
          </div>

          <div className="heroStats">
            <div className="statCard">
              <span>{livros.length}</span>
              <p>Livros</p>
            </div>

            <div className="statCard">
              <span>{Math.min(livros.length, 3)}</span>
              <p>Lendo</p>
            </div>

            <div className="statCard">
              <span>⭐</span>
              <p>Destaques</p>
            </div>
          </div>
        </section>

        {/* PESQUISA */}
        <SearchBar
          value={pesquisa}
          onChange={setPesquisa}
        />

        {/* BIBLIOTECA */}
        <div
          className="atalhoBiblioteca"
          onClick={() => aoNavegar("/biblioteca")}
        >
          <div>
            <h3>Minha Biblioteca</h3>

            <p>
              Veja seus livros salvos, acompanhe seu progresso e
              organize suas leituras.
            </p>
          </div>

          <button>Ver Biblioteca</button>
        </div>

        {/* CONTINUE LENDO */}
        <section className="homeSection">
          <div className="sectionHeader">
            <h2>Continue Lendo</h2>
            <span>📖</span>
          </div>

          <div className="carouselHome">
            {livros.slice(0, 5).map((livro) => (
              <CardLivro
                key={livro.id}
                imagem={livro.foto_capa}
                titulo={livro.titulo}
              />
            ))}
          </div>
        </section>

        {/* SUGESTÕES */}
        <section className="homeSection">
          <div className="sectionHeader">
            <h2>Sugestões para Você</h2>
            <span>✨</span>
          </div>

          <div className="carouselHome">
            {livrosFiltrados.length > 0 ? (
              livrosFiltrados.map((livro) => (
                <CardLivro
                  key={livro.id}
                  imagem={livro.foto_capa}
                  titulo={livro.titulo}
                />
              ))
            ) : (
              <p className="semResultados">
                Nenhum livro encontrado.
              </p>
            )}
          </div>
        </section>

        {/* POPULARES */}
        <section className="homeSection">
          <div className="sectionHeader">
            <h2>Mais Populares</h2>
            <span>🔥</span>
          </div>

          <div className="carouselHome">
            {[...livros]
              .reverse()
              .slice(0, 8)
              .map((livro) => (
                <CardLivro
                  key={livro.id}
                  imagem={livro.foto_capa}
                  titulo={livro.titulo}
                />
              ))}
          </div>
        </section>

        {/* TODOS OS LIVROS */}
        <section className="homeSection">
          <div className="sectionHeader">
            <h2>Explore o Catálogo</h2>
            <span>📚</span>
          </div>

          <div className="carouselHome">
            {livros.map((livro) => (
              <CardLivro
                key={livro.id}
                imagem={livro.foto_capa}
                titulo={livro.titulo}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}