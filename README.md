## react-game-hooks [WIP]

Hooks can be found in `src/react-game-hooks`.

Demos can be found in `src/demos`.

### API

### Positions

Positions represent objects in 2D space. They come with a bounding box that allows for collision detection with other positions via `useInteraction`.

#### const [position, move(newX, newY, timeLength)] = usePosition(x, y, width, height)

Creates a controlled position.

#### const [position, changeAngle(newAngle), changeVelocity(newVelocity)] = useMovingPosition(x, y, width, height, initialAngle, initialVelocity)

Creates a position that moves on its own, in direction defined by `angle` and with speed defined by `velocity`. Angle is in radians.

### Collisions

#### useInteraction(position, position, callback)

Creates a collision listener for two positions.

