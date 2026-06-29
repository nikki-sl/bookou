import React, { useState } from "react";
import "./MenuOpcoes.css"; // Mova o CSS do dropdown do Home.css para cá!

export default function MenuOpcoes({ aoNavegar }) {
  const [menuAberto, setMenuAberto] = useState(false);

  const alternarMenu = (e) => {
    e.stopPropagation();
    setMenuAberto(!menuAberto);
  };

  // Fecha o menu automaticamente se o usuário clicar fora (opcional e útil)
  React.useEffect(() => {
    const fecharMenuNoCliqueGeral = () => setMenuAberto(false);
    document.addEventListener("click", fecharMenuNoCliqueGeral);
    return () => document.removeEventListener("click", fecharMenuNoCliqueGeral);
  }, []);

  return (
    <div className="menuOpcoesContext">
      <button className="btnTresPontinhos" onClick={alternarMenu}>
        &#8942;
      </button>

      {menuAberto && (
        <div className="dropdownMenu">
          <button onClick={() => aoNavegar("/perfil")}>👤 Meu Perfil</button>
          <button onClick={() => aoNavegar("/biblioteca")}>📚 Minha Biblioteca</button>
          <button onClick={() => aoNavegar("/preferencias")}>⚙️ Preferências</button>
          <div className="divisorMenu"></div>
          <button className="btnSairDropdown" onClick={() => aoNavegar("/")}>Sair</button>
        </div>
      )}
    </div>
  );
}