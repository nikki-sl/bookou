import React, { useState, useEffect } from "react";
//import "./App.css";

import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

// Importações das Páginas (Certifique-se de que a pasta 'Pages' está dentro de 'src')
import Entrada from "./Pages/Entrada/Entrada";
import Login from "./Pages/Login/Login";
import Cadastro from "./Pages/Cadastro/Cadastro";
import Preferencias from "./Pages/Preferencias/Preferencias";
import Home from "./Pages/Home/Home";
import MinhaBiblioteca from "./Pages/MinhaBiblioteca/MinhaBiblioteca";
import DetalhesLivro from "./Pages/DetalhesLivro/DetalhesLivro";
import MeuPerfil from "./Pages/MeuPerfil/MeuPerfil"; // <-- Nova importação da tela de perfil

export default function App() {
  const [livros, setLivros] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [escritores, setEscritores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [telaAtual, setTelaAtual] = useState(window.location.pathname);
  const [idLivroAtivo, setIdLivroAtivo] = useState(null);

  const navegarPara = (caminho, idLivro = null) => {
    if (idLivro) setIdLivroAtivo(idLivro);
    window.history.pushState({}, "", caminho);
    setTelaAtual(caminho);
  };

  useEffect(() => {
    const lidarMudancaRota = () => setTelaAtual(window.location.pathname);
    window.addEventListener("popstate", lidarMudancaRota);
    return () => window.removeEventListener("popstate", lidarMudancaRota);
  }, []);

  useEffect(() => {
    const buscarDadosDoFirebase = async () => {
      try {
        const colecaoRef = collection(db, "Livro");
        const querySnapshot = await getDocs(colecaoRef);
        
        const listaLivros = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLivros(listaLivros);

        const generosVistos = new Set();
        const listaGeneros = [];
        listaLivros.forEach(livro => {
          if (livro.genero && !generosVistos.has(livro.genero)) {
            generosVistos.add(livro.genero);
            listaGeneros.push({ id: livro.genero, nome: livro.genero });
          }
        });
        setGeneros(listaGeneros);

        const writersVistos = new Set();
        const listaEscritores = [];
        listaLivros.forEach(livro => {
          if (livro.nome_escritor && !writersVistos.has(livro.nome_escritor)) {
            writersVistos.add(livro.nome_escritor);
            listaEscritores.push({
              id: livro.nome_escritor,
              nome: livro.nome_escritor,
              foto: livro.foto_escritor
            });
          }
        });
        setEscritores(listaEscritores);
      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDadosDoFirebase();
  }, []);

  if (carregando) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#E06237", fontFamily: "sans-serif", backgroundColor: "#FFFFFF" }}>
        <h2>Conectando ao banco de dados do Bookou...</h2>
      </div>
    );
  }

  switch (telaAtual) {
    case "/":
    case "/entrada":
      return <Entrada aoNavegar={navegarPara} />;
    case "/login":
      return <Login aoNavegar={navegarPara} />;
    case "/cadastro":
      return <Cadastro aoNavegar={navegarPara} />;
    case "/preferencias":
      return (
        <Preferencias 
          aoNavegar={navegarPara} 
          livros={livros} 
          generos={generos} 
          escritores={escritores} 
        />
      );
    case "/home":
      return <Home aoNavegar={navegarPara} />;
    case "/biblioteca":
      return <MinhaBiblioteca aoNavegar={navegarPara} />;
    case "/livro":
      return <DetalhesLivro idLivro={idLivroAtivo} aoNavegar={navegarPara} />;
    case "/perfil": // <-- Nova rota configurada para ler a tela de perfil
      return <MeuPerfil aoNavegar={navegarPara} />;
    default:
      return <Entrada aoNavegar={navegarPara} />;
  }
}