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

### Conditional Positions

Due to the <a href="https://reactjs.org/docs/hooks-rules.html">rules of hooks</a>, we can't wrap our `usePosition` calls in conditions. But whether or not objects exist in a current game scene are often tied to game state. (eg. show a mushroom if the user hasn't already picked it up, show this NPC if the game's season is summer)

For this reason, this library allows `off` as an optional parameter to `usePosition`:

```
const [position, movePosition] = usePosition(initialX, initialY, width, height, off);
```

`Sprite` handles `position.off` itself, so always render the position with Sprite.

:x:
```jsx
{!position.off && (<Sprite position={position}/>)}
```
```jsx
{someState && (<Sprite position={position}/>)}
```

:white_check_mark:
```jsx
// Make `off` controlled by state
const [position] = usePosition(initialX, initialY, width, height, someState);

return (
  <Sprite position={position}/> /* Have Sprite handle whether or not to show */
);
```

### Composing scenes 

However, if multiple objects and collisions 


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

