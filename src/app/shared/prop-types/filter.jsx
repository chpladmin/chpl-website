import {
  arrayOf,
  bool,
  func,
  number,
  oneOfType,
  shape,
  string,
} from 'prop-types';

const filter = shape({
  key: string.isRequired,
  disabled: bool,
  display: string.isRequired,
  required: bool,
  singular: bool,
  loneFilter: bool,
  operatorKey: string,
  operator: string,
  values: arrayOf(shape({
    value: oneOfType([number, string]).isRequired,
    default: oneOfType([bool, string]),
    display: string,
  })).isRequired,
  getQuery: func,
  getValueDisplay: func,
  getValueEntry: func,
});

export default filter;
