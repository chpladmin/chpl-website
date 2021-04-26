import React, { useEffect, useState } from 'react';
import { arrayOf, func } from 'prop-types';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
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
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { reliedUponSoftware } from '../../../../../shared/prop-types';

const validationSchema = yup.object({
});

function ChplReliedUponSoftwareEdit(props) {
  const [isAdding, setAdding] = useState(false);
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
      },
    ]);
  }

  const removeItem = (event) => {
    console.log(event);
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
          <Grid item xs={12} key={sw.id}>
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
                <IconButton
                  onClick={(event) => removeItem(event)}>
                  <CloseOutlinedIcon
                    color="primary"
                    size="small" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        ))}
        { !isAdding &&
        <Grid item xs={12}>
          <Button
            onClick={() => setAdding(true)}
          >Add item
          </Button>
        </Grid>}
        { isAdding &&
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <TextField
                  id="new-name"
                  name="newName"
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
                  id="new-version"
                  version="newVersion"
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
                  id="new-certifiedProductNumber"
                  certifiedProductNumber="newCertifiedProductNumber"
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
                  id="new-grouping"
                  grouping="newGrouping"
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
  handleReliedUponSoftwareChange: func,
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
