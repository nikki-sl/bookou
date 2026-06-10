import React, { useState } from "react";
import "./MeuPerfil.css";
import Header from "../../components/Header/Header";

export default function MeuPerfil({ aoNavegar }) {
  // Estado para controlar se a tela está no modo de visualização ou edição
  const [editando, setEditando] = useState(false);

  // Estados para guardar os dados do usuário (por enquanto simulados)
  const [nome, setNome] = useState("Leitor Bookou");
  const [email, setEmail] = useState("usuario@bookou.com");

  // Dados fixos de estatística
  const dataCadastro = "Outubro de 2024";
  const livrosLidos = 12;

  const salvarPerfil = () => {
    // No futuro, é aqui que você chamará a função para atualizar o Firebase!
    setEditando(false);
    alert("Perfil atualizado com sucesso! ✨");
  };

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
                onChange={(e) => setEmail(e.target.value)} 
                className="inputPerfil"
                disabled // E-mail geralmente não se edita tão fácil por segurança, mas você pode tirar esse 'disabled' se quiser!
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