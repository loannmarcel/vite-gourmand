# Documentation sécurité

## Mots de passe

- Mot de passe de 10 caractères minimum
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial
- Hash avec password_hash en PHP

## Protection SQL

- Utilisation de PDO
- Requêtes préparées
- Aucune concaténation directe de données utilisateur dans les requêtes SQL

## Protection XSS

- Échappement des données affichées
- Validation des formulaires côté client et côté serveur

## Sessions

- Vérification des rôles
- Accès protégé aux espaces utilisateur, employé et administrateur

## RGPD

- Collecte limitée aux données nécessaires
- Informations utilisateur modifiables depuis l'espace personnel
- Pas de création d'administrateur depuis l'application

## Accessibilité

- Contrastes lisibles
- Textes alternatifs pour les images
- Navigation claire
- Formulaires avec labels
