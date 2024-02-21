import React, { useEffect, useState } from "react";

export default function CountDown({ data }) {
  const [timeleft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeleft]);

  function calculateTimeLeft() {
    const difference = +new Date(data?.end_date) - +new Date(); // In javascript the date in month starts from 0-11
    let timeleft = {};

    if (difference > 0) {
      timeleft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeleft;
  }

  const timerComponents = Object.keys(timeleft).map((interval) => {
    if (!timeleft[interval]) {
      return null;
    }
    return (
      <span key={interval} className="text-[1.1rem] text-blue-500">
        {timeleft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-red-600 text-[20px]">Time's Up</span>
      )}
    </div>
  );
}
