import React from 'react';
import { Icon } from 'semantic-ui-react';
import _some from 'lodash/some';
import clsx from 'clsx';

import { SelectorSet, Selections, KeyType, ValueType } from '../Selectors';
import { isUnselected, trace, Verbosity as v } from '../utils';
import { UnselectedValue } from '../constants';

import './specifier.scss';

interface PositionVariableProps {
  label: string,
  alphabet: string[],
  wordLength: number,
  included: Selections,
  onChange: (key: KeyType, value: ValueType) => void,
  onAdd: (value: ValueType, position: number) => void,
  onRemove: (key: KeyType) => void,
}

const minSelectorCount = 1;

/** A controlled component to specify a required letter at any position in the word
 */
const PositionVariable: React.FC<PositionVariableProps> = (props) => {
  const compName = 'PositionVariable';

  const handleLetterChange = (key: KeyType, value: ValueType): void => {
    const { onChange, onRemove } = props;

    trace.str(v.DEBUG, compName, "handleLetterChange", "value = " + value + ", key = " + key);

    if (isUnselected(value)) {
      onRemove(key);
    } else {
      onChange(key, value);
    }
  }

  const handleAddSelector = (): void => {
    const { onAdd } = props;

    if (canAddSelectors()) {
      trace.str(v.DEBUG, compName, "handleAddSelector", "will define a new inclusion, null value");
      onAdd(UnselectedValue, -1);
    }
  }

  const canAddSelectors = (): boolean => {
    const { alphabet, included } = props;

    const hasUnselected = _some(included.getSelections(), ({ position, active }) => {
      return position === -1 && !active;
    });

    const hasMaxSelectors = included.getLength() === alphabet.length;
    return !hasUnselected && !hasMaxSelectors;
  }

  const { alphabet, included, label, wordLength } = props;

  if (included.getLength() === 0 || !included.hasPosition(-1)){
    included.addSelection(UnselectedValue, -1, false);
  }

  const iconObjClass = clsx('blue', !canAddSelectors() && 'disabled');
  const compClass = clsx(compName, 'PositionSpecifier');

  trace.arr(v.SILLY, compName, "render", "included = ", included.data);

  return (
    <div className={compClass}>
      <div className='label-container'>
        <div className='label'>
          {label}
        </div>
      </div>
      <SelectorSet
        alphabet={[UnselectedValue, ...alphabet]}
        wordLength={wordLength}
        selections={included}
        selectNegative
        minCount={minSelectorCount}
        onClick={handleLetterChange}
      />
      <div className='add-icon' onClick={handleAddSelector}>
        <Icon
          name='add circle'
          className={iconObjClass}
        />
      </div>
    </div>
  );
}

export default PositionVariable;
