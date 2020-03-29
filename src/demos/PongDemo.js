import React from 'react';
import {
  useMovingPosition,
  usePosition,
  useInteraction,
} from '../react-game-hooks';

const Ball = props => (
  <div
    style={{
      borderRadius: '50%',
      background: 'salmon',
      position: 'fixed',
      left: props.position.x,
      top: props.position.y,
      // TODO - These should come from position
      width: 36,
      height: 36
    }}
  />
);

const Paddle = props => (
  <div
    style={{
      background: 'black',
      position: 'fixed',
      left: props.position.x,
      top: props.position.y,
      // TODO - These should come from position
      width: 32,
      height: 400
    }}
  />
);

const PongDemo = () => {
  const [leftPaddlePosition, moveLeftPaddle] = usePosition(100, 100, 32, 400);
  const [rightPaddlePosition] = usePosition(600, 100, 32, 400);
  const [ballPosition, changeAngle] = useMovingPosition(350, 200, 36, 36, 2 * Math.PI, 10);

  const onMouseMove = e => {
    moveLeftPaddle(100, e.clientY - 150);
  };

  useInteraction(leftPaddlePosition, ballPosition, () => {
    changeAngle(2 * Math.PI);
  });

  useInteraction(rightPaddlePosition, ballPosition, () => {
    changeAngle(Math.PI);
  });

  const viewboxStyles = {
    width: '100%',
    height: '100%'
  };

  return (
    <div style={viewboxStyles} onMouseMove={onMouseMove}>
      <Paddle position={leftPaddlePosition}/>
      <Paddle position={rightPaddlePosition}/>
      <Ball position={ballPosition}/>
    </div>
  );
}

export default PongDemo;
