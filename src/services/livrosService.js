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

// --- NOVA FUNÇÃO PARA A TELA HOME (OTIMIZADA) ---
// Busca as interações da biblioteca e cruza com todos os livros do sistema
export const buscarDadosHome = async () => {
  // Se já tivermos os dados no cache da sessão, retorna direto sem gastar leituras no Firebase
  if (cacheDadosHome) {
    return cacheDadosHome;
  }

  try {
    const listaLivros = await obterTodosLivrosSistema();

    // Busca as interações da coleção "MinhaBiblioteca"
    const bibliotecaRef = collection(db, "MinhaBiblioteca");
    const bibliotecaSnapshot = await getDocs(bibliotecaRef);
    const listaBiblioteca = bibliotecaSnapshot.docs.map((doc) => doc.data());

    // Função interna otimizada para cruzar dados
    const unificarDadosPorStatus = (statusDesejado) => {
      return listaBiblioteca
        .filter(item => (item.status || "").toLowerCase() === statusDesejado)
        .map(item => listaLivros.find(livro => livro.id === item.livroId))
        .filter(Boolean); // Abreviação performática para remover undefined/null
    };

    // Salva o resultado estruturado no cache
    cacheDadosHome = {
      todosLivros: listaLivros ?? [],
      lendo: unificarDadosPorStatus("lendo"),
      queroLer: unificarDadosPorStatus("quero-ler"),
      lidos: unificarDadosPorStatus("lido")
    };

    return cacheDadosHome;

  } catch (error) {
    console.error("Erro ao buscar dados estruturados para a Home:", error);
    
    // Fallback seguro: se o Firebase falhar, a tela não fica branca, apenas exibe vazio
    return {
      todosLivros: [],
      lendo: [],
      queroLer: [],
      lidos: []
    };
  }
};

/**
 * Retorna os 5 livros mais recentes de forma performática.
 * @param {Array} todosLivros - Lista completa de livros.
 * @returns {Array} Lista otimizada com no máximo 5 livros.
 */
export const obterLivrosPopulares = (todosLivros) => {
  if (!Array.isArray(todosLivros) || todosLivros.length === 0) return [];
  
  // Otimização: Pega os últimos 5 elementos e inverte. 
  // Muito mais rápido do que duplicar e inverter a lista inteira do banco.
  return todosLivros.slice(-5).reverse();
};

/**
 * Força a limpeza do cache (use isso quando o usuário adicionar/remover um livro 
 * para garantir que a Home busque os dados novos do Firebase).
 */
export const limparCacheHome = () => {
  cacheDadosHome = null;
};

export const atualizarStatusLivro = async (idLivro, novoStatus) => {
  try {
    // ... seu código atual que salva no Firebase (doc, updateDoc, setDoc, etc.) ...
    
    // 🌟 A MÁGICA ESTÁ AQUI: Sempre que mudar o status, invalida o cache antigo!
    limparCacheHome(); 

    return true;
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    throw error;
  }
};