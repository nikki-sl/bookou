import React, { useState } from "react";
import "./Login.css";

export default function Login({ aoNavegar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const lidarComLogin = (e) => {
    e.preventDefault();
    // Pronto para colocar a lógica do Firebase Auth aqui futuramente
    aoNavegar("/preferencias");
  };

  const lidarComGoogle = () => {
    alert("Chamando API de autenticação do Google...");
    // Pronto para: signInWithPopup(auth, provider)
    aoNavegar("/preferencias");
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <div className="authVoltar" onClick={() => aoNavegar("/entrada")}>&larr; Voltar</div>
        <h2 className="authTitulo">Bem-vindo de volta!</h2>
        <p className="authSubtitulo">Insira seus dados para acessar sua conta.</p>
        
        <form onSubmit={lidarComLogin} className="authForm">
          <div className="inputGroup">
            <label>E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" required />
          </div>
          <div className="inputGroup">
            <label>Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btnAuth">Entrar</button>
        </form>

        <div className="authDivisor"><span>ou</span></div>

        <button type="button" className="btnGoogle" onClick={lidarComGoogle}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.9 1.2 9.5 3.3l7-7C36.3 2.4 30.6 0 24 0 14.6 0 6.7 5.4 3 13l7.7 6c1.8-5.5 7-9.5 13.3-9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.5 2.9-2.2 5.3-4.7 7l7.4 5.7c4.3-4 7.1-10 7.1-17z"/>
            <path fill="#FBBC05" d="M10.7 29c-1-2.9-1-6 0-9L3 14c-3.2 6.4-3.2 14 0 20.4l7.7-5.4z"/>
            <path fill="#34A853" d="M24 48c6.5 0 12.3-2.1 16.4-5.8l-7.4-5.7c-2.5 1.7-5.7 2.6-9 2.6-6.3 0-11.5-4-13.3-9.5L3 35c3.7 7.6 11.6 13 21 13z"/>
          </svg>
          Continuar com o Google
        </button>

        <p className="authAlternativa">
          Não tem uma conta? <span onClick={() => aoNavegar("/cadastro")}>Cadastre-se aqui</span>
        </p>
      </div>
    </div>
  );
}