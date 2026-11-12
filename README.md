# Portfolio — Eva Desboeufs

Site statique (HTML + CSS + un peu de JavaScript, sans outil de build), publié avec GitHub Pages sur `https://eva-desboeufs.github.io`.

## Organisation

```
index.html                 Accueil en français
en/index.html              Accueil en anglais
projets/<projet>/          Pages projet en français (looma, elixius, odyssea)
en/projects/<projet>/      Pages projet en anglais
assets/css/style.css       Toute la mise en forme (couleurs et polices en haut du fichier)
assets/js/main.js          Choix de la langue + apparition des images au défilement
assets/img/                Images optimisées (version 1600 px + version "-800" pour mobile)
```

## Modifier un texte

1. Ouvrir la page concernée (par ex. `index.html` pour l'accueil FR).
2. Modifier le texte entre les balises.
3. **Faire la même modification dans la version anglaise** (`en/...`) : les deux langues doivent rester complètes.

## Ajouter un projet

1. Préparer les images (JPG, environ 1600 px de large, moins de 300 Ko) nommées `projet-etape.jpg`, par ex. `nova-moodboard.jpg`, plus une version `nova-moodboard-800.jpg`.
2. Les placer dans `assets/img/`.
3. Copier le dossier `projets/looma/` en `projets/nova/` et `en/projects/looma/` en `en/projects/nova/`.
4. Remplacer textes, images, textes alternatifs (FR et EN) et la couleur `--project` en haut de la page.
5. Mettre à jour le lien FR/EN de chaque page (il doit pointer vers la même page dans l'autre langue).
6. Ajouter une carte du projet sur les deux accueils.

## Coordonnées (fenêtre « Me contacter »)

E-mail, téléphone et LinkedIn se modifient à un seul endroit : l'objet `CONTACT` en haut de `assets/js/main.js`.
Le numéro y est découpé en morceaux pour ne pas apparaître en clair dans le code (protection contre les robots).

## Règles

- Ne jamais publier l'adresse postale. Le téléphone n'apparaît que dans la fenêtre de contact.
- Ne pas déposer de fichier lourd (PDF du portfolio, vidéos) : seulement des images optimisées.
- Un changement par commit, message en français.

## Reste à faire

- [ ] Durée, date de début et pays du stage recherché (accroche).
- [ ] CV en PDF, FR et EN, dans `assets/cv/` (liens prêts en commentaire dans les accueils).
- [ ] LinkedIn / Behance si Eva souhaite les afficher.
- [ ] Photo d'accueil en plus haute définition (l'actuelle vient du PDF, 760 px de large).
- [ ] Relecture des textes par Eva (notamment le rôle exact d'Eva dans les projets de groupe).
