import React, { useState } from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { ChplTooltip } from '../../../../util/chpl-tooltip';
import { getAngularService } from '.';
import requirement from '../../../../../shared/prop-types/surveillance-requirement';
import nonconformity from '../../../../../shared/prop-types/surveillance-nonconformity';
import theme from '../../../../../themes/theme';

const useStyles = makeStyles(() => ({
  nonconformityAccordion: {
    borderRadius: '8px',
  },

  nonconformityAccordionSummary: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    display: 'grid',
    gridTemplateColumns: '4fr 1fr',
    gridRowGap: '8px',
  },

  iconSpacing: {
    marginLeft: '4px',
  },
}));

function ChplNonconformityView(props) {
  const DateUtil = getAngularService('DateUtil');
  const requirement = useState(props.requirement)[0];
  const nonconformity = useState(props.nonconformity)[0];
  const dateFormat = 'MMM d, y';

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Accordion className={classes.nonconformityAccordion}>
        <AccordionSummary
          className={classes.nonconformityAccordionSummary}
          expandIcon={<ExpandMoreIcon color="primary" fontSize="large" />}
        >
          <div>
            <span className={requirement.criterion.removed ? 'removed' : ''}>
              { ` ${(requirement.criterion.removed ? 'Removed | ' : '')} ${requirement.criterion.number} : ${requirement.criterion.title}` }
            </span>
          </div>
          <div>
            { requirement.result.name }
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Container>
            <TableContainer component={Paper}>
              <Table aria-label="Non-conformity Table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ width: '33%' }}
                    >
                      Attribute
                    </TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Date of Determination of Non-conformity
                      <ChplTooltip title="The date that the ONC-ACB determined that a non-conformity was present.">
                        <InfoOutlinedIcon
                          className={classes.iconSpacing}
                        />
                      </ChplTooltip>
                    </TableCell>
                    <TableCell>{ DateUtil.timestampToString(nonconformity.dateOfDetermination, dateFormat) }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
}

export default ChplNonconformityView;

ChplNonconformityView.propTypes = {
  requirement: requirement.isRequired,
  nonconformity: nonconformity.isRequired,
};
