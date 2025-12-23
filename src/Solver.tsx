import React from 'react';
import { Segment, Header } from "semantic-ui-react";
import _filter from 'lodash/filter';
import _flatMap from 'lodash/flatMap';
import clsx from 'clsx';

import { ExclusionPanel, InclusionPanel, WordFilter } from './Panels';
import { Position, Selections, KeyType, ValueType } from './Selectors';
import { GameToolbar, TopToolbar } from './Toolbars';
import { arrayIndexes, className, isUnselected, trace, Verbosity as v } from './utils';
import { GameColorType, LanguageCodeType, LatinLetters, UnselectedValue, WordLengthLimits } from './constants';

import "./solver.scss";

const ALPHABET = LatinLetters;

interface SolverProps {}

interface SolverState {
  language: LanguageCodeType,
  gameColor: GameColorType,
  darkTheme: boolean,
  wordLength: number,
  includedLetters: Selections,
  excludedLetters: Selections,
}

class Solver extends React.Component<SolverProps, SolverState> {

  initExcluded = (values: ValueType[]): Selections => {
    const obj = new Selections(0, '');
    obj.resetSelectionWithValues(values);
    return obj;
  };

  initIncluded = (count: number): Selections => {
    const obj = new Selections(0, UnselectedValue);
    obj.resetSelectionWithPositions(arrayIndexes(count));
    return obj;
  }

  constructor(props: SolverProps) {
    super(props);

    this.state = {
      language: 'fr',
      gameColor: 'default',
      darkTheme: true,
      wordLength: WordLengthLimits.DEFAULT,
      includedLetters: this.initIncluded(WordLengthLimits.DEFAULT),
      excludedLetters: this.initExcluded(ALPHABET),
    };
  }

  //------------------------------------------------
  // Event handlers
  //------------------------------------------------

  addIncluded = (letter: ValueType, position: number): void => {

    trace.str(v.DEBUG, className(this), "addIncluded", "no specific letter is required at new position " + position);

    this.setState((prevState) => {
      const includedLetters = prevState.includedLetters;
      includedLetters.addSelection(letter, position, false);
      return { includedLetters };
    });
  }

  changeGameColor = (gameColor: GameColorType): void => {
    trace.str(v.NORMAL, className(this), "changeGameColor", "gameColor = " + gameColor);
    this.setState({ gameColor });
  }

  changeIncluded = (key: KeyType, letter: ValueType, position: number): void => {

    const isActive = !isUnselected(letter);

    if (isActive) {
      trace.str(v.NORMAL, className(this), "changeIncluded", letter + " is required at " +
        (position < 0 ? "some position" : "exact position " + position)
      );
    } else {
      trace.str(v.NORMAL, className(this), "changeIncluded", "no specific letter is required at position " + position);
    }

    this.setState((prevState) => {
      // Set value+active in includedLetters
      const includedLetters = prevState.includedLetters;
      includedLetters.setValue(key, letter);
      includedLetters.setActive(key, isActive);

      // Clear active for that value in excludedLetters
      const excludedLetters = prevState.excludedLetters;

      if (letter !== UnselectedValue) {
        const excludedData = _filter(excludedLetters.getSelections(), ({ value }) => {
          return value === letter;
        });

        if (excludedData.length === 0) {
          console.warn("Letter %s was not found in excludedLetters", letter);
        } else if (excludedData.length > 1) {
          console.warn("Letter %s is found many times in excludedLetters", letter);
        } else {
          const { key: excludedKey } = excludedData[0];
          excludedLetters.setActive(excludedKey, false);
        }
      }

      trace.arr(v.DEBUG, className(this), "changeIncluded", "included letters = ", includedLetters.data);
      trace.arr(v.DEBUG, className(this), "changeIncluded", "excluded letters = ", excludedLetters.data);

      return { includedLetters };
    });
  }

  changeLanguage = (language: LanguageCodeType) => {
    trace.str(v.NORMAL, className(this), "changeLanguage", "TODO AEG : change dictionary language");
    this.setState({ language });
  }

  changeTheme = (darkTheme: boolean): void => {
    trace.str(v.NORMAL, className(this),"changeTheme", "theme is " + (darkTheme ? "dark" : "normal"));
    this.setState({ darkTheme });
  }

