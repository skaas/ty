import { handleActions } from 'redux-actions';
import { OpenDialogPayload, DialogActions } from 'app/actions';
import { DialogState } from 'app/models';

const initialState = {
  showDialog: false,
  title: '',
  msg: '',
  confirmMsg: '',
  cancelMsg: '',
  onConfirm: () => {},
  onCancel: () => {},
} as DialogState;

type GameActionPlayload = OpenDialogPayload;

export const dialogReducer = handleActions<DialogState, GameActionPlayload>(
  {
    [DialogActions.Type.OPEN_DIALOG]: (state, action) => {
      const payload = action.payload as OpenDialogPayload;

      return Object.assign({}, {
        showDialog: true,
        ...payload,
      });
    },
    [DialogActions.Type.CLOSE_DIALOG]: (state, action) => {
      return Object.assign({}, initialState);
    },
  },
  initialState
);
