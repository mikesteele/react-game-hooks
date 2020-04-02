import React, {
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import useInterval from './useInterval';
import { UPDATE_RATE } from './constants';
import { WorldContext } from './World';
import { uniqueId } from 'lodash';

const usePosition = (x, y, width, height) => {
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
  const [moveConfig, setMoveConfig] = React.useState({
    targetX: x,
    targetY: y,
    xDelta: 0,
    yDelta: 0
  });
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
  const requestMove = useCallback((targetX, targetY, timeLength) => {
    const time = timeLength || 1;
    setMoveConfig(previousMoveConfig => {
      const nextTargetX = Number(targetX) ? targetX : previousMoveConfig.targetX;
      const nextTargetY = Number(targetY) ? targetY : previousMoveConfig.targetY;
      // FIXME - This should probably not recalculate xDelta/yDelta if only requesting movement in one dimension.
      // See jumping in ChromeDinosaurDemo as an example.
      return {
        targetX: nextTargetX,
        targetY: nextTargetY,
        xDelta: (nextTargetX - position.x) / (time / UPDATE_RATE),
        yDelta: (nextTargetY - position.y) / (time / UPDATE_RATE)
      };
    });
  }, [setMoveConfig, position]);
  return [formattedPosition, requestMove];
};

export default usePosition;
