import React, { useState, useEffect } from "react";
import "./MinhaBiblioteca.css";
import { db } from "../../firebase"; // Ajuste o caminho dependendo de onde salvar
import { collection, getDocs, query, where } from "firebase/firestore";
import Header from "../../components/Header/Header";
import CardLivro from "../../components/CardLivro/CardLivro";

export default function MinhaBiblioteca() {
  const [meusLivros, setMeusLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("todos"); // Filtros: todos, lendo, lidos

  useEffect(() => {
    const buscarBiblioteca = async () => {
      try {
        // 1. Busca os livros que estão salvos na biblioteca do usuário
        // Nota: Se vocês tiverem autenticação, aqui usaria o ID do usuário logado.
        const bibliotecaRef = collection(db, "Biblioteca");
        const querySnapshot = await getDocs(bibliotecaRef);
        
        const itensBiblioteca = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // 2. Busca todos os livros cadastrados para cruzar os dados (pegar capa, título, etc.)
        const livrosRef = collection(db, "Livro");
        const livrosSnapshot = await getDocs(livrosRef);
        const listaTodosLivros = livrosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // 3. Junta as informações: Cruza o ID do livro salvo na biblioteca com os detalhes dele
        const livrosDetalhados = itensBiblioteca.map(item => {
          const dadosDoLivro = listaTodosLivros.find(l => l.id === item.livroId);
          return {
            ...item,
            ...dadosDoLivro // Junta foto_capa, titulo, etc.
          };
        }).filter(l => l.titulo); // Garante que só exibe se o livro existir no banco

        setMeusLivros(livrosDetalhados);
      } catch (error) {
        console.error("Erro ao buscar dados da biblioteca:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarBiblioteca();
  }, []);

  const lidarComVoltar = () => {
    window.location.href = "/home"; // Volta para a home
  };

  // Filtra os livros de acordo com a aba selecionada (Lendo, Lido, Quero Ler)
  const livrosFiltrados = meusLivros.filter(livro => {
    if (abaAtiva === "todos") return true;
    return livro.status === abaAtiva; 
  });

  if (carregando) {
    return (
      <div className="loadingContainer">
        <h2>Carregando sua biblioteca...</h2>
      </div>
    );
  }

  return (
    <div className="bibliotecaContainer">
      <Header onBack={lidarComVoltar} />
      
      <main className="content">
        <h2 className="title">Minha Biblioteca</h2>
        <p className="subtitle">Gerencie suas leituras e acompanhe seu progresso.</p>

        {/* Abas de Navegação interna da biblioteca */}
        <div className="abasContainer">
          <button 
            className={`abaBotao ${abaAtiva === "todos" ? "ativa" : ""}`} 
            onClick={() => setAbaAtiva("todos")}
          >
            Todos
          </button>
          <button 
            className={`abaBotao ${abaAtiva === "lendo" ? "ativa" : ""}`} 
            onClick={() => setAbaAtiva("lendo")}
          >
            Lendo
          </button>
          <button 
            className={`abaBotao ${abaAtiva === "quero-ler" ? "ativa" : ""}`} 
            onClick={() => setAbaAtiva("quero-ler")}
          >
            Quero Ler
          </button>
          <button 
            className={`abaBotao ${abaAtiva === "lido" ? "ativa" : ""}`} 
            onClick={() => setAbaAtiva("lido")}
          >
            Lidos
          </button>
        </div>

        {/* Grid de Exibição dos Livros */}
        <div className="livrosGrid">
          {livrosFiltrados.length > 0 ? (
            livrosFiltrados.map((livro) => (
              <div key={livro.id} className="livroItem">
                <CardLivro 
                  imagem={livro.foto_capa} 
                  titulo={livro.titulo} 
                  selecionado={false}
                  onSelect={() => {}} // Aqui depois você pode colocar para abrir detalhes do livro
                />
                {/* Tag discreta mostrando o status do livro */}
                <span className={`statusTag ${livro.status}`}>
                  {livro.status === "lendo" ? "📖 Lendo" : livro.status === "lido" ? "✅ Lido" : "📌 Quero ler"}
                </span>
              </div>
            ))
          ) : (
            <p className="semResultados">Nenhum livro encontrado nesta categoria.</p>
          )}
        </div>
      </main>
    </div>
  );
}