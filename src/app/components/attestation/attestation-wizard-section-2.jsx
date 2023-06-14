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
  Radio,
  RadioGroup,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { array, func, string } from 'prop-types';

import { interpretEmphatic, interpretLink } from './attestation-util';

const useStyles = makeStyles({
  nonCaps: {
    textTransform: 'none',
  },
  radioGroup: {
    textTransform: 'none',
  },
  warningBox: {
    padding: '16px',
    backgroundColor: '#fdfde7',
    border: '1px solid #afafaf',
    borderradius: '4px',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '4px',
    marginBottom: '16px',
    gridGap: '16px',
    alignItems: 'center',
  },
});

function ChplAttestationWizardSection2(props) {
  const { dispatch, instructions } = props;
  const [sections, setSections] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setSections(props.sections);
  }, [props.sections]); // eslint-disable-line react/destructuring-assignment

  const handleResponse = (section, item, value) => {
    const updated = sections.map((s) => {
      const updatedSection = {
        ...s,
      };
      if (section.id === s.id) {
        const updatedItems = section.formItems.map((i) => {
          const updatedItem = {
            ...i,
          };
          if (item.id === i.id) {
            updatedItem.submittedResponses = [item.question.allowedResponses.find((resp) => resp.response === value)];
          }
          return updatedItem;
        });
        updatedSection.formItems = updatedItems;
      }
      return updatedSection;
    });
    dispatch(updated);
    setSections(updated);
  };

  const handleSubResponse = (section, item, answer, checked) => {
    const updated = sections.map((s) => {
      const updatedSection = {
        ...s,
      };
      if (section.id === s.id) {
        const updatedItems = section.formItems.map((i) => {
          const updatedItem = {
            ...i,
          };
          if (item.id === i.id) {
            const updatedChildItems = updatedItem.childFormItems.map((c) => {
              const updatedChildItem = {
                ...c,
              };
              updatedChildItem.submittedResponses = checked
                ? [...updatedChildItem.submittedResponses, answer]
                : updatedChildItem.submittedResponses.filter((r) => r.id !== answer.id);
              return updatedChildItem;
            });
            updatedItem.childFormItems = updatedChildItems;
          }
          return updatedItem;
        });
        updatedSection.formItems = updatedItems;
      }
      return updatedSection;
    });
    dispatch(updated);
    setSections(updated);
  };

  const getQuestion = (section, item) => (
    <div key={item.id}>
      <FormControl component="fieldset">
        <FormLabel className={classes.nonCaps}>{ interpretLink(item.question.question) }</FormLabel>
        <RadioGroup
          className={classes.radioGroup}
          name={`response-${item.id}`}
          value={(item.submittedResponses && item.submittedResponses[0]?.response) || ''}
          onChange={(event) => handleResponse(section, item, event.currentTarget.value)}
        >
          { item.question.allowedResponses
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((response) => (
              <FormControlLabel
                key={response.id}
                value={response.response}
                control={<Radio />}
                label={response.response}
                className={classes.nonCaps}
              />
            ))}
        </RadioGroup>
      </FormControl>
      { item.submittedResponses[0]?.message
        && (
          <Box className={classes.warningBox}>
            <ReportProblemOutlinedIcon />
            <Typography>
              { item.submittedResponses[0].message }
            </Typography>
          </Box>
        )}
      { item.childFormItems
        .map((child) => item.submittedResponses
          .some((resp) => resp.id === child.parentResponse.id)
             && (
               <Card key={`${item.id}-sub-questions`}>
                 <CardContent>
                   <FormControl component="fieldset">
                     <FormLabel className={classes.nonCaps}>{ interpretEmphatic(child.question.question) }</FormLabel>
                     <FormGroup>
                       { child.question.allowedResponses
                         .sort((a, b) => a.sortOrder - b.sortOrder)
                         .map((answer) => (
                           <FormControlLabel
                             key={`${item.id}-${child.id}-${answer.id}`}
                             control={(
                               <Checkbox
                                 checked={child.submittedResponses.some((resp) => resp.id === answer.id)}
                                 onChange={(event) => handleSubResponse(section, item, answer, event.currentTarget.checked)}
                               />
                             )}
                             label={answer.response}
                             className={classes.nonCaps}
                           />
                         ))}
                     </FormGroup>
                   </FormControl>
                 </CardContent>
               </Card>
             ))}
    </div>
  );

  const getSection = (section, idx) => (
    <div key={section.id}>
      <Typography variant="subtitle1">
        { idx + 1 }
        :
        {' '}
        { section.name }
      </Typography>
      { section.formItems.map((item) => getQuestion(section, item)) }
      { idx !== section.length - 1
        && (
          <Divider />
        )}
    </div>
  );

  return (
    <Container maxWidth="md">
      <Typography gutterBottom variant="h2">
        Section 2 &mdash; Attestations
      </Typography>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="body1">
            As a health IT developer of certified health IT that had an active certification under the ONC Health IT Certification Program at any time during the Attestation Period, please indicate your compliance, noncompliance, or the inapplicability of each Condition and Maintenance of Certification requirement for the portion of the Attestation Period you had an active certification.
          </Typography>
          <Typography gutterBottom variant="body1">
            Select only one response for each statement.
          </Typography>
          { instructions
            && (
              <Typography variant="body1">
                { instructions }
              </Typography>
            )}
          <Divider />
          { sections.sort((a, b) => a.sortOrder - b.sortOrder).map((section, idx) => getSection(section, idx)) }
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChplAttestationWizardSection2;

ChplAttestationWizardSection2.propTypes = {
  sections: array.isRequired, // eslint-disable-line react/forbid-prop-types
  instructions: string,
  dispatch: func.isRequired,
};

ChplAttestationWizardSection2.defaultProps = {
  instructions: '',
};
