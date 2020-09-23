import { PacksState } from '../types/state/packs';
import {
  PacksResponseAction,
  FetchPacksSuccessAction,
  SavePackSuccessAction,
  DeletePackSuccessAction,
} from '../types/actions/packs';
import {
  FETCH_PACKS_SUCCESS,
  SAVE_PACK_SUCCESS,
  DELETE_PACK_SUCCESS,
} from '../actions/constants';

const initialState: PacksState = {
  packs: [],
};

export const packsReducer = (
  state: PacksState = initialState,
  action: PacksResponseAction
): PacksState => {
  switch (action.type) {
    case FETCH_PACKS_SUCCESS: {
      const packs = (action as FetchPacksSuccessAction).payload.items;
      return {
        packs: packs,
      };
    }
    case SAVE_PACK_SUCCESS: {
      const updatedPack = (action as SavePackSuccessAction).payload.item;
      return {
        packs: [
          ...state.packs.filter(pack => pack.id !== updatedPack.id),
          updatedPack,
        ],
      };
    }
    case DELETE_PACK_SUCCESS: {
      const packId = (action as DeletePackSuccessAction).payload.item;
      return {
        packs: [...state.packs.filter(pack => pack.id !== packId)],
      };
    }
    default:
      return state;
  }
};

export default packsReducer;
