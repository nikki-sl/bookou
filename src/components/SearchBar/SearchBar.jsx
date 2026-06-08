import React from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange }) {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="🔍 Pesquise aqui..."
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
}