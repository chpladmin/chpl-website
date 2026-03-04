import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { array, func, string } from 'prop-types';

import { interpretEmphatic, interpretLink } from './attestation-util';

const useStyles = makeStyles({
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 450px)',
  },
  nonCaps: {
    textTransform: 'none',
  },
  questionParagraph: {
    marginBottom: '8px',
  },
  radioGroup: {
    textTransform: 'none',
  },
  warningBox: {
    padding: '16px',
    backgroundColor: '#fdfde7',
    border: '1px solid #afafaf',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '4px',
    marginBottom: '16px',
    gridGap: '16px',
    alignItems: 'center',
  },
});

function ChplSbulWizardSection2({ dispatch, listings }) {
  const classes = useStyles();

  return (
    <Container className={classes.fixFooterSpacing} maxWidth="md">
      <Typography gutterBottom variant="h2">
        Section 2 &mdash; Listings
      </Typography>
      <Card>
        <CardContent>
          <List>
            { listings.map((l) => (
              <ListItem
                key={l.chplProductNumber}
              >
                {`${l.chplProductNumber} - ${l.serviceBaseUrlList.value}`}
              </ListItem>
            )) }
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChplSbulWizardSection2;

ChplSbulWizardSection2.propTypes = {
  listings: array.isRequired, // eslint-disable-line react/forbid-prop-types
  dispatch: func.isRequired,
};
