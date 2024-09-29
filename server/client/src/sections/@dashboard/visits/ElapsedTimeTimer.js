import React, { useState, useEffect } from 'react';

const ElapsedTimeTimer = ({ startDate }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const initialTime = new Date().getTime() - new Date(startDate).getTime();
    setElapsedTime(initialTime);
    const interval = setInterval(() => {
      setElapsedTime(new Date().getTime() - new Date(startDate).getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const formatElapsedTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      <p>{formatElapsedTime(elapsedTime)}</p>
    </div>
  );
};

export default ElapsedTimeTimer;