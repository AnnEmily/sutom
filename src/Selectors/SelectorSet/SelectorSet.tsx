import React from 'react';
import _filter from 'lodash/filter';
import _map from 'lodash/map';

import { Selections, KeyType, ValueType } from './Selections';
import DropdownSelector from '../DropdownSelector';
import { trace, Verbosity as v } from '../../utils';


export interface SelectorSetProps {
  /** Set of symbols to offer in each selector */
  alphabet: string[],
  /** */
  wordLength?: number,
  /** Data class of {key, value} */
  selections: Selections,
  /** Min number of selectors if selections is empty. Default : 1 */
  minCount?: number,
  /** Whether to show the position+1 above each selector. Default : false */
  showLabel?: boolean,
  /** Retain selections whose position < 0. Default : false */
  selectNegative?: boolean,
  /** Callback on selection */
  onClick: (key: KeyType, value: ValueType) => void,
}

/** Collection of controlled dropdown selectors
 */
const SelectorSet: React.FC<SelectorSetProps> = (props) => {
  const compName = 'SelectorSet';

  const handleClick = (key: KeyType, value: ValueType): void => {
    const { onClick } = props;

    trace.str(v.DEBUG, compName, "handleClick", "value = " + value + ", key = " + key);

    onClick(key, value);
  }

  const {
    alphabet,
    wordLength = 0,
    selectNegative = false,
    minCount = 1,
    selections,
    showLabel = false,
  } = props;

  if (selections.getLength() === 0) selections.resetSelections(minCount);

  trace.arr(v.SILLY, compName, "render", "selections = ", selections.data);

  return (
    <div className={compName}>
      {_map(
        _filter(selections.getSelections(), ({ position }) => {
          return selectNegative ? position < 0 : position >= 0;
        }),
        ({ key, value, position }) => {
          const label = showLabel ? position + 1 : null;
          
          return (
            <div className='singleSelector' key={key}>
              <DropdownSelector
                index={key}
                label={label}
                alphabet={alphabet}
                wordLength={wordLength}
                value={value}
                onChange={handleClick}
              />
            </div>
          );
        }
      )}
    </div>
  )
}

export default SelectorSet;