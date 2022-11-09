import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import ChplSurveillanceNonconformity from './nonconformity';

import { ChplTooltip } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { getRequirementDisplay, sortRequirements } from 'services/surveillance.service';
import {
  surveillance as surveillancePropType,
} from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
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
});

const getSurveillanceResultsSummary = (surv) => surv.requirements
  .flatMap((req) => req.nonconformities
    .map((nc) => ({
      ...req,
      id: `${req.id}-${nc.id}`,
      statusName: nc.nonconformityStatus,
      display: getRequirementDisplay(req),
      removed: req.requirementType.removed,
    })));

function ChplSurveillanceView(props) {
  const { surveillance } = props;
  const classes = useStyles();

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
              <TableCell>{ getDisplayDateFormat(surveillance.startDay) }</TableCell>
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
              <TableCell>{ getDisplayDateFormat(surveillance.endDay) }</TableCell>
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
              <TableCell>
                { surveillance.requirements?.length > 0
                  && (
                    <ul className={classes.unindentedData}>
                      { surveillance.requirements
                        .sort(sortRequirements)
                        .map((req) => (
                          <li key={req.id}>
                            { `${req.requirementType.requirementGroupType.name}` }
                            {': '}
                            <span className={(req.requirementType.removed ? 'removed' : '')}>
                              { getRequirementDisplay(req) }
                            </span>
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
                { getSurveillanceResultsSummary(surveillance).length > 0
                  && (
                    <ul className={classes.unindentedData}>
                      { getSurveillanceResultsSummary(surveillance).map((result) => (
                        <li key={result.id}>
                          { `${result.statusName} Non-Conformity Found for` }
                          <span className={result.removed ? 'removed' : ''}>
                            { result.display }
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                { getSurveillanceResultsSummary(surveillance).length === 0 && 'No Non-Conformities Found' }
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      { getSurveillanceResultsSummary(surveillance).length > 0
        && (
          <div className={classes.nonconformityContainer}>
            <Typography variant="subtitle1">
              Non-Conformities
            </Typography>
            <div>
              { surveillance.requirements.map((requirement) => (
                requirement.nonconformities.map((nonconformity) => (
                  <ChplSurveillanceNonconformity
                    key={requirement.id}
                    surveillance={surveillance}
                    nonconformity={nonconformity}
                  />
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
