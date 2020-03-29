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

// Should be 1000 / 26 for 26 fps
const UPDATE_RATE = 100;

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
      setPosition(position => ({
        ...position,
        x: position.x + moveConfig.xDelta,
        y: position.y + moveConfig.yDelta
      }));
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
    move(300, 100, 1000);
  };
  return (
    <>
      <div style={styles}>
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div>
      <button onClick={onClickButtonOne}>Button One</button>
    </>
  );
}
