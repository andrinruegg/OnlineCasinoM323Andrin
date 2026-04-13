import { Card, Rank, Suit } from '../components/atoms/Card';

const calculateRankValue = (rank: Rank): number => {
    if (rank === 'A') return 11;
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank, 10);
};

export const createDeck = (): Card[] => {
    const suits: Suit[] = ['♠', '♣', '♥', '♦'];
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    return suits
        .flatMap(suit => ranks.map(rank => ({ suit, rank, value: calculateRankValue(rank) })))
        .sort(() => Math.random() - 0.5);
};

const adjustForAces = (total: number, aces: number): number =>
    total > 21 && aces > 0 ? adjustForAces(total - 10, aces - 1) : total;

export const calculateHandValue = (hand: Card[]): number => {
    const { total, aces } = hand.reduce(
        (acc, card) => card.isHidden 
            ? acc 
            : { 
                total: acc.total + card.value, 
                aces: acc.aces + (card.rank === 'A' ? 1 : 0) 
              },
        { total: 0, aces: 0 }
    );
    return adjustForAces(total, aces);
};
