import React, { useState, useEffect } from "react";
import "./App.css";


import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";


import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import CardLivro from "./components/CardLivro/CardLivro";
import CardGenero from "./components/CardGenero/CardGenero";
import CardEscritor from "./components/CardEscritor/CardEscritor";

export default function App() {
  
  const [livros, setLivros] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [escritores, setEscritores] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [pesquisa, setPesquisa] = useState("");
  const [selecionadosLivros, setSelecionadosLivros] = useState([]);
  const [selecionadosGeneros, setSelecionadosGeneros] = useState([]);
  const [selecionadosEscritores, setSelecionadosEscritores] = useState([]);

  // === 2. FUNÇÃO QUE JUNTA O BANCO COM O CÓDIGO ===
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

        // EXTRAÇÃO AUTOMÁTICA DE GÊNEROS (Cria as tags de texto sem repetir nome)
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
    window.history.back();
  };

  const alternarSelecao = (id, listaAtual, setLista) => {
    if (listaAtual.includes(id)) {
      setLista(listaAtual.filter((itemId) => itemId !== id));
    } else {
      setLista([...listaAtual, id]);
    }
  };

  // === FILTROS DA BARRA DE PESQUISA ===
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

  if (carregando) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#E06237", fontFamily: "sans-serif" }}>
        <h2>Conectando ao banco de dados do Bookou...</h2>
      </div>
    );
  }

// Função do botão Pular (vai direto para a Home)
const lidarComPular = () => {
  window.location.href = "/home"; 
};

// Função do botão Concluir (Salva no Firebase e depois vai para a Home)
const lidarComConcluir = async () => {
  if (selecionadosLivros.length === 0 && selecionadosGeneros.length === 0 && selecionadosEscritores.length === 0) {
    alert("Por favor, selecione pelo menos uma opção ou clique em 'Pular Etapa'.");
    return;
  }

  try {
    // Cria um objeto organizado com tudo o que o usuário escolheu na tela
    const dadosPreferencia = {
      livrosEscolhidos: selecionadosLivros,       
      generosEscolhidos: selecionadosGeneros,     
      escritoresEscolhidos: selecionadosEscritores, 
      dataCriacao: new Date()                     
    };

    // Salva na coleção "Preferencias" lá no Firebase
    
    const { addDoc, collection } = await import("firebase/firestore"); 
    
    await addDoc(collection(db, "Preferencias"), dadosPreferencia);

    alert("Preferências salvas com sucesso!");
    
    // Depois que salvou no banco, manda o usuário para a Home
    window.location.href = "/home";

  } catch (error) {
    console.error("Erro ao salvar preferências no Firebase:", error);
    alert("Ops, erro ao salvar. Tente novamente!");
  }
};

  return (
    <div className="appContainer">
      <Header onBack={lidarComVoltar} />
      
      <main className="content">
        <h2 className="title">Vamos começar definindo suas preferências.</h2>
        <p className="subtitle">Escolha pelo menos 5 opções entre Livros, Gêneros, Autores...</p>

        <SearchBar value={pesquisa} onChange={setPesquisa} />

        <div className="sectionWrapper">
          <h3 className="dividerTitle">Sugestões</h3>
          
          {/* CARROSSEL DE LIVROS VINDO DO FIREBASE */}
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

        {/* SEÇÃO DE GÊNEROS (AGORA EM FORMATO DE TAGS DE TEXTO) */}
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

        {/* CARROSSEL DE ESCRITORES EXTRAÍDO DO BANCO */}
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
          <button className="btnPrimary" onClick={lidarComConcluir}>
            Concluir
          </button>
          <button className="btnSecondary" onClick={lidarComPular}>
            Pular Etapa
          </button>
        </div>
      </main>
    </div>
  );
}