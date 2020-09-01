import React from 'react';
import PositionDemo from './demos/PositionDemo';
import PongDemo from './demos/PongDemo';
import ChromeDinosaurDemo from './demos/ChromeDinosaurDemo';
import PokemonDemo from './demos/PokemonDemo';
import ConditionalPositionsDemo from './demos/ConditionalPositionsDemo';
import { css } from 'emotion';

const button = css`
  font-size: 24px;
  padding: 8px;
  margin: 8px;
`;

const demos = {
  position: <PositionDemo />,
  pong: <PongDemo />,
  dinosaur: <ChromeDinosaurDemo />,
  pokemon: <PokemonDemo />,
  conditional_positions: <ConditionalPositionsDemo />
}

const App = () => {
  const [demo, setDemo] = React.useState('pokemon');
  if (!demo) {
    return Object.keys(demos).map(name => (
      <button className={button} onClick={() => setDemo(name)}>
        {name}
      </button>
    ));
  } else {
    return demos[demo];
  }
};

export default App;
