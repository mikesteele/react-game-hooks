import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import s from "./index.module.css";

const makePosition = (x, y, width, height) => {
  const boundingBox = {
    topLeft: {
      x,
      y
    },
    topRight: { x: x + width, y },
    bottomLeft: { x, y: y + height },
    bottomRight: { x: x + width, y: y + height }
  };
  return {
    x,
    y,
    boundingBox
  };
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

class Ball extends React.Component {
  render() {
    const { x, y } = this.props;
    return (
      <div
        className={s.Ball}
        style={{
          position: "fixed",
          left: x,
          top: y,
          transition: "200ms"
        }}
      />
    );
  }
}

const Paddle = props => (
  <div
    className={s.Paddle}
    style={{
      position: "fixed",
      left: props.x,
      top: props.y,
      transition: "200ms"
    }}
  />
);

const useMovingPosition = (
  velocity,
  width,
  height,
  initialX,
  initialY,
  time
) => {
  const [x, setX] = React.useState(initialX);
  const [y, setY] = React.useState(initialY);
  const [lastTime, setLastTime] = React.useState(time);
  React.useEffect(() => {
    if (lastTime < time && velocity !== 0) {
      const xDelta = velocity * (time - lastTime);
      setLastTime(time);
      setX(x + xDelta);
    }
  }, [time, lastTime, velocity, x]);
  const boundingBox = {
    topLeft: {
      x,
      y
    },
    topRight: { x: x + width, y },
    bottomLeft: { x, y: y + height },
    bottomRight: { x: x + width, y: y + height }
  };
  return {
    x,
    y,
    boundingBox
  };
};

const useTime = () => {
  const [time, setTime] = useState(Date.now());
  useInterval(() => {
    setTime(Date.now());
  }, 100);
  return time;
};

const useInteraction = (firstPosition, secondPosition, onInteraction) => {
  React.useEffect(() => {
    // Source: https://stackoverflow.com/questions/2752349/fast-rectangle-to-rectangle-intersection
    const r1 = {
      top: firstPosition.boundingBox.topLeft.y,
      bottom: firstPosition.boundingBox.bottomRight.y,
      right: firstPosition.boundingBox.bottomRight.x,
      left: firstPosition.boundingBox.topLeft.x
    };
    const r2 = {
      top: secondPosition.boundingBox.topLeft.y,
      bottom: secondPosition.boundingBox.bottomRight.y,
      right: secondPosition.boundingBox.bottomRight.x,
      left: secondPosition.boundingBox.topLeft.x
    };
    if (
      !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
      )
    ) {
      onInteraction();
    }
  }, [firstPosition, secondPosition, onInteraction]);
  return null;
};

function App() {
  const [ballVelocity, changeBallVelocity] = React.useState(0.5);
  const [leftPaddleY, setLeftPaddleY] = React.useState(100);
  const onMouseMove = e => {
    setLeftPaddleY(e.clientY - 200);
  };
  const time = useTime();
  const leftPaddlePosition = makePosition(100, leftPaddleY, 32, 400);
  const rightPaddlePosition = makePosition(600, 0, 32, 400);
  const ballPosition = useMovingPosition(ballVelocity, 64, 64, 400, 100, time);

  // Interactions
  useInteraction(ballPosition, leftPaddlePosition, () => {
    changeBallVelocity(0.5);
  });
  useInteraction(rightPaddlePosition, ballPosition, () => {
    changeBallVelocity(-0.5);
  });

  return (
    <div className={s.App} onMouseMove={onMouseMove}>
      <Ball x={ballPosition.x} y={ballPosition.y} />
      <Paddle x={leftPaddlePosition.x} y={leftPaddlePosition.y} />
      <Paddle x={rightPaddlePosition.x} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
