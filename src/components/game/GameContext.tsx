import { createContext } from 'react';
import GameManager from './GameManager';

const GameContext = createContext<GameManager>({} as GameManager);

export default GameContext;
