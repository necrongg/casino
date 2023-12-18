import { useState } from 'react';

const BlackjackGame = () => {
    const [usedDecks, setUsedDecks] = useState([]);
    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);

    const createDeck = () => {
        const suits = ['♠', '♣', '♥', '♦'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        const deck = [];
        for (let i = 0; i < 6; i++) {
            for (let suit of suits) {
                for (let rank of ranks) {
                    deck.push(`${rank}${suit}`);
                }
            }
        }
        return deck;
    };

    const shuffleDeck = (deck) => {
        let currentIndex = deck.length,
            temporaryValue,
            randomIndex;

        // 뒤에서부터 앞으로 카드 섞기
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = deck[currentIndex];
            deck[currentIndex] = deck[randomIndex];
            deck[randomIndex] = temporaryValue;
        }
        return deck;
    };

    const shuffleDecks = () => {
        const newDeck = createDeck();
        const shuffledDeck = shuffleDeck(newDeck);
        setUsedDecks(shuffledDeck);
    };

    // 카드 값 계산 함수
    const getCardValue = (card) => {
        const rank = card.slice(0, -1);

        if (!isNaN(parseInt(rank))) {
            return parseInt(rank);
        } else if (rank === 'A') {
            return 11;
        } else {
            return 10;
        }
    };

    // 플레이어와 딜러가 카드를 받는 함수
    const dealCards = () => {
        const newPlayerCards = [];
        const newDealerCards = [];

        // 플레이어와 딜러에게 카드 나누기 (각각 2장씩)
        for (let i = 0; i < 2; i++) {
            newPlayerCards.push(usedDecks.pop());
            newDealerCards.push(usedDecks.pop());
        }

        setPlayerCards(newPlayerCards);
        setDealerCards(newDealerCards);
    };

    // 게임 시작 함수
    const startGame = () => {
        shuffleDecks();
        dealCards();
    };

    const handleSettings = () => {};

    const hit = () => {
        const newPlayerCards = [...playerCards, usedDecks.pop()];
        setPlayerCards(newPlayerCards);
    };

    const stay = () => {};

    return (
        <div>
            <button onClick={startGame}>게임 시작</button>
            <div>
                <h2>플레이어 카드:</h2>
                <ul>
                    {playerCards.map((card, index) => (
                        <li key={index}>{card}</li>
                    ))}
                </ul>
                <h2>딜러 카드:</h2>
                <ul>
                    {dealerCards.map((card, index) => (
                        <li key={index}>{card}</li>
                    ))}
                </ul>
            </div>
            <div>
                <button onClick={hit}>힛</button>
                <button onClick={stay}>스테이</button>
            </div>
        </div>
    );
};

export default BlackjackGame;
