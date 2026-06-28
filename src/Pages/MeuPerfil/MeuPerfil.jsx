import React, { useState, useEffect } from "react";
import "./MeuPerfil.css";
import Header from "../../components/Header/Header";
// Importando os serviços que criamos na pasta services
import { buscarPerfilUsuario, atualizarPerfilUsuario } from "../../services/UserService";

export default function MeuPerfil({ aoNavegar }) {
  // ID temporário para testes no Firebase. O grupo pode usar esse ID no Firestore para criar um usuário fake.
  const ID_USUARIO_TESTE = "leitor_teste_123";

  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para mostrar "Carregando..." enquanto puxa os dados

  // Estados para guardar os dados do usuário vindos do Firebase
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  // Dados fixos de estatística
  const dataCadastro = "Outubro de 2024";
  const livrosLidos = 12;

  // useEffect roda assim que a tela abre, buscando os dados no Firebase
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const dadosDoBanco = await buscarPerfilUsuario(ID_USUARIO_TESTE);

        if (dadosDoBanco) {
          setNome(dadosDoBanco.nome || "Usuário sem Nome");
          setEmail(dadosDoBanco.email || "sem-email@bookou.com");
        } else {
          // Caso o documento não exista no banco ainda, deixa o valor padrão
          setNome("Leitor Bookou");
          setEmail("usuario@bookou.com");
        }
      } catch (error) {
        console.error("Não foi possível carregar o perfil do Firebase, usando dados locais:", error);
        // REDE DE SEGURANÇA: Se o Firebase der erro de offline/falta de chaves, o app não trava!
        setNome("Leitor Bookou");
        setEmail("usuario@bookou.com");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const salvarPerfil = async () => {
    try {
      // Chama o serviço isolado para salvar no Firebase
      await atualizarPerfilUsuario(ID_USUARIO_TESTE, { nome });

      setEditando(false);
      alert("Perfil atualizado no Firebase com sucesso! ✨");
    } catch (error) {
      alert("Erro ao salvar os dados no banco de dados.");
    }
  };

  if (loading) {
    return (
      <div className="perfilContainer" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Carregando dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfilContainer">
      <Header onBack={() => aoNavegar("/home")} />

      <main className="perfilContent">
        <div className="perfilCard">
          {/* A letra do Avatar muda dinamicamente com a primeira letra do nome */}
          <div className="avatarPlaceholder">
            {nome ? nome.charAt(0).toUpperCase() : "U"}
          </div>

          {/* CONDICIONAL: Mostra inputs se estiver editando, ou texto normal se não estiver */}
          {editando ? (
            <div className="formEdicao">
              <label>Seu Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="inputPerfil"
                placeholder="Digite seu nome"
              />

              <label>Seu E-mail:</label>
              <input
                type="email"
                value={email}
                className="inputPerfil"
                disabled
              />
            </div>
          ) : (
            <>
              <h1 className="perfilNome">{nome}</h1>
              <p className="perfilEmail">{email}</p>
            </>
          )}

          <div className="perfilEstatisticas">
            <div className="statItem">
              <span className="statNumero">{livrosLidos}</span>
              <span className="statLabel">Livros Lidos</span>
            </div>
            <div className="statItem">
              <span className="statNumero">Membro desde</span>
              <span className="statLabel">{dataCadastro}</span>
            </div>
          </div>

          <div className="perfilAcoes">
            {/* CONDICIONAL DOS BOTÕES: Muda dependendo do modo de edição */}
            {editando ? (
              <>
                <button className="btnSalvarPerfil" onClick={salvarPerfil}>
                  Salvar Alterações
                </button>
                <button className="btnCancelarPerfil" onClick={() => setEditando(false)}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button className="btnEditarPerfil" onClick={() => setEditando(true)}>
                  Editar Perfil
                </button>
                <button className="btnSair" onClick={() => aoNavegar("/")}>
                  Sair da Conta
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}