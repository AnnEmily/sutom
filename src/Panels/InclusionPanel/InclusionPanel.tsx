import React from 'react';
import clsx from 'clsx';

import { CartridgeTop, Selections, KeyType, ValueType } from '../../Selectors';
import { PositionFixed, PositionVariable } from '../../Specifiers';
import { trace, Verbosity as v } from '../../utils';

import './InclusionPanel.scss';
import '../panels.scss';

interface InclusionPanelProps {
  alphabet: string[],
  included: Selections,
  title: string,
  gameColor: string,
  wordLength: number,
  onChange: (key: KeyType, value: ValueType, position: number) => void,
  onAdd: (value: ValueType, position: number) => void,
  onRemove: (key: KeyType) => void,
}

/** Controlled component to offer a choice of letters required in the word
 */
const InclusionPanel: React.FC<InclusionPanelProps> = (props)  => {
  const compName = 'InclusionPanel';

  const handleChange = (key: KeyType, value: ValueType) => {
    const { included, onChange } = props;
    
    const position = included.getPosition(key);

    trace.str(v.DEBUG, compName, "handleClick", "value = " + value + ", key = " + key + ", position = " + position);

    onChange(key, value, position);
  }

  const handleAdd = (value: ValueType, position: number) => {
    const { onAdd } = props;

    trace.str(v.DEBUG, compName, "handleAdd", "value = " + value + ", position = " + position);

    onAdd(value, position);
  }

  const handleRemove = (key: KeyType) => {
    const { onRemove } = props;
    
    trace.str(v.DEBUG, compName, "handleRemove", "key = " + key);

    onRemove(key);
  }

  const { alphabet, included, title, wordLength } = props;
  const compClass = clsx(compName, 'LetterList', 'cartridge', props.gameColor);

  trace.arr(v.SILLY, compName, "render", "included = ", included.data);

  return (
    <div className={compClass}>
      <CartridgeTop title={title}>
        {'Select the letters that must be in the word, whether at some known or unknown position.'}
      </CartridgeTop>
      <PositionFixed
        label="At exact position :"
        alphabet={alphabet}
        wordLength={wordLength}
        included={included}
        onClick={handleChange}
      />
      <PositionVariable
        label="At some position :"
        alphabet={alphabet}
        wordLength={wordLength}
        included={included}
        onChange={handleChange}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
    </div>
  );
}

export default InclusionPanel;
