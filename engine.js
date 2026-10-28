/* Pesée publique — moteur de contacts figés (v1).
 * Déterministe, stdlib, MIT. Aucun calcul serveur : le moteur tourne
 * dans le navigateur ; le référentiel figé ci-dessous est daté et
 * affiché avec chaque verdict. Les affirmations hors contacts sont
 * rendues « dormeuses » — la doctrine de la maison, visible.
 * Doctrine : NOTE-APPLICATIONS (adoptée 2026-10-21), phase 2.
 */
(function (global) {
  "use strict";

  /* Référentiel figé — v1, gelé le 2026-10-28 */
  const FROZEN = {
    date_gel: "2026-10-28",
    c: 299792458,                    // m/s (SI exact)
    eV: 1.602176634e-19,             // J
    u: 1.66053906660e-27,            // kg
    DT_J_par_reaction: 17.6e6 * 1.602176634e-19, // J (D-T, 17.6 MeV)
    n_par_W_DT: 1 / (17.6e6 * 1.602176634e-19),
    flux_ref_materiaux: 1e14,        // n/cm2/s, réacteur d'essai classique
    or_demonstre_atomess: 7.0e3,     // ~72 pg/an (x10 ALICE, pesée maison 23/10/2026)
    NA: 6.02214076e23,
    demi_vies_h: {                  // tables nucléaires figées
      "Hg-197": 64.14, "Cu-64": 12.70, "Cu-67": 61.87, "Zn-69m": 13.76,
      "Tritium": 12.32 * 365.25 * 24, "C-14": 5730 * 365.25 * 24,
    },
    raies_keV: [511.0, 1345.8, 93.3, 184.6, 438.6, 669.6, 962.1, 1115.5,
                77.4, 134.0, 279.0],
  };

  const NOMBRE = "([\\d]+(?:[\\s\\u202f\\d]{0,4}(?:[.,]\\d+)?)?)";
  function num(s) {
    if (!s) return NaN;
    const t = s.replace(/[\s\u202f]/g, "").replace(",", ".");
    return parseFloat(t);
  }
  function fmt(x, u) {
    if (!isFinite(x)) return "—";
    const a = Math.abs(x);
    const s = (a >= 1e6 || (a < 0.01 && a > 0)) ? x.toExponential(3)
                                                : x.toPrecision(4);
    return s + (u ? " " + u : "");
  }

  /* Chaque contact : extraire(phrase) -> [{affirmation, verdict, reference}]
   * verdict in {S+, P, S-, "DORMEUR"} */
  const CONTACTS = [
    {
      id: "C1-vitesse-lumiere",
      titre: "Vitesse contre c",
      extraire(texte) {
        const out = [];
        const re = new RegExp(NOMBRE + "\\s*(km/s|m/s|m/ps)", "gi");
        let m;
        while ((m = re.exec(texte))) {
          const v = num(m[1]);
          const mult = { "m/s": 1, "km/s": 1e3, "m/ps": 1e12 }[m[2]];
          const V = v * mult;
          const tol = V <= FROZEN.c ? "S+" : (V <= FROZEN.c * 1.001 ? "P" : "S-");
          out.push({
            affirmation: m[0],
            verdict: tol,
            reference: "c figée = 2.998e8 m/s — θ : v ≤ c (P : arrondi de c à 0,1 %)",
          });
        }
        return out;
      },
    },
    {
      id: "C2-cinetique-classique",
      titre: "Validité de la cinétique classique",
      extraire(texte) {
        const out = [];
        const re = new RegExp(
          NOMBRE + "\\s*(kg|g|u)\\s[^.\\n]{0,60}?" +
          NOMBRE + "\\s*(km/s|m/s)", "gi");
        let m;
        while ((m = re.exec(texte))) {
          const masse = num(m[1]) * { kg: 1, g: 1e-3, u: FROZEN.u }[m[2]];
          const v = num(m[3]) * { "km/s": 1e3, "m/s": 1 }[m[4]];
          const g = 1 / Math.sqrt(1 - (v / FROZEN.c) ** 2);
          const ecart = Math.abs((0.5 * v * v - (g - 1) * FROZEN.c ** 2) /
                                 ((g - 1) * FROZEN.c ** 2));
          out.push({
            affirmation: m[0].slice(0, 90),
            verdict: ecart <= 0.05 ? "S+" : (ecart <= 0.25 ? "P" : "S-"),
            reference: "½mv² vs (γ−1)mc², γ figé — θ : écart < 5 % (P < 25 %)",
          });
        }
        return out;
      },
    },
    {
      id: "C3-flux-neutrons",
      titre: "Flux de neutrons ↔ échelles figées",
      extraire(texte) {
        const out = [];
        const re = /([\d.,]+|a|an|une?)\s*(billion|trillion|million|milliard|mille milliards|10\^?(\d+))?\s*neutrons?\s*(par|per|every|chaque)\s*(seconde|second)/gi;
        let m;
        while ((m = re.exec(texte))) {
          let n = m[1].match(/[\d.,]/) ? num(m[1]) : 1;
          const mult = { billion: 1e9, milliard: 1e9, million: 1e6,
                         trillion: 1e12, "mille milliards": 1e12 }[m[2]] || 1;
          n *= mult;
          const W = n / FROZEN.n_par_W_DT;
          let verdict = "S+", note = "flux modeste à l'échelle fusion";
          const f = n; // n/s sur 1 cm2 si densité unitaire déclarée
          if (f / 1e4 >= FROZEN.flux_ref_materiaux) {
            verdict = "S-";
            note = "flux au-delà du référentiel matériaux figé";
          } else if (f >= 1e13) { verdict = "P"; note = "flux de l'ordre du référentiel matériaux"; }
          out.push({
            affirmation: m[0],
            verdict,
            reference: `${fmt(W, "W de fusion D-T")} ; réf. figée 1e14 n/cm²/s — ${note}`,
          });
        }
        return out;
      },
    },
    {
      id: "C4-or-transmutation",
      titre: "Or par transmutation ↔ échelle démontrée",
      extraire(texte) {
        const out = [];
        const re = /([\d.,]+)\s*(kg|tonnes|g)\s*d['’]?\s*or[^.\\n]{0,40}(an|ans|year)/gi;
        let m;
        while ((m = re.exec(texte))) {
          const kg = num(m[1]) * { g: 1e-3, kg: 1, tonnes: 1e3 }[m[2]];
          const atomes_s = kg / 0.19697 * FROZEN.NA / (365.25 * 86400);
          const ratio = atomes_s / FROZEN.or_demonstre_atomess;
          const verdict = ratio <= 1e2 ? "S+" : (ratio <= 1e10 ? "P" : "S-");
          out.push({
            affirmation: m[0].slice(0, 90),
            verdict,
            reference: `échelle démontrée figée ~7e3 atomes/s (x10 ALICE) — ratio ${fmt(ratio, "×")}`,
          });
        }
        return out;
      },
    },
    {
      id: "C5-demi-vies",
      titre: "Demi-vies contre la table figée",
      extraire(texte) {
        const out = [];
        const re = /(?:demi[- ]?vie|half[- ]?life)[^.\\n]{0,30}?([\d.,]+)\s*(heures?|hours?|h|jours?|d|années?|ans|min)/gi;
        let m;
        while ((m = re.exec(texte))) {
          const h = num(m[1]) * { h: 1, "heures": 1, "heure": 1,
            hours: 1, hour: 1,
            jours: 24, jour: 24, d: 24, années: 8766, ans: 8766,
            min: 1 / 60 }[m[2]];
          let best = null, bd = Infinity;
          for (const [iso, ref] of Object.entries(FROZEN.demi_vies_h)) {
            const d = Math.abs(h - ref) / ref;
            if (d < bd) { bd = d; best = iso; }
          }
          out.push({
            affirmation: m[0].slice(0, 80),
            verdict: bd <= 0.02 ? "S+" : "DORMEUR",
            reference: bd <= 0.02
              ? `isotope figé : ${best} (${FROZEN.demi_vies_h[best]} h) — θ : 2 %`
              : "aucune demi-vie figée dans le référentiel à 2 % — dormeur",
          });
        }
        return out;
      },
    },
    {
      id: "C6-raies-gamma",
      titre: "Raies γ contre la table figée",
      extraire(texte) {
        const out = [];
        const re = /([\d.,]+)\s*keV/gi;
        let m;
        while ((m = re.exec(texte))) {
          const e = num(m[1]);
          const hit = FROZEN.raies_keV.find(r => Math.abs(r - e) <= 0.6);
          out.push({
            affirmation: m[0],
            verdict: hit ? "S+" : "DORMEUR",
            reference: hit
              ? `raie figée à ${hit} keV — θ : 0.6 keV`
              : "aucune raie figée à 0.6 keV — dormeur",
          });
        }
        return out;
      },
    },
  ];

  function peser(texte) {
    const resultats = [];
    for (const c of CONTACTS) {
      for (const r of c.extraire(texte)) {
        resultats.push({ contact: c.titre, ...r });
      }
    }
    const mots = texte.split(/\s+/).length;
    if (resultats.length === 0) {
      resultats.push({
        contact: "—", affirmation: "(texte intégral)",
        verdict: "DORMEUR",
        reference: "aucun contact figé déclenché — l'affirmation dort " +
                   "en attendant un référentiel (doctrine : dormeurs publiés)",
      });
    }
    return { resultats, mots, gel: FROZEN.date_gel };
  }

  global.PESEE = { peser, FROZEN, CONTACTS };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { peser, FROZEN, CONTACTS };
  }
})(typeof window !== "undefined" ? window : globalThis);
