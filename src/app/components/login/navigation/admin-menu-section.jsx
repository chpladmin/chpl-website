import React from 'react';
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {
  bool,
  func,
  node,
  string,
} from 'prop-types';

import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { palette } from 'themes';

const useStyles = makeStyles({
  sectionHeader: {
    padding: '12px 16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: palette.greyDark,
    '&:hover': {
      backgroundColor: palette.secondary,
    },
  },
  sectionHeaderText: {
    fontWeight: 500,
    fontSize: '16px',
    display: 'flex',
    flexGrow: 1,
  },
  sectionChevron: {
    marginLeft: 'auto',
  },
});

function ChplAdminMenuSection({
  children,
  disablePadding = true,
  isOpen,
  onToggle,
  section,
  title,
}) {
  const classes = useStyles();
  const { analytics } = useAnalyticsContext();

  const handleToggle = () => {
    eventTrack({
      ...analytics,
      event: isOpen ? `Collapse ${title}` : `Expand ${title}`,
      category: 'Navigation',
    });
    onToggle(section);
  };

  return (
    <>
      <ListItem
        className={classes.sectionHeader}
        onClick={handleToggle}
        divider
      >
        <Typography className={classes.sectionHeaderText}>{title}</Typography>
        <IconButton
          className={classes.sectionChevron}
          aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
          aria-expanded={isOpen}
          size="small"
          onClick={(e) => { e.stopPropagation(); handleToggle(); }}
        >
          {isOpen
            ? <ExpandLessIcon style={{ color: 'black' }} />
            : <ExpandMoreIcon color="primary" />}
        </IconButton>
      </ListItem>
      <Collapse in={isOpen} timeout={{ enter: 400, exit: 400 }} unmountOnExit>
        <List component="div" disablePadding={disablePadding}>
          {children}
        </List>
      </Collapse>
    </>
  );
}

export default ChplAdminMenuSection;

ChplAdminMenuSection.propTypes = {
  children: node.isRequired,
  disablePadding: bool,
  isOpen: bool.isRequired,
  onToggle: func.isRequired,
  section: string.isRequired,
  title: string.isRequired,
};
