/// TODO remove the whole file

import React, { SyntheticEvent } from 'react';
import { Input, Dropdown, DropdownProps } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';

import './GameChooser.scss'

const Games = ['default', 'Sutom (FR)', 'Wordle (EN)', 'Wordle (ES)'] as const;
type GameType = typeof Games[number];
//import { Games, GameType } from '../../constants';


interface GameChooserProps {
  /** String left of dropdown */
  label: string,
  /** Current game */
  game: GameType,
  /** Callback on selection */
  onChange: (value: GameType) => void;
}

/** A labeled Semantic dropdown
 */
const GameChooser: React.FC<GameChooserProps> = (props) => {

  const handleChange = (e: SyntheticEvent, { value }: DropdownProps): void => {
    const { onChange } = props;
    onChange(value as GameType);
  }
 
  if (!Array.isArray(Games) || _isEmpty(Games)) {
    console.error("Error : Games must be a non empty array");
    //throw new Error("Games must not me empty");
  }

  const options = _map(Games, (game) => ({
    key: game,
    text: game,
    value: game
  }));
 
  return (
    <div className="GameChooser">
      <Input
        label={props.label}
        input={
          <Dropdown
            options={options}
            selection
            defaultValue={props.game}
            onChange={handleChange}
          />
        }
      />
    </div>
  );
};

export default GameChooser;
