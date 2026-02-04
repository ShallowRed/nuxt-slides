---
title: "Mutualisation des simulateurs d'aides publiques"
lang: fr
theme: dsfr
backgrounds:
  h1: "/backgrounds/as-title.png"
  h2: "/backgrounds/as-section.png"
  default: "/backgrounds/as-content.png"
reveal:
  slideNumber: false
  width: 1200
  height: 800
---

# Simulateurs d'aides publics, opportunités de mutualisation

Journée de travail collective - 8 décembre 2025

## *Contexte* de la réflexion

### *Pourquoi* cette journée ?

::TwoColumns

#### :icon{name="ri-emotion-unhappy-line"}
- **Mise en sommeil probable d'aides simplifiées** : Opportunité de prendre du recul et capitaliser
- **Contexte budgétaire 2026** : Il va falloir composer avec moins de moyens
- **Retours terrain convergents** : Des difficultés similaires remontées

#### :icon{name="ri-emotion-happy-line"}
- **Maturité de l'écosystème des simulateurs publics** : Patterns communs et enseignements identifiables
- **Opportunité technologique** : Des solutions émergentes, maturité des approches open source, IA
- **Traction  européenne** : Suite de l'événement "Rules as Code Europe" en 2024, intérêt croissant pour les "Personal Regulation Assistants (PRA)" dans plusieurs pays
::

### *Objectifs* de la journée

::ThreeColumns{size="md"}
#### :i{name="ri-shake-hands-line"} Se connaître
Qui fait quoi dans l'écosystème, avec quelles approches, quels outils ?

#### :i{name="ri-discuss-line"} Partager
Quelles difficultés et réussites pourrions nous partager ?

#### :i{name="ri-lightbulb-line"} Identifier
Y a-t-il des briques qui gagneraient à être partagées/documentées/mutualisées ?
::

### *Programme* de la journée

::TwoColumns{size="lg"}
#### Le matin (10h - 12h)
- **10h00** : Contexte & objectifs *(15mn)*
- **10h15** : Panorama de l'écosystème, présentation d'aides simplifiées *(30mn)*
- **10h45** : Tour de table des équipes *(45mn)*
- **11h30** : Préparation de l'atelier de l'après-midi, relevé des irritants *(30mn)*

#### L'après-midi (14h - 16h)
- **14h00** : Début de l'atelier cycle de vie en plénière *(15mn)*
- **14h15** : Ateliers en sous-groupes *(1h15)*
- **15h30** : Restitution & plans d'action *(30mn)*
- **16h00** : Clôture
::

## *Panorama* de l'écosystème

### *Cartographie* des simulateurs d'aides publiques

::Lightbox{src="/panorama-ecosysteme-simulateurs.svg" alt="Architecture système" width="100%"}
::

### Des clusters technologiques autour des *moteurs de règles*

::ThreeColumns{size="sm"}
#### Publicodes
**Projets** : mon-entreprise, mes-aides-reno, nosgestesclimat, transition-widget

- Syntaxe YAML lisible
- Calcul côté client (JS)
- Écosystème npm
- Contribution non-dev facilitée

#### OpenFisca
**Projets** : aides-jeunes, estime, leximpact, mes-ressources-formation

- Python côté serveur
- Gestion fine d'entités (foyer, ménage)
- Modélisation socio-fiscale
- API REST

#### Et les autres approches

- **envergo** : Moulinette Python (règles environnementales)
- **a-just** : TypeScript custom (algorithmes justice)
- **aides-agri** : Django + ORM (catalogue sans calcul)
- **pacoupa** : SQLite + Zod (recommandation par lookup)
::

### Plusieurs *patterns* architecturaux identifiés

::ThreeColumns
#### Définition formulaire
- YAML/JSON déclaratif
- Généré depuis règles Publicodes
- Codé en dur TypeScript

#### Localisation calcul
- Client (navigateur)
- Serveur (API)

#### Mapping données
- Direct
- Formatters
- Builders
::

###

::SplitSlide{src="https://docs.aides.beta.gouv.fr" type="iframe" height="1200" title="Documentation patterns simulateurs" lightbox}
#### Pour aller *plus loin*

Une première documentation sur :
- Méthodologies de conception
- Panorama des stacks techniques
- Patterns architecturaux existant
- Outils open source disponibles

::

## Présentation d'*aides simplifiées*

###

::SplitSlide{src="https://aides.beta.numerique.gouv.fr" type="iframe" title="Aides simplifiées" lightbox}
#### La bonne aide, au bon moment, au bon endroit

Des simulateurs en marque blanche, construits autour de paniers d'aides, thématisés par "moment de vie" :
- Déménagement pour les étudiants
- Dispositifs d'aide à l'innovation pour les entreprises
- Tarification sociale des transports
::

### Ressources *mutualisables*

::ThreeColumns
#### :icon{name="ri-book-mark-line"} Méthodologiques
- **Approche générique par moment de vie** : logement, mobilité, innovation...
- **Diagrammes et schémas** : recherches et outils de représentation des formulaires, des flux et des règles.
- **IA** : Structurations d'un jeu de données sur la tarification sociale des transports à partir de le scapping et d'IA

