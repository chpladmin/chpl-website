import React from 'react';
import {
  Button,
  Chip,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

import SgProductCard from './sg-product-card';
import SgDefaultFilter from './sg-default-filter';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '3fr 9fr',
    gap: '32px',
    overflowY: 'scroll',
  },
  productsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    padding: '8px 0px',
  },
  chipsSubContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    padding: '8px 0px',
  },
  productHeaderContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
});

function SgProductCardContainer() {
  const classes = useStyles();
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <div className={classes.container}>
      <div>
        <Typography gutterBottom variant="h3">Filters Applied:</Typography>
        <div className={classes.chipsSubContainer}>
          <div><Chip label="Active" onDelete={handleDelete} color="primary" /></div>
          <div><Chip label="Suspended (ONC)" onDelete={handleDelete} color="primary" /></div>
          <div><Chip label="Suspended (ACB)" onDelete={handleDelete} color="primary" /></div>
          <div><Chip label="2015" onDelete={handleDelete} color="primary" /></div>
        </div>
        <br />
        <Divider />
        <br />
        <div>
          <Typography gutterBottom variant="h5">Sort Results By:</Typography>
          <SgDefaultFilter fullWidth />
        </div>
      </div>
      <div>
        <div className={classes.productHeaderContainer}>
          <div className={classes.resultsContainer}>
            <Typography variant="h3">Search Results:</Typography>
            <Typography variant="h4">(189 Results)</Typography>
          </div>
          <Button variant="contained" color="secondary">
            Download Results
            <GetAppIcon />
          </Button>
        </div>
        <div className={classes.productsContainer}>
          <SgProductCard />
          <SgProductCard />
          <SgProductCard />
          <SgProductCard />
          <SgProductCard />
        </div>
      </div>
    </div>
  );
}

export default SgProductCardContainer;
