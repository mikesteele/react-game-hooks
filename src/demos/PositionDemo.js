import React from 'react';
import { usePosition } from '../react-game-hooks';

const PositionDemo = () => {
  const [position, move] = usePosition(100, 100, 100, 100);
  const styles = {
    position: 'fixed',
    top: position.y,
    left: position.x,
    width: 100,
    height: 100,
    background: 'salmon'
  };
  const onClickButtonOne = () => {
    move(300, 100, 600);
  };
  const onClickButtonTwo = () => {
    move(100, 300, 200);
  };
  const onClickButtonThree = () => {
    move(0, 100);
  };
  return (
    <>
      <div style={styles} />
      <button onClick={onClickButtonOne}>Button 1</button>
      <button onClick={onClickButtonTwo}>Button 2</button>
      <button onClick={onClickButtonThree}>Button 3</button>
    </>
  );
}

export default PositionDemo;
