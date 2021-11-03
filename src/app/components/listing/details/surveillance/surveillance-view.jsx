import React, { useState, useEffect } from 'react';
import {
  arrayOf, bool, shape, string,
} from 'prop-types';
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

import { ChplCriterionTitle, ChplTooltip } from '../../../util';
import { getAngularService } from '../../../../services/angular-react-helper';
import {
  surveillance as surveillancePropType,
  criterion as criterionPropType,
} from '../../../../shared/prop-types';
import theme from '../../../../themes/theme';

import ChplSurveillanceNonconformity from './nonconformity';

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

const getSurveillanceResults = (surv) => surv.requirements.flatMap((req) => req.nonconformities.map((nc) => ({
  id: req.id,
  statusName: nc.status.name,
  criterion: req.criterion,
  requirement: req.requirement,
})));

function ChplSurveillanceView(props) {
  /* eslint-disable react/destructuring-assignment */
  const DateUtil = getAngularService('DateUtil');
  const [surveillance] = useState(props.surveillance);
  const [surveillanceRequirements] = useState(props.surveillanceRequirements);
  const [nonconformityTypes] = useState(props.nonconformityTypes);
  const [surveillanceResults, setSurveillanceResults] = useState([]);

  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setSurveillanceResults(getSurveillanceResults(surveillance));
  }, [surveillance]);

  const isRequirementRemoved = (requirement) => {
    let foundReq = surveillanceRequirements.realWorldTestingOptions.find((req) => req.item === requirement);
    if (foundReq) {
      return foundReq.removed;
    }
    foundReq = surveillanceRequirements.transparencyOptions.find((req) => req.item === requirement);
    if (foundReq) {
      return foundReq.removed;
    }
    return false;
  };

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="Surveillance Table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '33%' }}>
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
              <TableCell>{ DateUtil.getDisplayDateFormat(surveillance.startDay) }</TableCell>
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
              <TableCell>{ DateUtil.getDisplayDateFormat(surveillance.endDay) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Surveillance Type
                <ChplTooltip title="The type of surveillance conducted (either randomized or reactive).">
                  <InfoOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </ChplTooltip>
              </TableCell>
              <TableCell>{ surveillance.type.name }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Certification Criteria and Program Requirements Surveilled
                <ChplTooltip title="The ONC Health IT Certification Program requirement that was surveilled. For example, this may be a specific certification criteria (e.g. 170.315(a)(1)), disclosure requirement (e.g. 170.523(k)(1)), another requirement with a regulatory reference (e.g. 170.523(l)), or a brief description of the surveilled requirement.">
                  <InfoOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </ChplTooltip>
              </TableCell>
              <TableCell data-testid="reqs-surveilled-cell">
                { surveillance.requirements?.length > 0
                  && (
                    <ul className={classes.unindentedData}>
                      { surveillance.requirements.map((req) => (
                        <li key={req.id}>
                          { `${req.type.name}` }
                          :
                          { req.criterion && <ChplCriterionTitle criterion={req.criterion} useRemovedClass /> }
                          { !req.criterion
                            && (
                              <span className={(isRequirementRemoved(req.requirement) ? 'removed' : '')}>
                                { `${(isRequirementRemoved(req.requirement) ? ' Removed | ' : ' ')} ${req.requirement}` }
                              </span>
                            )}
                        </li>
                      ))}
                    </ul>
                  )}
                { surveillance.requirements?.length === 0 && 'None' }
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
                          { result.criterion && <ChplCriterionTitle criterion={result.criterion} useRemovedClass /> }
                          { !result.criterion
                            && (
                              <span className={(isRequirementRemoved(result.requirement) ? 'removed' : '')}>
                                { `${(isRequirementRemoved(result.requirement) ? ' Removed | ' : ' ')} ${result.requirement}` }
                              </span>
                            )}
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
      { getSurveillanceResults(surveillance).length > 0
        && (
        <div className={classes.nonconformityContainer}>
          <Typography variant="subtitle1" data-testid="non-conformity-header">
            Non-Conformities
          </Typography>
          <div data-testid="non-conformity-component-container">
            { surveillance.requirements.map((requirement) => (
              requirement.nonconformities.map((nonconformity) => (
                <ChplSurveillanceNonconformity key={requirement.id} surveillance={surveillance} requirement={requirement} nonconformity={nonconformity} nonconformityTypes={nonconformityTypes} data-testid="non-conformity-component" />
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
  surveillanceRequirements: shape({
    criteriaOptions2014: arrayOf(criterionPropType),
    criteriaOptions2015: arrayOf(criterionPropType),
    realWorldTestingOptions: arrayOf(shape({
      item: string,
      removed: bool,
    })),
    transparencyOptions: arrayOf(shape({
      item: string,
      removed: bool,
    })),
  }).isRequired,
  nonconformityTypes: arrayOf(criterionPropType).isRequired,
};
