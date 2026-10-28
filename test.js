// Test du moteur sous node : node test.js
const { peser } = require("./engine.js");

const ECHANTILLONS = [
  ["Marathon (extrait réel)",
   "To meet demand, you would have to hit a target just 1 cm across, with a " +
   "trillion neutrons every second, continuously, for years. Mercury-197 has " +
   "a half-life of 64 hours. We produced 5 kg d'or par an. The beam " +
   "reaches 300 000 km/s."],
  ["Sortie d'IA incohérente",
   "Un vaisseau de 1000 kg voyage à 200 000 km/s ; son énergie cinétique " +
   "classique suffit. La désintégration a une demi-vie de 13 heures " +
   "(Zn-69m). Une raie à 134.2 keV est observée."],
  ["Texte sans contact figé",
   "La conjecture de Riemann demeure ouverte et les zéros non triviaux " +
   "semblent tous sur la droite critique, ce qui serait très important."],
];

let echecs = 0;
for (const [nom, texte] of ECHANTILLONS) {
  const { resultats, gel } = peser(texte);
  console.log("=== " + nom + " (référentiel gelé " + gel + ") ===");
  for (const r of resultats) {
    console.log("  [" + r.verdict + "] " + r.contact + " — " +
                r.affirmation.slice(0, 70));
    console.log("      " + r.reference);
  }
}
console.log();
console.log("attendu : Marathon -> C3 S+ + C5 S+ + C4 P + C1 S+ ;");
console.log("IA incohérente -> C1 S- ou P + C2 S-/P + C5 S+ + C6 S+ ;");
console.log("sans contact -> un DORMEUR unique.");
