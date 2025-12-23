import React, { useEffect, useState} from 'react';
import { Checkbox } from 'semantic-ui-react';
import _every from 'lodash/every';
import _filter from 'lodash/filter';
import _flatMap from 'lodash/flatMap';
import _isNull from 'lodash/isNull';
import _join from 'lodash/join';
import _map from 'lodash/map';
import _some from 'lodash/some';

import { CartridgeTop, Position, DataType, PositionType } from '../../Selectors';
import { trace, Verbosity as v } from '../../utils';
import { LanguageString, LanguageCodeType, UnselectedValue } from '../../constants';

import './WordFilter.scss';

// TODO : avoid loading all dictionaries before we know which one is needed
//        For performance, might choose to split files by wordLength
// import { Dictionary as dictDef } from '../../dico/default';
// import { Dictionary as dictEn } from '../../dico/english';
// import { Dictionary as dictFr } from '../../dico/french';
// import { Dictionary as dictEs } from '../../dico/spanish';


interface WordFilterProps {
  title: string,
  language: LanguageCodeType,
  wordLength: number,
  included: DataType[],
  excluded: DataType[],
}

/** Main filtering component
*/
const WordFilter: React.FC<WordFilterProps> = (props) => {
  const compName = 'WordFilter';

  //----------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------

  const handleListChange = (): void => {
    trace.str(v.DEBUG, compName, "handleListChange", "TODO ... set textarea readonly ?");
  }

  //----------------------------------------------------------------
  // State hooks
  //----------------------------------------------------------------

  const [dictionary, setDictionary] = useState(['']);
  const [wordList, setWordList] = useState(['']);
  const [prettyList, setPrettyList] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [allowDuplicated, setAllowDuplicated] = useState(true);

  //----------------------------------------------------------------
  // Effect hooks
  //----------------------------------------------------------------

  useEffect(/* Load dictionary from disk */() => {
    trace.str(v.NORMAL, compName, "useEffect", "load dictionary");

    const loadDictionary = async (language: LanguageCodeType, wordLength: number): Promise<any> => {
      let dict = [''];

      const root = '../../dico';
      const dir  = `${language}`;
      const name = `${wordLength.toString().padStart(2,'0')}`;
      const dictPath = `${root}/${dir}/${name}`;

      try {
        // NOTE : using an expression to create the filename triggers an error :
        //        "Critical dependency: the request of a dependency is an expression"
        //        and no module is loaded at all
        //        
        // const { Dictionary } = await import(dictPath);

        // TODO : replace by a fetch at some moment. Path should be normalized to current OS as well.
        const { Dictionary } = await import('../../dico/' + language + '/' + wordLength.toString().padStart(2,'0'));
        dict = Dictionary;

      } catch (err) {
        const { message } = err as any;
        console.error('Error loading dictionary : ' + message);
      }
  
      return { dict, dictPath };
    }

    // Effect main

    loadDictionary(props.language, props.wordLength)
    .then((res) => {
      const { dict: rawDict, dictPath } = res;

      // Make sure the dictionary contains only words of proper length
      const safeDict = _filter(rawDict, (word) => word.length === props.wordLength);
      const removedCount = rawDict.length - safeDict.length;

      if (removedCount > 0) {
        const suffix = removedCount > 1 ? 's' : '';
        const verb   = removedCount > 1 ? 'are' : 'is';
        console.warn('Dictionary file ' + dictPath + ' has ' + removedCount 
          + ' word' + suffix + ' that ' + verb + ' not of length = ' + props.wordLength
        );
      }

      setDictionary(safeDict);
    });
  }, [
    props.language,
    props.wordLength
  ]);

  useEffect(/* Clean dictionary and return wordList */() => {
    trace.str(v.NORMAL, compName, "useEffect", "clean dictionary");
    trace.str(v.NORMAL, compName, "useEffect", "... dictionary length = " + dictionary.length);
    trace.str(v.NORMAL, compName, "useEffect", "... language = " + props.language);

    const cleanDictionary = (dict: string[], language: LanguageCodeType): string[] => {
      // TODO : introduce ruleset + cleaning class. Overall, filtering should be independent of diacritics
      switch (language) {
        case 'fr':
          return dict;
        case 'en':
          return removeWordsWithCapital(dict);
        case 'es':
          return replaceTilde(dict);
        default:
          return dict;
      }
    }

    const removeWordsWithCapital = (wordList: string[]): string[] => {
      const regexp = new RegExp('[A-Z]', 'g');
      return _filter(wordList, (word) => _isNull(word.match(regexp)));
    }

    const replaceTilde = (wordList: string[]) : string[] => {
      const regexp = new RegExp('ñ', 'gi');
      return _map(wordList, (word) => word.replace(regexp, 'n'));
    }

    // Effect main

    let wordList = dictionary;

    wordList = cleanDictionary(wordList, props.language);
    wordList.sort((a, b) => a.localeCompare(b, props.language));
    
    // TODO : should remove uppercasing here, but filtering depends on it at this moment
    wordList = _map(wordList, (word) => word.toUpperCase());

    setWordList(wordList);
  }, [
    dictionary,
    props.language,
  ]);

  useEffect(/* Filter word list */() => {
    trace.str(v.NORMAL, compName, "useEffect", "filtering");
    
    const filterByDuplicated = (wordList: string[], allowDuplicated: boolean): string[] => {
      if (allowDuplicated) {
        return wordList;  
      }

      const regexp = new RegExp('(.)(?=.*\\1)', 'g');

      let wordsFiltered = _filter(wordList, (word) =>
        _isNull(word.match(regexp))
      );

      return wordsFiltered;
    }

    const filterByExcluded = (wordList: string[], excluded: DataType[]): string[] => {
      //const { excluded } = props;
  
      const singleString = flattenActiveValues(excluded, Position.Any);
      
      trace.arr(v.DEBUG, compName, "filterByExcluded", "excluded values = ", singleString || '<none>');
  
      return _filter(wordList, (word) =>
        !_some(singleString, (val) =>
          word.includes(val)
        )
      );
    }
  
    const filterByIncluded = (wordList: string[], included: DataType[], wordLength: number): string[] => {
      // Filter words for active letters at fixed position
      const fixedLetters = getActiveData(included, Position.Fixed);
      const regexp = regexpIncluded(fixedLetters, wordLength);
  
      trace.str(v.SILLY, compName, "filterByIncluded", "regexp = " + regexp);
  
      let wordsFilteredByFixed = _filter(wordList, (word) =>
        !_isNull(word.match(regexp))
      );
  
      // Replace matching letters by lowercase not to loose the word, but to avoid further match
      for (let [index, word] of wordsFilteredByFixed.entries()) {
        for (const selection of fixedLetters) {
          const { position, value } = selection;
          wordsFilteredByFixed[index] = word.substring(0, position) + value.toLowerCase() + word.substring(position + 1);
        }
      }
      trace.arr(v.SILLY, compName, "filterByIncluded", "first filtering = ", wordsFilteredByFixed);
  
      // Filter the reduced set of words by active letters at variable position
      const variableLetters = flattenActiveValues(included, Position.Variable);
      const wordsFilteredByVariable = _filter(wordsFilteredByFixed, (word) =>
        _every(variableLetters, (letter) => 
          word.includes(letter)
        )
      );
  
      // Restore filtered words to uppercase
      // TODO : find another way to filter ... uppercasing should be a user preference
      const filteredWords = _map(wordsFilteredByVariable, (word) => word.toUpperCase());
      // const filteredWords = wordsFilteredByVariable;
      trace.arr(v.DEBUG, compName, "filterByIncluded", "final filtering = ", filteredWords);
  
      return filteredWords;
    }
  
    const flattenActiveValues = (dataSet: DataType[], positionType: PositionType): string => {
      const activeData = getActiveData(dataSet, positionType);
      return _join(_flatMap(activeData, ({ value }) => [value]), '');
    }

    const getActiveData = (dataSet: DataType[], positionType: PositionType): DataType[] => {
      return _filter(dataSet, (d) => {
        if (positionType === Position.Variable) {
          return d.active && d.position === -1;
        } else if (positionType === Position.Fixed) {
          return d.active && d.position > -1;
        } else {
          return d.active;
        }
      });
    }
  
    const prettifyWordList = (wordList: string[]): string => {
      const splitter = " - ";
      return wordList
      .reduce((prev, curr) => prev + splitter + curr, '')
      .slice(splitter.length);
    }
  
    const regexpIncluded = (fixedLetters: DataType[], wordLength: number): RegExp => {
      //const { wordLength } = props;
  
      let str = '.'.repeat(wordLength);
  
      for (const selection of fixedLetters) {
        const { position, value, active } = selection;
        if (active && value !== UnselectedValue) {
          str = str.substring(0, position) + value + str.substring(position + 1);
        }
      }
  
      return new RegExp('^(' + str + ')', 'g');
    }
    
    // Effect main
    // TODO :  1- interpolate
    let wordCount = 0;
    let prettyList = LanguageString[props.language] + " dictionary contains no words of " + props.wordLength + " letters";

    if (wordList.length > 0) {
      let filteredWords = wordList;
      
      filteredWords = filterByDuplicated(filteredWords, allowDuplicated);
      filteredWords = filterByExcluded(filteredWords, props.excluded);
      filteredWords = filterByIncluded(filteredWords, props.included, props.wordLength)

      trace.arr(v.NORMAL, compName, "filter", "filtered words = ", filteredWords);

      wordCount = filteredWords.length;
      prettyList = wordCount > 0 ? prettifyWordList(filteredWords) : "No words match the constraints";
    }

    setPrettyList(prettyList);
    setWordCount(wordCount);
  }, [
    allowDuplicated,
    wordList,
    props.excluded,
    props.included,
    props.wordLength,
  ]);

  //----------------------------------------------------------------
  // Render
  //----------------------------------------------------------------

  return (
    <div className='WordFilter cartridge'>
      <CartridgeTop title={props.title} />
      <div className="controls">
        <div className="twins">
          <Checkbox
            label='No duplicated letters'
            checked={!allowDuplicated}
            onChange={() => setAllowDuplicated(!allowDuplicated)}
          />
        </div>
        <div className="count">
          <div className="label">{'word count :'}</div>
          <div className="value">{wordCount}</div>
        </div>
      </div>
      <div className="list">
        <textarea
          className='textarea'
          wrap='hard'
          value={prettyList}
          onChange={handleListChange}
        />
      </div>
    </div>
  );
}

export default WordFilter;
