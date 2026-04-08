import React from 'react';
import {
  Collapse,
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

  return (
    <>
      <ListItem
        className={classes.sectionHeader}
        onClick={() => onToggle(section)}
        divider
      >
        <Typography className={classes.sectionHeaderText}>{title}</Typography>
        {isOpen
          ? <ExpandLessIcon className={classes.sectionChevron} />
          : <ExpandMoreIcon className={classes.sectionChevron} />}
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
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
