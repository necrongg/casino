import { checkUser } from '../Controllers/chat/user.controller.js';

export default function gameIO(io) {
    // 최초 게임시 작업
    async function initializeDeck(socket, NumberOfDeck) {
        let cards = [];
        let usedCards = [];

        const suits = ['♡', '◇', '♣', '♠'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const cardValues = {
            A: 11,
            2: 2,
            3: 3,
            K: 10,
        };

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
        usedCards = cards.splice(0, 4); // 최초 버닝카드 4장

        const user = await checkUser(socket.id);
        io.to(user.room.toString()).emit('cardData', { cards });
    }

    io.on('connection', async (socket) => {
        socket.on('startGame', async (NumberOfDeck, cb) => {
            try {
                await initializeDeck(socket, NumberOfDeck);

                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });
    });
}
