import React, { useEffect, useState } from 'react';
import {
  Breadcrumbs,
  Container,
  Typography, 
  makeStyles,
} from '@material-ui/core';
import { node, string } from 'prop-types';

import { BreadcrumbContext } from 'shared/contexts';

const useStyles = makeStyles({
  breadcrumbContainer: {
    backgroundColor: '#ffffff',
    padding: '8px',
  },
});
function BreadcrumbWrapper(props) {
  const { children, title } = props;
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

  return (
    <Container maxWidth='lg' className={classes.breadcrumbContainer}>
      <Breadcrumbs >
        { displayed }
      </Breadcrumbs>
        { title
          && (
            <Typography gutterBottom variant="h1">{title}</Typography>
          )
        }
      <BreadcrumbContext.Provider value={breadcrumbState}>
        { children }
      </BreadcrumbContext.Provider>
    </Container>
  );
}

export default BreadcrumbWrapper;

BreadcrumbWrapper.propTypes = {
  children: node,
  title: string,
};

BreadcrumbWrapper.defaultProps = {
  children: undefined,
  title: undefined,
};
