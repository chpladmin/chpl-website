import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Popover,
  Grid,
  TextField,
  Typography,
  Container,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

const useStyles = makeStyles(() => ({
  SaveFilterPopover: {
    width: '50vw',
  },
  ButtonBarSpacing: {
    padding: '8px 0px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },

  deleteColor: {
    color: '#c44f65',
  },
}));

function ChplSavedFilter(props) {
  const [anchorElement, setAnchorElement] = useState(null);

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
  }

  const open = Boolean(anchorElement);
  const id = open ? 'saved-search' : undefined;
  const classes = useStyles();
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClick}
      >
        Saved Searches
        <ArrowDownwardIcon fontSize="small" />
      </Button>
      <Popover
        className={classes.SaveFilterPopover}
        id={id}
        open={open}
        anchorEl={anchorElement}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          style: { height: 'auto' },
        }}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}>
          <Grid item xs={12}>
            <Container>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <ButtonGroup
                    className={classes.ButtonBarSpacing}
                    variant="text"
                    color="primary"
                    aria-label="apply to filter dropdown">
                    <Button>Clear Filter</Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </Container>

            <Divider></Divider>
          </Grid>

          <Grid item xs={12}>
            <Container>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Save Filter As</Typography>
                  <Divider></Divider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size="small"
                    label="Custom Filter Name"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    size="small"
                    color="primary"
                    label="Saved"
                    variant="contained">
                    Save Filter{' '}
                    <SaveOutlinedIcon
                      size="small"
                      className={classes.iconSpacing}
                    />
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Grid>
          <Grid item xs={12}>
            <Container>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Available Filters</Typography>
                  <Divider></Divider>
                </Grid>
                <Grid item xs={12}>
                  <List dense>
                    <ListItem>
                      <ListItemText>Custom Filter 1</ListItemText>
                      <ListItemIcon>
                        <IconButton>
                          <DeleteOutlineOutlinedIcon
                            className={classes.deleteColor}
                          />
                        </IconButton>
                      </ListItemIcon>
                    </ListItem>
                    <Divider></Divider>
                    <ListItem>
                      <ListItemText>Custom Filter 2</ListItemText>
                      <ListItemIcon>
                        <IconButton>
                          <DeleteOutlineOutlinedIcon
                            className={classes.deleteColor}
                          />
                        </IconButton>
                      </ListItemIcon>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
}

export default ChplSavedFilter;
