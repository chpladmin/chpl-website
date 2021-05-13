import React, { useState } from 'react';
import { arrayOf, func } from 'prop-types';
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

const validationSchema = yup.object({
});

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

function ChplTestToolsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [testToolsUsed, setTestToolsUsed] = useState(props.testTools.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const [options, setOptions] = useState(
    props.options
      .filter((option) => !(props.testTools.find((used) => used.testToolId === option.id)))
      .sort((a, b) => (a.name < b.name ? -1 : 1)),
  );
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  const formik = useFormik({
    initialValues: {
      tt: '',
      version: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const update = (updated) => {
    props.onChange({ key: 'testToolsUsed', data: updated });
  };

  const addNew = () => {
    const updated = [
      ...testToolsUsed,
      {
        testToolId: formik.values.tt.id,
        testToolName: formik.values.tt.name,
        testToolVersion: formik.values.version,
        key: (new Date()).getTime(),
      },
    ];
    setTestToolsUsed(updated);
    setOptions(options.filter((option) => option.id !== formik.values.tt.id));
    formik.resetForm();
    setAdding(false);
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = testToolsUsed.filter((s) => !(s.testToolId === item.testToolId));
    setTestToolsUsed(updated);
    setOptions([
      ...options,
      {
        id: item.testToolId,
        name: item.testToolName,
      },
    ].sort((a, b) => (a.name < b.name ? -1 : 1)));
    update(updated);
  };

  return (
    <Container className={classes.container}>
      { testToolsUsed.length > 0
        && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle2">Name</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Version</Typography></TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                { testToolsUsed.map((item) => (
                  <TableRow key={item.id || item.key}>
                    <TableCell>
                      <Typography variant="subtitle2">{ item.testToolName }</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{ item.testToolVersion }</Typography>
                    </TableCell>
                    <TableCell align="right">
                      { !adding
                        && (
                          <IconButton
                            onClick={() => removeItem(item)}
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
                value={formik.values.tt}
                onChange={formik.handleChange}
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
                error={formik.touched.version && formik.errors.version}
                helperText={formik.touched.version && formik.errors.version}
              />
              <ButtonGroup
                color="primary"
                className={classes.dataEntryActions}
              >
                <Button
                  onClick={addNew}
                >
                  <CheckIcon />
                </Button>
                <Button
                  onClick={() => cancelAdd()}
                >
                  <CloseIcon />
                </Button>
              </ButtonGroup>
            </>
          )}
      </div>
    </Container>
  );
}

export default ChplTestToolsEdit;

ChplTestToolsEdit.propTypes = {
  testTools: arrayOf(selectedTestTool).isRequired,
  options: arrayOf(testTool).isRequired,
  onChange: func.isRequired,
};
