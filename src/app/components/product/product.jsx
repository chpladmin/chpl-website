import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  func,
  object,
  string,
} from 'prop-types';

import ChplProductEdit from './product-edit';

const useStyles = makeStyles({
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
});

function ChplProduct({
  dispatch,
  errorMessages,
  isEditing,
  isInvalid: initialIsInvalid,
  isProcessing,
  isSplitting,
  product,
}) {
  const [isInvalid, setIsInvalid] = useState(false);
  const classes = useStyles();

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
          <div className={classes.headerContainer}>
            <div className={classes.elementHeaderContainer}>Original Product</div>
          </div>
        )}
        component="div"
        className={classes.elementHeader}
      />
      <CardContent className={classes.content}>
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

ChplProduct.defaultProps = {
  dispatch: () => {},
  errorMessages: [],
  isEditing: false,
  isInvalid: false,
  isProcessing: false,
  isSplitting: false,
};
