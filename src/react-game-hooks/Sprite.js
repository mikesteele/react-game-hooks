import React from 'react';

const Sprite = props => {
  let background = 'salmon';
  if (props.image) {
    background = `url('${props.image}')`;
  } else if (props.backgroundColor) {
    background = props.backgroundColor;
  }
  return (
    <div
      style={{
        position: 'fixed',
        top: props.position.y,
        left: props.position.x,
        background,
        width: props.position.width,
        height: props.position.height,
        ...props.style
      }}
      id={props.position.id}
    />
  );
};

export default Sprite;
