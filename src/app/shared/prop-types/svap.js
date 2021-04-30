import {
  arrayOf, bool, number, shape, string,
} from 'prop-types';
import { criterion } from '.';

const svap = shape({
  approvedStandardVersion: string,
  criteria: arrayOf(criterion),
  regulatoryTextCitation: string,
  replaced: bool,
  svapId: number,
});

const selectedSvap = shape({
  approvedStandardVersion: string,
  id: number,
  regulatoryTextCitation: string,
  replaced: bool,
  svapId: number,
});

export { svap, selectedSvap };
