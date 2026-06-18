import React, { useState, useEffect } from "react";
import "./MinhaBiblioteca.css";
import Header from "../../components/Header/Header";
import CardLivro from "../../components/CardLivro/CardLivro";
import { obterBibliotecaDetalhada, limparTodaBiblioteca } from "../../services/bibliotecaService";
import { obterTodosLivrosSistema } from "../../services/livrosService";

export default function MinhaBiblioteca({ aoNavegar }) {
  const [meusLivros, setMeusLivros] = useState([]);
  const [todosLivrosSistema, setTodosLivrosSistema] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("todos");
  
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [resultadosPesquisa, setResultadosPesquisa] = useState([]);

  // Novos estados para controlar o visual dos alertas
  const [modalZerarAberto, setModalZerarAberto] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const livrosBiblioteca = await obterBibliotecaDetalhada();
        setMeusLivros(livrosBiblioteca);

        const livrosSistema = await obterTodosLivrosSistema();
        setTodosLivrosSistema(livrosSistema);
      } catch (error) {
        console.error("Erro ao carregar dados da biblioteca:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (termoPesquisa.trim() === "") {
      setResultadosPesquisa([]);
      return;
    }

    const filtrados = todosLivrosSistema.filter(livro => 
      livro.titulo?.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      livro.nome_escritor?.toLowerCase().includes(termoPesquisa.toLowerCase())
    );
    setResultadosPesquisa(filtrados);
  }, [termoPesquisa, todosLivrosSistema]);

  // Função nova que apaga e mostra o aviso bonito
  const confirmarZerarBiblioteca = async () => {
    try {
      await limparTodaBiblioteca();
      setMeusLivros([]);
      setModalZerarAberto(false); // Fecha a janelinha
      
      // Mostra a mensagem verde e esconde depois de 3 segundos
      setMensagemSucesso("Sua biblioteca foi limpa com sucesso!");
      setTimeout(() => {
        setMensagemSucesso("");
      }, 3000);

    } catch (error) {
      console.error("Erro ao zerar biblioteca:", error);
      alert("Erro de conexão ao tentar limpar a biblioteca.");
    }
  };

  const livrosFiltrados = meusLivros.filter(livro => {
    if (abaAtiva === "todos") return true;
    const statusLivro = (livro.status || "").toLowerCase();
    return statusLivro === abaAtiva; 
  });

  if (carregando) {
    return (
      <div className="loadingContainer">
        <h2>Carregando sua biblioteca...</h2>
      </div>
    );
  }

  return (
    <div className="bibliotecaContainer">
      <Header onBack={() => aoNavegar("/home")} />
      
      <main className="content">
        <h2 className="title">Minha Biblioteca</h2>
        <p className="subtitle">Gerencie suas leituras e acompanhe seu progresso.</p>

        {/* Barra de Pesquisa */}
        <div className="pesquisaBancoContainer">
          <input 
            type="text"
            className="inputPesquisaBanco"
            placeholder="Pesquise aqui..."
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />
          
          {resultadosPesquisa.length > 0 && (
            <div className="dropdownResultados">
              {resultadosPesquisa.map(livro => (
                <div 
                  key={livro.id} 
                  className="itemResultadoPesquisa"
                  onClick={() => aoNavegar("/livro", livro.id)}
                >
                  <img src={livro.foto_capa} alt={livro.titulo} className="miniCapaPesquisa" />
                  <div>
                    <p className="tituloResultado">{livro.titulo}</p>
                    <p className="autorResultado">{livro.nome_escritor || "Autor desconhecido"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Abas */}
        <div className="abasContainer">
          <button className={`abaBotao ${abaAtiva === "todos" ? "ativa" : ""}`} onClick={() => setAbaAtiva("todos")}>Todos ({meusLivros.length})</button>
          <button className={`abaBotao ${abaAtiva === "lendo" ? "ativa" : ""}`} onClick={() => setAbaAtiva("lendo")}>Lendo</button>
          <button className={`abaBotao ${abaAtiva === "quero-ler" ? "ativa" : ""}`} onClick={() => setAbaAtiva("quero-ler")}>Quero Ler</button>
          <button className={`abaBotao ${abaAtiva === "abandonou" ? "ativa" : ""}`} onClick={() => setAbaAtiva("abandonou")}>Abandonei</button>
          <button className={`abaBotao ${abaAtiva === "lido" ? "ativa" : ""}`} onClick={() => setAbaAtiva("lido")}>Lidos</button>
        </div>

        {/* Lista de Livros */}
        <div className="livrosGrid">
          {livrosFiltrados.length > 0 ? (
            livrosFiltrados.map((livro) => (
              <div key={livro.id} className="livroItem">
                <div onClick={() => aoNavegar("/livro", livro.livroId)} style={{ cursor: "pointer" }}>
                  <CardLivro imagem={livro.foto_capa} titulo={livro.titulo} selecionado={false} onSelect={() => {}}/>
                </div>
                <span className={`statusTag ${(livro.status || "").toLowerCase()}`}>
                  {(livro.status || "").toLowerCase() === "lendo" && "Lendo"}
                  {(livro.status || "").toLowerCase() === "quero-ler" && "Quero ler"}
                  {(livro.status || "").toLowerCase() === "abandonou" && "Abandonei"}
                  {(livro.status || "").toLowerCase() === "lido" && "Lido"}
                </span>
              </div>
            ))
          ) : (
            <p className="semResultados">Nenhum livro encontrado nesta categoria.</p>
          )}
        </div>

        {/* Botão que abre a janelinha (só aparece se tiver livros) */}
        {meusLivros.length > 0 && (
          <button className="btnZerarBibliotecaDiscreto" onClick={() => setModalZerarAberto(true)}>
            Limpar todos os dados da minha biblioteca
          </button>
        )}
      </main>

      {/* --- O MODAL BONITINHO FICA AQUI --- */}
      {modalZerarAberto && (
        <div className="modalOverlay">
          <div className="modalBox">
            <div className="modalIcone">⚠️</div>
            <h3 className="modalTitulo">Atenção!</h3>
            <p className="modalTexto">
              Você tem certeza que deseja <strong>apagar TODOS</strong> os livros, notas e avaliações da sua biblioteca? Esta ação não poderá ser desfeita.
            </p>
            <div className="modalBotoes">
              <button className="btnModalCancelar" onClick={() => setModalZerarAberto(false)}>
                Cancelar
              </button>
              <button className="btnModalApagar" onClick={confirmarZerarBiblioteca}>
                Sim, quero apagar tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- O AVISO DE SUCESSO FICA AQUI --- */}
      {mensagemSucesso && (
        <div className="toastSucesso">
          {mensagemSucesso}
        </div>
      )}

    </div>
  );
}