import React, { useState } from 'react';
import { arrayOf, func } from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  Button,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { testData, selectedTestData } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplTestDataEdit(props) {
  const [adding, setAdding] = useState(false);
  const [testDataUsed, setTestDataUsed] = useState(props.testData.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const [options, setOptions] = useState(props.options);

  const formik = useFormik({
    initialValues: {
      name: '',
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
        testData: {
          name: formik.values.name,
        },
        version: formik.values.version,
        alteration: formik.values.alteration,
        key: (new Date()).getTime(),
      },
    ];
    setTestDataUsed(updated);
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
    const updated = testDataUsed.filter((s) => !(s.id === item.id && s.key === item.key));
    setTestDataUsed(updated);
    setOptions([...options, item]);
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
              <InputLabel id="name-label">Test Data Used</InputLabel>
              <Select
                fullWidth
                labelId="name-label"
                id="name"
                name="name"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                { options.map((item) => (
                  <MenuItem value={item.name} key={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="version"
                name="version"
                label="Version"
                variant="outlined"
                value={formik.values.version}
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.version && formik.errors.version}
                helperText={formik.touched.version && formik.errors.version}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="alteration"
                name="alteration"
                label="Alteration"
                variant="outlined"
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
