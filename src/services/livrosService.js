import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

// Busca todos os livros cadastrados no sistema (usado na barra de pesquisa)
export const obterTodosLivrosSistema = async () => {
  const livrosRef = collection(db, "Livro");
  const livrosSnapshot = await getDocs(livrosRef);
  return livrosSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Busca os detalhes estáticos de um livro específico na coleção geral
export const obterDadosDoLivro = async (idLivro) => {
  const livroRef = doc(db, "Livro", idLivro);
  const livroSnap = await getDoc(livroRef);
  if (livroSnap.exists()) {
    return livroSnap.data();
  }
  return null;
};