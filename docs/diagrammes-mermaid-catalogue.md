# Propositions de Diagrammes (Mermaid) pour le Catalogue de Règles

Ce document rassemble les propositions de schémas conceptuels (générés via Mermaid.js) destinés à rythmer, "aérer" et clarifier les fondations de la présentation `restitution-catalogue.md`.

Toutes les étiquettes et nœuds ont été rigoureusement échappés pour garantir une compatibilité parfaite avec les moteurs de rendu Markdown/Mermaid stricts.

---

## 1. L'écologie d'artefacts (De la Loi jusqu'à l'Usager)
**Emplacement recommandé** : Section "L'enjeu de politique publique" ou "Les défis posés par la gestion informatique des règles"

```mermaid
flowchart LR
    subgraph Droit ["Monde du Droit (Juristes)"]
        Loi["Textes de Lois<br/>Décrets"]
        Ontologies["Concepts métiers<br/>& Définitions"]
    end

    subgraph Code ["Monde du Code (Dév/Data)"]
        Modeles["Modélisations<br/>Algorithmes"]
        Tests["Scénarios de tests<br/>Validation"]
    end

    subgraph Usager ["Monde de l'Usager (Designers)"]
        UI["Simulateurs<br/>Formulaires"]
    end

    Loi -->|"Interprétation"| Ontologies
    Ontologies -->|"Formalisation"| Modeles
    Modeles -->|"Exécution"| UI
    Modeles -.->|"Validation"| Tests
    Tests -.->|"Conformité"| Loi

    classDef droit fill:#f9f0ff,stroke:#000091,color:#161616;
    classDef code fill:#e3e3fd,stroke:#000091,color:#161616;
    classDef usager fill:#cacafb,stroke:#000091,color:#161616;
    class Loi,Ontologies droit;
    class Modeles,Tests code;
    class UI usager;
```

---

## 2. La Timeline des 4 Accélérateurs (L'alignement des planètes)
**Emplacement recommandé** : Section "Ce qui a changé"

```mermaid
timeline
    title Les 4 accélérateurs de la réglementation opérable
    section 1. Technique
        Moteurs matures : Publicodes, OpenFisca, Catala
    section 2. Institutionnel
        DINUM CTO : Infrastructures et APIs partagées
    section 3. Produit
        Besoins d'échelle : Accès massif via AMI
    section 4. Européen
        Rules as Code Europe : GovTech4All et CPRMV
```

---

## 3. Le Registre comme "Tiers de Confiance"
**Emplacement recommandé** : Section "La proposition de valeur"

```mermaid
graph TD
    subgraph Emetteurs ["Administrations Produisant les Règles"]
        A1["DGFIP"]
        A2["Urssaf"]
        A3["Min. Sociaux"]
    end

    Registry(("<b>Le Catalogue</b><br/>Registre de Métadonnées<br/><i>Traçabilité & Découvrabilité</i>"))

    subgraph Consommateurs ["Services Consommant les Règles"]
        C1["Portails Usagers<br/><i>ex: AMI, Mes-Aides</i>"]
        C2["Travailleurs Sociaux<br/><i>ex: Fiches d'explicabilité</i>"]
        C3["Agents Publics<br/><i>ex: Outils de conformité</i>"]
    end

    A1 -->|"Déclare ses modèles"| Registry
    A2 -->|"Déclare ses modèles"| Registry
    A3 -->|"Déclare ses modèles"| Registry

    Registry -->|"API de Calcul & Doc"| C1
    Registry -->|"API de Calcul & Doc"| C2
    Registry -->|"API de Calcul & Doc"| C3

    style Registry fill:#000091,stroke:#000091,color:#fff
```

---

## 4. L'Architecture Cible en Couches ("Layered Cake")
**Emplacement recommandé** : Section "L'architecture du système" ou "Du socle technique aux services"

```mermaid
flowchart TD
    subgraph SRV ["3. Les Services (Activateurs de Valeur)"]
        direction LR
        S1["APIs d'exécution d'interface"]
        S2["Génération DOC juridique"]
        S3["Preuves & Explicabilité (CRPA)"]
    end

    subgraph FCT ["2. Les Fonctionnalités (Standards & Indexation)"]
        direction LR
        F1["Indexation (Qui, Quoi, Comment)"]
        F2["Interopérabilité (Schémas data)"]
        F3["Métriques d'impact & Usage"]
    end

    subgraph SOC ["1. Le Socle Technique (L'Infrastructure)"]
        direction LR
        ST1["Fédération de dépôts Git"]
        ST2["Intégration Continue (CI/CD)"]
        ST3["Hébergement API unifié"]
    end

    SRV ~~~ FCT
    FCT ~~~ SOC

    classDef services fill:#e3e3fd,stroke:#000091,color:#161616;
    classDef fonct fill:#cacafb,stroke:#000091,color:#161616;
    classDef socle fill:#000091,stroke:#000091,color:#fff;

    class SRV,S1,S2,S3 services;
    class FCT,F1,F2,F3 fonct;
    class SOC,ST1,ST2,ST3 socle;
```

