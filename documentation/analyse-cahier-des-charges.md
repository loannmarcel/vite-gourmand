# Analyse du cahier des charges - Vite & Gourmand

## Présentation du client

Vite & Gourmand est une entreprise bordelaise existant depuis 25 ans.
Elle propose des prestations de menus pour différents événements.

## Objectif de l'application

Créer une application web permettant :
- d'augmenter la visibilité de l'entreprise ;
- de présenter les menus ;
- de permettre la commande en ligne ;
- de gérer les commandes, les avis et les menus depuis des espaces dédiés.

## Utilisateurs identifiés

### Visiteur
- Consulter la page d'accueil
- Consulter les menus
- Filtrer les menus
- Voir le détail d'un menu
- Créer un compte
- Contacter l'entreprise

### Utilisateur
- Se connecter
- Modifier ses informations personnelles
- Commander un menu
- Consulter ses commandes
- Modifier ou annuler une commande tant qu'elle n'est pas acceptée
- Suivre l'état d'une commande
- Déposer un avis après commande terminée

### Employé
- Gérer les menus
- Gérer les plats
- Gérer les horaires
- Gérer les commandes
- Mettre à jour le statut des commandes
- Valider ou refuser les avis clients

### Administrateur
- Réaliser toutes les actions d'un employé
- Créer des comptes employés
- Désactiver des comptes employés
- Consulter les statistiques
- Visualiser le chiffre d'affaires par menu

## Contraintes

- Application responsive
- Application accessible selon les principes RGAA
- Respect du RGPD
- Sécurisation des mots de passe
- Gestion des rôles
- Base de données relationnelle obligatoire
- Base de données non relationnelle obligatoire
- Déploiement obligatoire
- GitHub public obligatoire
- Documentation utilisateur, technique et projet obligatoire


## Personas

### Persona primaire 

- Nom : Marie Dupont
- Âge : 38 ans
- Obectif : Commander un menu pour un événement familial 
- Besoins : 
           - Voir rapidement les menus 
           - Comparer les prix 
           - Connaitre les allergenes 
           - Commander facilement
- Frustrations : 
           - Site compliqué
           - Trop d'étapes 
           - Information peu claires 

### Persona secondaire

- Nom : Julie Fleur
- Rôle : Employé de Vite & Gourmand
- Obectif : gérer les commandes et les menus
- Besoins : 
           - Trouver rapidement une commande 
           - Modifier les menus 
           - Mêttre a jour les statuts 
- Frustrations : 
           - trop de clics
           - Interface peu claire 

## Arborescence de l'application

### Partie publique

- Accueil
- Menus
  - Détail menu
  - Commande
- Contact
- Connexion
- Inscription

### Espace utilisateur

- Tableau de bord
- Mes commandes
- Mon profil

### Espace employé

- Gestion commandes
- Gestion menus
- Validation avis

### Espace administrateur

- Tableau de bord administrateur
- Gestion employés
- Statistiques

# Frames a créer

Public

  - Accueil Desktop
  - Menus Desktop
  - Détail Menu Desktop
  - Commande Desktop 
  - Connexion Desktop
  - Inscription Desktop
  - Mot de passe oublié Desktop
  - Contact Desktop

Utilsateur 

  - Dashboard Utilisateur
  - Mes Commandes Desktop
  - Détail Commande Desktop
  - Mon Profil Desktop

Employé 

  - Dashboard employé 

Adinistrateur 

  - Dashboard Administrateur
  - Gestion Employés Desktop
  - Statistiques Desktop

Frames principales :

- Accueil
- Menus
- Détail Menu
- Commande
- Connexion
- Inscription

Frames secondaires :

- Contact
- Mot de passe oublié
- Dashboard Utilisateur
- Mes Commandes
- Mon Profil
- Dashboard Employé
- Dashboard Administrateur
- Gestion Employés
- Statistiques