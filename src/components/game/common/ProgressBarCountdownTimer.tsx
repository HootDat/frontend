import React, { useState, useEffect, useRef } from 'react';
import { LinearProgress } from '@material-ui/core';

const ProgressBarCountdownTimer: React.FC<{
  countdownSeconds: number;
}> = ({ countdownSeconds }) => {
  const startTime = useRef(Date.now());
  const frame = useRef(0);
  const [progress, setProgress] = useState(0);

  const updateProgress = () => {
    const progress =
      (Date.now() - startTime.current) / (1000 * countdownSeconds);
    setProgress(progress > 1 ? 100 : progress * 100);

    if (progress > 0 && progress < 1) {
      frame.current = requestAnimationFrame(updateProgress);
    }
  };

  // TODO for some reason, this doesn't work on chrome
  useEffect(() => {
    frame.current = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LinearProgress variant="determinate" value={progress} />
    </>
  );
};

export default ProgressBarCountdownTimer;
