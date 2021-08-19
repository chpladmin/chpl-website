import React from 'react';
import {
    Fab,
    makeStyles,
    ThemeProvider,
} from '@material-ui/core';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import theme from '../../../themes/theme';

const useStyles = makeStyles({
    FabContainer: {
        position: 'fixed',
        zIndex: 1500,
        bottom: '9em',
        right: '1em',
    },
    iconSpacing:{
        marignLeft: '4px',
    },
});

export default function SgBackToTheTop() {
    const classes = useStyles();
    return (
        <div>
            <ThemeProvider theme={theme}>
            <Fab
                name="Back to the top"
                className={classes.FabContainer}
                color="primary"
                id="main-content"
                analytics={{ event: 'Jump to top of Overview', category: 'Navigation' }}
                variant="extended">Back To The Top
                <ArrowUpwardIcon className={classes.iconSpacing} />
            </Fab>
            </ThemeProvider>
        </div>
    );
}