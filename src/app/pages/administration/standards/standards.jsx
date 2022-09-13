import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';

import ChplSvaps from 'components/standards/svap/svaps';
import { BreadcrumbContext } from 'shared/contexts';
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

function ChplStandards() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const [active, setActive] = useState('');
  const classes = useStyles();
  let navigate;

  useEffect(() => {
    append(
      <Button
        key="standards.disabled"
        depth={0}
        variant="text"
        className={classes.breadcrumbs}
        disabled
      >
        Standards &amp; Processes
      </Button>,
    );
    append(
      <Button
        key="standards"
        depth={0}
        variant="text"
        className={classes.breadcrumbs}
        onClick={() => navigate()}
      >
        Standards &amp; Processes
      </Button>,
    );
    display('standards.disabled');
  }, []);

  navigate = (target) => {
    if (target) {
      setActive(target);
      display('standards');
      hide('standards.disabled');
    } else {
      setActive('');
      display('standards.disabled');
      hide('standards');
      hide('svaps.viewall.disabled');
      hide('svaps.viewall');
      hide('svaps.add.disabled');
      hide('svaps.edit.disabled');
    }
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography className={classes.fullWidthGridRow} variant="h1">Management of Standards &amp; Processes</Typography>
      <div>
        <Button onClick={() => navigate('svaps')}>SVAP Maintenance</Button>
      </div>
      <div>
        { active === 'svaps'
          && (
            <ChplSvaps />
          )}
      </div>
    </Container>
  );
}

export default ChplStandards;

ChplStandards.propTypes = {
};
