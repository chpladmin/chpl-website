import React, { useEffect, useState } from 'react';
import { arrayOf, func } from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  Button,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { reliedUponSoftware } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplReliedUponSoftwareEdit(props) {
  const [adding, setAdding] = useState(false);
  const [software, setSoftware] = useState(props.sw);

  const formik = useFormik({
    initialValues: {
      relies: props.sw.length > 0,
      name: '',
      version: '',
      certifiedProductNumber: '',
      grouping: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const addNew = () => {
    setSoftware([
      ...software,
      {
        name: formik.values.name,
        version: formik.values.version,
        certifiedProductNumber: formik.values.certifiedProductNumber,
        grouping: formik.values.grouping,
        key: (new Date()).getTime(),
      },
    ]);
    formik.resetForm();
    setAdding(false);
  }

  const cancelAdd = () => {
    formik.resetForm();
    setAdding(false);
  }

  const removeItem = (sw) => {
    setSoftware(software.filter((s) => !(s.id === sw.id && s.key === sw.key)));
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              id="relies"
              name="relies"
              color="primary"
              checked={ formik.values.relies }
              onChange={ formik.handleChange }
            />
          }
          label={`Relies upon additional software: ${formik.values.relies ? 'True' : 'False'}`}
        />
      </Grid>
      <Collapse in={formik.values.relies}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <Typography variant="subtitle2">Name</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle2">Version</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle2">CHPL ID</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2">Group</Typography>
            </Grid>
            <Grid item xs={1} />
          </Grid>
        </Grid>
        { software.map((sw) => (
          <Grid item xs={12} key={sw.id || sw.key}>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <Typography variant="subtitle2">{ sw.name }</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle2">{ sw.version }</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle2">{ sw.certifiedProductNumber }</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2">{ sw.grouping }</Typography>
              </Grid>
              <Grid item xs={1}>
                { !adding &&
                  <IconButton
                    onClick={() => removeItem(sw)}>
                    <CloseOutlinedIcon
                      color="primary"
                      size="small" />
                  </IconButton>}
              </Grid>
            </Grid>
          </Grid>
        ))}
        { !adding &&
          <Grid item xs={12}>
            <Button
              onClick={() => setAdding(true)}
            >Add item
            </Button>
          </Grid>}
        { adding &&
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="version"
                  name="version"
                  label="Version"
                  value={formik.values.version}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.version && formik.errors.version}
                  helperText={formik.touched.version && formik.errors.version}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="certified-product-number"
                  name="certifiedProductNumber"
                  label="Certified Product Number"
                  value={formik.values.certifiedProductNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.certifiedProductNumber && formik.errors.certifiedProductNumber}
                  helperText={formik.touched.certifiedProductNumber && formik.errors.certifiedProductNumber}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="grouping"
                  name="grouping"
                  label="Grouping"
                  value={formik.values.grouping}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.grouping && formik.errors.grouping}
                  helperText={formik.touched.grouping && formik.errors.grouping}
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
                  onClick={() => cancelAdd()}>
                  <CloseOutlinedIcon
                    color="primary"
                    size="small" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        }
      </Collapse>
    </Grid>
  );
}

export { ChplReliedUponSoftwareEdit };

ChplReliedUponSoftwareEdit.propTypes = {
  onChange: func,
  sw: arrayOf(reliedUponSoftware),
};

/*
  <Grid container spacing={4}>
  <Grid item xs={12}>
  <FormControlLabel
  control={
  <Switch
  id="relies"
  name="relies"
  color="primary"
  checked={ formik.values.relies }
  onChange={ formik.handleChange }
  />
  }
  label={`Relies upon additional software: ${formik.values.relies ? 'True' : 'False'}`}
  />
  </Grid>
  <Grid item xs={12}>
  <Grid container spacing={4}>
  <Grid item xs={3}>
  <Typography variant="subtitle2">Name</Typography>
  </Grid>
  <Grid item xs={3}>
  <Typography variant="subtitle2">Version</Typography>
  </Grid>
  <Grid item xs={3}>
  <Typography variant="subtitle2">CHPL ID</Typography>
  </Grid>
  <Grid item xs={2}>
  <Typography variant="subtitle2">Group</Typography>
  </Grid>
  <Grid item xs={1}></Grid>
  </Grid>
  </Grid>

  <Grid item xs={12}>
  <Grid container spacing={4}>
  <Grid item xs={3}>
  <Typography variant="body1">ONC Test Method</Typography>
  </Grid>
  <Grid item xs={3}>
  <Typography variant="body1">2.1</Typography>
  </Grid>
  <Grid item xs={3}>
  <Typography variant="body1">-</Typography>
  </Grid>
  <Grid item xs={2}>
  <Typography variant="body1">-</Typography>
  </Grid>
  <Grid item xs={1}>
  <IconButton>
  <CloseOutlinedIcon color="primary" size="small" />
  </IconButton>
  </Grid>
  </Grid>
*/
