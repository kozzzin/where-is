import React, { useEffect } from "react";

export default function NextLevelTimer(props) {
  const [ countDown, setCountDown ] = React.useState(5);
  const { showCountdown, setShowCountdown } = props;

  React.useEffect(
    () => {
      const timer = setInterval(
        () => { 
          if (countDown <= 0) {
            clearInterval(timer);
            setShowCountdown(false);
            return;
          } 
          return setCountDown((oldTime) => oldTime - 1) 
        }, 1000
      );

      return () => clearInterval(timer);
    }, [countDown, setShowCountdown, showCountdown]
  )

  return (
    <>        
      <div className="dark-background countdown">
        <h3 className="countdown">Next level starts in: { countDown }s</h3>
      </div>
    </>
  );
}

