import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

// Cache simples em memória para evitar ler o Firebase repetidamente na mesma sessão
let cacheDadosHome = null;

// Busca todos os livros cadastrados no sistema (usado na barra de pesquisa)
export const obterTodosLivrosSistema = async () => {
  try {
    const livrosRef = collection(db, "Livro");
    const livrosSnapshot = await getDocs(livrosRef);
    return livrosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao obter todos os livros do sistema:", error);
    return []; // Retorna array vazia para evitar quebras
  }
};

// Busca os detalhes estáticos de um livro específico na coleção geral
export const obterDadosDoLivro = async (idLivro) => {
  try {
    const livroRef = doc(db, "Livro", idLivro);
    const livroSnap = await getDoc(livroRef);
    if (livroSnap.exists()) {
      return livroSnap.data();
    }
    return null;
  } catch (error) {
    console.error(`Erro ao obter dados do livro ${idLivro}:`, error);
    return null;
  }
};




// danillo --
export const buscarDadosHome = async () => {
  if (cacheDadosHome) {
    return cacheDadosHome;
  }

  try {
    const listaLivros = await obterTodosLivrosSistema();
    const bibliotecaRef = collection(db, "MinhaBiblioteca");
    const bibliotecaSnapshot = await getDocs(bibliotecaRef);
    const listaBiblioteca = bibliotecaSnapshot.docs.map((doc) => doc.data());
    const unificarDadosPorStatus = (statusDesejado) => {
      return listaBiblioteca
        .filter(item => (item.status || "").toLowerCase() === statusDesejado)
        .map(item => listaLivros.find(livro => livro.id === item.livroId))
        .filter(Boolean); // Abreviação performática para remover undefined/null
    };

    cacheDadosHome = {
      todosLivros: listaLivros ?? [],
      lendo: unificarDadosPorStatus("lendo"),
      queroLer: unificarDadosPorStatus("quero-ler"),
      lidos: unificarDadosPorStatus("lido")
    };

    return cacheDadosHome;

  } catch (error) {
    console.error("Erro ao buscar dados estruturados para a Home:", error);
    return {
      todosLivros: [],
      lendo: [],
      queroLer: [],
      lidos: []
    };
  }
};

export const obterLivrosPopulares = (todosLivros) => {
  if (!Array.isArray(todosLivros) || todosLivros.length === 0) return [];
  return todosLivros.slice(-5).reverse();
};
export const limparCacheHome = () => {
  cacheDadosHome = null;
};
export const atualizarStatusLivro = async (idLivro, novoStatus) => {
  try {
    limparCacheHome();
    return true;
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    throw error;
  }
};