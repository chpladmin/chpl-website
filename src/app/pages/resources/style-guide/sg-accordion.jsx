import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    IconButton,
    makeStyles,
    Typography,
} from '@material-ui/core';

import { ChplTooltip } from '../../../components/util';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles(() => ({
    accordion: {
        padding: '16px',
    },
    content: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: '1fr',
        alignItems: 'start',
    },
    nestedAccordionSummary: {
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
    },
    nestedAccordionDetails: {
        borderRadius: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr',
        margin: '16px',
    },
    infoButton: {
        padding: '0px 0px 0px 4px',
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
                    Accordion Level 1 | Criteria
                    <ChplTooltip title="These certification criteria have been removed from the Program.">
                        <IconButton color="primary" className={classes.infoButton}>
                            <InfoIcon fontSize="medium" />
                        </IconButton>
                    </ChplTooltip>
                </AccordionSummary>
                <div className={classes.accordion}>
                <Accordion>
                    <AccordionSummary
                        className={classes.nestedAccordionSummary}
                        expandIcon={<ExpandMoreIcon color="primary" fontSize="large" />}
                        id="removed-header"
                    >
                        Example Accordion 1
                        <ChplTooltip title="nested Accordion.">
                            <IconButton color="primary" className={classes.infoButton}>
                                <InfoIcon fontSize="medium" />
                            </IconButton>
                        </ChplTooltip>
                    </AccordionSummary>
                    <AccordionDetails className={classes.nestedAccordionDetails}>
                        <div className={classes.content}>
                            <Typography>Something</Typography>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        className={classes.nestedAccordionSummary}
                        expandIcon={<ExpandMoreIcon color="primary" fontSize="large" />}
                        id="removed-header"
                    >
                        Example Accordion 2
                        <ChplTooltip title="nested Accordion.">
                            <IconButton color="primary" className={classes.infoButton}>
                                <InfoIcon fontSize="medium" />
                            </IconButton>
                        </ChplTooltip>
                    </AccordionSummary>
                    <AccordionDetails className={classes.nestedAccordionDetails}>
                        <div className={classes.content}>
                            <Typography>Something</Typography>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion disabled>
                    <AccordionSummary
                        className={classes.nestedAccordionSummary}
                        expandIcon={<ExpandMoreIcon color="primary" fontSize="large" />}
                        id="removed-header"
                    >
                        Disabled Accordion
                        <ChplTooltip title="nested Accordion.">
                            <IconButton color="primary" className={classes.infoButton}>
                                <InfoIcon fontSize="medium" />
                            </IconButton>
                        </ChplTooltip>
                    </AccordionSummary>
                </Accordion>
                </div>
            </Accordion>
        </div>
    );
}

export default SgAccordion;
