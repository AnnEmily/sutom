import React from 'react';
import _map from 'lodash/map';
import clsx from 'clsx';

import { CartridgeTop, KeyType, DataType, Selections, ToggleButton } from '../../Selectors';
import { trace, Verbosity as v } from '../../utils';

import './ExclusionPanel.scss'
import '../panels.scss';


interface ExclusionPanelProps {
  /** Panel title */
  title: string,
  /** Style class for coloring buttons */
  gameColor: string,
  /** Values excluded */
  excluded: Selections,
  /** Callback on user button click */
  onClick: (key: KeyType, active: boolean) => void,
}

/** Controlled component to offer a choice of letters to exclude from the word
 */
const ExclusionPanel: React.FC<ExclusionPanelProps> = (props) => {
  const compName = 'ExclusionPanel';

  trace.arr(v.SILLY, compName, "render", "excluded = ", props.excluded.data);

  return (
    <div className={clsx(compName, 'LetterList', 'cartridge', props.gameColor)}>
      <CartridgeTop title={props.title}>
        {'Select the letters that must not be in the word.'}
      </CartridgeTop>
      <div className='buttons'>
        {_map(props.excluded.getSelections(), ({ key, value, active }: DataType) => {
          const containerClass = clsx(active ? 'exclude' : 'include');

          return (
            <div className={containerClass} key={key}>
              <ToggleButton
                active={active}
                label={value as string}
                onClick={(val, act) => props.onClick(key, act)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExclusionPanel;
