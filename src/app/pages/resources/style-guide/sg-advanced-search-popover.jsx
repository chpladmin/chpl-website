import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Checkbox,
  InputBase,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Popover,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { palette } from 'themes';

const useStyles = makeStyles({
  advancedSearchContainer: {
    background: '#E7F0F8',
    display: 'grid',
    gridTemplateColumns: '6fr 2fr 4fr',
    padding: '16px',
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto',
    justifyItems: 'start',
    alignItems: 'start',
  },
  filterHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
  },
  filterGroupTwoContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    borderLeft: '1px solid #599bde',
  },
  filterGroupThreeContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
  },
  filterSubHeaderGroupThreeContainer: {
    display: 'grid',
    gridTemplateColumns: '10fr auto auto',
    alignItems: 'center',
    gap: '8px',
  },
  filterSubHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    justifyItems: 'start',
    gap: '8px',
  },
  searchInput: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: '4px',
    borderRadius: '4px',
    border: `1px solid ${palette.grey}`,
    width: '100%',
    alignItems: 'center',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
  },
  switchGroupThreeContainer: {
    display: 'grid',
    gridTemplateColumns: '10fr auto auto',
    alignItems: 'center',
    gap: '4px',
  },
  iconSpacing: {
    marginLeft: '4px',
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
        onClick={handleClick}
      >
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
            display: 'grid',
            width: '100%',
            marginTop: '21px',
            borderRadius: '0px',
            boxShadow: '0px 4px 8px rgb(149 157 165 / 30%)',
          },
        }}
      >
        <div className={classes.advancedSearchContainer}>
          <div>
            <div>
              <List
                dense
                subheader={(
                  <ListSubheader disableSticky component="div" id="nested-list-subheader">
                    <div className={classes.filterHeaderContainer}>
                      <div>
                        <Typography variant="subtitle1"> Filter By: </Typography>
                      </div>
                      <div>
                        <ButtonGroup
                          variant="text"
                          color="primary"
                          size="medium"
                          aria-label="apply to filter dropdown"
                        >
                          <Button>Reset All Filters</Button>
                        </ButtonGroup>
                      </div>
                    </div>
                  </ListSubheader>
                                  )}
              >
                <div className={classes.filterSubHeaderContainer}>
                  <div className={classes.filterContainer}>
                    <Button color="primary">Certification Criteria</Button>
                    <Button color="primary">Certification Status</Button>
                    <Button color="primary">Certification Edition</Button>
                    <Button color="primary">Clinical Quality Measures</Button>
                  </div>
                  <div className={classes.filterContainer}>
                    <Button color="primary">Certification Date</Button>
                    <Button color="primary">ONC-ACBs</Button>
                    <Button color="primary">Patient Type</Button>
                    <Button color="primary">Surveillance Activity</Button>
                  </div>
                </div>
              </List>
            </div>

          </div>
          <div>
            <List
              dense
              subheader={(
                <ListSubheader disableSticky component="div" id="nested-list-subheader">
                  <div className={classes.filterSubHeaderContainer}>
                    <div>
                      <ButtonGroup
                        variant="text"
                        color="primary"
                        size="medium"
                        aria-label="apply to filter dropdown"
                      >
                        <Button>Clear</Button>
                        <Button>Reset</Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </ListSubheader>
                              )}
            >
              <div className={classes.filterGroupTwoContainer}>
                <div>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>2011</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>2014</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>2015</ListItemText>
                  </ListItem>
                </div>
              </div>
            </List>
          </div>
          <div>
            <List
              dense
              subheader={(
                <ListSubheader disableSticky component="div" id="nested-list-subheader">
                  <div className={classes.filterSubHeaderGroupThreeContainer}>
                    <div className={classes.searchInput}>
                      <SearchIcon />
                      <InputBase
                        placeholder="Search for something..."
                      />
                    </div>
                    <div>
                      <Typography variant="subtitle1"> Matching: </Typography>
                    </div>
                    <div className={classes.switchGroupThreeContainer}>
                      <div>
                        <Typography variant="body1"> Any </Typography>
                      </div>
                      <div>
                        <Switch color="primary" />
                      </div>
                      <div>
                        <Typography variant="body1"> All </Typography>
                      </div>
                    </div>
                  </div>
                </ListSubheader>
                              )}
            >
              <div>
                <div className={classes.filterGroupThreeContainer}>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>All</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>170.315 (a)(1): Computerized Provider Order Entry (CPOE) - Medications</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>170.315 (a)(3): CPOE - Diagnostic Imaging</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>170.315 (a)(5): Demographics</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>170.302 (a)(5): Demographics</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>170.302 (a)(6): Problem list</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>170.302 (a)(7): Medication list</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>170.302 (a)(8): Medication allergy list</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>170.302 (a)(9): Clinical decision support</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>170.302 (a)(10): Drug-formulary and preferred drug list checks</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>170.302 (a)(11): Smoking status</ListItemText>
                  </ListItem>
                  <ListItem>
                    <Checkbox color="primary" edge="start" />
                    <ListItemText>170.302 (a)(12): Family health history</ListItemText>
                  </ListItem>
                </div>
              </div>
            </List>
          </div>
        </div>
      </Popover>
    </>
  );
}

export default SgAdvancedSearchPopover;
