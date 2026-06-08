import React from 'react';
import styles from './CardEscritor.module.css';

export default function CardEscritor({ imagem, nome, selecionado, onSelect }) {
  return (
    <div className={styles.cardContainer} onClick={onSelect}>
      <div 
        className={`${styles.imagemCircular} ${selecionado ? styles.selecionado : ''}`}
        style={{ backgroundImage: imagem ? `url(${imagem})` : 'none' }}
      />
      <p className={styles.nomeEscritor}>{nome}</p>
    </div>
  );
}