# Manuel utilisateur - Vite & Gourmand

## 1. Présentation

Vite & Gourmand est une application web de traiteur permettant de consulter des menus, créer un compte, commander un menu et suivre ses commandes.

L'application propose trois espaces adaptés aux différents rôles : utilisateur, employé et administrateur.

---

## 2. Comptes de démonstration

### Utilisateur

Email : `salut@gmail.com`
Mot de passe : `Salutgourmand1!`

### Employé

Email : `employe@vite-gourmand.fr`
Mot de passe : `Employe123!`

### Administrateur

Email : `jose@vite-gourmand.fr`
Mot de passe : `Josegourmand123!`

Ces comptes sont destinés à la démonstration de l'application.

---

## 3. Parcours visiteur

Sans être connecté, un visiteur peut :

1. Consulter la page d'accueil.
2. Découvrir la présentation de Vite & Gourmand.
3. Consulter les avis clients validés.
4. Accéder à la liste des menus.
5. Filtrer les menus selon les critères proposés.
6. Consulter le détail d'un menu, ses plats, ses allergènes, son prix, son nombre minimum de personnes et ses conditions.
7. Accéder au formulaire de contact.
8. Créer un compte.
9. Se connecter.

Lorsqu'un visiteur souhaite commander un menu sans être authentifié, il est invité à se connecter ou à créer un compte.

---

## 4. Création d'un compte utilisateur

Depuis la page d'inscription :

1. Renseigner les informations demandées.
2. Indiquer une adresse e-mail valide.
3. Choisir un mot de passe d'au moins 10 caractères contenant une majuscule, une minuscule, un chiffre et un caractère spécial.
4. Valider l'inscription.

Le nouveau compte possède le rôle utilisateur.

---

## 5. Connexion

Depuis la page de connexion :

1. Saisir l'adresse e-mail.
2. Saisir le mot de passe.
3. Valider la connexion.

L'utilisateur est ensuite dirigé vers les fonctionnalités correspondant à son rôle.

En cas d'oubli du mot de passe, la fonction « Mot de passe oublié » permet de demander un lien de réinitialisation par e-mail.

---

## 6. Consultation et filtrage des menus

La page des menus permet de consulter les offres disponibles.

Les filtres permettent d'affiner la liste des menus sans recharger la page.

Chaque menu présente notamment son nom, sa description, son prix et le nombre minimum de personnes.

La page de détail fournit les informations complémentaires : composition, plats, allergènes, conditions de commande, temps de préparation et disponibilité.

---

## 7. Passer une commande

Pour commander, l'utilisateur doit être connecté.

1. Choisir un menu.
2. Cliquer sur le bouton de commande.
3. Sélectionner le nombre de personnes en respectant le minimum du menu.
4. Choisir la date et l'heure de livraison.
5. Vérifier ou compléter les informations de livraison.
6. Vérifier le détail du prix.
7. Confirmer la commande.

Les coordonnées connues du compte sont préremplies.

Les frais de livraison sont calculés selon l'adresse de livraison.

Une remise de 10 % sur le prix du menu est appliquée lorsque le nombre de personnes atteint cinq personnes de plus que le minimum prévu pour le menu.

Les conditions et délais de préparation du menu doivent être respectés.

Après validation, un e-mail de confirmation est envoyé au client.

---

## 8. Espace utilisateur et suivi des commandes

L'utilisateur connecté peut consulter ses commandes depuis son espace personnel.

Pour chaque commande, il peut notamment consulter :

- le menu commandé ;
- la date et l'heure prévues ;
- le montant ;
- le statut actuel ;
- l'historique des différents statuts.

Tant qu'une commande n'a pas encore été acceptée, l'utilisateur peut la modifier ou l'annuler.

Une fois acceptée, ces actions ne sont plus disponibles.

---

## 9. Avis client

Lorsqu'une commande est terminée, l'utilisateur peut déposer un avis comprenant :

- une note ;
- un commentaire.

L'avis est placé en attente de modération.

Après validation par un employé, il peut apparaître parmi les avis clients visibles sur le site.

---

## 10. Espace employé

Le compte employé permet d'accéder aux outils nécessaires à la gestion de l'activité.

### Gestion des menus

L'employé peut :

- ajouter un menu ;
- modifier un menu ;
- supprimer un menu ;
- gérer les plats ;
- renseigner les allergènes ;
- gérer les stocks et la disponibilité des menus.

### Gestion des commandes

L'employé peut :

- consulter les commandes ;
- filtrer les commandes ;
- rechercher les commandes d'un client ;
- modifier leur statut ;
- annuler une commande en renseignant le moyen de contact et le motif.

Lorsqu'une commande atteint le statut lié au retour de matériel, le client reçoit une information précisant le délai de 10 jours ouvrés et les frais de 600 € prévus en cas de non-restitution.

### Gestion des avis

L'employé peut consulter les avis en attente et les valider ou les refuser.

### Gestion des horaires

L'employé peut modifier les horaires d'ouverture utilisés par l'application.

---

## 11. Espace administrateur

Le compte administrateur permet d'accéder aux fonctions d'administration.

### Gestion des employés

L'administrateur peut :

- créer un compte employé ;
- consulter les employés ;
- désactiver un compte employé.

Lors de la création d'un employé, un e-mail d'information est envoyé sans communiquer le mot de passe dans le message.

### Statistiques

L'administrateur peut consulter les statistiques liées aux commandes et aux menus.

Les données statistiques utilisent également une base NoSQL MongoDB.

Des filtres permettent d'afficher les statistiques sur différentes périodes.

---

## 12. Déconnexion

Lorsqu'un utilisateur a terminé sa session, il peut utiliser la fonction de déconnexion afin de fermer sa session.

Pour les tests avec plusieurs rôles, il est recommandé de se déconnecter avant de se connecter avec un autre compte de démonstration.

## 13. Problèmes courants

### Mot de passe oublié

Depuis la page de connexion, utiliser le lien « Mot de passe oublié » et suivre les instructions reçues par e-mail.

### Commande impossible

Vérifier que :
- l'utilisateur est connecté ;
- le nombre de personnes respecte le minimum du menu ;
- la date et l'heure choisies sont disponibles ;
- les informations de livraison sont correctement renseignées.

### Avis non visible

Un avis déposé après une commande terminée doit être validé par un employé avant d'être affiché publiquement.

### Problème d'affichage

En cas de problème d'affichage, vérifier que le navigateur est à jour et actualiser la page.

---

## 14. Fin de session

Après utilisation de l'application, il est recommandé de se déconnecter afin de fermer correctement la session utilisateur.

Les comptes de démonstration sont réservés aux tests et à la présentation de l'application.