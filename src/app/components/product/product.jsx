import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, CardHeader, Typography,
} from '@mui/material';
import {
  arrayOf,
  bool,
  func,
  object,
  string,
} from 'prop-types';

import ChplProductEdit from './product-edit';

const styles = {
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  elementHeader: {
    margin: '0',
    fontSize: '1.25em',
  },
  elementHeaderContainer: {
    maxWidth: '75%',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

function ChplProduct({
  dispatch = () => {},
  errorMessages = [],
  isEditing = false,
  isInvalid: initialIsInvalid = false,
  isProcessing = false,
  isSplitting = false,
  product,
}) {
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setIsInvalid(initialIsInvalid);
  }, [initialIsInvalid]);

  if (isEditing) {
    return (
      <ChplProductEdit
        dispatch={dispatch}
        isInvalid={isInvalid}
        isProcessing={isProcessing}
        isSplitting={isSplitting}
        errorMessages={errorMessages}
        product={product}
      />
    );
  }

  return (
    <Card
      title={`${product.name} Information`}
    >
      <CardHeader
        title={(
          <Box sx={styles.headerContainer}>
            <Box sx={styles.elementHeaderContainer}>Original Product</Box>
          </Box>
        )}
        component="div"
        sx={styles.elementHeader}
      />
      <CardContent sx={styles.content}>
        <div>
          <Typography variant="body1" gutterBottom>
            <strong>Product</strong>
            <br />
            {product.name}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChplProduct;

ChplProduct.propTypes = {
  dispatch: func,
  errorMessages: arrayOf(string),
  isEditing: bool,
  isInvalid: bool,
  isProcessing: bool,
  isSplitting: bool,
  product: object.isRequired,
};
