export type BetType =
    | 'straight'
    | 'even'
    | 'odd'
    | 'red'
    | 'black'
    | '1-18'
    | '19-36'
    | '1st12'
    | '2nd12'
    | '3rd12'
    | 'col1'
    | 'col2'
    | 'col3';

export type Bet =
    | { readonly type: 'straight'; readonly value: number; readonly amount: number }
    | { readonly type: Exclude<BetType, 'straight'>; readonly value: string; readonly amount: number };

export const ROULETTE_NUMBERS: ReadonlyArray<number> = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

export const RED_NUMBERS: ReadonlyArray<number> = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
export const BLACK_NUMBERS: ReadonlyArray<number> = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

export interface RouletteState {
    readonly balance: number;
    readonly activeBets: readonly Bet[];
    readonly lastBets: readonly Bet[];
    readonly lastResult: number | null;
    readonly isSpinning: boolean;
    readonly winningHistory: readonly number[];
}
