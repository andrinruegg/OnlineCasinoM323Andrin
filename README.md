# Online Casino M323 - Functional Programming Project

This is my evaluation project for module M323 at my school. The task was to build something using functional programming concepts in TypeScript, so I went with an online casino since it's an interesting problem space where things like payout calculations and statistics actually benefit from pure functions.

I built a full casino platform with Roulette, Blackjack, and Slots. The core logic lives in a handful of small utility files and is entirely side-effect free.

## What I built

The project is a browser-based casino with three games. All the actual game logic (who wins, how much, what the odds are) is written as pure functions in `src/lib/`. The React components just call those functions and display results. They don't do math themselves.

## How functional programming fits in

**Pure functions and no side effects**

Everything in `src/lib/rouletteUtils.ts` and `src/lib/fpUtils.ts` is a plain input-output function. You pass in the spin result and the list of bets, you get back a number. No global state touched, no logging, nothing hidden. This made it really easy to reason about whether payouts were correct.

**Immutability**

I don't use `let` or reassign variables anywhere in the logic files. State changes go through my `update()` helper in `fpUtils.ts` which does a shallow copy instead of modifying anything in place. The hook `useRoulette.ts` follows the same pattern.

**Higher-order functions and closures**

The most interesting part is `createEvaluator` in `rouletteUtils.ts`. Instead of a big switch statement for each bet type, I have a function that takes a win condition and a multiplier and returns a new evaluator function. The `payoutRules` dictionary is built entirely from these closures. It's cleaner and easier to extend.

**Function composition**

I wrote a generic `pipe()` function in `fpUtils.ts` that chains functions left to right. I use it in `deriveStats()` to turn a raw array of spin results into the hot/cold number statistics shown on the game screen.

**Type safety**

`BetType` is a union type so TypeScript will catch it if you try to create a bet with an invalid type. The `pipe` and `update` utilities use generics so they stay fully typed through transformations.

## Project structure

```
src/
  lib/
    fpUtils.ts         - pipe() and update(), generic FP tools
    rouletteUtils.ts   - all roulette logic as pure functions
    blackjackUtils.ts  - deck creation and hand value calculation
  hooks/
    useRoulette.ts     - state management, isolates side effects
  types/
    roulette.ts        - type definitions and constants
  components/          - React UI
```

The key design decision was keeping `rouletteUtils.ts` completely unaware of React. It doesn't import anything from React. If you want to test the payout logic you can just call `calculateTotalPayout(12, [{ type: 'straight', value: 12, amount: 100 }])` and get `3600` back. No test setup needed.

## Running it

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

## Testing the logic manually

Since all complex logic is in pure functions, you can verify it without running the app at all. Open `src/lib/rouletteUtils.ts` and look at `calculateTotalPayout` - pass it any result number and an array of bets and it will return the correct payout every time, deterministically. Same with `deriveStats`: give it an array of numbers and it returns `{ hot: [...], cold: [...] }` based on frequency.
