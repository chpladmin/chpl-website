import React, { useEffect, useState } from 'react';
import { arrayOf, func, object } from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  Button,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplEllipsis } from '../../../../util';
import { optionalStandard, selectedOptionalStandard } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplOptionalStandardsEdit(props) {
  const [adding, setAdding] = useState(false);
  const [optionalStandards, setOptionalStandards] = useState(props.optionalStandards.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const [options] = useState(props.options);

  const formik = useFormik({
    initialValues: {
      testStandardName: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const addNew = () => {
    const updated = [
      ...optionalStandards,
      {
        testStandardName: formik.values.testStandardName,
        key: (new Date()).getTime(),
      },
    ];
    setOptionalStandards(updated);
    formik.resetForm();
    setAdding(false);
    update(updated);
  };

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  };

  const removeItem = (item) => {
    const updated = optionalStandards.filter((s) => !(s.id === item.id && s.key === item.key));
    setOptionalStandards(updated);
    update(updated);
  };

  const update = (updated) => {
    props.onChange({ key: 'testStandards', data: updated });
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={11}>
            <Typography variant="subtitle2">Name</Typography>
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </Grid>
      { optionalStandards.map((item) => (
        <Grid item xs={12} key={item.id || item.key}>
          <Grid container spacing={4}>
            <Grid item xs={11}>
              <Typography variant="subtitle2"><ChplEllipsis text={item.testStandardName} maxLength={100} wordBoundaries /></Typography>
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
      { !adding
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
            <Grid item xs={11}>
              <InputLabel id="test-standard-name-label">Optional Standard</InputLabel>
              <Select
                fullWidth
                labelId="test-standard-name-label"
                id="test-standard-name"
                name="testStandardName"
                variant="outlined"
                value={formik.values.testStandardName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                { options.map((item) => (
                  <MenuItem value={item.name} key={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
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

export default ChplOptionalStandardsEdit;

ChplOptionalStandardsEdit.propTypes = {
  optionalStandards: arrayOf(selectedOptionalStandard),
  options: arrayOf(optionalStandard),
  onChange: func,
};
