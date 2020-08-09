import React, {
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { WorldContext } from './World';
import { uniqueId } from 'lodash';

const useCollisionWithKeypress = (position1, position2, keycode, callback) => {
  const [id] = useState(uniqueId());
  const [
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
  ] = useContext(WorldContext);

  useEffect(() => {
    addCollisonWithKeypress(position1, position2, keycode, id, callback);
    return () => removeCollisonWithKeypress(position1, position2, keycode, id, callback);
  }, [id, callback, keycode, addCollisonWithKeypress, removeCollisonWithKeypress]);
};

export default useCollisionWithKeypress;
