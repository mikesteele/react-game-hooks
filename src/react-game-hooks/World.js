import React from 'react';

export const withWorld = WrappedComponent => props => (
  <World>
    <WrappedComponent {...props} />
  </World>
);

export const WorldContext = React.createContext([
  {},       // allPositions
  () => {}, // addSelf
  () => {}  // removeSelf
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
  const value = [
    allPositions,
    addSelf,
    removeSelf
  ];
  return (
    <WorldContext.Provider value={value}>
      {props.children}
    </WorldContext.Provider>
  );
}

export default World;
