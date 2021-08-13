import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Checkbox,
  Popover,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
    filterContainer: {
        background: '#E7F0F8',
        display:'grid',
        gridTemplateColumns:'6fr 2fr 4fr',
        padding:'32px',
    },
  });
  

function SgAdvancedSearchPopover(props) {
  const classes = useStyles();
  const { anchor } = props;
  const [anchorElement, setAnchorElement] = useState(null);

  const handlePopoverClose = () => {
    setAnchorElement(null);
  };

  function handleClick(event) {
    setAnchorElement(event.currentTarget);
  }

  const open = Boolean(anchorElement);
  const id = open ? 'ChplDefaultFilterPopover' : undefined;

  return (
    <>
      <div
        // aria-owns={open ? 'assignedTo-popover' : undefined}
        // aria-haspopup='true'
        // onMouseEnter={handlePopoverOpen}
        // onMouseLeave={handlePopoverClose}
        aria-describedby={id}
        onClick={handleClick}>
        {anchor}
      </div>

      <Popover 
        id={id}
        open={open}
        anchorEl={anchorElement}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
            style: { 
            height: '250px', 
            background: '#E7F0F8',
            display:'grid',
            width:'100%',
            marginTop:'21px',
            borderRadius:'0px',
            boxShadow:'0px 4px 8px rgb(149 157 165 / 30%)',
            },
          }}
       >
      
      <div className={classes.filterContainer}>
          <div>
            Filter By
          </div>
          <div>
            Filter By 2
          </div>
          <div>
            Select Filter
          </div>
      </div>
      </Popover>
    </>
  );
}

export default SgAdvancedSearchPopover;