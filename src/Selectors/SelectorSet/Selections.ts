import { v4 as uuidv4 } from 'uuid';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import _isNil from 'lodash/isNil';
import _join from 'lodash/join';
import _map from 'lodash/map';
import _some from 'lodash/some';

import { arrayIndexes } from '../../utils';
import { EmptyValue, UnknownPosition, UnselectedValue } from '../../constants';

export enum Position {
  Any,
  Fixed,
  Variable
}

export type PositionType = number;
export type KeyType = string;
export type ValueType = string;

export type DataType = {
  key: KeyType,
  value: ValueType,
  position: PositionType,
  active: boolean,
}

/* Utility class to handle selector data, mainly an array of obj = {key, value, position, active}
 */
export class Selections {
  // TODO : set data private and force use of getSelections() ?
  data: DataType[];
  defaultValue: ValueType;
  defaultPosition: number;
  defaultActive: boolean;

  constructor(selectionCount: number, defaultVal?: string) {
    this.defaultValue = _isNil(defaultVal) ? UnselectedValue : defaultVal;
    this.defaultPosition = -1;
    this.defaultActive = false;
    this.data = this.createSelections(selectionCount);
  }

  public addSelection(value: ValueType, position: number, active: boolean): void {
    const selection = this.createSelection({ value, position, active });
    this.data.push(selection);
  }

  private createSelection(selection: Partial<DataType>): DataType {
    const {
      key = uuidv4(),
      value = this.defaultValue,
      position = this.defaultPosition,
      active = this.defaultActive
    } = selection;

    return {
      key,
      value,
      position, 
      active,
    };
  }

  public createSelections(count: number): DataType[] {
    const indexes = arrayIndexes(count);
    const selections = indexes.map((index) => {
      return this.createSelection({
        key: uuidv4(),
        value: this.defaultValue,
        position: this.defaultPosition,
        active: this.defaultActive,
      });
    });
    return selections;
  }
  
  public getFlattenedValues(positionType: PositionType, isActive?: boolean): string {
    const activeSelections = _filter(this.getSelections(), ({ position, active }) => {
      let positionIsOk = true;

      if (positionType === Position.Variable) {
        positionIsOk = position === -1;
      } else if (positionType === Position.Fixed) {
        positionIsOk = position > -1;
      }
      return (active === (typeof isActive === 'boolean' ? isActive : true)) && positionIsOk;
    });
    return _join(_map(activeSelections, 'value'), '');
  }

  public getLength(): number {
    return this.data.length;
  }

  public getPosition(key: KeyType): PositionType {
    const selection = _find(this.data, { key });
    return selection ? selection.position : UnknownPosition;
  }

  public getPositions(): number[] {
    return _map(this.data, 'position');
  }

  public getSelection(key: KeyType): DataType {
    const selection = _find(this.data, { key });
    return selection ? selection : {} as DataType;
  }

  public getSelections(): DataType[] {
    return this.data;
  }

  public getValue(key: KeyType): ValueType {
    const selection = _find(this.data, { key });
    return selection?.value || EmptyValue;
  }

  public getValues(): ValueType[] {
    return _map(this.data, 'value');
  }

  public hasValue(value: ValueType): boolean {
    return _some(this.data, { value });
  }

  public hasPosition(position: number): boolean {
    return _some(this.data, { position });
  }

  public isActive(value: ValueType): boolean {;
    const index = _findIndex(this.data, { value });
    
    if (index >= 0) {
      const twinSelections = _filter(this.data, (s) => {
        return (s.value === value) && !_isNil(value);
      })
      if (twinSelections.length > 1) {
        console.warn("isActive :: more than one selection found with value=%s", value);
      }
      return this.data[index].active;
    } else {
      console.warn("isActive :: No selection found with value=%s", value);
      return false;
    }
  }

  public removeSelection(key: KeyType): void {
    const index = _findIndex(this.data, { key });
    if (index >= 0) {
      this.data.splice(index, 1);
    } else {
      console.warn("removeSelection :: No selection found with key=%d. Selections unchanged.", key);
    }
  }

  public resetSelections(count = 1): void {
    this.data = this.createSelections(count);
  }

  public resetSelectionWithPositions(positions: number[]): void {
    this.data = _map(positions, (position) => {
      return this.createSelection({ position })
    });
  }

  public resetSelectionWithValues(values: ValueType[]): void {
    this.data = _map(values, (value) => {
      return this.createSelection({ value })
    })
    ;
  }

  public setActive(key: KeyType, active: boolean): void {
    const index = _findIndex(this.data, { key });
    if (index >= 0) {
      this.data[index].active = active;
    } else {
      console.error("setActive :: No selection found with key=%d.", key);
    }
  }

  public setPosition(key: KeyType, position: number): void {
    const index = _findIndex(this.data, { key });
    if (index >= 0) {
      this.data[index].position = position;
    } else {
      console.error("setPosition :: No selection found with key=%d.", key);
    }
  }

  public setValue(key: KeyType, value = this.defaultValue): void {
    const index = _findIndex(this.data, { key });
    if (index >= 0) {
      this.data[index].value = value;
    } else {
      console.error("setValue :: No selection found with key=%d", key);
    }
  }
}

export default Selections;