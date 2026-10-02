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
} from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { array, func, string } from 'prop-types';

import { interpretEmphatic, interpretLink } from './attestation-util';

const styles = {
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
};

function ChplAttestationWizardSection2({ dispatch, instructions = '', sections: initialSections }) {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

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

  const getInstructions = (ins) => (
    <>
      { ins.split('\n\n').map((p) => (
        <Typography
          variant="body1"
          sx={styles.questionParagraph}
          key={p}
        >
          { p }
        </Typography>
      ))}
    </>
  );

  const getQuestion = (section, item) => (
    <Box key={item.id}>
      <FormControl component="fieldset">
        <FormLabel sx={styles.nonCaps}>
          { item.question.question.split('\n\n').map((p) => (
            <Typography
              sx={styles.questionParagraph}
              key={p}
            >
              { interpretLink(p) }
            </Typography>
          ))}
        </FormLabel>
        <RadioGroup
          sx={styles.radioGroup}
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
                sx={styles.nonCaps}
              />
            ))}
        </RadioGroup>
      </FormControl>
      { item.submittedResponses[0]?.message
        && (
          <Box sx={styles.warningBox}>
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
                     <FormLabel sx={styles.nonCaps}>{ interpretEmphatic(child.question.question) }</FormLabel>
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
                                 color="primary"
                               />
                             )}
                             label={answer.response}
                             sx={styles.nonCaps}
                           />
                         ))}
                     </FormGroup>
                   </FormControl>
                 </CardContent>
               </Card>
             ))}
    </Box>
  );

  const getSection = (section, idx) => (
    <Box key={section.id}>
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
    </Box>
  );

  return (
    <Container sx={styles.fixFooterSpacing} maxWidth="md">
      <Typography gutterBottom variant="h2">
        Section 2 &mdash; Attestations
      </Typography>
      <Card>
        <CardContent>
          { getInstructions(instructions) }
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
