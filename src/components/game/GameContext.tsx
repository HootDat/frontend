import { createContext } from 'react';
import GameState, { home } from './GameState';

const GameContext = createContext<GameState>(home());

export default GameContext;
