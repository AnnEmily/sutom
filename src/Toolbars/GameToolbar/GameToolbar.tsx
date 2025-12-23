import React from "react";
//import { Flag, FlagNameValues } from 'semantic-ui-react'
import _map from 'lodash/map';

import { LengthChooser, TextDropdown } from '../../Selectors';
import {
  GameColorCode,
  GameColorString,
  GameColorType,
  LanguageCode,
  LanguageString,
  LanguageCodeType
} from '../../constants';

import './GameToolbar.scss';

// TODO for LanguageString :
// - add strings to Languages ?
// - key should be provided by the caller
// - consider i18next


const languageOptions =_map(LanguageCode, (lang) => ({
  key: lang,
  text: LanguageString[lang],
  value: lang,
  //image: {flagRenderer('fr')}
}))

const colorOptions =_map(GameColorCode, (gameColorCode) => ({
  key: gameColorCode,
  text: GameColorString[gameColorCode],
  value: gameColorCode,
}))

interface GameToolbarProps {
  language: LanguageCodeType,
  gameColor: GameColorType,
  onColorChange: (gameColor: GameColorType) => void,
  onLengthChange: (wordLength: number) => void,
  onLanguageChange: (lang: LanguageCodeType) => void,
}

const GameToolbar: React.FC<GameToolbarProps> = (props) => {
  const compName = "GameToolbar";

  // AEG keep
  // if (!Array.isArray(Languages) || _isEmpty(Languages)) {
  //   console.error("Error : Languages must be a non empty array");
  //   //throw new Error("Languages must not be empty");
  // }

  //const flagRenderer = (lang) => <Flag name={lang as FlagNameValues} />

  return (
    <div className={compName}>
      <TextDropdown
        label='Dictionary'
        options={languageOptions}
        default={props.language}
        onChange={props.onLanguageChange}
      />
      <TextDropdown
        label='Color set'
        options={colorOptions}
        default={props.gameColor}
        onChange={props.onColorChange}
      />
      <LengthChooser
        label='Word length'
        onChange={props.onLengthChange}
      />
    </div>
  );
}

export default GameToolbar;