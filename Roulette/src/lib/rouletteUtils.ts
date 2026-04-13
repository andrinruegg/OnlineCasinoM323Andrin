import { Bet, ROULETTE_NUMBERS, RED_NUMBERS, BLACK_NUMBERS } from '../types/roulette';
import { pipe } from './fpUtils';

/**
 * Creates a bet evaluator closure.
 */
export type BetEvaluator = (result: number, betValue: any) => (betAmount: number) => number;

export const createEvaluator = (
    condition: (result: number, betValue: any) => boolean,
    multiplier: number
): BetEvaluator => (result, betValue) => (betAmount) =>
    condition(result, betValue) ? betAmount * multiplier : 0;

/**
 * Dictionary mapping betting types to their validation logic.
 */
export const payoutRules: Readonly<Record<Bet['type'], BetEvaluator>> = {
    'straight': createEvaluator((result, betValue) => result === betValue, 36),
    'red': createEvaluator((result) => RED_NUMBERS.includes(result), 2),
    'black': createEvaluator((result) => BLACK_NUMBERS.includes(result), 2),
    'even': createEvaluator((result) => result !== 0 && result % 2 === 0, 2),
    'odd': createEvaluator((result) => result !== 0 && result % 2 !== 0, 2),
    '1-18': createEvaluator((result) => result >= 1 && result <= 18, 2),
    '19-36': createEvaluator((result) => result >= 19 && result <= 36, 2),
    '1st12': createEvaluator((result) => result >= 1 && result <= 12, 3),
    '2nd12': createEvaluator((result) => result >= 13 && result <= 24, 3),
    '3rd12': createEvaluator((result) => result >= 25 && result <= 36, 3),
    'col1': createEvaluator((result) => result !== 0 && result % 3 === 1, 3),
    'col2': createEvaluator((result) => result !== 0 && result % 3 === 2, 3),
    'col3': createEvaluator((result) => result !== 0 && result % 3 === 0, 3),
};

const evaluateSingleBet = (result: number) => (bet: Bet): number => {
    const evaluator = payoutRules[bet.type];
    return evaluator(result, bet.value)(bet.amount);
};

/**
 * Calculates total payout using a functional pipeline.
 */
export const calculateTotalPayout = (result: number, bets: readonly Bet[]): number =>
    bets
        .map(evaluateSingleBet(result))
        .reduce((total, p) => total + p, 0);


/**
 * Pure Statistical Frequencies logic for Hot/Cold numbers
 */
type FrequencyMap = Readonly<Record<number, number>>;

const countOccurrences = (history: readonly number[]): FrequencyMap =>
    history.reduce((acc, num) => ({
        ...acc,
        [num]: (acc[num] || 0) + 1
    }), {} as Record<number, number>);

const sortFrequencies = (counts: FrequencyMap): readonly number[] =>
    Object.entries(counts)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([num]) => Number(num));

const getMissingOrLeastFrequent = (counts: FrequencyMap) => (sortedPresent: readonly number[]): readonly number[] =>
    ROULETTE_NUMBERS
        .filter((n) => !sortedPresent.includes(n))
        .concat(
            Object.keys(counts)
                .map(Number)
                .sort((a, b) => (counts[a] || 0) - (counts[b] || 0))
        );

/**
 * Derives the hot and cold stats.
 */
export const deriveStats = (history: readonly number[]) => {
    const counts = countOccurrences(history);
    
    const hotPipeline = pipe<FrequencyMap, readonly number[], readonly number[]>(
        sortFrequencies,
        (sorted) => sorted.slice(0, 5)
    );

    const coldPipeline = pipe<FrequencyMap, readonly number[], readonly number[], readonly number[]>(
        sortFrequencies,
        getMissingOrLeastFrequent(counts),
        (allAscending) => Array.from(new Set(allAscending)).slice(0, 5)
    );

    return {
        hot: hotPipeline(counts) as number[],
        cold: coldPipeline(counts) as number[]
    };
};
