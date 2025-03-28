# ddd-training

## Anemic vs Rich Domain Model
Un modèle anémique est un modèle simple, avec des propriétés mais sans logique, nous n’avons pas de contrôle centralisé pour la création ou modification de nos modèles, cette logique se trouve dans d’autres couches.
Typiquement, nous retrouvons une classe avec des getters / setters sur tous les champs et on s’en contente.

Dans un modèle riche, on vient faire porter la logique par le modèle. Il n’est plus responsable d’exposer des getters / setters, mais plutôt des méthodes pour enrichir le modèle et apporter un contrôle à son niveau : `MyEntity.Create`, `MyEntity.addSomething`, ...

## Bounded Context - Ma métaphore
Un BC c’est comme une boulangerie.
Si tu rentres dans plusieurs boulangeries, tu vas retrouver des particularités dans le nommage de ce qui est proposé ! À première vue, on pourrait se dire que toutes proposent du pain et des viennoiseries, mais on a surtout un vocabulaire propre à chaque établissement.
Comme le petit-pain et la chocolatine, le roulé au raisin, le suisse…
La frontière de ce vocabulaire se situe à la porte de notre boulangerie.

## Value Object
Chaque objet que l’on manipule n’est pas une entité avec un besoin d’identité.
Autant il est préférable qu’un compte bancaire soit identifié par un numéro de compte, cette identité est nécessaire et restera la même dans le cycle de vie de notre logiciel.
Un point dans un dessin n’a pas ce besoin d’identité unique, c’est un Value Object.
Deux VO sont égaux si leurs propriétés le sont, on dit qu'un VO est défini par ses propriétés.
Un VO est immuable, on le crée puis on ne s’en occupe plus.
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
C’est une feature qui ne peut être portée par une entité unique.

À valider : j’ai l’impression qu’on retrouve la notion de use-case que l’on a en architecture en couches
