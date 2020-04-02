import React, {
  useState,
  useContext,
  useCallback,
  useEffect
} from 'react';
import useInterval from './useInterval';
import { UPDATE_RATE } from './constants';
import { WorldContext } from './World';
import { uniqueId } from 'lodash';

const useMovingPosition = (x, y, width, height, initialAngle, initialVelocity) => {
  const [id] = useState(uniqueId());
  const [allPositions, addSelf, removeSelf] = useContext(WorldContext);

  const initialPosition = {
    x,
    y,
    width,
    height,
    id
  };

  const [position, setPosition] = useState(initialPosition);

  // On mount, register with world context
  useEffect(() => {
    addSelf(initialPosition);
    return () => removeSelf(initialPosition)
  }, []);

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

  const [angle, changeAngle] = useState(initialAngle);
  const [velocity, changeVelocity] = useState(initialVelocity);

  const moveCallback = useCallback(() => {
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
