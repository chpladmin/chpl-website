import React, { useState } from 'react';
import { arrayOf, func } from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  Button,
  Grid,
  IconButton,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from '../../../../util';
import { testTool, selectedTestTool } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplTestToolsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [testToolsUsed, setTestToolsUsed] = useState(props.testTools.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const [options, setOptions] = useState(props.options);
  /* eslint-enable react/destructuring-assignment */

  const formik = useFormik({
    initialValues: {
      name: '',
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
        testToolName: formik.values.name,
        testToolVersion: formik.values.version,
        key: (new Date()).getTime(),
      },
    ];
    setTestToolsUsed(updated);
    setOptions(options.filter((option) => option.name !== formik.values.name));
    formik.resetForm();
    setAdding(false);
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = testToolsUsed.filter((s) => !(s.id === item.id && s.key === item.key));
    setTestToolsUsed(updated);
    setOptions([...options, item]);
    update(updated);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Name</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="subtitle2">Version</Typography>
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </Grid>
      { testToolsUsed.map((item) => (
        <Grid item xs={12} key={item.id || item.key}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">{ item.testToolName }</Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="subtitle2">{ item.testToolVersion }</Typography>
            </Grid>
            <Grid item xs={1}>
              { !adding
                && (
                <IconButton
                  onClick={() => removeItem(item)}
                >
                  <CloseOutlinedIcon
                    color="primary"
                    size="small"
                  />
                </IconButton>
                )}
            </Grid>
          </Grid>
        </Grid>
      ))}
      { !adding && options.length > 0
        && (
        <Grid item xs={12}>
          <Button
            onClick={() => setAdding(true)}
          >
            Add item
          </Button>
        </Grid>
        )}
      { adding
        && (
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <ChplTextField
                select
                id="name"
                name="name"
                label="Test Tool Used"
                value={formik.values.name}
                onChange={formik.handleChange}
              >
                { options.map((item) => (
                  <MenuItem value={item.name} key={item.id}>{item.name}</MenuItem>
                ))}
              </ChplTextField>
            </Grid>
            <Grid item xs={5}>
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
            </Grid>
            <Grid item xs={1}>
              <Button
                color="primary"
                variant="outlined"
                onClick={addNew}
              >
                <CheckOutlinedIcon />
              </Button>
              <IconButton
                onClick={() => cancelAdd()}
              >
                <CloseOutlinedIcon
                  color="primary"
                  size="small"
                />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        )}
    </Grid>
  );
}

export default ChplTestToolsEdit;

ChplTestToolsEdit.propTypes = {
  testTools: arrayOf(selectedTestTool).isRequired,
  options: arrayOf(testTool).isRequired,
  onChange: func.isRequired,
};
