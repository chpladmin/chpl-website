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
} from '@material-ui/core';

function ChplFilter(props) {
  const { anchor } = props;
  const [anchorElement, setAnchorElement] = useState(null);

  const handlePopoverClose = () => {
    setAnchorElement(null);
  };

  function handleClick(event) {
    setAnchorElement(event.currentTarget);
  }

  const open = Boolean(anchorElement);
  const id = open ? 'ChplFilter' : undefined;

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
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          style: { height: '250px' },
        }}>
        <ListSubheader>
          <ButtonGroup
            variant="text"
            color="primary"
            aria-label="apply to filter dropdown">
            <Button>Reset</Button>
            <Button>Select All</Button>
          </ButtonGroup>

          <Divider></Divider>
        </ListSubheader>
        <List dense>
          <ListItem>
            <Checkbox color="primary" edge="start" />
            <ListItemText>Active</ListItemText>
            <ListItemIcon></ListItemIcon>
          </ListItem>

          <ListItem>
            <Checkbox color="primary" edge="start" />
            <ListItemText>Retired</ListItemText>
            <ListItemIcon></ListItemIcon>
          </ListItem>

          <ListItem>
            <Checkbox color="primary" edge="start" />
            <ListItemText>Suspended by ONC</ListItemText>
            <ListItemIcon></ListItemIcon>
          </ListItem>
          <ListItem>
            <Checkbox color="primary" edge="start" />
            <ListItemText>Suspended by ONC/ACB</ListItemText>
            <ListItemIcon></ListItemIcon>
          </ListItem>
        </List>
      </Popover>
    </>
  );
}

export default ChplFilter;