import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import randomWords from 'random-words';

import './App.css';

// Font: Viga

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    font-size: 24px;
    max-width: 500px;
    margin: 0 auto;

    .word-options {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: 100%;
        margin-top: 30px;
    }

    input, textarea {
        display: block;
        margin: 10px 0;
        width: 450px;
        max-width: 100%;

        &.error {
            color: var(--red);
        }
    }
    .timer {
        text-align: center;
        margin-top: 30px;
        font-weight: 600;
        min-height: 35px;
    }

    button {
        margin: 20px 0;

        &.clear {
            margin-bottom: 100px;
        }
    }

    .best-time {
        margin: 30px 0;
        text-align: center;
        font-weight: 600;
        transition: 200ms;
        min-height: 65px;

        .result {
            color: var(--blue);
        }
    }

    &.new-bt {
        .best-time {
            animation-name: pulsate;
            animation-duration: 0.5s;
            animation-iteration-count: 4;
        }
    }

    @keyframes pulsate {
        0%   {transform: scale(1);}
        50%  {transform: scale(1.1);}
        100% {transform: scale(1);}
    }

    code {
        margin-top: auto;
    }

    h1 {
        display: flex;
        align-items: center;
        justify-content: space-between;

        > span {
            margin: 0 10px;
            display: block;
            animation: rotating 1s;
        }
    }

    @keyframes rotating {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`

function isMobile() {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const windows = /windows phone/i.test(userAgent);
    const android = /android/i.test(userAgent);
    const iOs = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    return windows || android || iOs;
};

function getInitialSentence() {
    const dateToday = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[dateToday.getDay()];
    let initial = `Ready for a ${today} session?`;

    if (today === 'Monday') {
        initial = `How was your weekend?`;
    }
    if (today === 'Friday') {
        initial = `${today} has arrived`;
    }
    if (today === 'Saturday' || today === 'Sunday') {
        initial = `${today} weekend vibes`;
    }
    return initial;
}

const successMessages = [
    "👏 Woo-hoo! Great job!",
    "⭐ Woo-hoo let's go!",
    "💪 Awesome!",
    "🚀 You're a rocket ship!",
    "🏁 Whoa you're fast!",
    "🔥 You're on fire!",
    "🙌 Amazing!",
    "🎉 You're unstoppable!",
    "🤩 New record!",
    "💥 Boom! New record!"
];

function App() {
    const intervalRef = useRef();
    const [total, setTotal] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const [sentence, setSentence] = useState(getInitialSentence());
    const [userInput, setUserInput] = useState('');
    const [success, setSuccess] = useState(false);
    const [bestTime, setBestTime] = useState(null);
    const [newBestTime, setNewBestTime] = useState(false);

    const isMobileDevice = isMobile();

    useEffect(() => () => clearInterval(intervalRef.current), []);
    useEffect(() => () => {
        setBestTime(null);
        onClearBtnClick();
    }, [sentence]);

    const onClearBtnClick = () => {
        clearInterval(intervalRef.current);
        setTotal(0);
        setIsCounting(false);
        setUserInput('');
        setSuccess(false);
        setNewBestTime(false);
    };

    const handleKeyDown = (e) => {
        if (success || e.code === 'Escape') {
            onClearBtnClick();
        }
    }

    const handleChangeSentence = (e) => {
        setSentence(e.target.value);
    }

    const handleClickWordOption = (option) => {
        switch (option) {
            case 'alphabet':
                setSentence('abcdefghijklmnopqrstuvwxyz');
                break;
            case 'word':
                setSentence(randomWords());
                break;
            case 'five':
                setSentence(randomWords({ exactly: 5, join: ' ' }));
                break;
            default:
                return;
        }
    }

    const handleUserInputChange = (e) => {

        if (sentence) {
            setUserInput(e.target.value);
            const clickTime = new Date().getTime();

            if (!isCounting) {
                intervalRef.current = setInterval(() => {
                    const totalTime = total + new Date().getTime() - clickTime;
                    setTotal(totalTime);
                    setIsCounting(true);
                }, 0);
            }

            if (e.target.value === sentence) {
                setUserInput('');
                clearInterval(intervalRef.current);
                const totalTime = total + new Date().getTime() - clickTime;
                setTotal(totalTime);
                setIsCounting(false);
                setSuccess(true);

                if (!bestTime || totalTime < bestTime) {
                    if (bestTime) {
                        setNewBestTime(true);

                        setTimeout(() => {
                            setNewBestTime(false);
                        }, 3000);
                    }
                    setBestTime(totalTime);
                }
            }
        }
    };

    return (
        <Container className={newBestTime ? 'new-bt' : ''}>
            <h1><span>🚀</span>BLAST PAST<span>🚀</span></h1>
            <div className='word-options'>
                <button className='btn-small' onClick={() => handleClickWordOption('alphabet')}>Alphabet</button>
                <button className='btn-small' onClick={() => handleClickWordOption('word')}>Word</button>
                <button className='btn-small' onClick={() => handleClickWordOption('five')}>5 words</button>
            </div>
            <div className='best-time'>
                {
                    !bestTime
                        ? <>No best time yet.<br />Give it try!</>
                        : <>Your best time is <br /><span className='result'>{bestTime} ms</span> 😎</>
                }
            </div>
            <textarea
                rows='3'
                value={sentence}
                onChange={handleChangeSentence}
                autoCapitalize='off'
                spellCheck='false'
                autoCorrect='off'
            />
            <textarea
                rows='3'
                autoFocus={!isMobileDevice}
                value={userInput}
                onChange={handleUserInputChange}
                onKeyDown={handleKeyDown}
                autoCapitalize='off'
                autoComplete='off'
                spellCheck='false'
                autoCorrect='off'
                placeholder={sentence}
                className={!sentence.includes(userInput) ? 'error' : ''}
            />
            {!newBestTime
                ? <div className='timer'>{total} ms</div>
                : <div className='timer'>{successMessages[Math.floor(Math.random() * 10)]}</div>
            }
            <button onClick={onClearBtnClick} className='clear'>
                Clear
            </button>
            <code>Version 1.0</code>
        </Container>
    );
}

export default App;
