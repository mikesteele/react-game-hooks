import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  Fragment
} from 'react';
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

const gameOverWrapper = css`
  position: fixed;
  top: 0;
  left: 0;
`;

const gameOver = css`
  font-family: sans-serif;
`;

const Dinosaur = props => (
  <div
    style={{
      background: props.isGameOver ? 'url("dinosaur-dead.png")' : 'url("dinosaur.png")',
      position: 'absolute',
      transform: `translateX(${props.position.x}px) translateY(${props.position.y}px)`,
      // TODO - These should come from position
      width: 80,
      height: 86
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
    background: 'url("cactus.png")',
    transform: `translateX(${x}px) translateY(${y}px)`,
  };

  return (
    <div className={obstacle} style={obstacleStyles} />
  );
};

const ChromeDinosaurDemo = () => {
  const [dinosaurPosition, moveDinosaur] = usePosition(0, 200, 80, 86);
  const [isGameOver, setIsGameOver] = useState(false);
  const viewBoxRef = useRef();
  const [isJumping, setIsJumping] = useState(false);

  // Keep moving the dinosaur to the right in space
  useInterval(() => {
    if (!isGameOver) {
      const targetY = isJumping ? 100 : 200;
      moveDinosaur(dinosaurPosition.x + 80, targetY, 100);
    }
  }, 100);

  // Keep the viewbox in sync with the dinosaur
  useLayoutEffect(() => {
    if (viewBoxRef && viewBoxRef.current) {
      viewBoxRef.current.scrollLeft = dinosaurPosition.x - 40;
    }
  }, [dinosaurPosition, viewBoxRef]);

  // Create 100 obstacles
  const obstacles = [...Array(100).keys()].map(offset => (
    <Obstacle
      width={30}
      height={66}
      x={1000 + (offset * 1000)}
      y={220}
      dinosaurPosition={dinosaurPosition}
      onGameOver={() => setIsGameOver(true)}
    />
  ));

  // Add onKeyDown listener to body
  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown);
    return () => document.body.removeEventListener('keydown', onKeyDown);
  }, []);

  const onKeyDown = e => {
    // Jump!
    if (e.keyCode === 74) {
      setIsJumping(true);
      window.setTimeout(() => {
        setIsJumping(false);
      }, 400);
    }
  };

  const onRestart = () => {
    moveDinosaur(1, 200);
    window.setTimeout(() => {
      setIsGameOver(false);
      setIsJumping(false);
    }, 100);
  };

  return (
    <Fragment>
      <div
        className={viewBox}
        ref={viewBoxRef}
      >
        <div className={world}>
          <Dinosaur
            position={dinosaurPosition}
            isGameOver={isGameOver}
          />
          {obstacles}
        </div>
      </div>
      {isGameOver && (
        <div className={gameOverWrapper}>
          <h1 className={gameOver}>GAME OVER</h1>
          <button onClick={onRestart}>Play again?</button>
        </div>
      )}
    </Fragment>
  );
};

export default ChromeDinosaurDemo;
