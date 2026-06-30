import { db } from "../firebase"; 
import { collection, addDoc } from "firebase/firestore";


export const salvarPreferenciasUsuario = async (dados) => {
  try {
    const docRef = await addDoc(collection(db, "Preferencias"), dados);
    return docRef;
  } catch (error) {
    console.error("Erro no serviço ao salvar preferências no Firebase:", error);
    throw error; 
  }
};