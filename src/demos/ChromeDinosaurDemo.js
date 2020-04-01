import React, { useLayoutEffect, useRef, useState, useCallback } from 'react';
import {
  useInterval,
  usePosition,
  useInteraction,
} from '../react-game-hooks';
import { css } from 'emotion';

const viewBox = css`
  height: 100%;
  width: 100%;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const obstacle = css`
  background: red;
`;

const world = css`
  position: relative;
  width: 1000000px;
`;

const Dinosaur = props => (
  <div
    style={{
      background: 'salmon',
      position: 'absolute',
      left: props.position.x,
      top: props.position.y,
      // TODO - These should come from position
      width: 10,
      height: 100
    }}
  />
);

const Obstacle = props => {
  const {
    x,
    y,
    width,
    height,
    dinosaurPosition,
    onGameOver
  } = props;

  const [ownPosition] = usePosition(x, y, width, height);

  // End the game if there's a collison
  useInteraction(ownPosition, dinosaurPosition, onGameOver);

  const obstacleStyles = {
    position: 'absolute',
    width,
    height,
    marginLeft: x,
    marginTop: y
  };

  return (
    <div className={obstacle} style={obstacleStyles} />
  );
};

const ChromeDinosaurDemo = () => {
  const [dinosaurPosition, moveDinosaur] = usePosition(0, 200, 10, 100);
  const [isGameOver, setIsGameOver] = useState(false);
  const viewBoxRef = useRef();
  const [isJumping, setIsJumping] = useState(false);

  // Keep moving the dinosaur to the right in space
  useInterval(() => {
    if (!isGameOver) {
      const targetY = isJumping ? 100 : 200;
      moveDinosaur(dinosaurPosition.x + 40, targetY, 100);
    }
  }, 100);

  // Keep the viewbox in sync with the dinosaur
  useLayoutEffect(() => {
    if (viewBoxRef && viewBoxRef.current) {
      viewBoxRef.current.scrollLeft = dinosaurPosition.x - 40;
    }
  }, [dinosaurPosition, viewBoxRef]);

  const onKeyDown = e => {
    // Jump!
    if (e.keyCode === 74) {
      setIsJumping(true);
      window.setTimeout(() => {
        setIsJumping(false);
      }, 400);
    }
  };

  // Create 100 obstacles
  const obstacles = [...Array(100).keys()].map(offset => (
    <Obstacle
      width={24}
      height={24}
      x={1000 + (offset * 10000)}
      y={250}
      dinosaurPosition={dinosaurPosition}
      onGameOver={() => setIsGameOver(true)}
    />
  ));

  return (
    <div
      className={viewBox}
      ref={viewBoxRef}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div className={world}>
        <Dinosaur position={dinosaurPosition} />
        {obstacles}
      </div>
    </div>
  );
};

export default ChromeDinosaurDemo;
