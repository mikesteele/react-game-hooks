import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
  Fragment
} from 'react';
import {
  useCollision,
  useCollisionWithKeypress,
  useInterval,
  usePosition,
  useInteraction,
  useWalls,
  withWorld,
  Sprite,
  Walls
} from '../react-game-hooks';
import { css } from 'emotion';

const pokecenter = css`
  background: url('pokecenter.png');
  background-repeat: no-repeat;
  width: 900px;
  height: 516px;
  position: absolute;
  top: 24px;
  left: 24px;
`;

const city = css`
  background: url('city.png');
  background-repeat: no-repeat;
  width: 800px;
  height: 720px;
  position: absolute;
  top: 24px;
  left: 24px;
`;

const PokeCenter = props => {
  const { userPosition, setSetting, moveUser } = props;

  const walls = useWalls(24, 24, 920, 24, 920, 540, 24, 540);
  const [exitDoorPosition] = usePosition(212, 475, 130, 64);
  const [pcPosition] = usePosition(854, 220, 70, 100);

  // Non-interactive positions
  const [counterPosition] = usePosition(24, 24, 900, 200);
  const [sofaPosition] = usePosition(24, 220, 70, 200);
  const [leftTreesPosition] = usePosition(24, 420, 130, 120);
  const [centerTreesPosition] = usePosition(410, 420, 130, 120);
  const [rightTreesPosition] = usePosition(790, 420, 130, 120);

  useCollision(userPosition, exitDoorPosition, () => {
    setSetting('city');
    moveUser(130, 300, 100);
  });

  const A_KEY = 65;
  useCollisionWithKeypress(userPosition, pcPosition, A_KEY, () => {
    alert('Ash booted the PC.');
  });

  return (
    <>
      <div className={pokecenter} />
      <Walls walls={walls} backgroundColor='black' />
      <Sprite position={userPosition} backgroundColor='blue' />
      <Sprite position={exitDoorPosition} backgroundColor='rgba(255, 0, 0, 0.3)' />
      <Sprite position={pcPosition} backgroundColor='rgba(255, 0, 0, 0.3)' />
      <Sprite position={counterPosition} backgroundColor='rgba(255, 0, 0, 0.3)' />
      <Sprite position={sofaPosition} backgroundColor='rgba(255, 0, 0, 0.3)' />
      <Sprite position={leftTreesPosition} backgroundColor='rgba(255, 0, 0, 0.3)' />
      <Sprite position={centerTreesPosition} backgroundColor='rgba(255, 0, 0, 0.3)' />
      <Sprite position={rightTreesPosition} backgroundColor='rgba(255, 0, 0, 0.3)' />
    </>
  )
}

const City = props => {
  const { userPosition, setSetting, moveUser} = props;

  const [
    topWallPosition,
    leftWallPosition,
    rightWallPosition,
    bottomWallPosition
  ] = useWalls(24, 24, 820, 24, 820, 600, 24, 600);

  const [pokeCenterDoorPosition] = usePosition(142, 225, 45, 38);

  useCollision(userPosition, pokeCenterDoorPosition, () => {
    moveUser(250, 340, 100);
    setSetting('poke-center');
  });

  return (
    <>
      <div className={city} />
      <Sprite position={userPosition} backgroundColor='blue' />
      <Sprite position={pokeCenterDoorPosition} backgroundColor='rgba(255, 0, 0, 0.3)' />
      <Sprite position={topWallPosition} backgroundColor='black'/>
      <Sprite position={leftWallPosition} backgroundColor='black'/>
      <Sprite position={rightWallPosition} backgroundColor='black'/>
      <Sprite position={bottomWallPosition} backgroundColor='black'/>
    </>
  );
};

const PokemonDemo = () => {
  const [userPosition, moveUser, moveUserRelative] = usePosition(120, 350, 64, 64);
  const [setting, setSetting] = useState('city');

  const onKeyDown = useCallback(e => {
    // Left
    if (e.keyCode === 37) {
      moveUserRelative(-30, null, 100);
    }
    // Up
    if (e.keyCode === 38) {
      moveUserRelative(null, -30, 100);
    }
    // Right
    if (e.keyCode === 39) {
      moveUserRelative(30, null, 100);
    }
    // Down
    if (e.keyCode === 40) {
      moveUserRelative(null, 30, 100);
    }
  }, [moveUserRelative]);

  // Add onKeyDown listener to body
  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown);
    return () => document.body.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  if (setting === 'city') {
    return (
      <City
        userPosition={userPosition}
        setSetting={setSetting}
        moveUser={moveUser}
      />
    );
  } else if (setting === 'poke-center') {
    return (
      <PokeCenter
        userPosition={userPosition}
        setSetting={setSetting}
        moveUser={moveUser}
      />
    );
  } else {
    return null;
  }
};

export default withWorld(PokemonDemo);
