import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControlLabel,
  IconButton,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Delete, Add, Save, Clear,
} from '@material-ui/icons';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchTargetedUsers } from 'api/data';
import { ChplTextField } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { ListingContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  fullWidth: {
    width: '100%',
  },
  cancelAndSaveButton: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    width: '100%',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '16px',
    alignItems: 'flex-start',
    width: '100%',
  },
  twoColumnContainer: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    alignItems: 'flex-start',
    width: '100%',
  },
});

const validationSchema = yup.object({
  reportFileLocation: yup.string()
    .required('Field is required') // TODO: for 2014 edition
    .url('Improper format (http://www.example.com)')
    .max(250, 'Field is too long'),
  ics: yup.boolean(),
  otherAcb: yup.string(),
  newTargetedUser: yup.string()
    .required('Field is required'),

  newStatusDay: yup.date()
    .required('Field is missing'),
});

function ChplAdditionalInformationEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const [addingExistingTargetedUser, setAddingExistingTargetedUser] = useState(true);
  const [addingTargetedUser, setAddingTargetedUser] = useState(false);
  const [targetedUsers, setTargetedUsers] = useState([]);
  const targetedUsersQuery = useFetchTargetedUsers();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (targetedUsersQuery.isLoading || !targetedUsersQuery.isSuccess) {
      return;
    }
    setTargetedUsers(targetedUsersQuery.data.data
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map((type) => type.name));
  }, [targetedUsersQuery.data, targetedUsersQuery.isLoading, targetedUsersQuery.isSuccess]);

  const handleBasicChange = (event) => {
    setListing((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const handleIcsToggle = () => {
    setListing((prev) => ({
      ...prev,
      ics: {
        ...prev.ics,
        inherits: !prev.ics.inherits,
      },
    }));
    formik.setFieldValue('ics', !formik.values.ics);
  };

  const handleItemAddition = (type) => {
    switch (type) {
      case 'targetedUsers':
        setListing((prev) => ({
          ...prev,
          targetedUsers: prev.targetedUsers.concat(
            targetedUsers
              .find((tu) => tu.name === formik.values.newTargetedUser)
              ?? {
                targetedUserName: formik.values.newTargetedUser,
              },
          ),
        }));
        setAddingTargetedUser(false);
        formik.setFieldValue('newTargetedUser', '');
        break;
      default:
        console.error('not found', type);
    }
  };

  const handleItemRemoval = (type, item) => {
    switch (type) {
      case 'targetedUsers':
        setListing((prev) => ({
          ...prev,
          targetedUsers: prev.targetedUsers.filter((tu) => tu.targetedUserName !== item.targetedUserName),
        }));
        break;
      default:
        console.error('not found', type, item);
    }
  };

  formik = useFormik({
    initialValues: {
      reportFileLocation: listing.reportFileLocation ?? '',
      ics: listing.ics?.inherits ?? false,
      otherAcb: listing.otherAcb ?? '',
      newTargetedUser: '',
    },
    validationSchema,
  });

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Box className={classes.column}>
      <ChplTextField
        id="report-file-location"
        name="reportFileLocation"
        label="Report File Location"
        value={formik.values.reportFileLocation}
        onChange={handleBasicChange}
        onBlur={formik.handleBlur}
        error={formik.touched.reportFileLocation && !!formik.errors.reportFileLocation}
        helperText={formik.touched.reportFileLocation && formik.errors.reportFileLocation}
      />
      <FormControlLabel
        control={(
          <Switch
            id="ics"
            name="ics"
            color="primary"
            checked={formik.values.ics}
            onChange={handleIcsToggle}
            onBlur={formik.handleBlur}
          />
        )}
        label="Inherited Certified Status"
      />
      { formik.values.ics
        && (
          <>ICS stuff</>
        )}
      <ChplTextField
        id="other-acb"
        name="otherAcb"
        label="Other ONC-ACB"
        value={formik.values.otherAcb}
        onChange={handleBasicChange}
        onBlur={formik.handleBlur}
        error={formik.touched.otherAcb && !!formik.errors.otherAcb}
        helperText={formik.touched.otherAcb && formik.errors.otherAcb}
      />
      <Typography variant="subtitle1">Targeted Users:</Typography>
      { listing.targetedUsers?.length > 0
        && (
          <>
            <Card className={classes.fullWidth}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Targeted User</TableCell>
                    <TableCell className="sr-only">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listing.targetedUsers
                    .sort((a, b) => (a.targetedUserName < b.targetedUserName ? 1 : -1))
                    .map((tu) => (
                      <TableRow key={tu.targetedUserName}>
                        <TableCell>
                          { tu.targetedUserName }
                        </TableCell>
                        <TableCell>
                          <IconButton variant="outlined" onClick={() => handleItemRemoval('targetedUsers', tu)}>
                            <Delete color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
      { !addingTargetedUser
        && (
          <Button
            size="medium"
            color="primary"
            variant="outlined"
            onClick={() => setAddingTargetedUser(true)}
            endIcon={<Add fontSize="medium" />}
          >
            Add Targeted User
          </Button>
        )}
      { addingTargetedUser
        && (
          <>
            <Typography variant="subtitle2">Adding New Targeted User:</Typography>
            <Box className={classes.twoColumnContainer}>
              { addingExistingTargetedUser
                && (
                  <ChplTextField
                    select
                    id="new-targeted-user"
                    name="newTargetedUser"
                    label="New Targeted User"
                    required
                    value={formik.values.newTargetedUser}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.newTargetedUser && !!formik.errors.newTargetedUser}
                    helperText={formik.touched.newTargetedUser && formik.errors.newStatusType}
                  >
                    { targetedUsers.map((item, idx) => (
                      <MenuItem value={item} key={`${item}-${idx}`}>{item}</MenuItem>
                    ))}
                  </ChplTextField>
                )}
              { !addingExistingTargetedUser
                && (
                  <ChplTextField
                    id="new-targeted-user"
                    name="newTargetedUser"
                    label="New Targeted User"
                    required
                    value={formik.values.newTargetedUser}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.newTargetedUser && !!formik.errors.newTargetedUser}
                    helperText={formik.touched.newTargetedUser && formik.errors.newStatusType}
                  />
                )}
              <FormControlLabel
                control={(
                  <Switch
                    id="add-existing-targeted-user"
                    name="addExistingTargetedUser"
                    color="primary"
                    checked={addingExistingTargetedUser}
                    onChange={() => setAddingExistingTargetedUser((prev) => !prev)}
                  />
                )}
                label="Add Existing Targeted User"
              />
            </Box>
            <Box className={classes.cancelAndSaveButton}>
              <Button
                size="medium"
                endIcon={<Clear fontSize="small" />}
                onClick={() => setAddingTargetedUser(false)}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                size="medium"
                endIcon={<Save fontSize="small" />}
                variant="contained"
                color="primary"
                onClick={() => handleItemAddition('targetedUsers')}
                disabled={formik.values.newTargetedUser === ''}
              >
                Save
              </Button>
            </Box>
          </>
        )}
    </Box>
  );
}

export default ChplAdditionalInformationEdit;

ChplAdditionalInformationEdit.propTypes = {
};
