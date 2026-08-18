# Modèle conceptuel de données

## Entités principales

### Utilisateur
- id
- nom
- prénom
- email
- téléphone
- adresse
- mot de passe
- rôle
- actif

### Menu
- id
- titre
- description
- thème
- régime
- nombre_personnes_minimum
- prix_minimum
- conditions
- stock_disponible

### Plat
- id
- nom
- type : entrée, plat, dessert
- description

### Allergène
- id
- nom

### Commande
- id
- utilisateur_id
- menu_id
- date_prestation
- heure_livraison
- adresse_livraison
- nombre_personnes
- prix_menu
- prix_livraison
- total
- statut

### Avis
- id
- utilisateur_id
- commande_id
- note
- commentaire
- valide

### Horaire
- id
- jour
- heure_ouverture
- heure_fermeture

### Contact
- id
- titre
- email
- description
- date_envoi

## Relations à détailler

- Un utilisateur peut passer plusieurs commandes
- Un menu peut être commandé plusieurs fois
- Un menu peut contenir plusieurs plats
- Un plat peut appartenir à plusieurs menus
- Un plat peut contenir plusieurs allergènes
- Une commande peut recevoir un avis
