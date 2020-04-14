import React from 'react';

export const isInteracting = (firstPosition, secondPosition) => {
  // Source: https://stackoverflow.com/questions/2752349/fast-rectangle-to-rectangle-intersection
  const r1 = {
    top: firstPosition.boundingBox.topLeft.y,
    bottom: firstPosition.boundingBox.bottomRight.y,
    right: firstPosition.boundingBox.bottomRight.x,
    left: firstPosition.boundingBox.topLeft.x
  };
  const r2 = {
    top: secondPosition.boundingBox.topLeft.y,
    bottom: secondPosition.boundingBox.bottomRight.y,
    right: secondPosition.boundingBox.bottomRight.x,
    left: secondPosition.boundingBox.topLeft.x
  };
  if (
    !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
    )
  ) {
    return true;
  } else {
    return false;
  }
}

const useInteraction = (firstPosition, secondPosition, onInteraction) => {
  React.useEffect(() => {
    if (isInteracting(firstPosition, secondPosition)) {
      onInteraction();
    }
  }, [firstPosition, secondPosition, onInteraction]);
  return null;
};

export default useInteraction;
