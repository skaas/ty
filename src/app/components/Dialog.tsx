import * as React from 'react';
import { CONST } from 'app/utils';
import { DialogState } from 'app/models';

export namespace Dialog {
  export interface Props {
    dialog: DialogState;
  }

  export interface State {}
}

export class Dialog extends React.Component<Dialog.Props, Dialog.State> {
  static defaultProps: Partial<Dialog.Props> = {};

  constructor(props: Dialog.Props, context?: any) {
    super(props, context);
  }

  render(): JSX.Element {
    return (
      <div
        style={{
          ...styles.container,
          visibility: this.props.dialog.showDialog ? 'visible' : 'hidden',
        }}
        onClick={() => {}}
      >
        <div style={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <div id="dialog-title" style={styles.title}>{this.props.dialog.title}</div>
          <div style={styles.msg}>
            <div style={styles.msgContent}>
              {this.props.dialog.msg}
            </div>
          </div>
          <div style={styles.buttons}>
            <div
              style={{
                ...styles.button,
                background: '#3f9cba',
                display: this.props.dialog.cancelMsg.length === 0 ? 'none' : 'flex',
              }}
              onClick={() => { this.props.dialog.onCancel(); }}
            >
              {this.props.dialog.cancelMsg}
            </div>
            <div
              style={{
                ...styles.button,
                background: '#58d6c0',
              }}
              onClick={() => { this.props.dialog.onConfirm(); }}
            >
              {this.props.dialog.confirmMsg}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    top: '0px',
    height: '100%',
    background: 'rgba(238, 238, 238, 0.4)',
    zIndex: 100,
    touchAction: 'manipulation',
  } as React.CSSProperties,
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    width: `${CONST.WIDTH * 0.8}px`,
    marginLeft: `${CONST.WIDTH * 0.1 - 10}px`,
    marginRight: `${CONST.WIDTH * 0.1 - 10}px`,
    padding: '10px',
    background: '#ffffff',
    borderRadius: '10px',
    userSelect: 'none',
  } as React.CSSProperties,
  title: {
    fontSize: '24px',
    color: '#58d6c0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: '10px',
    userSelect: 'none',
  } as React.CSSProperties,
  msg: {
    fontSize: '16px',
    color: '#333333',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    userSelect: 'none',
  } as React.CSSProperties,
  msgContent: {
    margin: '0 auto',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '10px',
    paddingBottom: '10px',
    userSelect: 'none',
  } as React.CSSProperties,
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    fontSize: '20px',
    marginBottom: '10px',
  } as React.CSSProperties,
  button: {
    width: `${CONST.WIDTH * 0.3}px`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderRadius: '5px',
    color: 'white',
    userSelect: 'element',
    cursor: 'pointer',
    touchAction: 'manipulation',
  } as React.CSSProperties,
};
