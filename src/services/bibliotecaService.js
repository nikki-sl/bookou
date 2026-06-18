import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { obterTodosLivrosSistema } from "./livrosService";

// Busca a biblioteca do usuário e cruza com os dados que vêm do livrosService
export const obterBibliotecaDetalhada = async () => {
  const bibliotecaRef = collection(db, "MinhaBiblioteca");
  const querySnapshot = await getDocs(bibliotecaRef);
  
  const itensBiblioteca = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const listaTodosLivros = await obterTodosLivrosSistema();

  return itensBiblioteca.map(item => {
    const dadosDoLivro = listaTodosLivros.find(l => l.id === item.livroId);
    return {
      ...item,
      ...dadosDoLivro 
    };
  }).filter(l => l.titulo);
};

// Busca o status, nota e feedback que o usuário deu para um livro específico
export const obterStatusUsuarioLivro = async (idLivro) => {
  const bibliotecaRef = doc(db, "MinhaBiblioteca", idLivro);
  const bibliotecaSnap = await getDoc(bibliotecaRef);
  
  if (bibliotecaSnap.exists()) {
    return {
      status: bibliotecaSnap.data().status || "",
      feedback: bibliotecaSnap.data().feedback || "",
      nota: bibliotecaSnap.data().nota || 0
    };
  }
  return { status: "", feedback: "", nota: 0 };
};

// Salva ou atualiza os dados de progresso de leitura do usuário
export const atualizarDadosLeitura = async (idLivro, dados) => {
  const docRef = doc(db, "MinhaBiblioteca", idLivro);
  await setDoc(docRef, {
    livroId: idLivro,
    titulo: dados.titulo,
    foto_capa: dados.foto_capa,
    status: dados.status,
    nota: dados.nota,
    feedback: dados.feedback,
    dataAtualizacao: new Date()
  }, { merge: true });
};

// Remove um livro específico da biblioteca do usuário
export const removerLivroDaBiblioteca = async (idLivro) => {
  const docRef = doc(db, "MinhaBiblioteca", idLivro);
  await deleteDoc(docRef);
};

// Apaga todos os livros salvos na biblioteca do usuário
export const limparTodaBiblioteca = async () => {
  const querySnapshot = await getDocs(collection(db, "MinhaBiblioteca"));
  const promessasDeDelecao = querySnapshot.docs.map((documento) =>
    deleteDoc(doc(db, "MinhaBiblioteca", documento.id))
  );
  await Promise.all(promessasDeDelecao);
};