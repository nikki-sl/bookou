import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

export const obterBibliotecaDetalhada = async () => {
  const querySnapshot = await getDocs(collection(db, "MinhaBiblioteca"));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const obterStatusUsuarioLivro = async (idLivro) => {
  const bibliotecaSnap = await getDoc(doc(db, "MinhaBiblioteca", idLivro));
  return bibliotecaSnap.exists() 
    ? bibliotecaSnap.data() 
    : { status: "", feedback: "", nota: 0 };
};

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

export const removerLivroDaBiblioteca = async (idLivro) => {
  await deleteDoc(doc(db, "MinhaBiblioteca", idLivro));
};

export const limparTodaBiblioteca = async () => {
  const querySnapshot = await getDocs(collection(db, "MinhaBiblioteca"));
  const promessasDeDelecao = querySnapshot.docs.map(documento => 
    deleteDoc(documento.ref)
  );
  
  await Promise.all(promessasDeDelecao);
};