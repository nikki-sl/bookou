import React, { useState, useEffect } from "react";
import "./DetalhesLivro.css";
import Header from "../../components/Header/Header";
import { obterDadosDoLivro } from "../../services/livrosService";
import { obterStatusUsuarioLivro, atualizarDadosLeitura, removerLivroDaBiblioteca } from "../../services/bibliotecaService";

export default function DetalhesLivro({ idLivro, aoNavegar }) {
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [nota, setNota] = useState(0);

  useEffect(() => {
    if (!idLivro) {
      aoNavegar("/home");
      return;
    }

    const carregarInformacoes = async () => {
      try {
        const dadosLivro = await obterDadosDoLivro(idLivro);
        setLivro(dadosLivro);

        const dadosUsuario = await obterStatusUsuarioLivro(idLivro);
        setStatus(dadosUsuario.status);
        setFeedback(dadosUsuario.feedback);
        setNota(dadosUsuario.nota);
      } catch (error) {
        console.error("Erro ao carregar detalhes do livro:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarInformacoes();
  }, [idLivro, aoNavegar]);

  const salvarDadosLeituraAtualizada = async (novoStatus = status, novaNota = nota) => {
    try {
      await atualizarDadosLeitura(idLivro, {
        titulo: livro.titulo,
        foto_capa: livro.foto_capa,
        status: novoStatus,
        nota: novaNota,
        feedback: feedback
      });
      // O salvamento acontece silenciosamente aqui
    } catch (error) {
      console.error("Erro ao salvar dados na biblioteca:", error);
    }
  };

  const alternarStatus = async (statusClicado) => {
    if (status === statusClicado) {
      try {
        await removerLivroDaBiblioteca(idLivro);
        setStatus("");
        setFeedback("");
        setNota(0);
        alert("Livro removido da sua biblioteca!");
      } catch (error) {
        console.error("Erro ao remover da biblioteca:", error);
      }
    } else {
      setStatus(statusClicado);
      salvarDadosLeituraAtualizada(statusClicado, nota);
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
                onClick={() => { setNota(estrela); salvarDadosLeituraAtualizada(status, estrela); }}
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
            <button className="btnSalvarFeedback" onClick={() => salvarDadosLeituraAtualizada()}>
              Salvar Feedback
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}