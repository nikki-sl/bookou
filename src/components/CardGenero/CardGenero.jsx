import React from 'react';
import styles from './CardGenero.module.css';

export default function CardGenero({ nome, selecionado, onSelect }) {
  return (
    <button 
      type="button"
      className={`${styles.tagGenero} ${selecionado ? styles.selecionado : ''}`} 
      onClick={onSelect}
    >
      {nome}
    </button>
  );
}