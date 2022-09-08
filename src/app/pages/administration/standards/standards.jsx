import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import * as jsJoda from '@js-joda/core';
import '@js-joda/timezone';

import ChplSvaps from 'components/standards/svap/svaps';

import { BreadcrumbContext, UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    [theme.breakpoints.up('lg')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
    },
  },
  breadcrumbs: {
    textTransform: 'none',
  },
});

const resetBreadcrumbs = (append, dropAll, classes) => {
  dropAll();
  append(
    <Button
      key="standards.disabled"
      variant="text"
      className={classes.breadcrumbs}
      disabled
    >
      Standards &amp; Processes
    </Button>,
  );
};

function ChplStandards() {
  const { append, dropAll } = useContext(BreadcrumbContext);
  const [active, setActive] = useState('svaps');
  const classes = useStyles();

  useEffect(() => {
    resetBreadcrumbs(append, dropAll, classes);
  }, []);

  const handleDispatch = () => {
    setActive('');
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography className={classes.fullWidthGridRow} variant="h1">Management of Standards &amp; Processes</Typography>
      <div>
        <Button onClick={() => setActive('svaps')}>SVAP Maintenance</Button>
      </div>
      <div>
        { active === 'svaps'
          && (
            <ChplSvaps dispatch={handleDispatch} />
          )}
      </div>
    </Container>
  );
}

export default ChplStandards;

ChplStandards.propTypes = {
};
