import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    useEffect(() => {
        const interval = setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);
            } else {
                clearInterval(interval); // stop the timer when time runs out
            }
        }, 1000);

        return () => clearInterval(interval); // cleanup the interval on component unmount
    }, [timeLeft]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="timer">
            {formatTime(timeLeft)}
        </div>
    );
};

export default Timer;
