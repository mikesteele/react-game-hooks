import React, {
  useState,
  useEffect,
} from 'react';
import {
  useMovingPosition,
  useInterval,
  usePosition,
  useInteraction,
  World,
  withWorld
} from '../react-game-hooks';
import _remove from 'lodash/remove';

const Sprite = props => (
  <div
    style={{
      position: 'fixed',
      top: props.position.y,
      left: props.position.x,
      background: props.image ? `url("${props.image}")` : "salmon",
      width: props.position.width,
      height: props.position.height
    }}
  />
);

const HeroBullet = props => {
  const {
    enemyPosition,
    id,
    removeHeroBullet
  } = props;

  const [bulletPosition] = useMovingPosition(
    props.heroPosition.x + 20,
    props.heroPosition.y,
    16,
    32,
    1.5 * Math.PI,
    10
  );

  useInteraction(bulletPosition, enemyPosition, () => {
    removeHeroBullet(id);
    // alert('Bullet hit enemy!');
  });

  return (
    <Sprite position={bulletPosition} />
  )
};

const EnemyBullet = props => {
  const {
    heroPosition
  } = props;

  const [bulletPosition] = useMovingPosition(
    props.enemyPosition.x + 20,
    props.enemyPosition.y,
    16,
    32,
    0.5 * Math.PI,
    10
  );

  useInteraction(bulletPosition, heroPosition, () => {
  //  alert('Bullet hit user!');
  });

  return (
    <Sprite position={bulletPosition} />
  )
};

const Enemy = props => {
  const {
    enemyPosition,
    heroPosition
  } = props;
  const [enemyBullets, setEnemyBullets] = useState([]);

  const fireBullet = () => {
    setEnemyBullets(bullets => [...bullets, 1]);
  };

  useInterval(() => {
    const num = Math.floor(Math.random() * 10);
    if (num === 0) {
      fireBullet();
    }
  }, 500);

  return (
    <div>
      <Sprite position={enemyPosition} />
      {enemyBullets.map((bullet, i) => (
        <EnemyBullet
          enemyPosition={enemyPosition}
          heroPosition={heroPosition}
          key={i}
        />
      ))}
    </div>
  )
}

const SpaceInvaderDemo = () => {
  const [heroPosition, moveHero] = usePosition(200, 600, 64, 16);
  const [heroBullets, setHeroBullets] = useState([]);
  const [enemyPosition, moveEnemy] = usePosition(200, 100, 64, 16);

  const removeHeroBullet = id  => {
    setHeroBullets(bullets => {
      _remove(bullets, b => b.id === id);
      return bullets;
    });
  };

  // Add onKeyDown listener to body
  useEffect(() => {
    const fireBullet = () => {
      setHeroBullets(bullets => [...bullets, { id: Date.now() }]);
    };
    const onKeyDown = e => {
      if (e.keyCode === 37) {
        moveHero(heroPosition.x - 24, null, 100);
      }

      if (e.keyCode === 39) {
        moveHero(heroPosition.x + 24, null, 100);
      }

      if (e.keyCode === 70) {
        fireBullet();
      }
    };
    document.body.addEventListener('keydown', onKeyDown);
    return () => document.body.removeEventListener('keydown', onKeyDown);
  }, [heroPosition, moveHero, setHeroBullets]);

  return (
    <div>
      <Sprite position={heroPosition} />
      {heroBullets.map(bullet => (
        <HeroBullet
          heroPosition={heroPosition}
          enemyPosition={enemyPosition}
          key={bullet.id}
          id={bullet.id}
          removeHeroBullet={removeHeroBullet}
        />
      ))}
      <Enemy
        enemyPosition={enemyPosition}
        moveEnemy={moveEnemy}
        heroPosition={heroPosition}
      />
    </div>
  );
}

export default withWorld(SpaceInvaderDemo);
