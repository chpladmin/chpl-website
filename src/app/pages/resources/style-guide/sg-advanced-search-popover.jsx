import React, { useState } from 'react';
import {
    Button,
    ButtonGroup,
    Checkbox,
    Divider,
    InputBase,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListSubheader,
    Popover,
    Switch,
    Typography,
    makeStyles,
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles({
    filterContainer: {
        background: '#E7F0F8',
        display: 'grid',
        gridTemplateColumns: '5fr auto 4fr',
        padding: '16px',
    },
    filterGroupOneContainer: {
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
    switchGroupThreeContainer: {
        display: 'grid',
        gridTemplateColumns: '10fr auto auto',
        alignItems: 'center',
        gap: '4px',
    },
    filterSubHeaderContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
    },
    searchInput: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
        padding: '4px',
        borderRadius: '4px',
        border: '1px solid #C6D5E5',
        width: '100%',
        alignItems: 'center',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
    },
    iconSpacing:{
        
    }
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
                                    <ListSubheader disableSticky component="div" id="nested-list-subheader">
                                        <div className={classes.filterGroupOneContainer}>
                                            <div>
                                                <Typography variant="subtitle1"> Filter By: </Typography>
                                            </div>
                                            <div>
                                                <ButtonGroup
                                                    variant="text"
                                                    color="primary"
                                                    size="medium"
                                                    aria-label="apply to filter dropdown">
                                                    <Button>Reset All Filters</Button>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    </ListSubheader>
                                }>
                                <div className={classes.filterSubHeaderContainer}>
                                    <div>
                                        <ListItem>
                                            <Checkbox color="primary" edge="start" />
                                            <ListItemText>Certification Criteria</ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <Checkbox color="primary" edge="start" />
                                            <ListItemText>Certification Status</ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <Checkbox color="primary" edge="start" />
                                            <ListItemText>Certification Edition</ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <Checkbox color="primary" edge="start" />
                                            <ListItemText>Clinical Quality Measures</ListItemText>
                                        </ListItem>
                                    </div>
                                    <div>
                                        <ListItem>
                                            <Checkbox color="primary" edge="start" />
                                            <ListItemText>Certification Date</ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <Checkbox color="primary" edge="start" />
                                            <ListItemText>ONC-ACBs</ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <Checkbox color="primary" edge="start" />
                                            <ListItemText>Patient Type</ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <Checkbox color="primary" edge="start" />
                                            <ListItemText>Surveillance Activity</ListItemText>
                                        </ListItem>
                                    </div>
                                </div>
                            </List>
                        </div>

                    </div>
                    <div>
                        <List dense
                            subheader={
                                <ListSubheader disableSticky component="div" id="nested-list-subheader">
                                    <div className={classes.filterSubHeaderContainer}>
                                        <div>
                                            <ButtonGroup
                                                variant="text"
                                                color="primary"
                                                size="medium"
                                                aria-label="apply to filter dropdown">
                                                <Button>Clear</Button>
                                                <Button>Reset</Button>
                                            </ButtonGroup>
                                        </div>
                                    </div>
                                </ListSubheader>
                            }>
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
                                    <ListItem>
                                        <Checkbox color="primary" edge="start" />
                                        <ListItemText>2015 Cures Update</ListItemText>
                                    </ListItem>
                                </div>
                            </div>
                        </List>
                    </div>
                    <div>
                        <List dense
                            subheader={
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
                            }>
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