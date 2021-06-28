/* eslint-disable import/no-extraneous-dependencies */
import { number, shape, string } from 'prop-types';

const contact = shape({
  contactId: number,
  email: string,
  fullName: string,
  phoneNumber: string,
  title: string,
});

export default contact;
