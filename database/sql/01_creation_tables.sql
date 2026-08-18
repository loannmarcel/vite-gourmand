-- Script de création des tables - Vite & Gourmand
-- À compléter progressivement pendant le projet

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    adresse TEXT,
    mot_de_passe VARCHAR(255) NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    theme VARCHAR(100),
    regime VARCHAR(100),
    nombre_personnes_minimum INT NOT NULL,
    prix_minimum DECIMAL(10,2) NOT NULL,
    conditions TEXT,
    stock_disponible INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plats (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE commandes (
    id SERIAL PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    menu_id INT NOT NULL,
    date_prestation DATE NOT NULL,
    heure_livraison TIME NOT NULL,
    adresse_livraison TEXT NOT NULL,
    nombre_personnes INT NOT NULL,
    prix_menu DECIMAL(10,2) NOT NULL,
    prix_livraison DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    statut VARCHAR(100) DEFAULT 'en attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);
