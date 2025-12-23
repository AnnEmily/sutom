/** Real constants, to use as needed */

export const LatinLetters = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
];

export const enum Colors {
  DEFAULT = '',
  GREEN = 'green',
  RED = 'red',
  YELLOW = 'yellow',
};

export const enum Symbols {
  WHICH_EVER = "\u2014",
};

export const UnknownPosition = -1000;
export const UnselectedValue = Symbols.WHICH_EVER;
export const EmptyValue = '';

/** Basic settings */

// TODO inférer Code de String
export const GameColorCode = ['default', 'sutom', 'wordle'] as const;
export type GameColorType = typeof GameColorCode[number];

export const GameColorString: Record<GameColorType, string> = {
  'default': 'default',
  'sutom': 'Sutom',
  'wordle': 'Wordle',
} ;

// TODO inférer Code de String ; interface ?
export const LanguageCode = ['en', 'es', 'fr', 'de'] as const;
// export interface LanguageCode = ['en', 'es', 'fr', 'de'];
export type LanguageCodeType = typeof LanguageCode[number];
// export type LanguageCodeType = 'en' | 'es' | 'fr' | 'de';

export const LanguageString: Record<LanguageCodeType, string> = {
  'en': 'English',
  'es': 'Spanish',
  'de': 'German',
  'fr': 'French',
} ;

// export const LanguageCode = typeof LanguageString;
// export type LanguageCodeType = keyof typeof LanguageString;

export const enum WordLengthLimits {
  MIN = 3,
  DEFAULT = 5,
  MAX = 12,
};
