import React, { useState, useEffect } from "react";
import "./MinhaBiblioteca.css";
import { db } from "../../firebase"; 
// 🔥 Adicionadas as funções deleteDoc e doc para conseguirmos apagar os itens
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Header from "../../components/Header/Header";
import CardLivro from "../../components/CardLivro/CardLivro";

export default function MinhaBiblioteca({ aoNavegar }) {
  const [meusLivros, setMeusLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("todos"); // Filtros: todos, lendo, quero-ler, abandonou, lido

  useEffect(() => {
    const buscarBiblioteca = async () => {
      try {
        const bibliotecaRef = collection(db, "MinhaBiblioteca");
        const querySnapshot = await getDocs(bibliotecaRef);
        
        const itensBiblioteca = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const livrosRef = collection(db, "Livro");
        const livrosSnapshot = await getDocs(livrosRef);
        const listaTodosLivros = livrosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const livrosDetalhados = itensBiblioteca.map(item => {
          const dadosDoLivro = listaTodosLivros.find(l => l.id === item.livroId);
          return {
            ...item,
            ...dadosDoLivro 
          };
        }).filter(l => l.titulo);

        setMeusLivros(livrosDetalhados);
      } catch (error) {
        console.error("Erro ao buscar dados da biblioteca:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarBiblioteca();
  }, []);

  // 🔥 Função que zera a biblioteca
  const zerarBiblioteca = async () => {
    const confirmar = window.confirm(
      "Atenção: Tem certeza que deseja apagar TODOS os livros da sua biblioteca? Esta ação não pode ser desfeita!"
    );
    
    if (!confirmar) return;

    try {
      const querySnapshot = await getDocs(collection(db, "MinhaBiblioteca"));
      const promessasDeDelecao = querySnapshot.docs.map((documento) =>
        deleteDoc(doc(db, "MinhaBiblioteca", documento.id))
      );
      
      await Promise.all(promessasDeDelecao);
      
      alert("Biblioteca zerada com sucesso!");
      window.location.reload(); // Recarrega a página para sumir com os livros na hora
    } catch (error) {
      console.error("Erro ao zerar biblioteca:", error);
      alert("Erro ao tentar limpar a biblioteca.");
    }
  };

  const livrosFiltrados = meusLivros.filter(livro => {
    if (abaAtiva === "todos") return true;
    const statusLivro = (livro.status || "").toLowerCase();
    return statusLivro === abaAtiva; 
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
      <Header onBack={() => aoNavegar("/home")} />
      
      <main className="content">
        <h2 className="title">Minha Biblioteca</h2>
        <p className="subtitle">Gerencie suas leituras e acompanhe seu progresso.</p>

        {/* 🔥 Botão condicional: Só aparece se a pessoa tiver livros salvos */}
        {meusLivros.length > 0 && (
          <button className="btnZerarBiblioteca" onClick={zerarBiblioteca}>
          Zerar Biblioteca
          </button>
        )}

        {/* Abas de Navegação interna da biblioteca */}
        <div className="abasContainer">
          <button 
            className={`abaBotao ${abaAtiva === "todos" ? "ativa" : ""}`} 
            onClick={() => setAbaAtiva("todos")}
          >
            Todos ({meusLivros.length})
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
            className={`abaBotao ${abaAtiva === "abandonou" ? "ativa" : ""}`} 
            onClick={() => setAbaAtiva("abandonou")}
          >
            Abandonei
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
                <div 
                  onClick={() => aoNavegar("/livro", livro.livroId)} 
                  style={{ cursor: "pointer" }}
                >
                  <CardLivro 
                    imagem={livro.foto_capa} 
                    titulo={livro.titulo} 
                    selecionado={false}
                    onSelect={() => {}}
                  />
                </div>
                
                {/* Tag dinâmica mostrando o status do livro */}
                <span className={`statusTag ${(livro.status || "").toLowerCase()}`}>
                  {(livro.status || "").toLowerCase() === "lendo" && "Lendo"}
                  {(livro.status || "").toLowerCase() === "quero-ler" && "Quero ler"}
                  {(livro.status || "").toLowerCase() === "abandonou" && "Abandonei"}
                  {(livro.status || "").toLowerCase() === "lido" && "Lido"}
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