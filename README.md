# La Pesée Publique

**Opérateur à contacts figés — phase 2 de la doctrine**
([NOTE-APPLICATIONS](https://github.com/PORTEMANN/noetic-machine-complete/blob/main/docs/NOTE-APPLICATIONS.md),
adoptée le 2026-10-21).

Collez une affirmation physique — une prédiction d'IA, un communiqué, un
bilan d'énergie — et recevez un verdict immédiat : chaque affirmation
déclenche un **contact figé**, adossé à un référentiel **gelé et daté**,
affiché avec sa tolérence. Ce qui n'entre dans aucun contact ne reçoit
pas d'opinion : ça **dort** — dormeurs publiés, comme dans la maison.

## Ce que c'est — et ce que ce n'est pas

- **Déterministe** : aucun modèle d'IA, aucun calcul serveur — tout
  s'exécute dans le navigateur du visiteur. Le code est la spécification.
- **Un garde-fou, pas un juge** : l'opérateur vérifie des inégalités et
  des identités contre des constantes figées (v ≤ c, validité de la
  cinétique classique, conversions neutroniques, échelles démontrées,
  tables nucléaires). Il ne certifie jamais « vrai » : il classe
  S+/P/S−, ou il dort.
- **Honni soit qui mal y pense** : une affirmation non pesée n'est pas
  rejetée — elle est dormeuse, en attente d'un référentiel. C'est la
  doctrine de la frontière
  ([NOTE-PESEE-SIMON](https://github.com/PORTEMANN/noetic-machine-complete/blob/main/docs/NOTE-PESEE-SIMON.md))
  rendue publique.

## Contacts figés (v1 — référentiel gelé le 2026-10-28)

| id | contact | tolérance |
|---|---|---|
| C1 | Vitesse contre c | v ≤ c (P : arrondi de c à 0,1 %) |
| C2 | Validité de la cinétique classique | ½mv² vs (γ−1)mc², écart < 5 % (P < 25 %) |
| C3 | Flux de neutrons ↔ échelles figées | conversion W de fusion D-T ; réf. 1e14 n/cm²/s |
| C4 | Or par transmutation ↔ échelle démontrée | ~7e3 atomes/s (x10 ALICE, pesée maison 23/10/2026) |
| C5 | Demi-vies contre la table figée | Hg-197, Cu-64, Cu-67, Zn-69m, T, C-14 — θ 2 % |
| C6 | Raies γ contre la table figée | θ 0,6 keV |

Ajouter un contact = ajouter une ligne au référentiel **gelé**, datée —
jamais d'ajustement rétroactif.

## Utiliser / rejouer

```bash
node test.js        # test du moteur sous node (3 échantillons)
```

Ouvrir `index.html` dans un navigateur — c'est tout (deux fichiers
statiques, aucune dépendance).

## Déploiement

Fichiers statiques : `index.html` + `engine.js` sur n'importe quel hôte.
Sur portemann.eu (carte de visite) via l'action GitHub du dépôt, dès que
la clé SSH Gandi est en place (même mécanisme que registre-public).

MIT. Référentiel figé, dormeurs publiés, jamais « vrai ».
