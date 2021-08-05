import React, { useState } from 'react';
import {
    Card,
    CardContent,
    makeStyles,
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    content: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: '1fr',
        alignItems: 'start',
        padding: '16px',
    },
    rowHeader: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: '1fr',
        alignItems: 'start',
        padding: '16px',
        backgroundColor:'#ffffff',

    },
    rowBody: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: '1fr',
        alignItems: 'start',
        padding: '16px',
        backgroundColor:'#f2f2f2',
        height:'100%',
    },
    rowFooter: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: '1fr',
        alignItems: 'start',
        padding: '16px',
        backgroundColor:'#e7e7e7',
    },
    iconSpacing:{
        marginLeft:'4px',
    },
}));

function ChplTemplate() {
    const classes = useStyles();

    return (
        <div>
        <div className={classes.rowHeader}>
            <Typography variant="h1">Header One Goes Here</Typography> 
        </div>
        <div className={classes.rowBody}>
            <Card>
                <CardContent>
                    <div className={classes.content}>

                    </div>
                </CardContent>
            </Card>
        </div>
        <div className={classes.rowFooter}>
            <Typography variant="body1">Footer Links Go Here</Typography> 
        </div>
        </div>
    );
}

export default ChplTemplate;
