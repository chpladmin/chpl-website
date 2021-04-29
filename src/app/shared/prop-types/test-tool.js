import {
  bool, number, shape, string,
} from 'prop-types';

const testTool = shape({
  description: string,
  id: number,
  name: string,
  retired: bool,
});

const selectedTestTool = shape({
  id: number,
  retired: bool,
  testToolId: number,
  testToolName: string,
  testToolVerion: string,
});

export { testTool, selectedTestTool };
