import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { SelectorSet, Selections, KeyType, ValueType } from '../Selectors';
import { trace, Verbosity as v } from '../utils';
import { UnselectedValue } from '../constants';

import "./specifier.scss"

interface PositionFixedProps {
  label: string,
  alphabet: string[],
  wordLength: number,
  included: Selections,
  onClick: (key: KeyType, value: ValueType) => void,
}


/** A controlled component to specify a required letter at a specific position in the word
 */
const PositionFixed: React.FC<PositionFixedProps> = (props) => {
  const compName = 'PositionFixed';

  //----------------------------------------------------------------
  // State hooks
  //----------------------------------------------------------------

  const [included, setIncluded] = useState(props.included);

  //----------------------------------------------------------------
  // Effect hooks
  //----------------------------------------------------------------

  useEffect(() => {
    setIncluded(props.included);
  }, [
    props.included,
  ]);

  //----------------------------------------------------------------
  // Render
  //----------------------------------------------------------------

  trace.arr(v.SILLY, compName, "render", "included = ", props.included.data);

  return (
    <div className={clsx(compName, 'PositionSpecifier')}>
      <div className='label-container labeled'>
        <div className='label'>
          {props.label}
        </div>
      </div>
      <SelectorSet
        alphabet={[UnselectedValue, ...props.alphabet]}
        selections={included}
        minCount={props.wordLength}
        showLabel
        onClick={props.onClick}
      />
    </div>
  );
}

export default PositionFixed;
