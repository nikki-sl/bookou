import { db } from "../firebase"; // Importa o banco configurado pelo grupo
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Nome da coleção que o grupo vai usar no Firestore
const COLECAO_USUARIOS = "usuarios";

/**
 * Busca os dados de um usuário no Firebase pelo ID dele
 */
export async function buscarPerfilUsuario(userId) {
  try {
    const docRef = doc(db, COLECAO_USUARIOS, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data(); // Retorna { nome, email, ... }
    } else {
      console.log("Nenhum usuário encontrado com esse ID!");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    throw error;
  }
}

/**
 * Atualiza os dados do usuário no Firebase
 */
export async function atualizarPerfilUsuario(userId, novosDados) {
  try {
    const docRef = doc(db, COLECAO_USUARIOS, userId);
    await updateDoc(docRef, novosDados);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error);
    throw error;
  }
}