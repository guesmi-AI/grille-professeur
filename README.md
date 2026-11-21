# Grille Professeur — calcul des points (CUN)

Application web (PWA) et Android pour calculer les points de la promotion au grade de Professeur,
selon la **grille 2026 (54ᵉ session)** et le **projet de grille 2028**. Interface en arabe (RTL), français et anglais.

Parcours : 1) choix de la grille → 2) critères minimaux de recevabilité (administrative + scientifique, par domaine S&T / SHS)
→ 3) pédagogie → 4) recherche → (5) fonctions administratives, 2028 uniquement) → résultat imprimable / PDF.
Les saisies sont enregistrées localement sur l’appareil. Fonctionne hors ligne.

## Structure
- `www/` : le site complet (HTML/CSS/JS sans framework, aucune étape de build)
  - `js/grids.js` : **toutes les règles des deux grilles** (barèmes, plafonds, bonus, seuils, critères de recevabilité, textes AR/FR/EN)
  - `js/calc.js` : moteur de calcul (fonctions pures)
  - `js/i18n.js` : textes de l’interface
- `android/` : projet Android natif (Capacitor 7) qui embarque `www/`
- `test/calc.test.js` : tests du calcul (`npm test`)

## Site web
Copier le dossier `www/` sur n’importe quel hébergement statique (serveur de l’université, GitHub Pages, Netlify…).
Le workflow `.github/workflows/android.yml` publie aussi `www/` sur GitHub Pages.

## Application Android
- **Sans installation locale** : pousser ce dossier dans un dépôt GitHub ; l’action « Build Android APK » produit `app-debug.apk`
  (onglet Actions → artefact `grille-professeur-apk`), installable directement sur un téléphone.
- **En local** (Android Studio + JDK 21) : `npm install`, puis `npm run android:debug`, ou `npx cap open android`.
- **Google Play** : `npm run android:release` puis signer l’AAB avec votre clé.

## Choix d’interprétation (à valider)
1. Les bonus (anglais, actes indexés WoS/Scopus, projets prioritaires) s’ajoutent **au-delà** du plafond de la rubrique,
   sauf lorsque la grille fixe un plafond propre au bonus (2028 : contenus en anglais, 10 pts max).
2. Le nombre d’éléments « en anglais » ne peut dépasser le nombre d’éléments déclarés.
3. Règle des co-auteurs (100 / 50 / 25 %) appliquée aux articles de revues ; option « ordre alphabétique » = 100 % pour tous.
4. Rubriques sans unité (2026 : projet tutoré 5 pts, animation 5 pts, formation doctorale 15 pts ; 2028 : animation, entrepreneuriat,
   prix, membre d’organismes internationaux) comptées une seule fois.
5. Bureaux d’études / filiales : la grille ne donne qu’un maximum (10 pts) ; l’utilisateur saisit les points attestés.
6. 2028, colloques internationaux : « + X pts / communication indexée » = nombre de communications indexées saisi librement.
7. 2028, fonctions administratives : ajoutées au total général, hors seuils pédagogie / recherche.
8. La recevabilité est déclarative (cases à cocher), conformément aux variantes du texte.

Outil d’aide au calcul, sans valeur officielle.
