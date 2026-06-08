import React from 'react';
import styles from './CardLivro.module.css';

export default function CardLivro({ imagem, titulo, selecionado, onSelect }) {
  return (
    <div className={styles.cardContainer} onClick={onSelect}>
      <div 
        className={`${styles.capaBg} ${selecionado ? styles.selecionado : ''}`}
        style={{ backgroundImage: imagem ? `url(${imagem})` : 'none' }}
      >
        {/* Se não houver imagem, mostra o texto do título como fallback */}
        {!imagem && <span className={styles.fallbackText}>{titulo}</span>}
      </div>
    </div>
  );
}