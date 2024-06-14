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

import { useFetchRelatedListings } from 'api/listing';
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
  ics: yup.boolean(),
  newIcsSource: yup.string()
    .required('Field is required')
    .matches(/^\d{2}\.\d{2}\.\d{2}\.\d{4}\.\w{4}\.\w{2}\.\d{2}\.[01]\.\d{6}$/, 'Improper format (00.00.00.0000.XXXX.XX.00.0.000000'),
});

function ChplIcsEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const [addingExistingIcsSource, setAddingExistingIcsSource] = useState(true);
  const [addingIcsSource, setAddingIcsSource] = useState(false);
  const [relatedListings, setRelatedListings] = useState([]);
  const relatedListingsQuery = useFetchRelatedListings({ id: listing.product.id });
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (relatedListingsQuery.isLoading || !relatedListingsQuery.isSuccess) {
      return;
    }
    setRelatedListings(relatedListingsQuery.data
      .filter((l) => l.edition === null || l.edition === '2015')
      .filter((l) => l.id !== listing.id)
      .sort((a, b) => (a.chplProductNumber < b.chplProductNumber ? -1 : 1))
      .map((l) => l.chplProductNumber));
  }, [relatedListingsQuery.data, relatedListingsQuery.isLoading, relatedListingsQuery.isSuccess]);

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

  const handleItemAddition = () => {
    setListing((prev) => ({
      ...prev,
      ics: {
        ...prev.ics,
        parents: prev.ics.parents.concat({
          chplProductNumber: formik.values.newIcsSource,
        }),
      },
    }));
    setAddingIcsSource(false);
    formik.setFieldValue('newIcsSource', '');
  };

  const handleItemRemoval = (item) => {
    setListing((prev) => ({
      ...prev,
      ics: {
        ...prev.ics,
        parents: prev.ics.parents.filter((p) => p.chplProductNumber !== item.chplProductNumber),
      },
    }));
  };

  formik = useFormik({
    initialValues: {
      ics: listing.ics?.inherits ?? false,
      newIcsSource: '',
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
      <FormControlLabel
        control={(
          <Switch
            id="ics"
            name="ics"
            color="primary"
            checked={formik.values.ics}
            onChange={handleIcsToggle}
          />
        )}
        label="Inherited Certified Status"
      />
      { formik.values.ics && listing.ics.parents.length > 0
        && (
          <>
            <Typography variant="subtitle2">Inherits from</Typography>
            <Card className={classes.fullWidth}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>CHPL Product Number</TableCell>
                    <TableCell className="sr-only">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listing.ics.parents
                    .sort((a, b) => (a.chplProductNumber < b.chplProductNumber ? 1 : -1))
                    .map((l) => (
                      <TableRow key={l.chplProductNumber}>
                        <TableCell>
                          { l.chplProductNumber }
                        </TableCell>
                        <TableCell>
                          <IconButton variant="outlined" onClick={() => handleItemRemoval(l)}>
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
      { formik.values.ics && !addingIcsSource
        && (
          <Button
            size="medium"
            color="primary"
            variant="outlined"
            onClick={() => setAddingIcsSource(true)}
            endIcon={<Add fontSize="medium" />}
          >
            Add ICS Source
          </Button>
        )}
      { addingIcsSource
        && (
          <>
            <Typography variant="subtitle2">Adding New ICS Source:</Typography>
            <Box className={classes.twoColumnContainer}>
              { addingExistingIcsSource
                && (
                  <ChplTextField
                    select
                    id="new-ics-source"
                    name="newIcsSource"
                    label="New ICS Source"
                    required
                    value={formik.values.newIcsSource}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.newIcsSource && !!formik.errors.newIcsSource}
                    helperText={formik.touched.newIcsSource && formik.errors.newIcsSource}
                  >
                    { relatedListings.map((item) => (
                      <MenuItem value={item} key={item}>{item}</MenuItem>
                    ))}
                  </ChplTextField>
                )}
              { !addingExistingIcsSource
                && (
                  <ChplTextField
                    id="new-ics-source"
                    name="newIcsSource"
                    label="New ICS Source (different Product)"
                    required
                    value={formik.values.newIcsSource}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.newIcsSource && !!formik.errors.newIcsSource}
                    helperText={formik.touched.newIcsSource && formik.errors.newIcsSource}
                  />
                )}
              <FormControlLabel
                control={(
                  <Switch
                    id="add-existing-ics-source"
                    name="addExistingIcsSource"
                    color="primary"
                    checked={addingExistingIcsSource}
                    onChange={() => setAddingExistingIcsSource((prev) => !prev)}
                  />
                )}
                label="Add Existing ICS Source"
              />
            </Box>
            <Box className={classes.cancelAndSaveButton}>
              <Button
                size="medium"
                endIcon={<Clear fontSize="small" />}
                onClick={() => setAddingIcsSource(false)}
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
                disabled={formik.values.newIcsSource === '' || (!addingExistingIcsSource && !!formik.errors.newIcsSource)}
              >
                Save
              </Button>
            </Box>
          </>
        )}
    </>
  );
}

export default ChplIcsEdit;

ChplIcsEdit.propTypes = {
};
