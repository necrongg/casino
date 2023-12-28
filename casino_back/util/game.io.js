import { checkUser } from '../Controllers/chat/user.controller.js';

export default function gameIO(io) {
    // 최초 게임시 작업
    async function initializeDeck(cards, usedCards, socket, NumberOfDeck) {
        const suits = ['♡', '◇', '♣', '♠'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

        // 카드 덱 생성
        for (let i = 0; i < NumberOfDeck; i++) {
            for (let suit of suits) {
                for (let rank of ranks) {
                    cards.push({ suit, rank });
                }
            }
        }

        //카드 셔플
        function shuffleCards(cards) {
            for (let i = cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cards[i], cards[j]] = [cards[j], cards[i]];
            }
            return cards;
        }
        cards = shuffleCards(cards);

        // 최초 버닝카드 4장
        usedCards = cards.splice(0, 4);

        const user = await checkUser(socket.id);
        io.to(user.room.toString()).emit('cardData', { cards });
    }

    // 점수 계산
    function calculateCardValue(rank) {
        if (['J', 'Q', 'K'].includes(rank)) {
            return 0;
        } else if (rank === 'A') {
            return 1;
        } else {
            return parseInt(rank, 10);
        }
    }

    // 핸드 점수 계산
    function calculateHandScore(cards) {
        let totalScore = 0;
        for (let card of cards) {
            totalScore += calculateCardValue(card.rank);
        }
        return totalScore % 10;
    }

    io.on('connection', async (socket) => {
        socket.on('startGame', async (NumberOfDeck, cb) => {
            try {
                let cards = [];
                let usedCards = [];
                let dealerCards = [];
                let playerCards = [];

                await initializeDeck(cards, usedCards, socket, NumberOfDeck);

                dealerCards = cards.splice(0, 2);
                playerCards = cards.splice(0, 2);

                const dealerScore = calculateHandScore(dealerCards);
                const playerScore = calculateHandScore(playerCards);

                const user = await checkUser(socket.id);
                io.to(user.room.toString()).emit('dealerCards', { cards: dealerCards, score: dealerScore });
                io.to(user.room.toString()).emit('playerCards', { cards: playerCards, score: playerScore });

                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });
    });
}
