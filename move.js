import React from "react";
import "./styles.css";

function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const UPDATE_RATE = 1000 / 26;

const usePosition = (x, y, width, height) => {
  const [position, setPosition] = React.useState({
    x,
    y,
    width,
    height
  });
  const [moveConfig, setMoveConfig] = React.useState({
    targetX: x,
    targetY: y,
    xDelta: 0,
    yDelta: 0
  });
  const boundingBox = {
    topLeft: {
      x: position.x,
      y: position.y
    },
    topRight: { x: position.x + width, y: position.y },
    bottomLeft: { x: position.x, y: position.y + height },
    bottomRight: { x: position.x + width, y: position.y + height }
  };
  const formattedPosition = {
    x: position.x,
    y: position.y,
    boundingBox
  };
  const moveCallback = React.useCallback(() => {
    if (
      position.x !== moveConfig.targetX ||
      position.y !== moveConfig.targetY
    ) {
      setPosition(position => {
        let nextX = position.x + moveConfig.xDelta;
        let nextY = position.y + moveConfig.yDelta;
        if (
          (position.x < moveConfig.targetX && nextX > moveConfig.targetX) ||
          (position.x > moveConfig.targetX && nextX < moveConfig.targetX)
        ) {
          nextX = moveConfig.targetX;
        }
        if (
          (position.y < moveConfig.targetY && nextY > moveConfig.targetY) ||
          (position.y > moveConfig.targetY && nextY < moveConfig.targetY)
        ) {
          nextY = moveConfig.targetY;
        }
        return {
          ...position,
          x: nextX,
          y: nextY
        };
      });
    }
  }, [position, moveConfig]);
  useInterval(moveCallback, UPDATE_RATE);
  const requestMove = (targetX, targetY, timeLength) => {
    const time = timeLength || 1;
    setMoveConfig({
      targetX,
      targetY,
      xDelta: (targetX - position.x) / (time / UPDATE_RATE),
      yDelta: (targetY - position.y) / (time / UPDATE_RATE)
    });
  };
  return [formattedPosition, requestMove];
};

export default function App() {
  const [position, move] = usePosition(100, 100, 100, 100);
  const styles = {
    position: "fixed",
    top: position.y,
    left: position.x
  };
  const onClickButtonOne = () => {
    move(300, 100, 600);
  };
  const onClickButtonTwo = () => {
    move(100, 300, 200);
  };
  const onClickButtonThree = () => {
    move(0, 100);
  };
  return (
    <>
      <div style={styles}>
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div>
      <button onClick={onClickButtonOne}>Button One</button>
      <button onClick={onClickButtonTwo}>Button 2</button>
      <button onClick={onClickButtonThree}>Button 3</button>
    </>
  );
}
