# Casino Ramon - Mein M323 Projekt (Funktionale Programmierung)

Willkommen bei **Casino Ramon**. Das hier ist mein Abschlussprojekt für das Modul M323. Ich habe versucht, eine Online-Casino-Plattform zu bauen, die sich strikt an die Prinzipien der funktionalen Programmierung (FP) hält. Mir war wichtig, dass der Code nicht nur funktioniert, sondern auch sauber strukturiert und für andere leicht verständlich ist.

Ich habe das Ganze von Grund auf mit **TypeScript**, **React** und **TailwindCSS** hochgezogen. Dabei habe ich vor allem auf eine "Functional Core, Imperative Shell" Architektur geachtet.

---

## Wie ich das Ganze aufgebaut habe

Mein Ziel war es, die eigentliche Logik komplett von den Seiteneffekten zu trennen:
- **Der funktionale Kern**: Die ganzen Regeln für die Spiele, die Gewinnberechnungen und Statistiken findet man in `src/lib/`. Das sind alles pure Funktionen, die nichts von React oder irgendeinem externen State wissen.
- **Die imperative Hülle**: Damit die App auch wirklich was macht, steuern meine Custom Hooks in `src/hooks/` den State und die Effekte (wie Sound oder Animationen). Die Komponenten in `src/components/` sind dann nur noch für das Aussehen zuständig.

---

## Erfüllung des Bewertungsrasters (Ziel: Note 6.0 / 27 Pkt)

Ich habe darauf geachtet, dass jedes Kriterium vom M323-Raster auf dem "Excellent"-Level erfüllt ist. Hier ist die Übersicht, was ich wo und wie umgesetzt habe:

### **A. Core FP Konzepte**

| Kriterium | Umsetzung | Dateien |
| :--- | :--- | :--- |
| **Pure Functions** | Die ganze Spielmathematik ist komplett frei von Seiteneffekten. Gleiche Inputs liefern immer gleiche Outputs. | `src/lib/rouletteUtils.ts`, `src/lib/slotsUtils.ts`, `src/lib/blackjackUtils.ts` |
| **Immutability** | Ich benutze nirgends `let` oder `var`, sondern nur `const`. Für State-Updates nutze ich meine `update()` Utility für flache Kopien. Auch die Types sind alle `readonly`. | `src/lib/fpUtils.ts`, `src/types/roulette.ts` |
| **HOFs** | Ich habe eine eigene HOF geschrieben, `createEvaluator`, die Payout-Funktionen basierend auf Bedingungen generiert. | `src/lib/rouletteUtils.ts` |

### **B. FP Techniken**

| Kriterium | Umsetzung | Dateien |
| :--- | :--- | :--- |
| **Function Composition** | Ich habe eine `pipe()` Utility gebaut, um Funktionen sauber nacheinander auszuführen, ohne sie tief zu verschachteln. | `src/lib/fpUtils.ts`, genutzt z.B. in `src/lib/rouletteUtils.ts` (`deriveStats`) |
| **Recursion & Closures** | Closures nutze ich im Evaluator-Pattern. Rekursion kommt beim Blackjack zum Einsatz (für die Asse und die Züge vom Dealer). | `src/lib/blackjackUtils.ts`, `src/hooks/useBlackjack.ts` |
| **Type Safety** | Ich arbeite viel mit **Discriminated Unions** (z.B. beim `Bet` Type), damit der Compiler direkt merkt, wenn eine Wette nicht zum Spieltyp passt. | `src/types/roulette.ts` |

### **C. Code Qualität**

| Kriterium | Umsetzung | Dateien |
| :--- | :--- | :--- |
| **Verständlichkeit** | Ich habe versucht, alle Namen so zu wählen, dass man sofort versteht, was passiert. Der Code liest sich fast wie eine Beschreibung der Spielregeln. | Der ganze `src/` Ordner. |
| **Projektumfang** | Es gibt drei fertige Spiele (Roulette, Blackjack, Slots) inklusive Statistiken und einem "Vault"-System. | `src/components/organisms/` |
| **README** | (Das ist genau das Dokument, das du gerade liest!) | `README.md` |

---

## Projektstruktur im Überblick

```text
src/
├── lib/           # DER KERN (Pure Logik)
│   ├── fpUtils.ts        - pipe(), update() usw.
│   ├── rouletteUtils.ts  - Alles für Roulette
│   ├── blackjackUtils.ts - Karten-Logik
│   └── slotsUtils.ts     - Slot-Berechnungen
├── hooks/         # DIE HÜLLE (State & Side Effects)
│   ├── useRoulette.ts    - Roulette State Management
│   ├── useBlackjack.ts   - Blackjack Ablauf
│   └── useSlots.ts       - Slots Timing
├── types/         # Types (Discriminated Unions)
└── components/    # UI-Komponenten
```

---

## So startet man das Projekt

Falls du es lokal ausprobieren willst, geht das ganz einfach:

```bash
# Erst mal die Librarys installieren
npm install

# Und dann den lokalen Server starten
npm run dev
```

---

## Mein Fazit zum Projekt

Ist alles fertig? **Definitiv.**
- [x] **Kein `let` oder `var`**: Ich habe konsequent nur `const` benutzt.
- [x] **Kein `any`**: Alles ist sauber durchgetypt.
- [x] **Keine Logik in der UI**: Die ganze Mathe ist in den funktionalen Kern ausgelagert.
- [x] **Einfach zu testen**: Da die Funktionen in `src/lib/` pure sind, lassen sie sich super vorhersagbar testen.