---

## 5. Le "Périmètre Pragmatique" (L'entonnoir de la Loi au Calculable)
**Emplacement recommandé** : Pour expliciter le périmètre exact.

```mermaid
flowchart TD
    A[/"<b>Le Droit applicable dans son entièreté</b><br/>Textes, jurisprudence..."/] --> B
    B[/"<b>Les Dispositifs & Aides</b><br/>Prestations donnant droit à subvention"/] --> C
    C[/"<b>Les Règles Métiers</b><br/>Droit avec calcul ET décision humaine"/] --> D
    D[\"<b>Les Modélisations Algorithmiques</b><br/>Périmètre du Catalogue : automatisme strict"/]

    style D fill:#000091,stroke:#000091,color:#fff,stroke-width:2px
    style A fill:#f9f0ff
    style B fill:#e3e3fd
    style C fill:#cacafb
```

---

## 6. La Chaîne de Valeur Complète (Cœur technique vers Usages externes)
**Emplacement recommandé** : En amont de la section "Quelques cas d'usages porteurs".

```mermaid
flowchart LR
    subgraph S ["1. Le Socle Technique"]
        Git[("Dépôts Git")]
        CI["CI/CD Tests"]
    end

    subgraph F ["2. Le Catalogue (Fonctionnalités)"]
        Index(("Indexation<br/>Centralisée"))
    end

    subgraph SRV ["3. Les Services"]
        API_Calc["API d'exécution"]
        Doc["Générateur CRPA/Doc"]
    end

    subgraph CU ["4. Les Cas d'usages (Destinataires)"]
        AMI(["App. Mobile (AMI)<br/><i>Citoyens</i>"])
        Agents(["Fiches explicabilité<br/><i>Travailleurs Sociaux</i>"])
    end

    Git & CI --> Index
    Index -->|"Déploie et audite"| API_Calc & Doc
    API_Calc --> AMI
    Doc --> Agents

    classDef socle fill:#f9f0ff,stroke:#000091,color:#161616;
    classDef fonct fill:#e3e3fd,stroke:#000091,color:#161616;
    classDef serv fill:#cacafb,stroke:#000091,color:#161616;
    classDef capa fill:#000091,stroke:#000091,color:#fff;

    class S socle; class F fonct; class SRV serv; class CU capa;
```

---

## 7. La Granularité de l'Information Indexée
**Emplacement recommandé** : Explications de la "fiche" d'une règle dans le catalogue.

```mermaid
mindmap
  root(("Catalogue<br/>de Règles"))
    ("Politique Publique")
      ("Dispositif ou Aide")
        ("Règles d'éligibilité")
          ("Paramètres de calcul")
          ("Arbre de décision")
    ("Domaine Juridique")
      ("Droit du Salarié")
        ("...")
```

---

## 8. Les 3 Cercles de Diffusion (Destinataires)
**Emplacement recommandé** : Section "Des fonctionnalités aux services" ou "Cas d'usages".

```mermaid
flowchart LR
    Cat(("<b>Catalogue de Règles</b><br/>Tiers de confiance<br/>intra-gouvernemental"))

    subgraph C1 ["Cercle 1 : Le cœur de l'État (Usage direct)"]
        AMI["App Mobile. (AMI)"]
        FranceConnect["FranceConnect / API Particulier"]
    end

    subgraph C2 ["Cercle 2 : Partenaires métiers (Standardisation)"]
        CAF["Urssaf / CAF"]
        Guichets["Espaces France Services / CCAS"]
    end

    subgraph C3 ["Cercle 3 : Société Civile (Open Data & Recherche)"]
        Civic["Entreprises / Startups d'État"]
        Recherche["Chercheurs / Observatoires publics"]
    end

    Cat ==>|"APIs robustes<br/>& Confiance forte"| C1
    C1 -.->|"Outils de terrain"| C2
    C2 -.->|"Accès libre"| C3

    style Cat fill:#000091,stroke:#000091,color:#fff
    style C1 fill:#e3e3fd,stroke:#000091,color:#161616
    style C2 fill:#f0f8ff,stroke:#000091,stroke-dasharray: 5 5,color:#161616
    style C3 fill:#fff,stroke:#000091,stroke-dasharray: 2 2,color:#161616
```

---

## 9. Montée en Puissance : Les Niveaux de Maturité
**Emplacement recommandé** : Section "Notre vision à 6 mois" / "Une vision ambitieuse à 3 ans"

```mermaid
journey
    title Ambition 2024-2027 : Devoir de Transparence vers Hub d'Exécution
    section "Niveau 1 (Découvrabilité)"
      "Indexation passive des modèles existants": 5: Catalogue
      "Vue Bêta du registre public des règles": 4: Public
    section "Niveau 2 (Confiance)"
      "Génération automatique de doc juridique": 4: Services
      "Certificats de conformité (CI/CD)": 6: Socle
    section "Niveau 3 (Consommation active)"
      "Hub API Plug-and-play massifiée": 7: Écosystème
      "Outillage d'édition No-Code pour Juristes": 3: Stratégie Long-Terme
```
