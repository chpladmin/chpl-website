import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { ChplTextField } from '../../../components/util';

const useStyles = makeStyles(() => ({
    content: {
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'start',
    },
    dataEntry: {
      display: 'grid',
      gap: '8px',
    },
  }));

function SgDefaultForm() {
  const classes = useStyles();

  return (
    <Card>
        <CardHeader title="Form Title Should Go Here | Default CHPL Form">
        </CardHeader>
        <CardContent className={classes.content}>
        <div className={classes.dataEntry}>
        <Typography gutterBottom variant="subtitle1">Subtitle is used to break up content</Typography>  
        <ChplTextField
        id="first-name"
        name="firstName"
        label="First Name"
        required
        />
        <ChplTextField
        id="last-name"
        name="LastName"
        label="Last Name"
        required
        />
        <ChplTextField
        id="email"
        name="email"
        label="Email"
        required
        />
        <ChplTextField
        id="job-title"
        name="jobTitle"
        label="Job Title"
        required
        />
        </div>
        <div className={classes.dataEntry}>
        <Typography gutterBottom variant="subtitle1">Another Subtitle</Typography>
        <ChplTextField
        id="company-name"
        name="companyName"
        label="Company Name"
        required
        />
        <ChplTextField
        id="company-size"
        name="companySize"
        label="Company Size"
        required
        />
        <ChplTextField
        id="company-address"
        name="companyAddress"
        label="Company Address"
        required
        />
        <ChplTextField
        id="company-email"
        name="companyEmail"
        label="Company Email"
        required
        />
        </div>       
        </CardContent>
        </Card>
  );
}

export default SgDefaultForm;
