import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  MenuItem,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../../../themes/theme';
import { product as productProp } from '../../../shared/prop-types';
import { ChplTextField } from '../../util';

const useStyles = makeStyles(() => ({
  buttonCard: {
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#f5f9fd',
    whiteSpace: 'pre-wrap',
  },
  buttonCardFocused: {
    boxShadow: '0px 0px 16px 4px #337ab750',
    fontWeight: '600',
    backgroundColor: '#ffffff',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    whiteSpace: 'pre-wrap',
  },
  developerConfirm: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
    padding: '32px 0',
    alignItems: 'start',
  },
  developerSubContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'self-start',
    textAlign: 'center',
    gap: '32px',
  },
  developerInfo: {
    display: 'grid',
    gap: '16px',
    flexDirection: 'row',
    gridTemplateColumns: '1fr 1fr',
  },
  extraLargeIcons: {
    marginBottom: '8px',
    fontSize: '2em',
  },
  formContainer: {
    display: 'flex',
    gap: '16px',
    flexDirection: 'column',
  },
  formSubContainer: {
    display: 'grid',
    gap: '16px',
    flexDirection: 'row',
    gridTemplateColumns: '1fr',
  },
  orContainer: {
    display: 'flex',
    gap: '4px',
    flexDirection: 'column',
    paddingTop: '32px',
  },
  rejectButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  selectedDeveloper: {
    fontWeight: '100',
    paddingTop: '8px',
  },
  verticalDivider: {
    height: '25%',
  },
}));

const validationSchema = yup.object({
  name: yup.string()
    .required('Product Name is required'),
});

function ChplConfirmProduct(props) {
  /* eslint-disable react/destructuring-assignment */
  const [selectedProduct, setSelectedProduct] = useState('');
  const products = props.products
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  const [isCreating, setIsCreating] = useState(true);
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    const selected = props.products.filter((p) => p.id === props.product.id)[0];
    if (selected) {
      setSelectedProduct(selected);
    }
    setIsCreating(!props.product.id || props.products.length === 0);
  }, [props.product, props.products]); // eslint-disable-line react/destructuring-assignment

  let formik;

  const handleCreationToggle = (creating) => {
    if (isCreating !== creating) {
      if (isCreating) {
        props.dispatch('select', selectedProduct);
      } else {
        formik.handleSubmit();
      }
      setIsCreating(creating);
    }
  };

  const handleChange = (...args) => {
    formik.handleChange(...args);
    formik.handleSubmit();
  };

  const handleSelectOnChange = (event) => {
    props.dispatch('select', event.target.value);
    setSelectedProduct(event.target.value);
  };

  const classes = useStyles();

  const submit = () => {
    props.dispatch('edit', {
      name: formik.values.name,
    });
  };

  formik = useFormik({
    initialValues: {
      name: props.product?.name || '', // eslint-disable-line react/destructuring-assignment
    },
    onSubmit: () => {
      submit();
    },
    validationSchema,
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <div className={classes.developerConfirm}>
          <div className={classes.developerSubContainer}>
            <Button
              variant="outlined"
              color="default"
              fullWidth
              disabled={products?.length === 0}
              className={`${classes.buttonCard} ${!isCreating ? classes.buttonCardFocused : ''}`}
              onClick={() => handleCreationToggle(false)}
            >
              <span className={classes.buttonContent}>
                <CheckCircleIcon color="primary" className={classes.extraLargeIcons} />
                { selectedProduct
                  ? (
                    <>
                      {`Use "${selectedProduct.name}"`}
                    </>
                  ) : (
                    <>
                      Choose A Product To Use
                    </>
                  )}
              </span>
            </Button>
            <div className={classes.orContainer}>
              <Divider />
              <Typography>OR</Typography>
              <Divider />
            </div>
            <Button
              variant="outlined"
              color="default"
              fullWidth
              className={`${classes.buttonCard} ${isCreating ? classes.buttonCardFocused : ''}`}
              onClick={() => handleCreationToggle(true)}
            >
              <span className={classes.buttonContent}>
                <AddCircleIcon color="primary" className={classes.extraLargeIcons} />
                Create a Product
              </span>
            </Button>
          </div>
          <Divider />
          {isCreating
            ? (
              <Card>
                <CardHeader title="Create A New Product" />
                <CardContent>
                  <div className={classes.formContainer}>
                    <ChplTextField
                      id="name"
                      name="name"
                      label="Product Name"
                      value={formik.values.name}
                      error={formik.touched.name && !!formik.errors.name}
                      helperText={formik.touched.name && formik.errors.name}
                      onChange={handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader title="Select An Existing Product" />
                <CardContent>
                  <ChplTextField
                    select
                    id="selected-product"
                    name="selectedProduct"
                    label="Select a Product"
                    required
                    value={selectedProduct}
                    onChange={handleSelectOnChange}
                  >
                    {products.map((item) => (
                      <MenuItem value={item} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </ChplTextField>
                </CardContent>
              </Card>
            )}
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default ChplConfirmProduct;

ChplConfirmProduct.propTypes = {
  product: productProp.isRequired,
  products: arrayOf(productProp).isRequired,
  dispatch: func.isRequired,
};
