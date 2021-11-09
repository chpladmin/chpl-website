import React, { useState } from 'react';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import {
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from '../../../../util';
import { testData, selectedTestData } from '../../../../../shared/prop-types';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gap: '8px',
  },
  dataEntry: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 2fr 1fr',
    gap: '4px',
  },
  dataEntryActions: {
    alignSelf: 'center',
    justifySelf: 'center',
  },
  dataEntryAddNew: {
    gridColumn: '1 / -1',
  },
}));

const validationSchema = yup.object({
  td: yup.object()
    .required('Test Data Used is required'),
  version: yup.string()
    .required('Version is required'),
});

function ChplTestDataEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [testDataUsed, setTestDataUsed] = useState(props.testData.sort((a, b) => (a.testData.name < b.testData.name ? -1 : 1)));
  const [options, setOptions] = useState(props.options.filter((option) => props.testData.filter((used) => used.testData.id === option.id).length === 0));
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let addNew;

  const formik = useFormik({
    initialValues: {
      td: '',
      version: '',
      alteration: '',
    },
    onSubmit: () => {
      addNew();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const update = (updated) => {
    props.onChange({ key: 'testDataUsed', data: updated });
  };

  addNew = () => {
    const updated = [
      ...testDataUsed,
      {
        testData: formik.values.td,
        version: formik.values.version,
        alteration: formik.values.alteration,
        key: (new Date()).getTime(),
      },
    ];
    const removed = formik.values.td.id;
    setAdding(false);
    formik.resetForm();
    setTestDataUsed(updated);
    setOptions(options.filter((option) => option.id !== removed));
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = testDataUsed.filter((s) => !(s.testData.id === item.testData.id));
    setTestDataUsed(updated);
    setOptions([...options, item.testData]);
    update(updated);
  };

  return (
    <div className={classes.container}>
      { testDataUsed.length > 0
        && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="body2">Name</Typography></TableCell>
                  <TableCell><Typography variant="body2">Version</Typography></TableCell>
                  <TableCell><Typography variant="body2">Alteration</Typography></TableCell>
                  <TableCell><Typography variant="srOnly">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { testDataUsed.map((item, index) => (
                  <TableRow key={item.id || item.key || index}>
                    <TableCell>
                      <Typography variant="body2">{ item.testData.name }</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{ item.version }</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{ item.alteration }</Typography>
                    </TableCell>
                    <TableCell align="right">
                      { !adding
                        && (
                          <IconButton
                            onClick={() => removeItem(item)}
                            aria-label="Remove item"
                          >
                            <CloseIcon
                              color="primary"
                              size="small"
                            />
                          </IconButton>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      <div className={classes.dataEntry}>
        { !adding && options.length > 0
          && (
            <div className={classes.dataEntryAddNew}>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => setAdding(true)}
                id="test-data-add-item"
              >
                Add item
                {' '}
                <AddIcon />
              </Button>
            </div>
          )}
        { adding
          && (
            <>
              <ChplTextField
                select
                id="td"
                name="td"
                label="Test Data Used"
                value={formik.values.td}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.td && !!formik.errors.td}
                helperText={formik.touched.td && formik.errors.td}
              >
                { options.map((item) => (
                  <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                ))}
              </ChplTextField>
              <ChplTextField
                id="version"
                name="version"
                label="Version"
                required
                value={formik.values.version}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.version && !!formik.errors.version}
                helperText={formik.touched.version && formik.errors.version}
              />
              <ChplTextField
                id="alteration"
                name="alteration"
                label="Alteration"
                value={formik.values.alteration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.alteration && !!formik.errors.alteration}
                helperText={formik.touched.alteration && formik.errors.alteration}
              />
              <ButtonGroup
                color="primary"
                className={classes.dataEntryActions}
              >
                <Button
                  onClick={formik.handleSubmit}
                  aria-label="Confirm adding item"
                  id="test-data-check-item"
                >
                  <CheckIcon />
                </Button>
                <Button
                  onClick={() => cancelAdd()}
                  aria-label="Cancel adding item"
                  id="test-data-close-item"
                >
                  <CloseIcon />
                </Button>
              </ButtonGroup>
            </>
          )}
      </div>
    </div>
  );
}

export default ChplTestDataEdit;

ChplTestDataEdit.propTypes = {
  testData: arrayOf(selectedTestData).isRequired,
  options: arrayOf(testData).isRequired,
  onChange: func.isRequired,
};
