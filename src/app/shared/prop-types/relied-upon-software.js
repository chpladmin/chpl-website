import { number, shape, string } from 'prop-types';

const reliedUponSoftware = shape({
  certificationResultId: number,
  certifiedProductId: number,
  certifiedProductNumber: string,
  grouping: string,
  id: number,
  justification: string,
  name: string,
  version: string,
});

export { reliedUponSoftware };
