import React, { SyntheticEvent } from 'react';
import { Input, Dropdown, DropdownProps } from 'semantic-ui-react';

import { arrayIndexes } from '../../utils';
import { WordLengthLimits } from '../../constants';

import './LengthChooser.scss'

interface LengthChooserProps {
  /** String left of dropdown */
  label: string,
  /** Callback on selection */
  onChange: (value: number) => void;
}

/** A labeled Semantic dropdown
 */
const LengthChooser: React.FC<LengthChooserProps> = (props) => {

  const handleChange = (e: SyntheticEvent, { value }: DropdownProps): void => {
    const { onChange } = props;
    onChange(value as number);
  }

  const { label } = props;
  const length = WordLengthLimits.MAX - WordLengthLimits.MIN + 1;

  const options = arrayIndexes(length).map((index) => {
    const value = index + WordLengthLimits.MIN;
    return {
      key: value,
      text: value.toString(),
      value: value
    };
  });

  return (
    <div className="LengthChooser">
      <Input
        label={label}
        input={
          <Dropdown
            options={options}
            selection
            compact
            defaultValue={WordLengthLimits.DEFAULT}
            onChange={handleChange}
          />
        }
      />
    </div>
  );
};

export default LengthChooser;
