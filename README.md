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
  const [userPosition, moveUser] = usePosition(0, 0, 60, 60);
  const [enemyPosition] = usePosition(100, 100, 60, 60);
  
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

### Moving Positions

`usePosition` takes `initialX` and `initialY` as parameters. It will not update the positions' coordinates if these are changed.

Instead, use the `move` function provided by `usePosition`. If you want the position to move according to a value change, wrap it in an effect. An example:

:x:

```jsx
const { x, y, width, height } = props;

// This will start the position at x, y, but not move it if they change
const [position] = usePosition(x, y, width, height);
```

:white_check_mark:

```jsx
const { x, y, width, height } = props;

// Initial position at x, y
const [position, movePosition] = usePosition(x, y, width, height);

// If they ever change, call `move`
React.useEffect(() => {
  movePosition(x, y, 100);
}, [movePosition, x, y])
```

This is because movements in this library are not instantaneous and require a time. (here `100` milliseconds) This is because they could collide with something before reaching the requested x and y, and cause the movement to be aborted. 

### Conditional Positions

Due to the <a href="https://reactjs.org/docs/hooks-rules.html">rules of hooks</a>, we can't wrap our `usePosition` calls in conditions. But whether or not objects exist in a current game scene are often tied to game state. (eg. show a mushroom if the user hasn't already picked it up, show this NPC if the game's season is summer)

For this reason, this library allows `off` as an optional parameter to `usePosition`:

```jsx
const [position, movePosition] = usePosition(initialX, initialY, width, height, off);
```

Off positions will not trigger collisions and will not appear on screen.

Unlike initialX and initialY, changing `off` will cause the position to be added/remove from the scene.

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
const [someState] = React.useState(true);

// Make `off` controlled by state
const [position] = usePosition(initialX, initialY, width, height, someState);

return (
  <Sprite position={position}/> /* Have Sprite handle whether or not to show on screen */
);
```

### Composing scenes 

If multiple objects and collisions are `off` with the same logic, it may make more sense to abstract them away into their own components. 

Consider a location where certain items are in the world depending on the time of year:

```jsx
// For brevity, usePosition initialX, initialY, width and height params have been shorted with ....

const Farm = props => {
  const { currentSeason, userPosition, pickUpItem } = props;
  
  const isAutumn = currentSeason === 'autumn';
  const isWinter = currentSeason === 'winter';
  
  // Autumn items
  const [mushroom] = usePosition(...., !isAutumn);
  const [truffle] = usePosition(...., !isAutumn);

  // Winter items
  const [snowflake] = usePosition(...., !isWinter);
 
  // If we run into any item, add it to our inventory
  useCollision(userPosition, mushroom, () => pickUpItem('mushroom'));
  useCollision(userPosition, truffle, () => pickUpItem('truffle'));
  useCollision(userPosition, snowflake, () => pickUpItem('snowflake'));
  
  return (
    <div>
      <Sprite position={mushroom} />
      <Sprite position={truffle} />
      <Sprite position={snowflake} />
    </div>
  );
};

```

Since positions are really tied to `currentSeason`, it makes more sense here to split our `Farm` into sub-components:

```jsx
const Farm = props => {
  if (props.currentSeason === 'autumn') {
    return (
      <AutumnFarm {...props} />
    );
  } else if (props.currentSeason === 'winter') {
    return (
      <WinterFarm {...props} />
    );
  } else {
    return null;
  }
}

const AutumnFarm = props => {
  const { userPosition, pickUpItem } = props;
  
  const [mushroom] = usePosition(....);
  const [truffle] = usePosition(....);

  useCollision(userPosition, mushroom, () => pickUpItem('mushroom'));
  useCollision(userPosition, truffle, () => pickUpItem('truffle'));
  
  return (
    <div>
      <Sprite position={mushroom} />
      <Sprite position={truffle} />
    </div>
  );
};

const WinterFarm = props => {
  const { userPosition, pickUpItem } = props;
  
  const [snowflake] = usePosition(....);
  useCollision(userPosition, snowflake, () => pickUpItem('snowflake'));
  
  return (
    <div>
      <Sprite position={snowflake} />
    </div>
  );
};
```

In practice, it seems like complex games would need to use a combination of `position.off` and composition. If we wanted the item to disappear from the world once we pick it up, we'd need to turn off the item position or create another component for that case. But each item has a different value driving whether or not it's off (eg. `didPickUpMushroom`, `didPickUpSnowflake`) so new components doesn't make sense.


### API

### Positions

Positions represent objects in 2D space. They come with a bounding box that allows for collision detection with other positions via `useInteraction`.

#### const [position, move(newX, newY, timeLength)] = usePosition(x, y, width, height, off)

Creates a controlled position.

#### const [position, changeAngle(newAngle), changeVelocity(newVelocity)] = useMovingPosition(x, y, width, height, initialAngle, initialVelocity)

Creates a position that moves on its own, in direction defined by `angle` and with speed defined by `velocity`. Angle is in radians.

### World

World provides internal context for positions to register, update, and deregister themselves. It also provides context for collisons to register and deregister.

World allows for positions to be aware of other positions, to cancel movements and fire collision listeners if they collide.

Wrap your App in `withWorld`:

```jsx
withWorld(App);
```

### Collisions

#### useCollision(position, position, callback)

Creates a collision listener for two positions.

***

### Roadmap ideas

#### useCollisonWithKeypress(position1, position2, keycode, callback)

This would allow a collison + keypress listener. Think Pokemon Blue: the user walks up to the PC (a collison) and hits the A button to open the PC.

#### Adding "off" for Collisons

Similar to the `off` parameter for positions, collisons should be able to be turned off if in certain game state. Similar to the example above, hitting the A button should open the PC, but only if the PC isn't already open.
