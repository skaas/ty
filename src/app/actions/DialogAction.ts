import { createAction } from 'redux-actions';
import { DialogState } from 'app/models';

export namespace DialogActions {
  export enum Type {
    OPEN_DIALOG = 'OPEN_DIALOG',
    CLOSE_DIALOG = 'CLOSE_DIALOG'
  }

  export const openDialog = createAction<OpenDialogPayload>(Type.OPEN_DIALOG);
  export const closeDialog = createAction(Type.CLOSE_DIALOG);
}

export type OpenDialogPayload = Omit<DialogState, 'showDialog'>;

export type DialogActions = Omit<typeof DialogActions, 'Type'>;
