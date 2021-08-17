import React from 'react';
import {
    Avatar,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Divider,
    Typography,
    makeStyles,
} from '@material-ui/core';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';

const useStyles = makeStyles({
    iconSpacing: {
        marginLeft: '4px',
    },
    productCard: {
        paddingBottom: '8px',
    },
    productCardHeaderContainer: {
        display: 'grid',
        gridTemplateColumns: 'auto 11fr',
        padding: '16px',
        gap: '16px',
        alignItems: 'center',
    },
    subProductCardHeaderContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr',
    },
    versionProductCardHeaderContainer: {
        display: 'grid',
        gridTemplateColumns: 'auto auto auto auto 1fr',
        gap: '8px',
        alignItems: 'center',
    },
    widgetProductContainer:{
        alignContent:'space-between',
        display: 'grid',
        gap: '8px',
    },
    content: {
        display: 'grid',
        gridTemplateColumns: 'auto auto auto',
        gap: '8px',

    },
    subcontent: {
        display: 'grid',
        gap: '8px',
    },

    developerAvatar: {
        color: '#156dac',
        backgroundColor: '#f5f9fd',
    },

    activeStatus: {
        color: '#66926d',
        marginLeft: '4px',
    },
});

function SgProductCard() {
    const classes = useStyles();

    return (
        <div>
            <Card className={classes.productCard} >
                <div className={classes.productCardHeaderContainer}>
                    <Avatar className={classes.developerAvatar}>EPIC</Avatar>
                    <div className={classes.subProductCardHeaderContainer}>
                        <Typography variant='h5'><a href='#'>Infection Control Antimicrobial Use and Resistance Reporting</a></Typography>
                        <div className={classes.versionProductCardHeaderContainer}>
                            <Typography variant='subtitle2'> Version:</Typography>
                            <Typography variant='body1'>May 2021</Typography>|
                            <Typography variant='subtitle2'> Developer:</Typography>
                            <Typography variant='body1'><a href='#'> Epic Systems Corporation </a></Typography>
                        </div>
                    </div>
                </div>
                <Divider />
                <CardContent className={classes.content}>
                    <div className={classes.subcontent}>
                        <div>
                            <Typography variant='subtitle1'>
                                Edition{' '}
                            </Typography>
                            <Typography varient='body1'>
                                2015
                            </Typography>
                        </div>
                        <div>
                            <Typography variant='subtitle1'>
                                CHPL ID{' '}
                            </Typography>
                            <Typography varient='body1'>
                                15.04.04.1447.Beac.AU.08.1.200220
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.subcontent}>
                        <div>
                            <Typography variant='subtitle1'>
                                Certification Data{' '}
                            </Typography>
                            <Typography varient='body1'>
                                May 12, 2021
                            </Typography>
                        </div>
                        <div>
                            <Typography variant='subtitle1'>
                                Status{' '}
                            </Typography>
                            <Typography varient='body1'>
                                Active <BeenhereIcon className={classes.activeStatus} />
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.widgetProductContainer}>
                        <div>
                            <Button color='secondary' variant='contained' fullWidth>
                                CERT ID
                                <AssignmentOutlinedIcon className={classes.iconSpacing}
                                />
                            </Button>
                        </div>
                        <div>
                            <Button color='secondary' variant='contained' fullWidth>
                                COMPARE
                                <CompareArrowsIcon className={classes.iconSpacing}
                                />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div >
    );
}

export default SgProductCard;