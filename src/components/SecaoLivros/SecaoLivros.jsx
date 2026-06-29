import React from "react";
import CardLivro from "../CardLivro/CardLivro"; // Ajuste o caminho se o CardLivro estiver em outro lugar

export default function SecaoLivros({ titulo, icone, livros, aoNavegar }) {
  return (
    <section className="homeSection">
      <div className="sectionHeader">
        <h2>{titulo}</h2>
        {icone && <span>{icone}</span>}
      </div>
      <div className="carouselHome">
        {livros.map((livro) => (
          <div 
            key={livro.id} 
            onClick={() => aoNavegar("/livro", livro.id)} 
            style={{ cursor: "pointer" }}
          >
            <CardLivro imagem={livro.foto_capa} titulo={livro.titulo} />
          </div>
        ))}
      </div>
    </section>
  );
}