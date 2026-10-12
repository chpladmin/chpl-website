import React from 'react';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import { useFormik } from 'formik';
import { func, string } from 'prop-types';
import * as yup from 'yup';

import { FormGroupContext, useFormGroup, useFormGroupMember } from './form-group-context';

function Member({ name }) {
  const formik = useFormik({
    initialValues: { [name]: '' },
    validationSchema: yup.object({ [name]: yup.string().required(`${name} is required`) }),
  });
  useFormGroupMember(formik);
  return (
    <>
      <input aria-label={name} name={name} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} />
      { formik.touched[name] && formik.errors[name] && <span>{formik.errors[name]}</span> }
    </>
  );
}

Member.propTypes = {
  name: string.isRequired,
};

function Owner({ onValidate = () => {} }) {
  const { group, hasErrors, validateAll } = useFormGroup();
  return (
    <FormGroupContext.Provider value={group}>
      <Member name="first" />
      <Member name="second" />
      <span>{hasErrors ? 'has errors' : 'no errors'}</span>
      <button type="button" onClick={() => validateAll().then(onValidate)}>validate</button>
    </FormGroupContext.Provider>
  );
}

Owner.propTypes = {
  onValidate: func,
};

describe('a form group', () => {
  it('has no errors until a field showing one is touched', async () => {
    render(<Owner />);
    expect(screen.getByText('no errors')).toBeInTheDocument();
    await act(async () => { fireEvent.blur(screen.getByLabelText('first')); });
    expect(await screen.findByText('has errors')).toBeInTheDocument();
    expect(screen.getByText('first is required')).toBeInTheDocument();
    expect(screen.queryByText('second is required')).not.toBeInTheDocument();

    await act(async () => { fireEvent.change(screen.getByLabelText('first'), { target: { value: 'x' } }); });
    expect(await screen.findByText('no errors')).toBeInTheDocument();
  });

  it('validates every member at once and surfaces all their errors', async () => {
    const onValidate = jest.fn();
    render(<Owner onValidate={onValidate} />);
    await act(async () => { fireEvent.click(screen.getByText('validate')); });
    expect(onValidate).toHaveBeenCalledWith(false);
    expect(screen.getByText('has errors')).toBeInTheDocument();
    expect(screen.getByText('first is required')).toBeInTheDocument();
    expect(screen.getByText('second is required')).toBeInTheDocument();
  });

  it('passes once every member is valid', async () => {
    const onValidate = jest.fn();
    render(<Owner onValidate={onValidate} />);
    await act(async () => {
      fireEvent.change(screen.getByLabelText('first'), { target: { value: 'x' } });
      fireEvent.change(screen.getByLabelText('second'), { target: { value: 'y' } });
    });
    await act(async () => { fireEvent.click(screen.getByText('validate')); });
    expect(onValidate).toHaveBeenCalledWith(true);
  });

  it('does nothing for a member outside a group', async () => {
    render(<Member name="lonely" />);
    await act(async () => { fireEvent.blur(screen.getByLabelText('lonely')); });
    expect(await screen.findByText('lonely is required')).toBeInTheDocument();
  });
});
