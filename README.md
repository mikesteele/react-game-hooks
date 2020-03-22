# react-game-hooks
Hooks for creating 2D platform games in React 

## Guidelines

These are not hard rules, but helpful in creating a larger 

### A sprite (?) is one position and its interactions

Due to the rules of hooks, you can't create hooks in loops.

As opposed to creating a group of non-playable characters like this:

```
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

```
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
