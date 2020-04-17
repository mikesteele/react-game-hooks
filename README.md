## react-game-hooks [WIP]

A library for creating 2D games with React.

It focuses primarily on bounding box calculation and collision detection.

This is an experiment and not meant for production.

Hooks can be found in `src/react-game-hooks`.

Demos can be found in `src/demos`.

### Basics

The most basic game that can be created with this library looks like this:

```jsx
import {
  useCollision,
  usePosition,
  Sprite,
  withWorld
 } from '../react-game-hooks';

const Game = () => {
  const [userPosition, moveUser] = usePosition(...);
  const [enemyPosition] = usePosition(...);
  
  useCollison(userPosition, enemyPosition, () => alert('Game over!'));
  
  return (
    <div>
      <Sprite position={userPosition} />
      <Sprite position={enemyPosition} />
    </div>
  );
};

export default withWorld(Game);
```

This game defined two **positions** (with `usePosition`) which represent objects in 2D space. It renders them to the screen using the **Sprite** component.

It defines a **collision** (with `useCollision`) between the user and the enemy. If they collide, the callback fires. Game over!

The game is wrapped in a **world** (with the `withWorld` HOC) which is required to the useCollision hook.

### API

### Positions

Positions represent objects in 2D space. They come with a bounding box that allows for collision detection with other positions via `useInteraction`.

#### const [position, move(newX, newY, timeLength)] = usePosition(x, y, width, height)

Creates a controlled position.

#### const [position, changeAngle(newAngle), changeVelocity(newVelocity)] = useMovingPosition(x, y, width, height, initialAngle, initialVelocity)

Creates a position that moves on its own, in direction defined by `angle` and with speed defined by `velocity`. Angle is in radians.

### World

World provides internal context for positions to register, update, and deregister themselves. It also provides context for collisons to register and deregister.

World allows for positions to be aware of other positions, to cancel movements and fire collision listeners if they collide.

Wrap your App in `withWorld`:

```
withWorld(App);
```

### Collisions

#### useInteraction(position, position, callback)

Creates a collision listener for two positions.

