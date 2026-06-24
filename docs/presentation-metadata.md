# Métadonnées de présentation : statut & projet en frontmatter

> Note d'architecture — 2026-06-24. Décrit le passage du **statut de
> publication** (et l'ajout d'un axe **projet**) du chemin physique vers le
> **frontmatter** du stub `.md`, avec un registre `projects.yml` dédié.

## Contexte & motivation

Une présentation se range historiquement par **dossier d'accès** :
`presentations/<public|semi-private|private|draft>/<slug>.md`. Le dossier servait
à la fois de rangement **et** de source de vérité du statut de publication.

Deux limites :

1. **Un chemin ne porte qu'un axe.** On voulait trier les présentations par
   **projet** — un second axe. Le mettre aussi en dossier (`<projet>/<statut>/`)
   reproduit le problème et fige une arborescence rigide.
2. **Le dossier de statut n'est pas une frontière de sécurité.** Tout
   `presentations/` est bundlé/copié identiquement au build
   (`nuxt.config.ts` → `serverAssets`, hook `nitro:build:public-assets`).
   L'accès réel est décidé **à l'exécution** par `decideAccess`
   (`shared/access/decide.ts`, appelé par `server/utils/access.ts`). Le dossier
   ne fait que *fournir* la valeur `status` à cette décision : c'est une **donnée**,
   pas un rempart. Le champ `access:` existait d'ailleurs déjà — inutilisé — dans
   `DeckMetaSchema`.

Le précédent existe : l'axe **lifecycle** (`live | frozen | archived`, DDR-018)
a déjà quitté l'arborescence pour un registre (`registry.yml`).

## Décision

| Axe | Cardinalité | Avant | Après |
|-----|-------------|-------|-------|
| **Statut** (`public`/`semi-private`/`private`/`draft`) | mono-valué | dossier | frontmatter `status:` |
| **Projet** | mono-valué, exclusif | — | frontmatter `project:` + `projects.yml` |
| **Lifecycle** | mono-valué | `registry.yml` | inchangé |

Source de vérité = **frontmatter du stub**. L'arborescence redevient un simple
rangement (aplati). Liste/affichage des projets pilotés par un registre dédié.

### Cible

```
presentations/
  <slug>.md         # frontmatter: status, project, theme, accessPassword…
  registry.yml      # lifecycle + alias (inchangé, DDR-018)
  projects.yml      # NOUVEAU : slug → { title, order, color }
```

```yaml
# stub <slug>.md
---
title: "…"
status: semi-private     # remplace le dossier
project: portail-rse     # nouvel axe de tri
theme: dsfr
accessPassword: "…"
---
```

```yaml
# projects.yml
portail-rse:
  title: "Portail RSE"
  order: 1
  color: "#2563eb"
```

## Règle de sécurité — défaut fermé

`status` devient une donnée éditable dans le même fichier que le contenu. **Un
stub sans `status:` (ou avec une valeur invalide) doit être traité comme
`private` → `deny`**, jamais ouvert. C'est le seul vrai point de vigilance du
déplacement et il est couvert par un test dédié.

## Contrainte : `presentations/` est un sous-module git

`presentations/` est un **sous-module** (`.gitmodules` →
`ShallowRed/nuxt-slides-content`, privé). Conséquences :

- L'**aplatissement des fichiers** (migration) est un commit **dans le
  sous-module**, pas dans le repo principal.
- La doc `private-presentations.md` décrit un modèle deux-repos keyé sur les noms
  de dossiers (`.gitignore` par dossier). Après aplatissement, la séparation
  public/privé ne peut plus reposer sur le chemin — à réévaluer (le sous-module
  privé étant fetché en entier, la distinction passe par le statut frontmatter
  côté listing, déjà runtime-gated).

## Plan de migration

1. **Schéma & registre** (repo principal, non destructif) : `status`/`project`
   dans `DeckMetaSchema` ; `shared/projects/` + lecture `projects.yml`.
2. **Résolution** : `findPresentationBySlug` / `listAllPresentations` lisent le
   `status` du frontmatter ; prerender public + `routeRules /slides/public/**`
   recalculés depuis `status: public` (plus depuis le segment d'URL).
3. **Migration des fichiers** (sous-module) : aplatir + injecter
   `status:`/`project:`, commit mécanique isolé.
4. **Catalogue** : exposer `project`, grouper/filtrer par projet (libellé+couleur
   depuis `projects.yml`).
5. **Tests** : défaut-fermé, fixtures aplaties, vue catalogue par projet.

## Compatibilité

- `status` manquant → `private` (défaut fermé).
- `access:` (legacy frontmatter) : alias toléré de `status`, déprécié.
- `registry.yml` / `/p/<alias>` / frozen : inchangés ; la résolution d'alias et
  `readArchivedStub` ne dépendent pas du dossier d'accès.
