import { useEffect, useState } from 'react';
import socket from '../../server.js';

export default function BlackjackGame() {
    const NumberOfDeck = 6; // 카드 덱 수량
    const [deck, setDeck] = useState([]);

    useEffect(() => {
        socket.on('cardData', (data) => {
            setDeck(data.cards);
        });
    }, []);

    // 게임 시작
    const startGame = () => {
        socket.emit('startGame', NumberOfDeck, (res) => {
            if (res?.ok) {
                console.log('startGame ok');
            }
        });
    };

    return (
        <div className='blackjack-game'>
            <button onClick={() => startGame()}>start Game</button>
            {deck.map((card, index) => (
                <span key={index}>
                    [{card.suit}
                    {card.rank}]
                </span>
            ))}
        </div>
    );
}
