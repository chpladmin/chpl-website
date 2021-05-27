import React, { useState, useEffect } from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import { ChplTooltip } from '../../../util/chpl-tooltip';
import { getAngularService } from '.';
import surveillance from '../../../../shared/prop-types/surveillance';
import ChplSurveillanceNonconformity from './nonconformity/nonconformity-view';
import theme from '../../../../themes/theme';

const useStyles = makeStyles(() => ({
  iconSpacing: {
    marginLeft: '4px',
  },
  unindentedData: {
    marginLeft: '-25px',
  },
  nonconformityContainer: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
}));

const getSurveillanceResults = (surv) => {
  const results = [];
  let i;
  let j;
  for (i = 0; i < surv.requirements.length; i += 1) {
    for (j = 0; j < surv.requirements[i].nonconformities.length; j += 1) {
      const result = {
        id: surv.requirements[i].id,
        statusName: surv.requirements[i].nonconformities[j].status.name, // + ' Non-Conformity Found for ';
        criterion: surv.requirements[i].criterion,
        requirement: surv.requirements[i].requirement,
      };
      results.push(result);
    }
  }
  return results;
};

function ChplSurveillanceView(props) {
  const DateUtil = getAngularService('DateUtil');
  const surv = useState(props.surveillance)[0];
  const [surveillanceResults, setSurveillanceResults] = useState([]);
  const dateFormat = 'MMM d, y';

  const classes = useStyles();

  useEffect(() => {
    setSurveillanceResults(getSurveillanceResults(surv));
  }, [surv]);

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table aria-label="Surveillance Table">
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
                Date Surveillance Began
                <ChplTooltip title="The date surveillance was initiated">
                  <InfoOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </ChplTooltip>
              </TableCell>
              <TableCell>{ DateUtil.timestampToString(surv.startDate, dateFormat) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Date Surveillance Ended
                <ChplTooltip title="The date surveillance was completed">
                  <InfoOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </ChplTooltip>
              </TableCell>
              <TableCell>{ DateUtil.timestampToString(surv.endDate, dateFormat) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Surveillance Type
                <ChplTooltip title="The type of surveillance conducted (either randomized or reactive). ONC-ACBs are required to randomly survey a minimum of 2% of all the Health IT modules to which they have issued an active certification.">
                  <InfoOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </ChplTooltip>
              </TableCell>
              <TableCell>{ surv.type.name }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Certification Criteria and Program Requirements Surveilled
                <ChplTooltip title="The ONC Health IT Certification Program requirement that was surveilled. For example, this may be a specific certification criteria (e.g. 170.315(a)(1)), a transparency or disclosure requirement (e.g. 170.523(k)(1)), another requirement with a regulatory reference (e.g. 170.523(l)), or a brief description of the surveilled requirement.">
                  <InfoOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </ChplTooltip>
              </TableCell>
              <TableCell>
                { surv.requirements.length > 0
                  && (
                    <ul className={classes.unindentedData}>
                      { surv.requirements.map((req) => (
                        <li key={req.id}>
                          { req.type.name }
                          <span className={req.criterion.removed ? 'removed' : ''}>
                            { `: ${(req.criterion.removed ? 'Removed | ' : '')} ${req.criterion.number} : ${req.criterion.title}` }
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                { surv.requirements.length === 0 && 'None' }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Surveillance Result
                <ChplTooltip title="Whether or not a non-conformity was found for the conducted surveillance.">
                  <InfoOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </ChplTooltip>
              </TableCell>
              <TableCell>
                { surveillanceResults.length > 0
                  && (
                    <ul className={classes.unindentedData}>
                      { surveillanceResults.map((result) => (
                        <li key={result.id}>
                          { `${result.statusName} Non-Conformity Found for` }
                          <span className={result.criterion.removed ? 'removed' : ''}>
                            { `: ${(result.criterion.removed ? 'Removed | ' : '')} ${result.criterion.number} : ${result.criterion.title}` }
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                { surveillanceResults.length === 0 && 'No Non-Conformities Found' }
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.nonconformityContainer}>
        <Typography variant="subtitle1">
          Non-Conformities
        </Typography>
        { surv.requirements.length > 0
          && surv.requirements.map((requirement) => (
            requirement.nonconformities.map((nonconformity) => (
              <ChplSurveillanceNonconformity key={requirement.id} surveillance={surv} requirement={requirement} nonconformity={nonconformity} />
            ))
          ))}
      </div>
    </ThemeProvider>
  );
}

export default ChplSurveillanceView;

ChplSurveillanceView.propTypes = {
  surveillance: surveillance.isRequired,
};
