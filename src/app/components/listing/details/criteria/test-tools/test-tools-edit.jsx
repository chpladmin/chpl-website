import React, { useState } from 'react';
import { arrayOf, bool, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import {
  Button,
  ButtonGroup,
  Container,
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
import { testTool, selectedTestTool } from '../../../../../shared/prop-types';

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
  tt: yup.object()
    .required('Test Tool is required'),
  version: yup.string()
    .required('Version is required'),
});

const mergeTestTools = (availableTestTools, usedTestTools) => {
  let mergedTestTools = [];
  if (Array.isArray(availableTestTools)) {
    mergedTestTools = availableTestTools;
    usedTestTools.forEach((tt) => {
      if (!availableTestTools.find((att) => att.id === tt.testToolId)) {
        mergedTestTools.push({
          id: tt.testToolId,
          name: tt.testToolName,
          retired: tt.retired,
        });
      }
    });
  }
  return mergedTestTools;
};

function ChplTestToolsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [hasIcs] = useState(props.hasIcs);
  const [isConfirming] = useState(props.isConfirming);
  const [testToolsUsed, setTestToolsUsed] = useState(props.testTools.sort((a, b) => (a.testToolName < b.testToolName ? -1 : 1)));
  const [options, setOptions] = useState(
    mergeTestTools(props.options, testToolsUsed)
      .filter((option) => !(props.testTools.find((used) => used.testToolId === option.id)))
      .sort((a, b) => (a.name < b.name ? -1 : 1)),
  );
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let addNew;

  const formik = useFormik({
    initialValues: {
      tt: '',
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
    props.onChange({ key: 'testToolsUsed', data: updated });
  };

  addNew = () => {
    const updated = [
      ...testToolsUsed,
      {
        testToolId: formik.values.tt.id,
        testToolName: formik.values.tt.name,
        testToolVersion: formik.values.version,
        key: (new Date()).getTime(),
      },
    ];
    const removed = formik.values.tt.id;
    setAdding(false);
    formik.resetForm();
    setTestToolsUsed(updated);
    setOptions(options.filter((option) => option.id !== removed));
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const isDisabled = (tool) => tool.retired && isConfirming && !hasIcs;

  const removeItem = (item) => {
    const updated = testToolsUsed.filter((s) => !(s.testToolId === item.testToolId));
    setTestToolsUsed(updated);
    setOptions([
      ...options,
      {
        id: item.testToolId,
        name: item.testToolName,
        retired: item.retired,
      },
    ].sort((a, b) => (a.name < b.name ? -1 : 1)));
    update(updated);
  };

  return (
    <div className={classes.container}>
      { testToolsUsed.length > 0
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
                { testToolsUsed.map((item, index) => (
                  <TableRow key={item.id || item.key || index}>
                    <TableCell>
                      <Typography variant="body2">{`${item.testToolName}${item.retired ? ' (Retired)' : ''}`}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{ item.testToolVersion }</Typography>
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
                id="test-tools-add-item"
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
                id="tt"
                name="tt"
                label="Test Tool Used"
                required
                value={formik.values.tt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tt && !!formik.errors.tt}
                helperText={formik.touched.tt && formik.errors.tt}
              >
                { options.map((item) => (
                  <MenuItem value={item} key={item.id} disabled={isDisabled(item)}>{`${item.name}${item.retired ? ' (Retired)' : ''}`}</MenuItem>
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
                  id="test-tools-check-item"
                >
                  <CheckIcon />
                </Button>
                <Button
                  onClick={() => cancelAdd()}
                  aria-label="Cancel adding item"
                  id="test-tools-close-item"
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

export default ChplTestToolsEdit;

ChplTestToolsEdit.propTypes = {
  isConfirming: bool,
  hasIcs: bool,
  onChange: func.isRequired,
  options: arrayOf(testTool).isRequired,
  testTools: arrayOf(selectedTestTool).isRequired,
};

ChplTestToolsEdit.defaultProps = {
  isConfirming: false,
  hasIcs: false,
};
