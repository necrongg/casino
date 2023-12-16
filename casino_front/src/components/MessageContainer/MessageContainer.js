import { useEffect, useRef } from 'react';
import './MessageContainer.scss';

const MessageContainer = ({ messageList, user }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    return (
        <div className='message-container-box'>
            {messageList.map((message, index) => {
                return (
                    <div key={index} className='message-container'>
                        {message.user.name === 'system' ? (
                            <div className='system-message-container'>
                                <p className='system-message'>{message.chat}</p>
                            </div>
                        ) : message.user.name === user.name ? (
                            <div className='my-message-container'>
                                <div className='my-message'>{message.chat}</div>
                            </div>
                        ) : (
                            <div className='your-message-container'>
                                <img
                                    src='/profile.jpeg'
                                    alt='profile'
                                    className='profile-image'
                                    style={
                                        (index === 0
                                            ? { visibility: 'visible' }
                                            : messageList[index - 1].user.name === user.name) ||
                                        messageList[index - 1].user.name === 'system'
                                            ? { visibility: 'visible' }
                                            : { visibility: 'hidden' }
                                    }
                                />
                                <div className='your-message'>{message.chat}</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                );
            })}
        </div>
    );
};

export default MessageContainer;
