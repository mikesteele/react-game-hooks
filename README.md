# react-game-hooks
Hooks for creating 2D platform games in React 

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
