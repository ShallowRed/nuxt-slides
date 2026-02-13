# GitHub Token Permissions Guide

## Required Permissions

Pour que le script de synchronisation des présentations fonctionne, le GitHub Personal Access Token doit avoir les permissions suivantes :

### Scope requis : `repo`

✅ **`repo` - Full control of private repositories**

Ce scope inclut automatiquement :
- `repo:status` - Access commit status
- `repo_deployment` - Access deployment status
- `public_repo` - Access public repositories
- `repo:invite` - Access repository invitations
- `security_events` - Read and write security events

### Pourquoi ce scope ?

Le script `scripts/fetch-presentations.js` effectue les opérations suivantes :

```javascript
// 1. Clone du repository privé
git clone https://github.com/owner/private-repo.git

// 2. Lecture des fichiers
cp -r private-repo/presentations/* presentations/
```

Ces opérations nécessitent :
- ✅ **Read access** au repository privé
- ✅ **Contents read** pour lire les fichiers

### ⚠️ Limitation GitHub

GitHub ne propose pas de scope plus granulaire pour les repositories privés.

Options disponibles :
- ❌ `public_repo` - Uniquement les repos publics (insuffisant)
- ✅ `repo` - Tous les repos privés (requis)

Pour accéder à un repository privé, même en lecture seule, le scope `repo` complet est obligatoire.

## 🔐 Meilleures pratiques de sécurité

### 1. Token dédié

Créez un token spécifiquement pour Vercel :
- **Nom** : `Vercel Presentations Sync`
- **Description** : Token for syncing private presentations during Vercel builds
- **Scope** : `repo` uniquement
- **Expiration** : 90 jours (renouvelable)

### 2. Permissions minimales

Bien que le scope `repo` donne accès à tous vos repositories privés, vous pouvez limiter l'impact :

**Option A : Utiliser un compte GitHub dédié** (Recommandé pour production)
```bash
# Créer un compte GitHub "deployer" ou "bot"
# Donner accès UNIQUEMENT au repo nuxt-slides-content
# Créer le token sur ce compte
```

**Option B : Fine-grained Personal Access Token** (Beta)

GitHub propose maintenant des tokens à granularité fine :

1. Aller sur : https://github.com/settings/personal-access-tokens/new
2. Type : **Fine-grained token**
3. Repository access : **Only select repositories**
   - Sélectionner uniquement : `nuxt-slides-content`
4. Repository permissions :
   - **Contents** : `Read-only` ✅
5. Generate token

**Avantages** :
- ✅ Accès limité à un seul repository
- ✅ Permissions granulaires (read-only contents)
- ✅ Plus sécurisé

**Inconvénients** :
- ⚠️ Feature en beta
- ⚠️ Peut nécessiter l'activation par l'organisation

### 3. Rotation régulière

```bash
# Recommandation : Renouveler tous les 90 jours
# Ajouter une alerte calendrier :
# "Renouveler token GitHub Vercel"
```

### 4. Storage sécurisé

**Stockage** :
- ✅ Vercel Environment Variables (encrypted)
- ✅ Password manager (1Password, Bitwarden)
- ❌ Jamais dans le code
- ❌ Jamais dans les logs
- ❌ Jamais dans la documentation partagée

## 📝 Étapes détaillées

### Option 1 : Classic Personal Access Token

1. **Accéder à la page de création**
   - URL : https://github.com/settings/tokens/new
   - Ou : Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Configurer le token**
   ```
   Note: Vercel Presentations Sync
   Expiration: 90 days
   Select scopes:
     ☑️ repo
       ☑️ repo:status
       ☑️ repo_deployment
       ☑️ public_repo
       ☑️ repo:invite
       ☑️ security_events
   ```

