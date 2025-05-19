# ddd-training

## Anemic vs Rich Domain Model

Un modèle anémique est un modèle simple, avec des propriétés mais sans logique, nous n’avons pas de contrôle centralisé pour la création ou modification de nos modèles, cette logique se trouve dans d’autres couches.
Typiquement, nous retrouvons une classe avec des getters / setters sur tous les champs et on s’en contente.

Dans un modèle riche, on vient faire porter la logique par le modèle. Il n’est plus responsable d’exposer des getters / setters, mais plutôt des méthodes pour enrichir le modèle et apporter un contrôle à son niveau : `MyEntity.Create`, `MyEntity.addSomething`, ...

## Bounded Context - Ma métaphore

Si on prend une longue course en montagne, on pourrait modéliser la course selon plusieurs point de vue :

- Pour le coureur, une course sera modélisée par une fréquence cardiaque moyenne, un dénivelé, un kilométrage, un chrono réalisé, un numéro de dossard...
- Pour l'organisateur, la course sera modélisée par un ensemble de ravitaillements, un ensemble de participants, des barrières horaires...
- Et pour l'équipe de suivi, la course sera modélisée par des points GPS et des numéros de balises correspondant aux coureurs

Chacun de ces points de vues sont des BC.

Ils n'attendent pas la même chose dans une course, ne parlent pas le même language pour définir leur course, et communiquent entre eux : le coureur à besoin que l'orga lui partage les emplacement des ravitos, l'équipe de suivi informe l'orga si un coureur prend un mauvais chemin...

## Value Object

Chaque objet que l’on manipule n’est pas une entité avec un besoin d’identité.

Autant il est préférable qu’un compte bancaire soit identifié par un numéro de compte, cette identité est nécessaire et restera la même dans le cycle de vie de notre logiciel.

Un point dans un dessin n’a pas ce besoin d’identité unique, c’est un Value Object.

On considère que :

- Deux VO sont égaux si leurs propriétés le sont, on dit qu'un VO est défini par ses propriétés.
- Un VO est immuable, on le crée puis on ne s’en occupe plus.
- Un VO s'assure qu'on respecte les règles du domaine (la propriété `name` doit être < 200 chars par exemple).

Exemple : une adresse, un point, une quantité, une mesure…

## Aggregate

Un Agrégat est un groupe d’objets associés qui sont considérés comme un tout unique.

Chaque Agrégat a une racine.

La racine est une Entité (Aggregate Root), et c’est le seul objet accessible de l’extérieur.

La racine peut posséder des références vers n’importe quel objet de l’agrégat, et les autres objets peuvent se référencer entre eux, mais un objet externe peut seulement avoir une référence vers l’objet racine.

À l’intérieur d’un agrégat, tout doit être cohérent avec les règles business. (mot clef: transactional consistency)

Si d’autres aggrégats doivent être mis à jour en réaction, on utilise l’eventual consistency

D’autres agrégats peuvent être référencés par leur ID.

Exemple : “ProductAggregate” qui englobe l’entité Product et d’autres entités / value object…

## Domain Event

Ce sont des évènements lancé depuis les agrégats ou les entités, pour informer les autres acteurs d’un événement important (jugé important par les experts domaines)

On nomme les Domain Event en indiquant que “ça s’est passé”. (similaire à la manière de penser une action avec Redux)

Exemple : PaymentCompleted, SubscriptionStarted…

Ces événements sont envoyés de préférence sur un bus de messages.

## Domain Service

Un DS implémente la logique business qui ne pourrait pas tenir dans une entité ou un VO parce-que plus complexe.

Par exemple, une feature transaction de fonds entre comptes d’une application bancaire.

C’est une feature qui ne peut être portée par une entité unique car elle implique plusieurs entités, de même type ou de types différents.

On cherche alors à extraire cette logique dans un DS.

À valider : j’ai l’impression qu’on retrouve la notion de use-case que l’on a en architecture en couches

## Published Language

Rien qui ait un rapport avec le langage (TypeScript), on veut ici du contrat partagé : OpenAPI par exemple

## Shared Kernel

On y place des "utilitaires" ou des VO / Entity communs entre plusieurs BC, ici on peut organiser en différents dossiers (events, infrastructure...)
