import React, { SyntheticEvent } from "react";
import { Button } from "semantic-ui-react";

import "./ToggleButton.scss"

export interface ToggleButtonProps {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: (label: string, active: boolean) => void;
}

/** A simple controlled toggle button
 */
const ToggleButton: React.FC<ToggleButtonProps> = (props) => {

  ToggleButton.defaultProps = {
    disabled: false
  }

  const handleClick = (e: SyntheticEvent, data: any): void => {
    const { label, onClick } = props;
    const { active } = data;

    onClick(label, !active);
  }

  const { active, disabled, label } = props; 

  return (
    <Button
      toggle
      disabled={disabled}
      active={active}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}

export default ToggleButton;
