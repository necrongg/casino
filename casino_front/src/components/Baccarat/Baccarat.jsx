import { useEffect, useState } from 'react';
import socket from '../../server.js';

export default function Baccarat() {
    const NumberOfDeck = 6; // 카드 덱 수량
    const [deck, setDeck] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);
    const [dealerScore, setDealerScore] = useState(0);
    const [playerCards, setPlayerCards] = useState([]);
    const [playerScore, setPlayerScore] = useState(0);

    useEffect(() => {
        socket.on('cardData', (data) => {
            setDeck(data.cards);
        });

        socket.on('dealerCards', (data) => {
            setDealerCards(data.cards);
            setDealerScore(data.score);
        });

        socket.on('playerCards', (data) => {
            setPlayerCards(data.cards);
            setPlayerScore(data.score);
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

            <div className='dealer-cards'>
                딜러카드
                {dealerCards.map((card, index) => (
                    <span key={index}>
                        [{card.suit} {card.rank}]
                    </span>
                ))}
                {dealerScore}
            </div>

            <div className='player-cards'>
                플레이어카드
                {playerCards.map((card, index) => (
                    <span key={index}>
                        [{card.suit} {card.rank}]
                    </span>
                ))}
                {playerScore}
            </div>

            {deck.map((card, index) => (
                <span key={index}>
                    [{index} {card.suit} {card.rank}]
                </span>
            ))}
        </div>
    );
}
