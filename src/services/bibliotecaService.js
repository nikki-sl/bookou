import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

// 1. Busca todos os livros salvos na biblioteca do usuário
export const obterBibliotecaDetalhada = async () => {
  const querySnapshot = await getDocs(collection(db, "MinhaBiblioteca"));
  
  // Como o título e a capa já foram salvos junto, é só retornar os dados direto!
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// 2. Busca o status, nota e feedback de um livro específico
export const obterStatusUsuarioLivro = async (idLivro) => {
  const bibliotecaSnap = await getDoc(doc(db, "MinhaBiblioteca", idLivro));
  
  // Usamos um "if" simplificado (operador ternário) para retornar os dados ou valores zerados
  return bibliotecaSnap.exists() 
    ? bibliotecaSnap.data() 
    : { status: "", feedback: "", nota: 0 };
};

// 3. Salva ou atualiza os dados de leitura
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

// 4. Remove um livro específico
export const removerLivroDaBiblioteca = async (idLivro) => {
  await deleteDoc(doc(db, "MinhaBiblioteca", idLivro));
};

// 5. Apaga todos os livros de uma vez
export const limparTodaBiblioteca = async () => {
  const querySnapshot = await getDocs(collection(db, "MinhaBiblioteca"));
  
  // Usamos 'documento.ref' para simplificar o caminho da exclusão
  const promessasDeDelecao = querySnapshot.docs.map(documento => 
    deleteDoc(documento.ref)
  );
  
  await Promise.all(promessasDeDelecao);
};