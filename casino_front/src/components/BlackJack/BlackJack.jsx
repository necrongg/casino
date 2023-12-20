import { useEffect, useState } from 'react';
import socket from '../../server.js';

export default function BlackjackGame() {
    const NumberOfDeck = 6; // 카드 덱 수량
    const [deck, setDeck] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);
    const [playerCards, setPlayerCards] = useState([]);

    useEffect(() => {
        socket.on('cardData', (data) => {
            setDeck(data.cards);
        });
    }, []);

    useEffect(() => {
        // 딜러와 플레이어의 카드 정보를 수신
        socket.on('dealerCards', (data) => {
            setDealerCards(data.cards);
        });

        socket.on('playerCards', (data) => {
            setPlayerCards(data.cards);
        });

        return () => {
            socket.off('dealerCards');
            socket.off('playerCards');
        };
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

            {/* 딜러의 카드 정보를 화면에 출력 */}
            <div className='dealer-cards'>
                {dealerCards.map((card, index) => (
                    <span key={index}>
                        [{card.suit} {card.rank}]
                    </span>
                ))}
            </div>

            {/* 플레이어의 카드 정보를 화면에 출력 */}
            <div className='player-cards'>
                {playerCards.map((card, index) => (
                    <span key={index}>
                        [{card.suit} {card.rank}]
                    </span>
                ))}
            </div>

            {/* 전체 덱의 카드 정보를 화면에 출력 */}
            {deck.map((card, index) => (
                <span key={index}>
                    [{index} {card.suit} {card.rank}]
                </span>
            ))}
        </div>
    );
}
