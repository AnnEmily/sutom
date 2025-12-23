import React, { SyntheticEvent } from 'react';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import clsx from 'clsx';

import { KeyType, ValueType } from '../';
import { isUnselected, trace, Verbosity as v } from '../../utils';

import './DropdownSelector.scss';

/**
 * * label - character or number to display above the selector, Default: null
 * * alphabet - Set of symbols to offer in the dropdown
 * * value - symbol selected
 * * index - Unique key of the selector
 * * onChange - Callback on selection
 * * wordLength - enable drawer with values. Default: 0 
 */
export interface DropdownSelectorProps {
  label?: string | number | null,
  alphabet: string[],
  value: ValueType,
  index: KeyType,
  wordLength?: number,
  onChange: (key: KeyType, value: ValueType) => void,

}

/** A single controlled Semantic dropdown
 */
const DropdownSelector: React.FC<DropdownSelectorProps> = (props) => {
  const compName = 'DropdownSelector';

  const handleChange = (e: SyntheticEvent, { value }: DropdownProps ): void => {
    const { index, onChange } = props;

    trace.str(v.SILLY, compName, "handleChange", "value = " + value + ", key = " + index);

    onChange(index, value as ValueType);
  }

  const handleOpen = (): void => {
    // TODO : here, openDrawer. Must design drawer component first
    trace.str(v.SILLY, compName, "handleOpen");
  }

  const { label = null, alphabet, value } = props;

  const selectedClass = isUnselected(value) ? 'unselected' : 'selected';
  const selectorClass = clsx('selector', selectedClass);

  const options = alphabet.map((letter, index) => {
    return {
      key: index,
      text: letter,
      value: letter
    };
  });

  return (
    <div className={compName}>
      {label 
        ? (<div className='label'>{label}</div>)
        : null
      }
      <div className={selectorClass}>
        <Dropdown
          options={options}
          selection
          value={value as string}
          onChange={handleChange}
        />
        {props.wordLength === 0 || isUnselected(value)
          ? null
          : (
            <div className='openIcon' onClick={handleOpen}>
              •
            </div>
          )
        }
      </div>
    </div>
  );
}

export default DropdownSelector;