  changeWordLength = (wordLength: number): void => {
    trace.str(v.NORMAL, className(this), "changeWordLength", "wordLength = " + wordLength);
    
    const includedLetters = this.initIncluded(wordLength);
    const excludedLetters = this.initExcluded(ALPHABET);

    trace.arr(v.DEBUG, className(this), "changeWordLength", "includedLetters = ", includedLetters.getFlattenedValues(Position.Fixed));
    trace.arr(v.DEBUG, className(this), "changeWordLength", "excludedLetters = ", excludedLetters.getFlattenedValues(Position.Variable));

    this.setState({
      excludedLetters,
      includedLetters,
      wordLength,
    });
  }

  excludeLetter = (key: KeyType, active: boolean): void => {

    this.setState((prevState) => {
      // Set active in excludedLetters
      const excludedLetters = prevState.excludedLetters;
      excludedLetters.setActive(key, active);

      // Set inactive if present in includedLetters
      const excludedLetter = excludedLetters.getValue(key);
      const includedLetters = prevState.includedLetters;
      const includedData = includedLetters.getSelections();
      
      for (let selection of includedData) {
        const { key: includedKey, value: includedLetter } = selection;
        if (includedLetter === excludedLetter) {
          includedLetters.setValue(includedKey, UnselectedValue);
          includedLetters.setActive(includedKey, false);
        }
      }

      const excludedValues = excludedLetters.getFlattenedValues(Position.Variable);
      const includedValues = includedLetters.getFlattenedValues(Position.Any);

      const noneIfEmpty = (str: string): string => { return str.length ? str : '<none>' }

      trace.str(v.NORMAL, className(this), "excludeLetter", "exclude " + noneIfEmpty(excludedValues) + ", require " + noneIfEmpty(includedValues));

      return { 
        excludedLetters,
        includedLetters
      };
    });
  }

  removeIncluded = (key: KeyType): void => {

    this.setState((prevState) => {
      const includedLetters = prevState.includedLetters;
      includedLetters.removeSelection(key);
      trace.arr(className(this), "removeIncluded", "includedLetters = ", includedLetters.data);
      return { includedLetters };
    });
  }

  //------------------------------------------------
  // Render functions
  //------------------------------------------------

  renderInfo(): JSX.Element {
    const description = (
      <div className="description">
        <span>If you are a fan of crosswords or online word games such as </span>
        <a
          href="https://www.nytimes.com/games/wordle/index.html"
          rel="noreferrer"
          target="_blank"
        >
          Wordle
        </a>
        <span> or </span>
        <a href="https://sutom.nocle.fr/#" rel="noreferrer" target="_blank">
          Sutom
        </a>
        <span>, this is the tool you need !</span>
      </div>
    );

    return (
      <div className="TopInfo">
        <Header as="h2">Word game solver</Header>
        <Segment>{description}</Segment>
      </div>
    );
  }

  render () {
    const { darkTheme, gameColor, excludedLetters, includedLetters, language, wordLength } = this.state;

    const topInfo = this.renderInfo();
    
    const solverClass = clsx('Solver', darkTheme && 'dark');

    trace.arr(v.SILLY, className(this), "render", "included = ", includedLetters.data);
    trace.arr(v.SILLY, className(this), "render", "excluded = ", excludedLetters.data);

    const excludedData = _flatMap(excludedLetters.data, ({ key, value, position, active}) => [{ key, value, position, active }]);
    const includedData = _flatMap(includedLetters.data, ({ key, value, position, active}) => [{ key, value, position, active }]);

    const gameColorClass = `colors-${gameColor}`;

    return (
      <div className={solverClass}>
        <TopToolbar 
          darkTheme={darkTheme}
          onChangeTheme={this.changeTheme}
        />
        {topInfo}
        <GameToolbar
          language={language}
          gameColor={gameColor}
          onColorChange={this.changeGameColor}
          onLengthChange={this.changeWordLength}
          onLanguageChange={this.changeLanguage}
        />
        <WordFilter 
          title="Word list"
          language={language}
          wordLength={wordLength}
          included={includedData}
          excluded={excludedData}
        />
        <InclusionPanel
          title="Required letters"
          gameColor={gameColorClass}
          alphabet={ALPHABET}
          wordLength={wordLength}
          included={includedLetters}
          onChange={this.changeIncluded}
          onAdd={this.addIncluded}
          onRemove={this.removeIncluded}
        />
        <ExclusionPanel
          title="Excluded letters"
          gameColor={gameColorClass}
          excluded={excludedLetters}
          onClick={this.excludeLetter}
        />
      </div>
    );
  }
}

export default Solver;
