import { createContext } from 'react';
import GameState, { reset } from './GameState';

const GameContext = createContext<GameState>(reset());

export default GameContext;
