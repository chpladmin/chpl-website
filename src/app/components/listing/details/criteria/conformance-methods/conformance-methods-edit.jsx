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

import { ChplEllipsis, ChplTextField } from '../../../../util';
import { conformanceMethod, selectedConformanceMethod } from '../../../../../shared/prop-types';

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
  cm: yup.object()
    .required('Conformance Method is required'),
  version: yup.string()
    .test('conditionallyRequired',
      'Version is required',
      (value, context) => (!!value || context.parent.cm?.name === 'Attestation')),
});

function ChplConformanceMethodsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [conformanceMethods, setConformanceMethods] = useState(props.conformanceMethods.sort((a, b) => (a.conformanceMethod.name < b.conformanceMethod.name ? -1 : 1)));
  const [options, setOptions] = useState(
    props.options
      .filter((option) => !(props.conformanceMethods.find((used) => used.conformanceMethod.id === option.id)))
      .sort((a, b) => (a.name < b.name ? -1 : 1)),
  );
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let formik;

  const update = (updated) => {
    props.onChange({ key: 'conformanceMethods', data: updated });
  };

  const addNew = () => {
    const updated = [
      ...conformanceMethods,
      {
        conformanceMethod: {
          id: formik.values.cm.id,
          name: formik.values.cm.name,
        },
        conformanceMethodVersion: formik.values.version,
        key: Date.now(),
      },
    ];
    const removed = formik.values.cm.id;
    setAdding(false);
    formik.resetForm();
    setConformanceMethods(updated);
    setOptions(options.filter((option) => option.id !== removed));
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = conformanceMethods.filter((m) => m.conformanceMethod.id !== item.conformanceMethod.id);
    setConformanceMethods(updated);
    setOptions([
      ...options,
      {
        name: item.conformanceMethod.name,
        id: item.conformanceMethod.id,
      },
    ].sort((a, b) => (a.name < b.name ? -1 : 1)));
    update(updated);
  };

  formik = useFormik({
    initialValues: {
      cm: '',
      version: '',
    },
    onSubmit: () => {
      addNew();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  return (
    <div className={classes.container}>
      { conformanceMethods.length > 0
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
                { conformanceMethods.map((item, index) => (
                  <TableRow key={item.id || item.key || index}>
                    <TableCell>
                      <Typography variant="body2"><ChplEllipsis text={item.conformanceMethod.name} maxLength={100} wordBoundaries /></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{ item.conformanceMethodVersion }</Typography>
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
                id="conformance-methods-add-item"
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
                id="cm"
                name="cm"
                label="Conformance Method"
                required
                value={formik.values.cm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cm && !!formik.errors.cm}
                helperText={formik.touched.cm && formik.errors.cm}
              >
                { options.map((item) => (
                  <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                ))}
              </ChplTextField>
              <ChplTextField
                id="version"
                name="version"
                label="Version"
                required={formik.values.cm.name !== 'Attestation'}
                disabled={formik.values.cm.name === 'Attestation'}
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
                  id="conformance-methods-check-item"
                >
                  <CheckIcon />
                </Button>
                <Button
                  onClick={() => cancelAdd()}
                  aria-label="Cancel adding item"
                  id="conformance-methods-close-item"
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

export default ChplConformanceMethodsEdit;

ChplConformanceMethodsEdit.propTypes = {
  conformanceMethods: arrayOf(selectedConformanceMethod).isRequired,
  options: arrayOf(conformanceMethod).isRequired,
  onChange: func.isRequired,
};
