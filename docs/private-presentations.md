# Configuration des présentations privées

Ce guide explique comment configurer le déploiement des présentations privées/protégées sur Vercel sans les exposer dans le repo public.

## 📐 Architecture

- **Repo public** : `ShallowRed/nuxt-slides` (code source uniquement)
- **Repo privé** : `ShallowRed/nuxt-slides-content` (présentations sensibles)
- **Vercel** : Clone automatiquement le contenu privé au build

## 🚀 Setup

### 1. Créer le repo privé pour les présentations

```bash
# Créer un nouveau repo GitHub privé
gh repo create ShallowRed/nuxt-slides-content --private

# Initialiser la structure
mkdir -p nuxt-slides-content/presentations/{private,semi-private,draft}
cd nuxt-slides-content

# Copier vos présentations existantes
cp -r ../nuxt-slides/presentations/private/* presentations/private/
cp -r ../nuxt-slides/presentations/semi-private/* presentations/semi-private/
cp -r ../nuxt-slides/presentations/draft/* presentations/draft/

# Ajouter un .gitkeep pour garder la structure
touch presentations/private/.gitkeep
touch presentations/semi-private/.gitkeep
touch presentations/draft/.gitkeep

# Commit et push
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Créer un GitHub Personal Access Token

**Méthode rapide (classic token):**
1. Aller sur [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Créer un nouveau token (classic)
3. Nom : `Vercel Presentations Sync`
4. Scopes : cocher `repo` (Full control of private repositories)
5. Copier le token généré (vous ne pourrez plus le voir après)

**Méthode recommandée (fine-grained token):**
Pour une meilleure sécurité, utilisez un token à granularité fine limité uniquement au repository privé.
Voir le guide détaillé : [GITHUB-TOKEN-PERMISSIONS.md](./GITHUB-TOKEN-PERMISSIONS.md)

### 3. Configurer Vercel

Dans les **Environment Variables** de votre projet Vercel :

```
PRESENTATIONS_REPO=ShallowRed/nuxt-slides-content
PRESENTATIONS_REPO_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
PRESENTATIONS_BRANCH=main
PRESENTATIONS_FOLDERS=private,semi-private,draft
```

### 4. Mise à jour du .gitignore

Le `.gitignore` du repo public doit exclure les présentations sensibles :

```gitignore
# Sensitive presentations (keep structure but ignore content)
presentations/private/*
!presentations/private/.gitkeep
presentations/semi-private/*
!presentations/semi-private/.gitkeep
presentations/draft/*
!presentations/draft/.gitkeep
```

## 🔄 Workflow

### Développement local

Pour travailler avec les présentations privées en local :

```bash
# Option 1 : Clone manuel du contenu
git clone https://github.com/ShallowRed/nuxt-slides-content.git temp-content
cp -r temp-content/presentations/* presentations/
rm -rf temp-content

# Option 2 : Utiliser le script avec un token local
export PRESENTATIONS_REPO_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
pnpm prebuild
```

### Déploiement sur Vercel

Le workflow est automatique :

1. **Push** vers `main` du repo public
2. **Vercel** déclenche le build
3. **Script `prebuild`** clone automatiquement le contenu privé
4. **Build** génère le site avec toutes les présentations
5. **Deploy** inclut private/semi-private/draft

### Mise à jour des présentations

Pour mettre à jour les présentations privées :

```bash
# Dans le repo nuxt-slides-content
cd nuxt-slides-content
# Modifier vos présentations
git add presentations/
git commit -m "Update presentation X"
git push

# Redéployer sur Vercel (trigger un rebuild)
# Option 1 : Via l'interface Vercel (bouton Redeploy)
# Option 2 : Via un webhook ou l'API Vercel
```

## 🎯 Avantages de cette approche

✅ **Séparation claire** : Code public, contenu privé
✅ **Pas de submodules** : Plus simple à maintenir
✅ **Build automatique** : Script transparent
✅ **Sécurité** : Token GitHub avec accès limité
✅ **Flexibilité** : Facile de changer la structure

## 🔒 Sécurité

- Le token GitHub n'a accès qu'au repo privé (scope `repo`)
- Le token est stocké dans les secrets Vercel (jamais dans le code)
- Le repo privé peut avoir des accès encore plus restreints
- Les présentations ne sont jamais dans le repo public

## 🛠️ Troubleshooting

### Le build Vercel échoue

Vérifier que :
- Le token GitHub est bien configuré dans Vercel
- Le token a accès au repo privé
- Le nom du repo est correct (`owner/repo`)
- La branche existe dans le repo privé

### Les présentations ne sont pas synchronisées

Vérifier les logs de build Vercel :
- Rechercher `🔄 Fetching presentations`
- Vérifier s'il y a des erreurs de clone
- Confirmer que les dossiers existent dans le repo privé

### Différence entre local et production

C'est normal ! En local :
- Pas de token configuré = pas de sync automatique
- Vous gérez manuellement les présentations

En production (Vercel) :
- Token configuré = sync automatique au build
- Toutes les présentations sont disponibles

## 📝 Alternative : Garder tout local

Si vous ne voulez pas de repo séparé, vous pouvez aussi :

1. Garder les présentations en local uniquement
2. Les envoyer directement sur Vercel via le build
3. Utiliser des variables d'environnement pour les contenus sensibles

Mais cette approche est moins flexible et maintenable.
