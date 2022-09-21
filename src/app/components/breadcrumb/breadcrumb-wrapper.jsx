import React, { useEffect, useState } from 'react';
import {
  Breadcrumbs,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { bool, node, string } from 'prop-types';

import { BreadcrumbContext } from 'shared/contexts';

const useStyles = makeStyles({
  breadcrumbContainer: {
    backgroundColor: '#ffffff',
    padding: '8px',
    marginBottom: '16px',
  },
  breadcrumbs: {
    '& ol': {
      '& li': {
        '& button': {
          '& span': {
            textTransform: 'none',
          },
        },
      },
    },
  },
});

function BreadcrumbWrapper(props) {
  const { children, disabled, title } = props;
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [visible, setVisible] = useState(new Set());
  const classes = useStyles();

  useEffect(() => {
    setDisplayed(breadcrumbs
      .filter((crumb) => visible.has(crumb.key))
      .sort((a, b) => a.props.depth - b.props.depth));
  }, [breadcrumbs, visible]);

  const append = (crumb) => {
    setBreadcrumbs((crumbs) => crumbs.filter((c) => c.key !== crumb.key).concat(crumb));
  };

  const display = (key) => {
    setVisible((prev) => (new Set(prev)).add(key));
  };

  const hide = (key) => {
    setVisible((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const breadcrumbState = {
    append,
    display,
    hide,
  };

  if (disabled) {
    return (
      <BreadcrumbContext.Provider value={breadcrumbState}>
        { children }
      </BreadcrumbContext.Provider>
    );
  }

  return (
    <>
      <div className={classes.breadcrumbContainer}>
        <Container maxWidth="lg">
          <Breadcrumbs className={classes.breadcrumbs}>
            { displayed }
          </Breadcrumbs>
          { title
            && (
              <Typography gutterBottom variant="h1">{title}</Typography>
            )}
        </Container>
      </div>
      <Container maxWidth="lg">
        <BreadcrumbContext.Provider value={breadcrumbState}>
          { children }
        </BreadcrumbContext.Provider>
      </Container>
    </>
  );
}

export default BreadcrumbWrapper;

BreadcrumbWrapper.propTypes = {
  children: node,
  disabled: bool,
  title: string,
};

BreadcrumbWrapper.defaultProps = {
  children: undefined,
  disabled: false,
  title: undefined,
};
