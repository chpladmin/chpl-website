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
/* eslint-disable import/no-cycle */
import { getAngularService } from '.';
/* eslint-enable import/no-cycle */
import ChplCriterionTitle from '../../../util/criterion-title';
import ChplSurveillanceNonconformity from './nonconformity/nonconformity-view';
import surveillancePropType from '../../../../shared/prop-types/surveillance';
import theme from '../../../../themes/theme';

const useStyles = makeStyles(() => ({
  iconSpacing: {
    marginLeft: '4px',
  },
  unindentedData: {
    marginLeft: '-25px',
  },
  nonconformityContainer: {
    paddingTop: '16px',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
}));

const getSurveillanceResults = (surv) => surv.requirements.map((req) => req.nonconformities.map((nc) => ({
  id: req.id,
  statusName: nc.status.name,
  criterion: req.criterion,
  requirement: req.requirement,
})))
  .flat();

function ChplSurveillanceView({ surveillance }) {
  const DateUtil = getAngularService('DateUtil');
  const [currentSurveillance] = useState(surveillance);
  const [surveillanceResults, setSurveillanceResults] = useState([]);
  const dateFormat = 'MMM d, y';

  const classes = useStyles();

  useEffect(() => {
    setSurveillanceResults(getSurveillanceResults(currentSurveillance));
  }, [currentSurveillance]);

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="Surveillance Table">
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
              <TableCell>{ DateUtil.timestampToString(currentSurveillance.startDate, dateFormat) }</TableCell>
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
              <TableCell>{ DateUtil.timestampToString(currentSurveillance.endDate, dateFormat) }</TableCell>
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
              <TableCell>{ currentSurveillance.type.name }</TableCell>
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
              <TableCell data-testid="reqs-surveilled-cell">
                { currentSurveillance.requirements?.length > 0
                  && (
                    <ul className={classes.unindentedData}>
                      { currentSurveillance.requirements.map((req) => (
                        <li key={req.id}>
                          { `${req.type.name} ${req.criterion && ': '}` }
                          <ChplCriterionTitle criterion={req.criterion} useRemovedClass />
                        </li>
                      ))}
                    </ul>
                  )}
                { currentSurveillance.requirements?.length === 0 && 'None' }
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
              <TableCell test_dataid="">
                { surveillanceResults.length > 0
                  && (
                    <ul className={classes.unindentedData}>
                      { surveillanceResults.map((result) => (
                        <li key={result.id}>
                          { `${result.statusName} Non-Conformity Found for` }
                          <ChplCriterionTitle criterion={result.criterion} useRemovedClass />
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
      { getSurveillanceResults(currentSurveillance).length > 0
        && (
        <div className={classes.nonconformityContainer}>
          <Typography variant="subtitle1" data-testid="non-conformity-header">
            Non-Conformities
          </Typography>
          <div data-testid="non-conformity-component-container">
            { currentSurveillance.requirements.map((requirement) => (
              requirement.nonconformities.map((nonconformity) => (
                <ChplSurveillanceNonconformity key={requirement.id} surveillance={currentSurveillance} requirement={requirement} nonconformity={nonconformity} data-testid="non-conformity-component" />
              ))
            ))}
          </div>
        </div>
        )}
    </ThemeProvider>
  );
}

export default ChplSurveillanceView;

ChplSurveillanceView.propTypes = {
  surveillance: surveillancePropType.isRequired,
};
