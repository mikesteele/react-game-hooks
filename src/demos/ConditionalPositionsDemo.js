import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  usePosition,
  useCollision,
  Sprite,
  withWorld
} from '../react-game-hooks';

const ConditionalPositionsDemo = () => {
  const [didCollide, setDidCollide] = useState(false);
  const [userPosition, moveUser] = usePosition(150, 150, 64, 64);
  const [enemyPosition] = usePosition(350, 350, 64, 64, didCollide);

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

  useCollision(userPosition, enemyPosition, () => setDidCollide(true));

  return (
    <>
      <Sprite position={userPosition} />
      <Sprite position={enemyPosition} />
    </>
  );
};

export default withWorld(ConditionalPositionsDemo);
