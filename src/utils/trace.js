/** Set of console functions for debugging */

export const Verbosity = {
  SILENT: 0,
  NORMAL: 1,
  DEBUG: 2,
  SILLY: 3
}

/* Change const below to adjust current verbosity level */
const CurrentLevel = Verbosity.SILLY;

/* Change below to align console messages */
const clsLength = 16;
const fnLength = 18;

const isLogAllowed = (asked) => {
  return CurrentLevel >= asked;
}

export function str (v, cls, fn, str) {
  if (!isLogAllowed(v)) return;

  console.log(
    "%s :: %s :: %s",
    cls.padEnd(clsLength), fn.padEnd(fnLength), str
  );
}

export function arr (v, cls, fn, str, arr) {
  if (!isLogAllowed(v)) return;

  console.log(
    "%s :: %s :: %s",
    cls.padEnd(clsLength), fn.padEnd(fnLength), str, arr
  );
}

const trace = { arr, str };

export default trace;
