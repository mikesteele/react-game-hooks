## react-game-hooks [WIP]

Demos can be found in `src/demos`.

### API

### Positions

Positions represent objects in 2D space. They come with a bounding box with allows for collision detection with other positions via `useInteraction`.

#### const [position, requestMove] = usePosition(x, y, width, height)

Creates a controlled position.

#### const [position, changeAngle, changeVelocity] = useMovingPosition(x, y, width, height, initialAngle, initialVelocity)

Creates a position that moves on its own, in direction defined by `angle` and with speed defined by `velocity`.

### Collisions

#### useInteraction(position, position, callback)

Creates a collision listener for two positions.

