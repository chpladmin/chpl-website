import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Switch,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../../../themes/theme';
import { product as productProp } from '../../../shared/prop-types';
import { ChplTextField } from '../../util';

const validationSchema = yup.object({
  name: yup.string()
    .required('Product Name is required'),
});

function ChplConfirmProduct(props) {
  /* eslint-disable react/destructuring-assignment */
  const product = {
    ...props.product,
  };
  const [selectedProduct, setSelectedProduct] = useState('');
  const products = props.products
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  const [isCreating, setIsCreating] = useState(true);
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    const selected = props.products.filter((p) => p.productId === props.product.productId)[0];
    if (selected) {
      setSelectedProduct(selected);
    }
    setIsCreating(!props.product.productId || props.products.length === 0);
  }, [props.product, props.products]); // eslint-disable-line react/destructuring-assignment

  let formik;

  const handleCreationToggle = () => {
    if (isCreating) {
      props.dispatch('select', selectedProduct);
    } else {
      formik.handleSubmit();
    }
    setIsCreating(!isCreating);
  };

  const handleChange = (...args) => {
    formik.handleChange(...args);
    formik.handleSubmit();
  };

  const handleSelectOnChange = (event) => {
    props.dispatch('select', event.target.value);
    setSelectedProduct(event.target.value);
  };

  const submit = () => {
    props.dispatch('edit', {
      name: formik.values.name,
    });
  };

  formik = useFormik({
    initialValues: {
      name: product?.name || '',
    },
    onSubmit: () => {
      submit();
    },
    validationSchema,
  });

  return (
    <ThemeProvider theme={theme}>
      <Paper>
        <form noValidate>
          <Container>
            <Card>
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={4}>
                    Create a product
                  </Grid>
                  <Grid item xs={4}>
                    <Switch
                      id="create-toggle"
                      name="createProduct"
                      color="primary"
                      disabled={products?.length === 0}
                      checked={!isCreating}
                      onChange={handleCreationToggle}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    { selectedProduct
                      ? (
                        <>
                          Use
                          {' '}
                          { selectedProduct.name }
                        </>
                      ) : (
                        <>
                          Choose a product to use
                        </>
                      )}
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Product Information
                    </Typography>
                    <Divider />
                  </Grid>
                  { isCreating
                    ? (
                      <Grid container spacing={4}>
                        <Grid item xs={6}>
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
                        </Grid>
                      </Grid>
                    )
                    : (
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <ChplTextField
                            select
                            id="selected-product"
                            name="selectedProduct"
                            label="Select a Product"
                            required
                            value={selectedProduct}
                            onChange={handleSelectOnChange}
                          >
                            { products.map((item) => (
                              <MenuItem value={item} key={item.productId}>
                                { item.name }
                              </MenuItem>
                            ))}
                          </ChplTextField>
                        </Grid>
                      </Grid>
                    )}
                </Grid>
              </CardContent>
            </Card>
          </Container>
        </form>
      </Paper>
    </ThemeProvider>
  );
}

export default ChplConfirmProduct;

ChplConfirmProduct.propTypes = {
  product: productProp.isRequired,
  products: arrayOf(productProp).isRequired,
  dispatch: func.isRequired,
};
