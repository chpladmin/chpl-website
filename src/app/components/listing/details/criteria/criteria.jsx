import React, { useState } from 'react';
import { arrayOf, bool, object } from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../../themes/theme';
import { getAngularService } from '.';
import { ChplCriteriaDetailsView } from '.';

const useStyles = makeStyles(() => ({
  NestedAccordionLevelOne: {
    borderRadius: '8px',
    display: 'grid',
  },
  NestedAccordionLevelOneSummary: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
}));

function ChplCriteria (props) {
  const [canEdit] = useState(props.canEdit);
  const [criteria] = useState(props.certificationResult);
  const [editing, setEditing] = useState(false);
  const [qmsStandards] = useState(props.qmsStandards);
  const [accessibilityStandards] = useState(props.accessibilityStandards);
  const $analytics = getAngularService('$analytics');
  const classes = useStyles();

  return (
    <ThemeProvider theme={ theme }>
      <Accordion disabled={!criteria.success} className={classes.NestedAccordionLevelOne}>
        <AccordionSummary
          className={classes.NestedAccordionLevelOneSummary}
          expandIcon={<ExpandMoreIcon />}
          id={criteria.id + '-header'}>
          <Grid container spacing={4}>
            <Grid item xs={1}>
              { criteria.success &&
                <Typography variant="subtitle1">
                  <DoneAllIcon size="small" />
                </Typography>
              }
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">
                { criteria.criterion.removed &&
                  <>
                    Removed |
                  </>
                }
                {criteria.criterion.number}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>
                {criteria.criterion.title}
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={4}>
            { canEdit &&
              <Grid item xs={12}>
                <Button fullWidth color="secondary" variant="contained" onClick={() => setEditing(true)}>
                  Edit Criteria
                  <EditOutlinedIcon
                    className={classes.iconSpacing}
                    fontSize="small"
                  />
                </Button>
              </Grid>
            }
            <ChplCriteriaDetailsView
              criteria={criteria}
              accessibilityStandards={accessibilityStandards}
              qmsStandards={qmsStandards}
            />
          </Grid>
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
}

export { ChplCriteria };

ChplCriteria.propTypes = {
  canEdit: bool,
  certificationResult: object,
  qmsStandards: arrayOf(object),
  accessibilityStandards: arrayOf(object),
};
