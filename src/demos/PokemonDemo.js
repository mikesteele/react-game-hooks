import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
  Fragment
} from 'react';
import {
  useInterval,
  usePosition,
  useInteraction,
  useWalls,
  withWorld,
  Sprite
} from '../react-game-hooks';

const PokeCenter = props => {
  const { userPosition, setSetting, moveUser } = props;

  const [
    topWallPosition,
    leftWallPosition,
    rightWallPosition,
    bottomWallPosition
  ] = useWalls(300, 100, 800, 300, 800, 600, 300, 600);

  const [exitDoorPosition] = usePosition(700, 100, 64, 16);

  useEffect(() => {
    moveUser(700, 150);
  }, []);

  useInteraction(userPosition, exitDoorPosition, () => {
    setSetting('city');
    moveUser(300, 200);
  });

  return (
    <>
      <Sprite position={userPosition} backgroundColor='blue' />
      <Sprite position={bottomWallPosition} backgroundColor='black' />
      <Sprite position={topWallPosition} backgroundColor='black' />
      <Sprite position={leftWallPosition} backgroundColor='black' />
      <Sprite position={rightWallPosition} backgroundColor='black' />
      <Sprite position={bottomWallPosition} backgroundColor='black' />
      <Sprite position={exitDoorPosition} backgroundColor='red' />
    </>
  )
}

const City = props => {
  const { userPosition, setSetting } = props;

  const [
    topWallPosition,
    leftWallPosition,
    rightWallPosition,
    bottomWallPosition
  ] = useWalls(100, 100, 800, 100, 800, 500, 100, 500);

  const [pokeCenterPosition] = usePosition(300, 300, 64, 64);
  const [pokeCenterDoorPosition] = usePosition(314, 300, 36, 12);

  useInteraction(userPosition, pokeCenterDoorPosition, () => {
    setSetting('poke-center');
  });

  return (
    <>
      <Sprite position={userPosition} backgroundColor='blue' />
      <Sprite position={pokeCenterPosition} backgroundColor='salmon' />
      <Sprite position={pokeCenterDoorPosition} backgroundColor='green' />
      <Sprite position={topWallPosition} backgroundColor='black'/>
      <Sprite position={leftWallPosition} backgroundColor='black'/>
      <Sprite position={rightWallPosition} backgroundColor='black'/>
      <Sprite position={bottomWallPosition} backgroundColor='black'/>
    </>
  );
};

const PokemonDemo = () => {
  const [userPosition, moveUser] = usePosition(150, 150, 64, 64);
  const [setting, setSetting] = useState('city');

  const onKeyDown = useCallback(e => {
    // Left
    if (e.keyCode === 37) {
      moveUser(userPosition.x - 30, null, 100);
    }
    // Up
    if (e.keyCode === 38) {
      moveUser(null, userPosition.y - 30, 100);
    }
    // Right
    if (e.keyCode === 39) {
      moveUser(userPosition.x + 30, null, 100);
    }
    // Down
    if (e.keyCode === 40) {
      moveUser(null, userPosition.y + 30, 100);
    }
  }, [moveUser, userPosition]);

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
