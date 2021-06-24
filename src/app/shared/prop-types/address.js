import { number, shape, string } from 'prop-types';

const address = shape({
  addressId: number,
  city: string,
  country: string,
  line1: string,
  line2: string,
  state: string,
  zipcode: string,
});

export default address;
