# react-game-hooks
Hooks for creating 2D platform games in React

This library focuses primarily on:
* Bounding box calculation
* Interactions between bounding boxes
* Preventing collisions between bounding boxes

## API

### usePosition

```
const [spritePosition, moveSprite] = usePosition(initialBoundingBox);
```

`usePosition` creates a bounding box for a sprite. It comes with:

```

```

It also registers the position to prevent collisions with other positions.

### useInteraction

```
useInteraction(position1, position2, callback);
```

## Guidelines

### A sprite is one position and its interactions

Due to the rules of hooks, you can't create hooks in conditions or loops. But screens in games often have variable amounts and types of sprites depending on game context.

As opposed to creating a group of non-playable sprites like this:

```jsx
const City = () => {
  const [position, move] = usePosition(initialPosition);
  const [position, move] = usePosition(initialPosition);
  useInteraction(position1, position2, () => {
    alert('We hit!')
  });
  return (
    <>
      <Position position1/>
      <Position position2/>
    </>
  )
};
```

Move the positions into their own component:

```jsx
const NonPlayableCharacter = props => {
  const [position, move] = usePosition(initialPosition);
  useInteraction(position, props.userPosition, props.onUserInteraction);
  return (
    <Sprite/>
  );
};
    
const City = () => {
  return (
    {characters.map(c => <NonPlayableCharacter/>)}
  );
}

```

This allows for variable amounts and types sprites on a screen.

### Couple sprite wrappers to scenes, abstract shared visuals

Positions and interactions of sprites change in different scenes. Instead of making bulky shared sprites full of complex scene logic, prefer to couple "sprite wrappers" to scenes, which define positions and interactions.

```jsx
// This Sprite can contain walking animations, etc.
import EnemySprite from './EnemySprite';

const EnemySpriteWrapper = () => {
  const position = usePosition();
  
  // Define interactions specific to this scene
  
  return (
    <EnemySprite position={position} />
  );
};

const FinalBossScene = () => {
  return (
    <EnemySpriteWrapper/>
  );
};

```

```