3. **Générer et copier**
   - Click "Generate token"
   - **⚠️ Copier immédiatement** (ne sera plus visible)
   - Format : `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Option 2 : Fine-grained Token (Recommandé)

1. **Accéder à la page de création**
   - URL : https://github.com/settings/personal-access-tokens/new
   - Ou : Settings → Developer settings → Personal access tokens → Fine-grained tokens

2. **Configurer le token**
   ```
   Token name: Vercel Presentations Sync
   Expiration: 90 days
   Description: Read-only access to nuxt-slides-content for Vercel builds

   Repository access:
     ⦿ Only select repositories
       → nuxt-slides-content ✅

   Permissions:
     Repository permissions:
       Contents: Read-only ✅
   ```

3. **Générer et copier**
   - Click "Generate token"
   - **⚠️ Copier immédiatement**
   - Format : `github_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 🔍 Vérification des permissions

### Test local

```bash
# Set token
export PRESENTATIONS_REPO_TOKEN=ghp_xxxxx

# Test read access
git clone https://oauth2:${PRESENTATIONS_REPO_TOKEN}@github.com/owner/private-repo.git test-clone

# Si succès → token fonctionne ✅
# Si erreur → vérifier les permissions ❌

# Cleanup
rm -rf test-clone
```

### Test avec le script

```bash
export PRESENTATIONS_REPO=owner/private-repo
export PRESENTATIONS_REPO_TOKEN=ghp_xxxxx

node scripts/fetch-presentations.js
```

**Output attendu** :
```
🔄 Fetching presentations from private repository...
📥 Cloning owner/private-repo...
✅ Synced presentations/private
✅ Synced presentations/semi-private
✅ Synced presentations/draft
✨ Successfully fetched all presentations!
```

## ⚠️ Troubleshooting

### Erreur : "Authentication failed"

**Cause** : Token invalide ou permissions insuffisantes

**Solutions** :
1. Vérifier que le token n'a pas expiré
2. Vérifier que le scope `repo` est activé
3. Pour fine-grained token : vérifier que le repository est sélectionné
4. Vérifier que le token n'a pas été révoqué

### Erreur : "Repository not found"

**Cause** : Token n'a pas accès au repository

**Solutions** :
1. Vérifier que le repository existe
2. Le token doit appartenir à un compte ayant accès au repo privé
3. Pour organisation : vérifier que les SSO restrictions sont respectées

### Erreur : "Could not read from remote repository"

**Cause** : Token n'a pas les permissions de lecture

**Solutions** :
1. Classic token : vérifier que `repo` est coché
2. Fine-grained token : vérifier que `Contents: Read` est activé

## 📊 Comparaison des options

| Critère | Classic Token (`repo`) | Fine-grained Token |
|---------|----------------------|-------------------|
| **Sécurité** | ⚠️ Accès à tous repos privés | ✅ Accès par repository |
| **Granularité** | ❌ Scope large | ✅ Permissions précises |
| **Simplicité** | ✅ Setup simple | ⚠️ Plus de configuration |
| **Disponibilité** | ✅ Stable | ⚠️ Beta |
| **Support CI/CD** | ✅ Compatible partout | ✅ Compatible partout |
| **Recommandation** | OK pour usage personnel | ✅ Recommandé pour production |

## 🎯 Recommandation finale

### Pour développement/test
→ **Classic token** avec scope `repo`

### Pour production
→ **Fine-grained token** limité au repository spécifique

### Pour organisation
→ **Service account** + **Fine-grained token** + **SSO**

## 📚 Ressources

- [GitHub Token Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Fine-grained tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token)
- [Token security best practices](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-security-best-practices)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## ✅ Checklist

Avant de créer le token :
- [ ] Décider entre classic ou fine-grained
- [ ] Préparer un nom descriptif
- [ ] Avoir un password manager prêt pour stocker le token
- [ ] Connaître le nom exact du repository privé

Après création :
- [ ] Token copié dans password manager
- [ ] Token ajouté aux env vars Vercel
- [ ] Token testé localement
- [ ] Date d'expiration notée
- [ ] Rappel de rotation configuré
