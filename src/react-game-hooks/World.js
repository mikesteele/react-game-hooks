import React, { useCallback, useEffect } from 'react';
import { isInteracting } from './useInteraction';
import { makeFormattedPosition } from './usePosition';
import _get from 'lodash/get';
import _set from 'lodash/set';

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
  () => {},   // removeCollison
  () => {},   // addCollisonWithKeypress
  () => {},   // removeCollisonWithKeypress
  () => {},   // onMoveSuccessful
  []          // touches - TODO - Remove
]);

const World = props => {
  const [allPositions, setAllPositions] = React.useState({});
  const [allCollisons, setAllCollisons] = React.useState({});
  const [allCollisonsWithKeypress, setAllCollisonsWithKeypress] = React.useState({});
  const [touches, setTouches] = React.useState({});
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
    let collisionTargetId = null;

    const nextPosition = makeFormattedPosition({
      ...allPositions[positionId],
      x: nextX,
      y: nextY
    });

    Object.keys(allPositions).forEach(id => {
      if (id !== positionId) {
        const otherPosition = makeFormattedPosition(allPositions[id]);
        if (isInteracting(otherPosition, nextPosition)) {
          collisionTargetId = id;
        }
      }
    });
    return collisionTargetId;
  };

  const onCollison = useCallback((p1, p2) => {
    if (allCollisons[p1] && allCollisons[p1][p2]) {
      Object.keys(allCollisons[p1][p2]).forEach(key => {
        // Fire all listeners
        allCollisons[p1][p2][key]();
      });
    }
    // Check for collisons defined in reverse order
    if (allCollisons[p2] && allCollisons[p2][p1]) {
      Object.keys(allCollisons[p2][p1]).forEach(key => {
        // Fire all listeners
        allCollisons[p2][p1][key]();
      });
    }

    // Set them as touching
    setTouches(touches => {
      _set(touches, [p1, p2], true);
      return touches;
    });
  }, [allCollisons, setTouches]);

  const addCollison = useCallback((position1, position2, id, callback) => {
    const p1 = position1.id;
    const p2 = position2.id;
    setAllCollisons(collisions => {
      if (collisions[p1] && collisions[p1][p2]) {
        collisions[p1][p2][id] = callback;
      } else if (collisions[p1]) {
        collisions[p1][p2] = {};
        collisions[p1][p2][id] = callback;
      } else {
        collisions[p1] = {};
        collisions[p1][p2] = {};
        collisions[p1][p2][id] = callback;
      };
      return collisions;
    });
  }, [setAllCollisons]);

  const removeCollison = useCallback((position1, position2, id) => {
    const p1 = position1.id;
    const p2 = position2.id;
    setAllCollisons(collisions => {
      delete collisions[p1][p2][id];
      return collisions;
    });
  }, [setAllCollisons]);

  const addCollisonWithKeypress = useCallback((position1, position2, keycode, id, callback) => {
    const p1 = position1.id;
    const p2 = position2.id;
    setAllCollisonsWithKeypress(collisions => {
      _set(collisions, [keycode, p1, p2, id], callback);
      return collisions;
    });
  }, [setAllCollisonsWithKeypress]);

  const removeCollisonWithKeypress = useCallback((position1, position2, keycode, id) => {
    const p1 = position1.id;
    const p2 = position2.id;
    setAllCollisonsWithKeypress(collisions => {
      delete collisions[keycode][p1][p2][id];
      return collisions;
    });
  }, [setAllCollisonsWithKeypress]);

  const onMoveSuccessful = useCallback((id) => {
    setTouches(touches => {
      Object.keys(touches).forEach(p1 => {
        Object.keys(touches[p1]).forEach(p2 => {
          if (p1 === id || p2 === id) {
            delete touches[p1][p2];
          }
        });
      });
      return touches;
    });
  }, [setTouches]);

  const onKeyDown = useCallback(e => {
    const keycode = e.keyCode;
    if (keycode && allCollisonsWithKeypress[keycode]) {
      Object.keys(allCollisonsWithKeypress[keycode]).forEach(p1 => {
        Object.keys(allCollisonsWithKeypress[keycode][p1]).forEach(p2 => {
          if (_get(touches, [p1, p2]) || _get(touches, [p2, p1])) {
            Object.keys(allCollisonsWithKeypress[keycode][p1][p2]).forEach(key => {
              // Fire all listeners
              allCollisonsWithKeypress[keycode][p1][p2][key]();
            });
          }
        });
      })
    }
  }, [touches]);

  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown);
    return () => document.body.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const value = [
    allPositions,
    addSelf,
    removeSelf,
    canMoveToTarget,
    onCollison,
    addCollison,
    removeCollison,
    addCollisonWithKeypress,
    removeCollisonWithKeypress,
    onMoveSuccessful,
    touches // TODO - Remove
  ];
  return (
    <WorldContext.Provider value={value}>
      {props.children}
    </WorldContext.Provider>
  );
}

export default World;
