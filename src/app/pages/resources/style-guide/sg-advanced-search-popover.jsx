import React, { useState } from 'react';
import {
    Button,
    ButtonGroup,
    Checkbox,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListSubheader,
    Popover,
    makeStyles,
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
    filterContainer: {
        background: '#E7F0F8',
        display: 'grid',
        gridTemplateColumns: '6fr 2fr 4fr',
        padding: '16px',
    },
    filterGroupOneContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems:'center',
    },
    filterListContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems:'center',
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
                        display: 'grid',
                        width: '100%',
                        marginTop: '21px',
                        borderRadius: '0px',
                        boxShadow: '0px 4px 8px rgb(149 157 165 / 30%)',
                    },
                }}
            >
                <div className={classes.filterContainer}>
                    <div>
                        <div>
                            <List dense
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                        <div className={classes.filterGroupOneContainer}>
                                        <div>
                                        <Typography variant="subtitle1"> Filter By </Typography>
                                        </div>
                                        <div>
                                        <ButtonGroup
                                            variant="text"
                                            color="primary"
                                            size="medium"
                                            aria-label="apply to filter dropdown">
                                            <Button>Reset</Button>
                                            <Button>Select All</Button>
                                        </ButtonGroup>
                                        </div>
                                        </div>
                                    </ListSubheader>
                                }>
                                <div className={classes.filterListContainer}>
                                    <div>
                                <ListItem>
                                    <Checkbox color="primary" edge="start" />
                                    <ListItemText>Certification Criteria</ListItemText>
                                    <ListItemIcon></ListItemIcon>
                                </ListItem>
                                <ListItem>
                                    <Checkbox color="primary" edge="start" />
                                    <ListItemText>Certification Status</ListItemText>
                                    <ListItemIcon></ListItemIcon>
                                </ListItem>
                                <ListItem>
                                    <Checkbox color="primary" edge="start" />
                                    <ListItemText>Certification Edition</ListItemText>
                                    <ListItemIcon></ListItemIcon>
                                </ListItem>
                                <ListItem>
                                    <Checkbox color="primary" edge="start" />
                                    <ListItemText>Clinical Quality Measures</ListItemText>
                                    <ListItemIcon></ListItemIcon>
                                </ListItem>
                                </div>
                                <div>
                                <ListItem>
                                    <Checkbox color="primary" edge="start" />
                                    <ListItemText>Certification Date</ListItemText>
                                    <ListItemIcon></ListItemIcon>
                                </ListItem>
                                <ListItem>
                                    <Checkbox color="primary" edge="start" />
                                    <ListItemText>ONC-ACBs</ListItemText>
                                    <ListItemIcon></ListItemIcon>
                                </ListItem>
                                <ListItem>
                                    <Checkbox color="primary" edge="start" />
                                    <ListItemText>Patient Type</ListItemText>
                                    <ListItemIcon></ListItemIcon>
                                </ListItem>
                                <ListItem>
                                    <Checkbox color="primary" edge="start" />
                                    <ListItemText>Surveillance Activity</ListItemText>
                                    <ListItemIcon></ListItemIcon>
                                </ListItem>
                                </div>
                                </div>
                            </List>
                        </div>

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