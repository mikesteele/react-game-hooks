import React, {
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { WorldContext } from './World';
import { uniqueId } from 'lodash';

const useCollision = (position1, position2, callback) => {
  const [id] = useState(uniqueId());
  const worldContext = useContext(WorldContext);
  const addCollison = worldContext[5];
  const removeCollison = worldContext[6];

  useEffect(() => {
    addCollison({
      id,
      callback
    });
    return () => removeCollison({
      id
    });
  }, [callback]);
};

export default useCollision;
