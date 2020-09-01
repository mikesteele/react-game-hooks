import React from 'react';
import usePosition from './usePosition';
import { MIN_X, MIN_Y, MAX_X, MAX_Y } from './constants';
import Sprite from './Sprite';

const FULL_WIDTH = MAX_X - MIN_X;

const useWalls = (topLeftX, topLeftY, topRightX, topRightY, bottomRightX, bottomRightY, bottomLeftX, bottomLeftY) => {
  const [topWallPosition] = usePosition(MIN_X, MIN_Y, FULL_WIDTH, topLeftY - MIN_Y);
  const [leftWallPosition] = usePosition(MIN_X, topLeftY - MIN_Y, topLeftX - MIN_X, bottomLeftY - topLeftY);
  const [rightWallPosition] = usePosition(topRightX, topLeftY - MIN_Y, MAX_X - topRightX, bottomLeftY - topLeftY);
  const [bottomWallPosition] = usePosition(MIN_X, bottomLeftY, FULL_WIDTH, MAX_Y - bottomLeftY);
  return [
    topWallPosition,
    leftWallPosition,
    rightWallPosition,
    bottomWallPosition
  ];
}

const Walls = props => {
  return props.walls.map(wallPosition => (
    <Sprite position={wallPosition} backgroundColor={props.backgroundColor} />
  ));
};

export default useWalls;
export { Walls };
