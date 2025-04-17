import * as React from 'react';
import * as _ from 'lodash';
import * as BezierEasing from 'bezier-easing';

import { CONST } from 'app/utils';
import { Position } from 'app/models';
import { AnimationLoop } from 'app/utils/animation';

export namespace BonusBoard {
  export interface Props {}

  export interface State {
    bonuses: BonusState[];
  }
}

export class BonusBoard extends React.Component<BonusBoard.Props, BonusBoard.State> {
  static defaultProps: Partial<BonusBoard.Props> = {};

  constructor(props: BonusBoard.Props, context?: any) {
    super(props, context);

    this.state = {
      bonuses: []
    };
  }

  render(): JSX.Element {
    return (
      <div
        style={styles.container}
      >
      {this.state.bonuses.map((bonus, i) => {
        const left = bonus.pos.col * CONST.WIDTH / CONST.GAME_SIZE;
        const top = bonus.pos.row * CONST.WIDTH / CONST.GAME_SIZE
          + CONST.COIN_HEIGHT / 2 - 10
          - bonus.top;

        return (
          <div
            key={`bonus-${i}`}
            style={{
              ...styles.bonusDiv,
              left,
              top,
              opacity: bonus.opacity
            }}
          >
            {bonus.text}
          </div>
        );
      })}
      </div>
    );
  }

  public async bonuseAnimation(
    pos: Position,
    bonusText: string,
    delay: number = 100): Promise<void> {

    let target = this.state.bonuses.find(bonus => this.isEqualBonus(pos, bonusText, bonus));
    const curve = BezierEasing(0.165, 0.84, 0.44, 1);
    const anim = new AnimationLoop(
      (delta) => {
        const state = this.state.bonuses.filter(bonus =>
          !this.isEqualBonus(pos, bonusText, bonus));
        if (!target) {
          target = { pos, text: bonusText, top: 0, opacity: 0 };
        } else {
          target.top = (CONST.COIN_HEIGHT / 3) * curve(delta / BONUS_ANIM_DURATION);
          target.opacity += curve(delta / BONUS_ANIM_DURATION);
        }

        state.push(target);
        this.setState({
          bonuses: state
        });
      },
      BONUS_ANIM_DURATION
    );

    await anim.start();
    if (delay !== -1) {
      setTimeout(() => {
        const state = this.state.bonuses.filter(bonus =>
          !this.isEqualBonus(pos, bonusText, bonus));
        this.setState({
          bonuses: state
        });
      // tslint:disable-next-line:align
      }, delay);
    }
  }

  public clearBoard(): void {
    this.setState({
      bonuses: []
    });
  }

  private isEqualBonus(pos: Position, text: string, bonus: BonusState): boolean {
    return _.isEqual(pos, bonus.pos) && text === bonus.text;
  }
}

interface BonusState {
  pos: Position;
  text: string;
  top: number;
  opacity: number;
}

const BONUS_ANIM_DURATION = 500;

const styles = {
  container: {
    position: 'absolute',
    width: '480px',
    height: '480px',
    top: '240px',
    zIndex: 10,
    pointerEvents: 'none',
  } as React.CSSProperties,
  bonusDiv: {
    position: 'absolute',
    width: `${CONST.COIN_WIDTH}px`,
    height: `${CONST.COIN_HEIGHT}px`,
    color: '#3f9cba',
    textShadow: '-1px 0 #f0edde, 0 1px #f0edde, 1px 0 #f0edde, 0 -1px #f0edde',
    fontSize: 22,
    textAlign: 'center',
  } as React.CSSProperties,
};
