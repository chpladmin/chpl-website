import React from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf } from 'prop-types';
import { palette, utilStyles } from 'themes';
import { measure as measureType } from 'shared/prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChplDirectReviews from './direct-reviews';
import ChplSurveillance from './surveillance';
const useStyles = makeStyles({
  ...utilStyles,
  infoIcon: {
    color: `${palette.primary}`,
  },
  root: {
    width: '100%',
    padding: '0 8px!important',
  },
  subCard: {
    backgroundColor: `${palette.white}`,
    borderBottom: '.5px solid #c2c6ca',
  },
  NestedAccordionLevelOne: {
    borderRadius: '4px',
    display: 'grid',
    borderColor: ' #c2c6ca',
    borderWidth: '.5px',
    borderStyle: 'solid',
    padding: '0px',
    backgroundColor: `${palette.white}`,
  },
  NestedAccordionLevelOneSummary: {
    backgroundColor: `${palette.secondary}!important`,
    borderRadius: '4px',
    borderBottom: '.5px solid #c2c6ca',
    width: '100%',
    padding: '0 8px!important',
  },
  NestedAccordionLevelTwoSummary: {
    backgroundColor: `${palette.white}!important`,
    borderRadius: '4px',
    borderBottom: '.5px solid #c2c6ca',
    width: '100%',
    padding: '0 8px!important',
  },
  '& span.MuiTypography-root.MuiCardHeader-title.MuiTypography-h6.MuiTypography-displayBlock': {
    fontWeight: '300',
  },
});


function ChplCompliance(props) {
  const { compliance } = props;
  const { surveillance } = props;
  const { directReviews } = props;
  const classes = useStyles();
  /*
    if (!compliance || compliance.length === 0) {
      return (
        <Typography>
          No data for Compliance Activites.
        </Typography>
      );
    }
  */
  return (
    <div>
      <Accordion className={classes.NestedAccordionLevelOne}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.NestedAccordionLevelOneSummary}
          color="secondary"
        >
          <Typography>
            Compliance Activites
          </Typography>
        </AccordionSummary>
        <Box display="flex" flexDirection={"column"}>
          <CardContent compliance={compliance}>
            {/*Surveillance*/}
            <ChplSurveillance surveillance={surveillance}/>
            {/*Direct Reviews*/}
            <ChplDirectReviews/>
          </CardContent>
        </Box >
      </Accordion >
    </div >
  );
}

export default ChplCompliance;

ChplCompliance.propTypes = {
  ChplSurveillance,
};
