import React, { useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    IconButton, 
    Container,
    ThemeProvider,
    makeStyles,
    Typography,
} from '@material-ui/core';


import { ChplTooltip } from '../../../components/util';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles(() => ({
    content: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: '1fr',
        alignItems: 'start',
    },
    NestedAccordionSummary: {
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        margin:'8px',
    },
    NestedAccordionDetails: {
        borderRadius: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr',
        margin:'8px',
    },
    infoButton:{
        padding:'0px 0px 0px 4px',
    }
}));

function SgAccordion() {
    const classes = useStyles();

    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon color="primary" fontSize="large" />}
                    id="removed-header"
                >
                    Accordion Level 1
                    <ChplTooltip title="These certification criteria have been removed from the Program.">
                        <IconButton color="primary" className={classes.infoButton}>
                        <InfoOutlinedIcon fontSize="medium" />
                        </IconButton>
                    </ChplTooltip>
                </AccordionSummary>
                        <Accordion>
                            <AccordionSummary
                                className={classes.NestedAccordionSummary}
                                expandIcon={<ExpandMoreIcon color="primary" fontSize="large" />}
                                id="removed-header"
                            >
                                Nested Accordion
                                <ChplTooltip title="Nested Accordion.">
                                <IconButton color="primary" className={classes.infoButton}>
                                <InfoOutlinedIcon fontSize="medium" />
                                </IconButton>
                                </ChplTooltip>
                            </AccordionSummary>
                            <AccordionDetails className={classes.NestedAccordionDetails}>
                                    <div className={classes.content}>
                                    <Typography>Something</Typography>
                                    </div>                            
                            </AccordionDetails>
                        </Accordion>
            </Accordion>
        </div>
    );
}

export default SgAccordion;
