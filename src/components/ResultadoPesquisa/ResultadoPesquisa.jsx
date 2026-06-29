import React from "react";
import CardLivro from "../CardLivro/CardLivro";

export default function ResultadoPesquisa({ livros, aoNavegar }) {
  return (
    <section className="homeSection">
      <div className="sectionHeader">
        <h2>Resultados da Pesquisa ({livros.length})</h2>
      </div>
      <div className="resultadoPesquisaGrid">
        {livros.length > 0 ? (
          livros.map((livro) => (
            <div 
              key={livro.id} 
              onClick={() => aoNavegar("/livro", livro.id)} 
              style={{ cursor: "pointer" }}
            >
              <CardLivro imagem={livro.foto_capa} titulo={livro.titulo} />
            </div>
          ))
        ) : (
          <p className="semResultados">Nenhum livro corresponde à sua busca.</p>
        )}
      </div>
    </section>
  );
}