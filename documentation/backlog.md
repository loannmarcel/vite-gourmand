# Documentation de gestion de projet

## Outil utilisé

La gestion du projet Vite & Gourmand est suivie avec **GitHub Projects**, directement associé au dépôt GitHub de l'application.

Lien vers le projet GitHub :

https://github.com/users/loannmarcel/projects/1/views/1

## Méthode utilisée

Le projet est organisé avec une méthode **Kanban**. Les grandes étapes du développement sont représentées par des issues GitHub intégrées au tableau de suivi.

Les tâches couvrent notamment :
- l'analyse du cahier des charges ;
- le maquettage et la charte graphique ;
- le développement front-end ;
- le développement back-end ;
- les bases de données MySQL et MongoDB ;
- la sécurité et l'accessibilité ;
- le déploiement ;
- les tests fonctionnels ;
- la documentation et les livrables ECF.

## Organisation des tâches

Chaque élément du tableau correspond à une issue du dépôt GitHub. Les tâches sont déplacées dans le tableau selon leur état d'avancement.

## Statuts utilisés

Le modèle Kanban de GitHub Projects utilise les statuts suivants :
- **Backlog** : tâche identifiée mais non commencée ;
- **Ready** : tâche prête à être traitée ;
- **In progress** : tâche en cours de réalisation ;
- **In review** : tâche terminée techniquement et en cours de vérification ;
- **Done** : tâche terminée et validée.

## Suivi du projet

Le tableau permet de visualiser l'avancement global du projet.

Les fonctionnalités principales développées et testées sont placées dans **Done**, tandis que les travaux de finalisation restent dans **In progress**.

Le dépôt Git est organisé autour des branches `main`, `development` et de branches `feature/*`. Les fonctionnalités sont développées sur une branche dédiée avant leur intégration dans `development`, puis dans `main` pour la mise en production.

## Justification

GitHub Projects a été choisi afin de centraliser le code source, les issues et le suivi du projet dans le même environnement.

La méthode Kanban permet de visualiser rapidement les tâches à réaliser, celles en cours et celles terminées, tout en conservant une trace de l'avancement du projet.