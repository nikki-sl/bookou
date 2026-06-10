import React, { useState, useEffect } from "react";
import "./DetalhesLivro.css";

import { db } from "../../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"; // <-- Importamos deleteDoc
import Header from "../../components/Header/Header";

export default function DetalhesLivro({ idLivro, aoNavegar }) {
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [status, setStatus] = useState(""); // lendo, lido, abandonou, quero-ler
  const [feedback, setFeedback] = useState("");
  const [nota, setNota] = useState(0);

  useEffect(() => {
    if (!idLivro) {
      aoNavegar("/home");
      return;
    }

    const buscarDetalhes = async () => {
      try {
        const livroRef = doc(db, "Livro", idLivro);
        const livroSnap = await getDoc(livroRef);

        if (livroSnap.exists()) {
          setLivro(livroSnap.data());
        }

        const bibliotecaRef = doc(db, "MinhaBiblioteca", idLivro);
        const bibliotecaSnap = await getDoc(bibliotecaRef);

        if (bibliotecaSnap.exists()) {
          const dadosUsuario = bibliotecaSnap.data();
          setStatus(dadosUsuario.status || "");
          setFeedback(dadosUsuario.feedback || "");
          setNota(dadosUsuario.nota || 0);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do livro:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDetalhes();
  }, [idLivro]);

  const salvarDadosLeitura = async (novoStatus = status, novaNota = nota) => {
    try {
      const docRef = doc(db, "MinhaBiblioteca", idLivro);
      await setDoc(docRef, {
        livroId: idLivro,
        titulo: livro.titulo,
        foto_capa: livro.foto_capa,
        status: novoStatus,
        nota: novaNota,
        feedback: feedback,
        dataAtualizacao: new Date()
      }, { merge: true });
      
      alert("Sua biblioteca foi atualizada com sucesso! 🎉");
    } catch (error) {
      console.error("Erro ao salvar dados na biblioteca:", error);
    }
  };

  // 🔥 Nova função que gerencia o clique no botão (Salvar vs Desmarcar)
  const alternarStatus = async (statusClicado) => {
    const docRef = doc(db, "MinhaBiblioteca", idLivro);

    if (status === statusClicado) {
      // Se clicou no botão que JÁ ESTAVA ativo -> Desmarca e deleta do banco
      try {
        await deleteDoc(docRef);
        setStatus("");
        setFeedback("");
        setNota(0);
        alert("Livro removido da sua biblioteca!");
      } catch (error) {
        console.error("Erro ao remover da biblioteca:", error);
      }
    } else {
      // Se clicou em um status novo -> Salva e atualiza o estado
      setStatus(statusClicado);
      salvarDadosLeitura(statusClicado, nota);
    }
  };

  if (carregando) {
    return <div className="loading"><h2>Carregando informações do livro...</h2></div>;
  }

  if (!livro) {
    return <div className="loading"><h2>Livro não encontrado.</h2></div>;
  }

  return (
    <div className="detalhesContainer">
      <Header onBack={() => aoNavegar("/home")} />
      
      <main className="detalhesContent">
        <div className="livroHeaderPrincipal">
          <img src={livro.foto_capa} alt={livro.titulo} className="capaLivroGrande" />
          
          <div className="livroInfosAgrupadas">
            <h1 className="livroTituloInfo">{livro.titulo}</h1>
            <p className="livroAutorInfo">Por: <span>{livro.nome_escritor || "Autor Desconhecido"}</span></p>
            {livro.genero && <span className="livroTagGenero">{livro.genero}</span>}
            
            <div className="statusOpcoesContainer">
              <h3>Status da sua leitura:</h3>
              <div className="botoesStatusGrid">
                {/* Note que mudamos de onClick={() => setStatus...} para onClick={() => alternarStatus...} */}
                {/* Também adicionei a opção de 'Quero Ler' para bater com a Biblioteca! */}
                <button 
                  className={`btnStatus ${status === "quero-ler" ? "ativoQueroLer" : ""}`}
                  onClick={() => alternarStatus("quero-ler")}
                >
                  Quero Ler
                </button>
                <button 
                  className={`btnStatus ${status === "lendo" ? "ativoLendo" : ""}`}
                  onClick={() => alternarStatus("lendo")}
                >
                  Lendo
                </button>
                <button 
                  className={`btnStatus ${status === "lido" ? "ativoLido" : ""}`}
                  onClick={() => alternarStatus("lido")}
                >
                  Lido
                </button>
                <button 
                  className={`btnStatus ${status === "abandonou" ? "ativoAbandonei" : ""}`}
                  onClick={() => alternarStatus("abandonou")}
                >
                  Abandonei
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="secaoFeedbackUsuario">
          <h3>Sua Avaliação</h3>
          <div className="estrelasContainer">
            {[1, 2, 3, 4, 5].map((estrela) => (
              <span 
                key={estrela} 
                className={`estrelaClick ${estrela <= nota ? "estrelaCheia" : ""}`}
                onClick={() => { setNota(estrela); salvarDadosLeitura(status, estrela); }}
              >
                ★
              </span>
            ))}
          </div>

          <div className="campoTextoFeedback">
            <label>O que achou dessa leitura? Deixe seu feedback:</label>
            <textarea 
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)} 
              placeholder="Escreva aqui suas impressões, citações favoritas ou críticas..."
            />
            <button className="btnSalvarFeedback" onClick={() => salvarDadosLeitura()}>
              Salvar Feedback
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}