import React from "react";

import { ThemeChooser } from '../../Selectors';
import { trace, Verbosity as v } from '../../utils';

import './TopToolbar.scss';


interface TopToolbarProps {
  darkTheme: boolean,
  onChangeTheme: (isDark: boolean) => void,
}

const TopToolbar: React.FC<TopToolbarProps> = (props) => {
  const compName = "TopToolbar";

  const handleChangeTheme = (isDark: boolean): void => {
    const { onChangeTheme } = props;

    trace.str(v.SILLY, compName, "onChangeTheme", "new theme is " + (isDark ? "dark" : "normal"));

    onChangeTheme(isDark || false);
  }

  const { darkTheme } = props;

  return (
    <div className={compName}>
      <ThemeChooser
        type='icon'
        darkTheme={darkTheme}
        onClick={handleChangeTheme}
      />
    </div>
  );
}

export default TopToolbar;

