## react-game-hooks [WIP]

### API

#### Positions

Positions represent objects in 2D space. They come with a bounding box with allows for collision detection with other positions via `useInteraction`.

#### const [position, requestMove] = usePosition(x, y, width, height)

Creates a controlled position.

#### const [position, changeAngle, changeVelocity]

### useInteraction(position, position, callback)

Creates a collision listener for two positions.

