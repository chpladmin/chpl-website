import React from 'react';
import SgProductCard from './sg-product-card'
import {
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display:'grid',
    gridTemplateColumns: '4fr 8fr',
    gap:'16px',
    maxHeight:'800px',
    overflowY:'scroll',
  },
  subcontainer: {
    display:'grid',
    gridTemplateColumns: '1fr',
    gap:'16px',
  },
});
function SgProductCardContainer() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
       <Typography variant='h4'>Filters Applied:</Typography> 
      </div>
      <div className={classes.subcontainer}>
        <SgProductCard />
        <SgProductCard />
        <SgProductCard />
        <SgProductCard />
        <SgProductCard />
      </div>
    </div>
  );
}

export default SgProductCardContainer;