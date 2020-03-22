const City = () => {
  const [position, move] = usePosition(initialPosition);
  const [position, move] = usePosition(initialPosition);
  useInteraction(position1, position2, () => {
    alert('We hit!')
  });
  useKeyDown('b', () => move(2));
  return (
    <>
      <Position position1/>
      <Position position2/>
    </>
  )
};

const usePosition = initialPosition => {
  // register with global positions
  const [position, setPosition] = useState(initialPosition);
  const [registerPosition, unregisterPosition, attemptMove] = useContext(GlobalPositionsContext);
  useEffect(() => {
    register(position)
    return () => {
      unregister(position)
    }
  }, [position]);
  const move = amount => {
    const canMove = attemptMove(position, amount);
    if (canMove) {
      setPosition()
    }
  }
}

const NonPlayableCharacter = props => {
  const [position, move] = usePosition(initialPosition);
  useInteraction(position, props.userPosition, props.onUserInteraction);
  return (
    <Sprite/>
  );
};
    
const City = () => {
  return (
    {characters.map(c => <NonPlayableCharacter/>}
  );
}
