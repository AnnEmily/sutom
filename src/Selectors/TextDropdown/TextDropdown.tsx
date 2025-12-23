import React from 'react';
import { Input, Dropdown} from 'semantic-ui-react';

import './TextDropdown.scss'

// TODO remove 'any' and replace by the type provided by the caller
type ValueType = any;

type OptionType = {
  key: string,
  text: string,
  value: ValueType,
}

interface TextDropdownProps {
  /** String left of dropdown */
  label: string,
  /** Options */
  options: OptionType[],
  /** Default value */
  default: ValueType,
  /** Callback on selection */
  onChange: (value: ValueType) => void;
}

/** A labeled Semantic dropdown for text.
 */
const TextDropdown: React.FC<TextDropdownProps> = (props) => {
  const compName = 'TextDropdown';

  return (
    <div className={compName}>
      <Input
        label={props.label}
        input={
          <Dropdown
            options={props.options}
            selection
            compact
            defaultValue={props.default}
            onChange={(e, { value }) => props.onChange(value as ValueType)}
          />
        }
      />
    </div>
  );
};

export default TextDropdown;
