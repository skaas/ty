import * as React from 'react';
import { Storage } from 'app/utils/storage';

export namespace GameUI {
  export interface Props {
    score: number;
  }
}

export class GameUI extends React.Component<GameUI.Props> {
  static defaultProps: Partial<GameUI.Props> = {};

  constructor(props: GameUI.Props, context?: any) {
    super(props, context);
  }

  render(): JSX.Element {
    return (
      <div style={styles.ui}>
        <div style={styles.titleContainer}>
          <div style={styles.title}>Make 5000</div>
        </div>
        <div style={styles.scoreContainer}>
          <div style={styles.score}>
            <div style={styles.scoreTitle}>Score</div>
            <div style={styles.scoreText}>{this.props.score}</div>
          </div>
          <div style={styles.score}>
            <div style={styles.scoreTitle}>Best</div>
            <div style={styles.scoreText}>{Storage.getBestScore()}</div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  ui: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 'auto',
    height: '100px',
  } as React.CSSProperties,
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  title: {
    flex: 1,
    marginLeft: '10px',
    color: '#3f9cba',
    fontSize: '40px',
  } as React.CSSProperties,
  coin: {
    height: '50%',
    paddingLeft: '10px',
  } as React.CSSProperties,
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  } as React.CSSProperties,
  score: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '10px',
    padding: '10px',
    borderRadius: '5px',
    color: '#ffffff',
    background: '#3f9cba',
  } as React.CSSProperties,
  scoreTitle: {
    fontSize: '15px',
  } as React.CSSProperties,
  scoreText: {
    fontSize: '20px',
    marginTop: '10px',
  } as React.CSSProperties,
};
