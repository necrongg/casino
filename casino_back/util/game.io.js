import { checkUser } from '../Controllers/chat/user.controller.js';

export default function gameIO(io) {
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

    // 덱 세팅
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
    }

    // 바카라 게임 진행
    async function baccaratGame(cards, usedCards, bankerCards, playerCards, result, socket) {
        const user = await checkUser(socket.id);

        playerCards.push(cards.splice(0, 1)[0]);
        bankerCards.push(cards.splice(0, 1)[0]);
        playerCards.push(cards.splice(0, 1)[0]);
        bankerCards.push(cards.splice(0, 1)[0]);

        let playerScore = calculateHandScore(playerCards);
        let bankerScore = calculateHandScore(bankerCards);

        // 네츄럴 상황
        if (bankerScore >= 8 || playerScore >= 8) {
            result = bankerScore > playerScore ? 'Banker Win' : 'Player Win'; // 네츄럴 윈
        } else {
            // 플레이어 추가 드로우
            if (playerScore <= 5) {
                playerCards.push(cards.splice(0, 1)[0]);

                // 뱅커 추가 드로우
                if (bankerScore === 3 && playerCards[2].rank !== '8') {
                    bankerCards.push(cards.splice(0, 1)[0]);
                }
                if (bankerScore === 4 && playerCards[2].rank > '1' && playerCards[2].rank < '8') {
                    bankerCards.push(cards.splice(0, 1)[0]);
                }
                if (bankerScore === 5 && playerCards[2].rank > '3' && playerCards[2].rank < '8') {
                    bankerCards.push(cards.splice(0, 1)[0]);
                }
                if (bankerScore === 6 && playerCards[2].rank > '5' && playerCards[2].rank < '8') {
                    bankerCards.push(cards.splice(0, 1)[0]);
                }
            }
            // 뱅커 추가 드로우
            if (bankerScore <= 2) {
                bankerCards.push(cards.splice(0, 1)[0]);
            }
        }

        playerScore = calculateHandScore(playerCards);
        bankerScore = calculateHandScore(bankerCards);

        if (bankerScore === playerScore) {
            result = 'Tie'; // 무승부
        } else if (bankerScore > playerScore) {
            result = 'Banker Win'; // 뱅커 승리
        } else if (bankerScore < playerScore) {
            result = 'Player Win'; // 플레이어 승리
        }

        io.to(user.room.toString()).emit('bankerCards', { cards: bankerCards, score: bankerScore });
        io.to(user.room.toString()).emit('playerCards', { cards: playerCards, score: playerScore });
        io.to(user.room.toString()).emit('gameEnd', { result });
    }

    io.on('connection', async (socket) => {
        socket.on('startGame', async (NumberOfDeck, cb) => {
            const user = await checkUser(socket.id);

            try {
                let cards = [];
                let usedCards = [];
                let playerCards = [];
                let bankerCards = [];
                let result = '';

                await initializeDeck(cards, usedCards, socket, NumberOfDeck);

                socket.on('nextGame', async () => {
                    await baccaratGame(cards, usedCards, bankerCards, playerCards, result, socket);

                    usedCards.push(...playerCards);
                    playerCards = [];
                    usedCards.push(...bankerCards);
                    bankerCards = [];

                    io.to(user.room.toString()).emit('cards', { cards: cards.length });
                    io.to(user.room.toString()).emit('usedCards', { cards: usedCards.length });
                });

                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });
    });
}
