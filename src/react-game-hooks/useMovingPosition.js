import React from 'react';
import useInterval from './useInterval';
import { UPDATE_RATE } from './constants';

const useMovingPosition = (x, y, width, height, initialAngle, initialVelocity) => {
  const [position, setPosition] = React.useState({
    x,
    y,
    width,
    height
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
    boundingBox,
    width,
    height
  };

  const [angle, changeAngle] = React.useState(initialAngle);
  const [velocity, changeVelocity] = React.useState(initialVelocity);

  const moveCallback = React.useCallback(() => {
    setPosition(position => {
      let nextX = position.x + (Math.cos(angle) * velocity);
      let nextY = position.y + (Math.sin(angle) * velocity);
      return {
        ...position,
        x: nextX,
        y: nextY
      };
    });
  }, [angle, velocity]);
  useInterval(moveCallback, UPDATE_RATE);

  return [formattedPosition, changeAngle, changeVelocity];
};

export default useMovingPosition;