#### :icon{name="ri-code-line"} Techniques
- **@betagouv/survey-schema** : schéma de questionnaire JSON découplé du moteur (Publicodes OU OpenFisca)
- **Cas de tests partagés** : format JSON cross-stack avec validation experte traçable
- **Intégration Démarches-Simplifiées** : préremplissage automatique des dossiers
- **POC FranceConnect** : récupération automatique de données usager
::

### *Difficultés* rencontrées

::ThreeColumns
#### :icon{name="ri-line-chart-line"} Courbe d'apprentissage
- Équipes produit et métier à (re)former au Rules as Code
- Peu de ressources méthodos à disposition

#### :icon{name="ri-tools-line"} Outillage conséquent
- Nombreux outils à (re)construire pour concevoir et fiabiliser des simulateurs génériques
- Tensions entre agilité et robustesse/

#### :icon{name="ri-shield-line"} Inspirer la confiance
En particulier avec nos partenaires sur des paniers multi-aides, sans liens forts avec les services instructeurs
::

## Les *défis* que nous avons identifiés

### :i{name="ri:discuss-line"} Faire *dialoguer* les métiers

::TwoColumns
#### Le problème
Un simulateur implique de nombreux acteurs autour d'objets complexes et de nature variés : juristes, développeurs, mais aussi product owners, designers, rédacteurs web, partenaires institutionnels, services instructeurs, etc.

#### Ce qu'on observe
- Compromis difficiles à trouver entre parcours fluide (PO, design) et rigueur des calculs (juristes, devs)
- Objets complexes à manipuler et représenter lors de la conception
::

### :i{name="ri:shield-check-line"} Garantir et maintenir la *conformité*

::TwoColumns
#### Le problème
Comment s'assurer que les calculs sont corrects ?
Et qu'ils le restent quand la réglementation évolue ou que le code change ?

#### Ce qu'on observe
- Tests insuffisants ou non représentatifs des cas réels
- Régressions silencieuses
- Difficile de garantir les calculs et d'en prendre la responsabilité
- Difficile de prouver la conformité aux partenaires institutionnels
::

### :i{name="ri:archive-line"} *Capitaliser* et ne pas réinventer

::TwoColumns

#### Le problème
Chaque équipe redécouvre les mêmes problématiques et doit reconstruire ses outils en bénéficiant peu de l'expérience des autres.

#### Ce qu'on observe
- Perte d'agilité et d'impact due à la réinvention constante
- Temps perdu à explorer des solutions déjà trouvées ailleurs
- Pas de documentation partagée des patterns, pièges courants, bonnes pratiques
::

## Tour de table

### Votre projet
*(10mn de préparation + 5mn de présentation par équipe)*

::ThreeColumns{size="sm"}
#### Présentez votre projet
- **Domaine** : Quel est votre produit ? Le service public que vous rendez ? Quelles aides ou dispositifs simulez-vous ?
- **Stack technique** : Frontend, backend, moteur de règles
- **Architecture** : Où vivent vos règles ? Calcul client ou serveur ? Comment sont définis vos formulaires ?

#### Vos retours d'expérience
- **Collaboration métier/produit/dev** : Comment organisez-vous le travail entre ces différents rôles ?
- **Validation des règles** : Comment garantissez-vous la conformité des calculs ?
- **Capitalisation** : Avez-vous documenté vos apprentissages ? Réutilisez-vous des briques existantes ?

#### Mais aussi...

##### Vos réussites

##### Les principaux défis rencontrés

##### Ce que vous aimeriez mutualiser ou voir mutualisé ?
::

## Atelier cycle de vie

### Le cycle de vie d'un simulateur
*Relevé collectif des irritants (15mn)*

::Image{src="/cycle-vie-simulateurs.png" alt="Cycle de vie d'un simulateur" width="100%"}
::

### Définition des thématiques d'atelier

*À partir des irritants relevés, définissont les thématiques prioritaires pour les sous-groupes (15mn)*

::TwoColumns
#### Thématiques pré-identifiées
- **A.** Conception partagée
- **B.** Tests & conformité
- **C.** Capitalisation & documentation

#### Thématiques émergentes
- **D.** ...
- **E.** ...
::

### Travail en sous-groupes
*(45mn)*

::ThreeColumns{size="sm"}
#### :i{name="ri:discuss-line"} Groupe A : Conception partagée
**Le défi :** Comment dialoguer entre métiers et partenaires pour construire ensemble des parcours justes et compréhensibles ?

#### :i{name="ri:shield-check-line"} Groupe B : Tests & conformité

**Le défi :** Comment prouver que ça marche, garantir et maintenir la conformité dans le temps ?

#### :i{name="ri:archive-line"} Groupe C : Capitalisation
**Le défi** : Comment partager nos apprentissages et moins réinventer la roue ?

::

### Consignes pour les groupes

::TwoColumns
#### Pour vous guider
- **Problème** : Reformulez le problème tel que vous le vivez
- **Existant** : Comment faites-vous aujourd'hui ?
- **Idéal** : À quoi ressembleraient les choses dans un monde parfait ?
- **Quick win** : Que pourrait-on faire en 3 mois ?

####
::

## Mise en commun

### Restitution des groupes

*10mn par groupe*

::ThreeColumns{size="sm"}
#### Format de restitution possible
- Le problème tel qu'on le vit
- Ce qui existe déjà
- 2-3 pistes de mutualisation concrètes
- 1 quick win à 3 mois
::
