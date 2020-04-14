import React from 'react';
import {
  useMovingPosition,
  usePosition,
  useInteraction,
  Sprite
} from '../react-game-hooks';

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
      <Sprite position={leftPaddlePosition} backgroundColor='black' />
      <Sprite position={rightPaddlePosition} backgroundColor='black' />
      <Sprite position={ballPosition} style={{ borderRadius: '50%' }}/>
    </div>
  );
}

export default PongDemo;
