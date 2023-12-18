import { checkUser } from '../Controllers/chat/user.controller.js';

export default function gameIO(io) {
    async function initializeDeck(socket, NumberOfDeck) {
        const suits = ['♡', '◇', '♣', '♠'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const cards = [];

        for (let i = 0; i < NumberOfDeck; i++) {
            for (let suit of suits) {
                for (let rank of ranks) {
                    cards.push({ suit, rank });
                }
            }
        }

        const user = await checkUser(socket.id);
        io.to(user.room.toString()).emit('cardData', { cards });
    }

    io.on('connection', async (socket) => {
        socket.on('startGame', async (NumberOfDeck, cb) => {
            try {
                initializeDeck(socket, NumberOfDeck);
                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });
    });
}
