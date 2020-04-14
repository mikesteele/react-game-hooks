import React from 'react';
import { isInteracting } from './useInteraction';
import { makeFormattedPosition } from './usePosition';

export const withWorld = WrappedComponent => props => (
  <World>
    <WrappedComponent {...props} />
  </World>
);

export const WorldContext = React.createContext([
  {},         // allPositions
  () => {},   // addSelf
  () => {},   // removeSelf
  () => true, // canMoveToTarget
  () => {},   // onCollison
  () => {},   // addCollison
  () => {}    // removeCollison
]);

const World = props => {
  const [allPositions, setAllPositions] = React.useState({});
  const addSelf = (position) => setAllPositions(prevPositions => {
    const nextPositions = {...prevPositions};
    nextPositions[position.id] = position;
    return nextPositions;
  });
  const removeSelf = (position) => {
    setAllPositions(prevPositions => {
      delete prevPositions[position.id];
      return prevPositions;
    });
  };
  const canMoveToTarget = (nextX, nextY, positionId) => {
    let canMove = true;

    const nextPosition = makeFormattedPosition({
      ...allPositions[positionId],
      x: nextX,
      y: nextY
    });

    Object.keys(allPositions).forEach(id => {
      if (id !== positionId) {
        const otherPosition = makeFormattedPosition(allPositions[id]);
        if (isInteracting(otherPosition, nextPosition)) {
          canMove = false;
        }
      }
    });

    return canMove;
  };
  const value = [
    allPositions,
    addSelf,
    removeSelf,
    canMoveToTarget,
    // TODO
    () => {},
    () => {},
    () => {}
  ];
  return (
    <WorldContext.Provider value={value}>
      {props.children}
    </WorldContext.Provider>
  );
}

export default World;
