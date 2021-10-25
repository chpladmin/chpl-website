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
import { testProcedure, selectedTestProcedure } from '../../../../../shared/prop-types';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gap: '8px',
  },
  dataEntry: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 1fr',
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
  name: yup.object()
    .required('Test Procedure is required'),
  version: yup.string()
    .required('Version is required'),
});

function ChplTestProceduresEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [testProcedures, setTestProcedures] = useState(props.testProcedures.sort((a, b) => (a.testProcedure.name < b.testProcedure.name ? -1 : 1)));
  const [options, setOptions] = useState(props.options.filter((option) => props.testProcedures.filter((used) => used.testProcedure.id === option.id).length === 0));
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let addNew;

  const formik = useFormik({
    initialValues: {
      name: '',
      version: '',
    },
    onSubmit: () => {
      addNew();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const update = (updated) => {
    props.onChange({ key: 'testProcedures', data: updated });
  };

  addNew = () => {
    const updated = [
      ...testProcedures,
      {
        testProcedure: formik.values.name,
        testProcedureVersion: formik.values.version,
        key: (new Date()).getTime(),
      },
    ];
    const removed = formik.values.name.id;
    setAdding(false);
    formik.resetForm();
    setTestProcedures(updated);
    setOptions(options.filter((option) => option.id !== removed));
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = testProcedures.filter((s) => !(s.id === item.id && s.key === item.key));
    setTestProcedures(updated);
    setOptions([...options, item.testProcedure]);
    update(updated);
  };

  return (
    <div className={classes.container}>
      { testProcedures.length > 0
        && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="body2">Name</Typography></TableCell>
                  <TableCell><Typography variant="body2">Version</Typography></TableCell>
                  <TableCell><Typography variant="srOnly">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { testProcedures.map((item, index) => (
                  <TableRow key={item.id || item.key || index}>
                    <TableCell>
                      <Typography variant="body2">{ item.testProcedure.name }</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{ item.testProcedureVersion }</Typography>
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
                id="test-procedures-add-item"
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
                id="name"
                name="name"
                label="Procedure Tested"
                required
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
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
              <ButtonGroup
                color="primary"
                className={classes.dataEntryActions}
              >
                <Button
                  onClick={formik.handleSubmit}
                  aria-label="Confirm adding item"
                  id="test-procedures-check-item"
                >
                  <CheckIcon />
                </Button>
                <Button
                  onClick={() => cancelAdd()}
                  aria-label="Cancel adding item"
                  id="test-procedures-close-item"
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

export default ChplTestProceduresEdit;

ChplTestProceduresEdit.propTypes = {
  testProcedures: arrayOf(selectedTestProcedure).isRequired,
  options: arrayOf(testProcedure).isRequired,
  onChange: func.isRequired,
};
