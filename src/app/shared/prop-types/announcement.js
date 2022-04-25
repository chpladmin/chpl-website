import {
  bool, number, shape, string,
} from 'prop-types';

const announcement = shape({
  id: number,
  isPublic: bool,
  title: string,
  text: string,
  startDate: number,
  endDate: number,
});

export default announcement;
