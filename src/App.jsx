import React, { useState, useEffect } from "react";
import "./App.css";

// === 1. IMPORTAÇÕES DO FIREBASE ===
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

// === 2. IMPORTAÇÕES DE COMPONENTES GLOBAIS ===
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import CardLivro from "./components/CardLivro/CardLivro";
import CardGenero from "./components/CardGenero/CardGenero";
import CardEscritor from "./components/CardEscritor/CardEscritor";

// === 3. IMPORTAÇÃO DAS TELAS (Ajustado para "Pages" maiúsculo como na sua pasta) ===
import Home from "./Pages/Home/Home";
import MinhaBiblioteca from "./Pages/MinhaBiblioteca/MinhaBiblioteca";

export default function App() {
  // === ESTADOS PARA ARMAZENAR OS DADOS DO BANCO ===
  const [livros, setLivros] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [escritores, setEscritores] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // === ESTADOS PARA A TELA DE PREFERÊNCIAS ===
  const [pesquisa, setPesquisa] = useState("");
  const [selecionadosLivros, setSelecionadosLivros] = useState([]);
  const [selecionadosGeneros, setSelecionadosGeneros] = useState([]);
  const [selecionadosEscritores, setSelecionadosEscritores] = useState([]);

  // === ROTEADOR PROVISÓRIO PARA NAVEGAÇÃO ===
  const [telaAtual, setTelaAtual] = useState(window.location.pathname);

  // Função que muda a tela do usuário
  const navegarPara = (caminho) => {
    window.history.pushState({}, "", caminho);
    setTelaAtual(caminho);
  };

  // === CARREGAMENTO DOS DADOS DO BANCO (LIVROS, GÊNEROS, AUTORES) ===
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

        // EXTRAÇÃO AUTOMÁTICA DE GÊNEROS
        const generosVistos = new Set();
        const listaGeneros = [];
        listaLivros.forEach(livro => {
          if (livro.genero && !generosVistos.has(livro.genero)) {
            generosVistos.add(livro.genero);
            listaGeneros.push({ id: livro.genero, nome: livro.genero });
          }
        });
        setGeneros(listaGeneros);

        // EXTRAÇÃO AUTOMÁTICA DE ESCRITORES
        const escritoresVistos = new Set();
        const listaEscritores = [];
        listaLivros.forEach(livro => {
          if (livro.nome_escritor && !escritoresVistos.has(livro.nome_escritor)) {
            escritoresVistos.add(livro.nome_escritor);
            listaEscritores.push({
              id: livro.nome_escritor,
              nome: livro.nome_escritor,
              foto: livro.foto_escritor
            });
          }
        });
        setEscritores(listaEscritores);

      } catch (error) {
        console.error("Erro ao conectar e buscar dados do Firebase:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDadosDoFirebase();
  }, []);

  const lidarComVoltar = () => {
    navegarPara("/home");
  };

  const alternarSelecao = (id, listaAtual, setLista) => {
    if (listaAtual.includes(id)) {
      setLista(listaAtual.filter((itemId) => itemId !== id));
    } else {
      setLista([...listaAtual, id]);
    }
  };

  const livrosFiltrados = livros.filter((livro) => {
    if (!pesquisa.trim()) return true;
    const termo = pesquisa.toLowerCase();
    return (livro.titulo || "").toLowerCase().includes(termo);
  });

  const escritoresFiltrados = escritores.filter((escritor) => {
    if (!pesquisa.trim()) return true;
    const termo = pesquisa.toLowerCase();
    return (escritor.nome || "").toLowerCase().includes(termo);
  });

  // Mostra isso enquanto o Firebase ainda não entregou os dados
  if (carregando) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#E06237", fontFamily: "sans-serif", backgroundColor: "#121212" }}>
        <h2>Conectando ao banco de dados do Bookou...</h2>
      </div>
    );
  }

  // =======================================================
  // === CONTROLE DE ROTAS (QUAL TELA MOSTRAR)           ===
  // =======================================================

  // 1. Se a URL for "/biblioteca", mostra a sua tela
  if (telaAtual === "/biblioteca") {
    return <MinhaBiblioteca aoNavegar={navegarPara} />;
  }

  // 2. Se a URL for "/home", mostra a tela de Home
  if (telaAtual === "/home") {
    return <Home aoNavegar={navegarPara} />;
  }

  // === FUNÇÕES DOS BOTÕES DA TELA DE PREFERÊNCIAS ===
  const lidarComPular = () => {
    navegarPara("/home"); 
  };

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

      const { addDoc, collection } = await import("firebase/firestore"); 
      await addDoc(collection(db, "Preferencias"), dadosPreferencia);

      alert("Preferências salvas com sucesso!");
      navegarPara("/home");

    } catch (error) {
      console.error("Erro ao salvar preferências no Firebase:", error);
      alert("Ops, erro ao salvar. Tente novamente!");
    }
  };

  // 3. Se não for nenhuma das de cima, mostra a tela de Preferências por padrão
  return (
    <div className="appContainer">
      <Header onBack={lidarComVoltar} />
      <main className="content">
        <h2 className="title">Vamos começar definindo suas preferências.</h2>
        <p className="subtitle">Escolha pelo menos 5 opções entre Livros, Gêneros, Autores...</p>
        <SearchBar value={pesquisa} onChange={setPesquisa} />
        
        <div className="sectionWrapper">
          <h3 className="dividerTitle">Sugestões</h3>
          {livrosFiltrados.length > 0 ? (
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
          ) : (
            pesquisa.trim() && <p className="semResultados">Nenhum livro encontrado.</p>
          )}
        </div>

        <div className="sectionWrapper">
          <h4 className="sectionTitle">Gêneros</h4>
          <div className="carouselHorizontal" style={{ flexWrap: "wrap", gap: "10px" }}>
            {generos.map((gen) => (
              <CardGenero 
                key={gen.id} 
                nome={gen.nome} 
                selecionado={selecionadosGeneros.includes(gen.id)}
                onSelect={() => alternarSelecao(gen.id, selecionadosGeneros, setSelecionadosGeneros)}
              />
            ))}
          </div>
        </div>

        <div className="sectionWrapper">
          {escritoresFiltrados.length > 0 ? (
            <>
              <h4 className="sectionTitle">Escritores</h4>
              <div className="carouselHorizontal">
                {escritoresFiltrados.map((esc) => (
                  <CardEscritor 
                    key={esc.id} 
                    imagem={esc.foto} 
                    nome={esc.nome} 
                    selecionado={selecionadosEscritores.includes(esc.id)}
                    onSelect={() => alternarSelecao(esc.id, selecionadosEscritores, setSelecionadosEscritores)}
                  />
                ))}
              </div>
            </>
          ) : (
            pesquisa.trim() && <p className="semResultados">Nenhum escritor encontrado.</p>
          )}
        </div>

        <div className="buttonContainer">
          <button className="btnPrimary" onClick={lidarComConcluir}>Concluir</button>
          <button className="btnSecondary" onClick={lidarComPular}>Pular Etapa</button>
        </div>
      </main>
    </div>
  );
}