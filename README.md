# Vite & Gourmand

Application web réalisée dans le cadre de l'ECF Studi.

Vite & Gourmand est une application de traiteur permettant aux visiteurs de consulter les menus proposés, aux utilisateurs de créer un compte et de passer des commandes, aux employés de gérer l'activité et à l'administrateur de gérer les employés et les statistiques.

## Fonctionnalités principales

### Visiteur / utilisateur
- Consultation et filtrage des menus
- Création de compte et authentification
- Réinitialisation du mot de passe
- Consultation du détail d'un menu
- Commande d'un menu
- Calcul des frais de livraison
- Application automatique de la remise de 10 % selon le nombre de personnes
- Consultation et modification des commandes autorisées
- Suivi de l'état d'une commande
- Dépôt d'un avis après une commande terminée
- Formulaire de contact

### Employé
- Gestion des menus
- Gestion des plats et allergènes
- Gestion des stocks
- Gestion des commandes
- Mise à jour du statut des commandes
- Annulation d'une commande avec motif et moyen de contact
- Gestion des horaires d'ouverture
- Modération des avis clients

### Administrateur
- Création et gestion des comptes employés
- Activation / désactivation des comptes employés
- Consultation des statistiques des commandes
- Statistiques utilisant une base NoSQL MongoDB

## Technologies utilisées

### Front-end
- HTML5
- CSS3
- JavaScript

### Back-end
- PHP
- PDO

### Bases de données
- MySQL : données relationnelles de l'application
- MongoDB : statistiques administrateur

### Dépendances PHP
- PHPMailer `^7.1`
- vlucas/phpdotenv `^5.7`
- Extension PHP MongoDB

## Prérequis

Avant de lancer le projet en local, installer :

- PHP
- Composer
- MySQL
- MongoDB
- Extension PHP `mongodb`

## Installation locale

### 1. Cloner le dépôt

```bash
git clone https://github.com/loannmarcel/vite-gourmand.git
cd vite-gourmand
```

### 2. Installer les dépendances PHP

```bash
composer install
```

### 3. Créer la base MySQL

Créer une base nommée :

```text
vite_gourmand
```

Importer ensuite les scripts SQL dans cet ordre :

```text
database/sql/01_creation_tables.sql
database/sql/02_insert_data.sql
```

Le premier script crée la structure de la base et le second ajoute les données initiales.

### 4. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet.

Variables nécessaires :

```env
DB_HOST=
DB_PORT=
DB_NAME=vite_gourmand
DB_USER=
DB_PASSWORD=

SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
MONGODB_URI=
APP_URL=
ORS_API_KEY=
```

Ne jamais versionner les identifiants ou mots de passe réels.

### 5. MongoDB

Démarrer MongoDB localement.

L'application utilise MongoDB pour les statistiques accessibles depuis l'espace administrateur.

La connexion locale utilisée par le projet est :

```text
mongodb://127.0.0.1:27017
```

L'extension PHP `mongodb` doit être activée.

### 6. Lancer l'application

Depuis la racine du projet :

```bash
php -S localhost:8000
```

Puis ouvrir dans le navigateur :

```text
http://localhost:8000/
```

## Structure du projet

```text
backend/        Routes, services et configuration PHP
database/       Scripts SQL et données liées aux bases
documentation/  Documentation du projet
frontend/       Pages, styles, scripts et ressources front-end
```

## Branches Git

Le projet utilise le workflow suivant :

- `main` : version stable
- `development` : branche d'intégration et de développement
- `feature/...` : branches dédiées aux fonctionnalités

Les fonctionnalités sont développées sur une branche `feature/...`, intégrées dans `development`, puis intégrées dans `main` lorsque la version est validée.

## Sécurité

Les informations sensibles sont stockées dans les variables d'environnement et ne doivent pas être publiées dans le dépôt Git.

Le fichier `.env` est exclu du versionnement.