import React from "react";
import { Checkbox } from "semantic-ui-react";
import DarkModeTwoTone from "@mui/icons-material/DarkModeTwoTone";
import LightModeTwoTone from "@mui/icons-material/LightModeTwoTone";

import { trace, Verbosity as v } from '../../utils';

import './ThemeChooser.scss';


interface ThemeChooserProps {
  darkTheme: boolean,
  type: 'icon' | 'toggle',
  onClick: (checked: boolean) => void,
}

const ThemeChooser: React.FC<ThemeChooserProps> = (props) => {
  const compName = "ThemeChooser";

  const handleChangeTheme = (isDark: boolean): void => {
    const { onClick } = props;
    
    trace.str(v.SILLY, compName, "handleChangeTheme", "new theme is " + (isDark ? "dark" : "normal"));
    
    onClick(isDark || false);
  }

  const chooserIcon = (): JSX.Element => {
    const iconTooltip = `Switch to ${darkTheme ? 'light' : 'dark'} mode`;
    // TODO find relevant component props to avoid custom styling through css
    return (
      <div
        className='icon'
        title={iconTooltip}
        onClick={(e) => handleChangeTheme(!darkTheme)} >
        { darkTheme ? <DarkModeTwoTone/> : <LightModeTwoTone />}
      </div>
    );
  }

  const chooserToggle = (): JSX.Element => (
    <Checkbox 
      toggle
      checked={darkTheme}
      label={'Dark'}
      onClick={(e) => handleChangeTheme(!darkTheme)}
    />
  );

  const { darkTheme, type } = props;
  
  return (
    <div className={compName}>
      {type === 'icon' ? chooserIcon() : chooserToggle()}
    </div>
  );
}

export default ThemeChooser;