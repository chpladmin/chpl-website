import React, { useContext } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { bool, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { UserContext } from 'shared/contexts';
import { acb as acbPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    alignItems: 'start',
  },
  organizationChips: {
    margin: '4px',
  },
  organizationHeader: {
    margin: '0',
    fontSize: '1.25em',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  table: {
    border: '.5px solid #c2c6ca',
  },
  tableFooterButton: {
    margin: '0 -4px',
    textTransform: 'none',
    fontSize: '1.5em',
  },
  errorColor: {
    color: '#c44f65',
  },
});

const validationSchema = yup.object({
  name: yup.string()
    .when('retired', {
      is: false,
      then: yup.string()
        .required('Name is required')
        .max(300, 'Name is too long'),
    }),
  retired: yup.boolean(),
  retirementDay: yup.date()
    .when('retired', {
      is: true,
      then: yup.date()
        .required('Retirement Date is required')
        .max(new Date(), 'Retirement Date must be in the past'),
    }),
  line1: yup.string()
    .when('retired', {
      is: false,
      then: yup.string()
        .required('Address is required')
        .max(250, 'Address is too long'),
    }),
  line2: yup.string()
    .when('retired', {
      is: false,
      then: yup.string()
        .max(250, 'Line 2 is too long'),
    }),
  city: yup.string()
    .when('retired', {
      is: false,
      then: yup.string()
        .required('City is required')
        .max(250, 'City is too long'),
    }),
  state: yup.string()
    .when('retired', {
      is: false,
      then: yup.string()
        .required('State is required')
        .max(250, 'State is too long'),
    }),
  zipcode: yup.string()
    .when('retired', {
      is: false,
      then: yup.string()
        .required('Zip is required')
        .max(25, 'Zip is too long'),
    }),
  country: yup.string()
    .when('retired', {
      is: false,
      then: yup.string()
        .required('Country is required')
        .max(250, 'Country is too long'),
    }),
  website: yup.string()
    .when('retired', {
      is: false,
      then: yup.string()
        .url('Improper format (http://www.example.com)')
        .required('Website is required')
        .max(300, 'Website is too long'),
    }),
});

const getEditField = ({
  key,
  display,
  formik,
  required = true,
  disabled,
}) => (
  <ChplTextField
    id={key}
    name={key}
    label={display}
    required={required}
    disabled={disabled}
    value={formik.values[key]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched[key] && !!formik.errors[key]}
    helperText={formik.touched[key] && formik.errors[key]}
  />
);

function ChplOncOrganizationEdit(props) {
  const {
    organization,
    dispatch,
    isProcessing,
  } = props;
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();
  let formik;

  const cancel = () => {
    dispatch('cancel');
  };

  const getEnhancedEditField = (editProps) => getEditField({
    ...editProps,
    formik,
  });

  const save = () => {
    const updatedOncOrganization = {
      ...organization,
      name: formik.values.name,
      retired: formik.values.retired,
      retirementDay: formik.values.retired ? formik.values.retirementDay : null,
      website: formik.values.website,
      address: {
        ...organization.address,
        line1: formik.values.line1,
        line2: formik.values.line2,
        city: formik.values.city,
        state: formik.values.state,
        zipcode: formik.values.zipcode,
        country: formik.values.country,
      },
    };
    dispatch('save', updatedOncOrganization);
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        cancel();
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  const isActionDisabled = () => !formik.isValid;

  formik = useFormik({
    initialValues: {
      name: organization.name ?? '',
      retired: !!organization.retired,
      retirementDay: organization.retirementDay ?? '',
      website: organization.website ?? '',
      line1: organization.address?.line1 ?? '',
      line2: organization.address?.line2 ?? '',
      city: organization.address?.city ?? '',
      state: organization.address?.state ?? '',
      zipcode: organization.address?.zipcode ?? '',
      country: organization.address?.country ?? '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  /* eslint-disable object-curly-newline */
  return (
    <>
      <Card>
        <CardHeader
          title={organization.name ?? 'Create new Organization'}
          className={classes.organizationHeader}
          component="h2"
        />
        <CardContent className={classes.content}>
          <Typography className={classes.fullWidth} variant="subtitle1">General Info</Typography>
          { getEnhancedEditField({ key: 'name', display: 'Name', disabled: formik.values.retired }) }
          { getEnhancedEditField({ key: 'website', display: 'Website', disabled: formik.values.retired }) }
          { hasAnyRole(['chpl-admin', 'ROLE_ONC']) && organization.name
              && (
                <>
                  <Divider className={classes.fullWidth} />
                  <FormControlLabel
                    control={(
                      <Switch
                        id="retired"
                        name="retired"
                        color="primary"
                        checked={formik.values.retired}
                        onChange={formik.handleChange}
                      />
                    )}
                    label="Retired"
                  />
                  <ChplTextField
                    id="retirement-day"
                    name="retirementDay"
                    label="Retirement Date"
                    type="date"
                    placeholder="Retirement Date"
                    disabled={!formik.values.retired}
                    value={formik.values.retirementDay}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.retirementDay && !!formik.errors.retirementDay}
                    helperText={formik.touched.retirementDay && formik.errors.retirementDay}
                  />
                </>
              )}
          <Divider className={classes.fullWidth} />
          <Typography className={classes.fullWidth} variant="subtitle1">Address</Typography>
          { getEnhancedEditField({ key: 'line1', display: 'Address', disabled: formik.values.retired }) }
          { getEnhancedEditField({ key: 'line2', display: 'Line 2', required: false, disabled: formik.values.retired }) }
          { getEnhancedEditField({ key: 'city', display: 'City', disabled: formik.values.retired }) }
          { getEnhancedEditField({ key: 'state', display: 'State', disabled: formik.values.retired }) }
          { getEnhancedEditField({ key: 'zipcode', display: 'Zip', disabled: formik.values.retired }) }
          { getEnhancedEditField({ key: 'country', display: 'Country', disabled: formik.values.retired }) }
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={isActionDisabled()}
        isProcessing={isProcessing}
      />
    </>
  );
}

export default ChplOncOrganizationEdit;

ChplOncOrganizationEdit.propTypes = {
  organization: acbPropType.isRequired,
  dispatch: func.isRequired,
  isProcessing: bool.isRequired,
};
