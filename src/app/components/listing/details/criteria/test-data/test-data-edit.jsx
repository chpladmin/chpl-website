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
import { testData, selectedTestData } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplTestDataEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [adding, setAdding] = useState(false);
  const [testDataUsed, setTestDataUsed] = useState(props.testData.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const [options, setOptions] = useState(props.options.filter((option) => props.testData.filter((used) => used.testData.id === option.id).length === 0));
  /* eslint-enable react/destructuring-assignment */

  const formik = useFormik({
    initialValues: {
      td: '',
      version: '',
      alteration: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const update = (updated) => {
    props.onChange({ key: 'testDataUsed', data: updated });
  };

  const addNew = () => {
    const updated = [
      ...testDataUsed,
      {
        testData: formik.values.td,
        version: formik.values.version,
        alteration: formik.values.alteration,
        key: (new Date()).getTime(),
      },
    ];
    setTestDataUsed(updated);
    setOptions(options.filter((option) => option.id !== formik.values.td.id));
    formik.resetForm();
    setAdding(false);
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
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <Typography variant="subtitle2">Name</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2">Version</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2">Alteration</Typography>
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </Grid>
      { testDataUsed.map((item) => (
        <Grid item xs={12} key={item.id || item.key}>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <Typography variant="subtitle2">{ item.testData.name }</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle2">{ item.version }</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2">{ item.alteration }</Typography>
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
            <Grid item xs={3}>
              <ChplTextField
                select
                id="td"
                name="td"
                label="Test Data Used"
                value={formik.values.td}
                onChange={formik.handleChange}
              >
                { options.map((item) => (
                  <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                ))}
              </ChplTextField>
            </Grid>
            <Grid item xs={3}>
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
            <Grid item xs={2}>
              <ChplTextField
                id="alteration"
                name="alteration"
                label="Alteration"
                value={formik.values.alteration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.alteration && formik.errors.alteration}
                helperText={formik.touched.alteration && formik.errors.alteration}
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

export default ChplTestDataEdit;

ChplTestDataEdit.propTypes = {
  testData: arrayOf(selectedTestData).isRequired,
  options: arrayOf(testData).isRequired,
  onChange: func.isRequired,
};
