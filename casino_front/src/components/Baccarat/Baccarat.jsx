import { useEffect, useState } from 'react';
import socket from '../../server.js';

export default function Baccarat() {
    const NumberOfDeck = 8; // 카드 덱 수량
    const [cards, setCards] = useState([]);
    const [usedCards, setUsedCards] = useState([]);
    const [bankerCards, setBankerCards] = useState([]);
    const [bankerScore, setBankerScore] = useState(0);
    const [playerCards, setPlayerCards] = useState([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [result, setResult] = useState('');

    useEffect(() => {
        socket.on('cards', (data) => {
            setCards(data.cards);
        });
        socket.on('usedCards', (data) => {
            setUsedCards(data.cards);
        });

        socket.on('bankerCards', (data) => {
            setBankerCards(data.cards);
            setBankerScore(data.score);
        });

        socket.on('playerCards', (data) => {
            setPlayerCards(data.cards);
            setPlayerScore(data.score);
        });

        socket.on('gameEnd', (data) => {
            setResult(data.result);
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

    const nextGame = () => {
        socket.emit('nextGame', NumberOfDeck, (res) => {
            if (res?.ok) {
                console.log('nextGame ok');
            }
        });
    };

    return (
        <div className='baccarat-game'>
            <button onClick={() => startGame()}>start Game</button>
            <button onClick={() => nextGame()}>next Game</button>

            <div className='banker-cards'>
                뱅커카드
                {bankerCards.map((card, index) => (
                    <span key={index}>
                        [{card.suit} {card.rank}]
                    </span>
                ))}
                {bankerScore}
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
            <div>{result}</div>
            <div>{cards}</div>
            <div>{usedCards}</div>
        </div>
    );
}
