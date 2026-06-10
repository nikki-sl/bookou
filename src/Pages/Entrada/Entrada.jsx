import React from "react";
import "./Entrada.css";

export default function Entrada({ aoNavegar }) {
  return (
    <div className="entradaContainer">
      <div className="entradaConteudo">
        <div className="logoBookou">Bookou</div>
        <h1 className="entradaTitulo">A sua próxima grande história começa aqui.</h1>
        <p className="entradaSubtitulo">Descubra novos livros, organize sua estante digital e conecte-se com as suas leituras favoritas.</p>
        
        <div className="entradaBotoes">
          <button className="btnPrimaryEntrada" onClick={() => aoNavegar("/login")}>
            Entrar na Conta
          </button>
          <button className="btnSecondaryEntrada" onClick={() => aoNavegar("/cadastro")}>
            Criar Nova Conta
          </button>
        </div>
      </div>
    </div>
  );
}