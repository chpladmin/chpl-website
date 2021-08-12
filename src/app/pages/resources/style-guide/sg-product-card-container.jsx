import React from 'react';
import SgProductCard from './sg-product-card'
import {

  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display:'grid',
    gridTemplateColumns: '3fr 9fr',
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
        Filter Chip should ideally be placed here:
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