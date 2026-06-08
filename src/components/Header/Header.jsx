import React from 'react';
import styles from './Header.module.css';
import logo from '../../assets/logo.png'; 

export default function Header({ onBack }) {
  return (
    <header className={styles.header}>
      <button className={styles.backButton} onClick={onBack}>←</button>
        <img src={logo} alt="Bookou Logo" className={styles.logo} />
    </header>
  );
}