import React from 'react';
import {
    Avatar,
    Button,
    Card,
    CardActions,
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
    productCardHeaderContainer: {
        display: "grid",
        gridTemplateColumns: "1fr 11fr",
        padding:'16px',
        alignItems:'center',
        maxWidth:'800px',
        },

    productCardHeader: {
        textDecoration:'none',
     },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
        paddingBottom:'16px',
    },
    subcontent: {
        display: 'grid',
        gap: '8px',
    },

    developerAvatar:{
        color:'#156dac',
        backgroundColor:'#f5f9fd',
    },

    activeStatus:{
        color: '#66926d',
        marginLeft: '4px',
    },
});

function SgProductCard() {
    const classes = useStyles();

    return (
        <div>
            <Card>
                <div className={classes.productCardHeaderContainer}>
                <Avatar className={classes.developerAvatar}>EPIC</Avatar>
                <Typography variant="h3"><a className={classes.productCardHeader} href="#">Infection Control Antimicrobial Use and Resistance Reporting</a></Typography></div>
                <Divider/>
                <CardContent className={classes.content}>
                    <div className={classes.subcontent}>
                        <div>
                        <Typography variant="subtitle1">
                                Edition{' '}
                            </Typography>
                            <Typography varient="body1">
                                2015
                            </Typography>
                        </div>
                        <div>
                        <Typography variant="subtitle1">
                               Version{' '}
                            </Typography>
                            <Typography varient="body1">
                                May 2021
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.subcontent}>
                        <div>
                        <Typography variant="subtitle1">
                            CHPL ID{' '}
                        </Typography>
                        <Typography varient="body1">
                            15.04.04.1447.Beac.AU.08.1.200220	
                        </Typography>
                        </div>
                        <div>
                        <Typography variant="subtitle1">
                            Certification Data{' '}
                        </Typography>
                        <Typography varient="body1">
                            May 12, 2021
                        </Typography>
                        </div>
                    </div>
                    <div className={classes.subcontent}>
                        <div>
                        <Typography variant="subtitle1">
                               Status{' '}
                            </Typography>
                            <Typography varient="body1">
                               Active <BeenhereIcon className={classes.activeStatus}/>
                            </Typography>
                        </div>
                        <div> 
                            <Typography variant="subtitle1">
                                Developer
                            </Typography>
                            <Typography varient="body1">
                               <a href="#"> Epic Systems Corporation </a>
                            </Typography>
                        </div>
                    </div>
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" fullWidth>
                        More Details
                        <ArrowForwardIcon className={classes.iconSpacing}

                        />
                    </Button>
                    <Button color="secondary" variant="contained" fullWidth>
                        CERT ID
                        <AssignmentOutlinedIcon className={classes.iconSpacing}
                            
                        />
                    </Button>
                    <Button color="secondary" variant="contained" fullWidth>
                        COMPARE
                        <CompareArrowsIcon className={classes.iconSpacing}
                            
                        />
                    </Button>
                </CardActions>
            </Card>

        </div>
    );
}

export default SgProductCard;