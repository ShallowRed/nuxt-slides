---
title: "Example Presentation - DSFR Theme"
lang: fr
theme: dsfr
backgrounds:
  h1: "/backgrounds/as-title.png"
  h2: "/backgrounds/as-section.png"
  default: "/backgrounds/as-content.png"
reveal:
  slideNumber: true
  width: 1200
  height: 800
---

# Bienvenue sur Nuxt Slides

Un framework de présentation avec Nuxt + Reveal.js

## Fonctionnalités

### Ce que vous pouvez faire

::TwoColumns

#### Contenu
- **Slides en Markdown** avec syntaxe MDC
- **Plusieurs thèmes** (DSFR, minimal)
- **Arrière-plans personnalisés** par niveau de titre
- **Coloration syntaxique** avec Shiki

#### Layouts
- Colonnes (2 ou 3)
- Callouts et alertes
- Lightbox pour images
- Et bien plus...
::

### Exemple de code

```javascript
// Configurez votre présentation dans le frontmatter
const config = {
  theme: 'dsfr',
  transition: 'slide',
  slideNumber: true
}
```

## Démarrage

### Installation

1. Clonez ce dépôt
2. Exécutez `pnpm install`
3. Créez votre présentation dans `presentations/public/`
4. Lancez `pnpm dev`

### Structure des dossiers

| Dossier | Usage | Accès |
|---------|-------|-------|
| `public/` | Présentations publiques | Tout le monde |
| `semi-private/` | Protégées par mot de passe | Avec mot de passe |
| `private/` | Auth GitHub requise | Utilisateurs authentifiés |
| `draft/` | En cours de travail | Mode dev uniquement |

## Merci !

:icon{name="ri-heart-line"} Construit avec Nuxt, Reveal.js et MDC

Voir aussi : **example-minimal** pour découvrir un autre thème
