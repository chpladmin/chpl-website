import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
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

import { useFetchAccessibilityStandards } from 'api/standards';
import { ChplTextField } from 'components/util';
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
  twoColumnContainer: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    alignItems: 'flex-start',
    width: '100%',
  },
});

const validationSchema = yup.object({
  newAccessibilityStandard: yup.object()
    .required('Field is required'),
});

function ChplAccessibilityStandardsEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const [addingAccessibilityStandard, setAddingAccessibilityStandard] = useState(false);
  const [accessibilityStandards, setAccessibilityStandards] = useState([]);
  const accessibilityStandardsQuery = useFetchAccessibilityStandards();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (accessibilityStandardsQuery.isLoading || !accessibilityStandardsQuery.isSuccess) {
      return;
    }
    setAccessibilityStandards(accessibilityStandardsQuery.data
      .sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [accessibilityStandardsQuery.data, accessibilityStandardsQuery.isLoading, accessibilityStandardsQuery.isSuccess]);

  const handleItemAddition = () => {
    setListing((prev) => ({
      ...prev,
      accessibilityStandards: prev.accessibilityStandards.concat({
        accessibilityStandardId: formik.values.newAccessibilityStandard.id,
        accessibilityStandardName: formik.values.newAccessibilityStandard.name,
      }),
    }));
    setAddingAccessibilityStandard(false);
    formik.setFieldValue('newAccessibilityStandard', '');
  };

  const handleItemRemoval = (item) => {
    setListing((prev) => ({
      ...prev,
      accessibilityStandards: prev.accessibilityStandards.filter((accessibility) => accessibility.accessibilityStandardName !== item.accessibilityStandardName),
    }));
  };

  formik = useFormik({
    initialValues: {
      newAccessibilityStandard: '',
    },
    validationSchema,
  });

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <>
      <Typography variant="subtitle1">Accessibility Standards:</Typography>
      { listing.accessibilityStandards?.length > 0
        && (
          <>
            <Card className={classes.fullWidth}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Accessibility Standard</TableCell>
                    <TableCell className="sr-only">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listing.accessibilityStandards
                    .sort((a, b) => (a.accessibilityStandardName < b.accessibilityStandardName ? 1 : -1))
                    .map((std) => (
                      <TableRow key={std.accessibilityStandardName}>
                        <TableCell>
                          { std.accessibilityStandardName }
                        </TableCell>
                        <TableCell>
                          <IconButton variant="outlined" onClick={() => handleItemRemoval(std)}>
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
      { !addingAccessibilityStandard
        && (
          <Button
            size="medium"
            color="primary"
            variant="outlined"
            onClick={() => setAddingAccessibilityStandard(true)}
            endIcon={<Add fontSize="medium" />}
          >
            Add Accessibility Standard
          </Button>
        )}
      { addingAccessibilityStandard
        && (
          <>
            <Typography variant="subtitle2">Adding New Accessibility Standard:</Typography>
            <Box className={classes.twoColumnContainer}>
              <ChplTextField
                select
                id="new-accessibility-standard"
                name="newAccessibilityStandard"
                label="New Accessibility Standard"
                required
                value={formik.values.newAccessibilityStandard}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newAccessibilityStandard && !!formik.errors.newAccessibilityStandard}
                helperText={formik.touched.newAccessibilityStandard && formik.errors.newAccessibilityStandard}
              >
                { accessibilityStandards.map((item) => (
                  <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                ))}
              </ChplTextField>
            </Box>
            <Box className={classes.cancelAndSaveButton}>
              <Button
                size="medium"
                endIcon={<Clear fontSize="small" />}
                onClick={() => setAddingAccessibilityStandard(false)}
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
                onClick={() => handleItemAddition()}
                disabled={formik.values.newAccessibilityStandard === ''}
              >
                Save
              </Button>
            </Box>
          </>
        )}
    </>
  );
}

export default ChplAccessibilityStandardsEdit;

ChplAccessibilityStandardsEdit.propTypes = {
};
