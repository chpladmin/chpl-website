import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { bool, func } from 'prop-types';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CallMergeIcon from '@material-ui/icons/CallMerge';

import { ChplLink, ChplTooltip } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { developer as developerPropType } from 'shared/prop-types';
import { UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    justifyItems: 'stretch'
  },
});

function ChplDeveloperView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { isSplitting } = props;
  const [developer, setDeveloper] = useState({});
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    setDeveloper(props.developer);
  }, [props.developer]); // eslint-disable-line react/destructuring-assignment

  const can = (action) => {
    // todo - containing allowances?
    // todo - add Developer can edit (flag & owns organization based)
    if (action === 'edit') {
      return hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // always allowed as ADMIN/ONC
        || (hasAnyRole(['ROLE_ACB']) && developer.status.status === 'Active'); // allowed for ACB iff Developer is "Active"
    }
    if (action === 'merge') {
      return hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']); // always allowed as ADMIN/ONC
    }
    if (action === 'split') {
      return hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // always allowed as ADMIN/ONC
        || (hasAnyRole(['ROLE_ACB']) && developer.status.status === 'Active'); // allowed for ACB iff Developer is "Active"
    }
    return false;
  };

  const edit = () => {
    props.dispatch('edit');
  };

  const split = () => {
    props.dispatch('split');
  };

  const merge = () => {
    props.dispatch('merge');
  };

  return (
    <Card
      title={`${developer.name} Information`}
    >
      <CardHeader
        title={isSplitting ? 'Original Developer' : developer.name}
      />
      <CardContent className={classes.content}>
        <div>
          <Typography><strong>Developer code</strong></Typography>
          <Typography>{developer.developerCode}</Typography>
          <br />
          <Typography><strong>Self-developer</strong></Typography>
          <Typography>{developer.selfDeveloper ? 'Yes' : 'No'}</Typography>
          <br />
          { developer.statusEvents
              ?.sort((a, b) => b.statusDate - a.statusDate)
              .map((status) => (
                <Typography key={status.id}>
                  <strong>Status</strong>
                  <br />
                  {status.status.status}
                  {' '}
                  as of
                  {' '}
                  { DateUtil.getDisplayDateFormat(status.statusDate) }
                  { status.reason
                    && (
                      <>  
                        <br />
                        <br />
                        {status.reason}
                      </>
                    )}
                </Typography>
              ))}
           <br />
        </div>
        <div>
          { developer.contact
              && (
                <Typography>
                  <strong>Contact</strong>
                  <br />
                  <span className="sr-only">Full name: </span>
                  {developer.contact.fullName}
                  {developer.contact.title
                   && (
                     <>
                       ,
                       {' '}
                       <span className="sr-only">Title: </span>
                       {developer.contact.title}
                     </>
                   )}
                  <br />
                  <span className="sr-only">Phone: </span>
                  {developer.contact.phoneNumber}
                  <br />
                  <span className="sr-only">Email: </span>
                  {developer.contact.email}
                </Typography>
              )}
          <br />
          { developer.address
              && (
                <Typography>
                  <strong>Address</strong>
                  <br />
                  <span className="sr-only">Line 1: </span>
                  {developer.address.line1}
                  {developer.address.line2
                   && (
                     <>
                       ,
                       {' '}
                       <span className="sr-only">Line 2: </span>
                       {developer.address.line2}
                     </>
                   )}
                  <br />
                  <span className="sr-only">City: </span>
                  {developer.address.city}
                  ,
                  {' '}
                  <span className="sr-only">State: </span>
                  {developer.address.state}
                  {' '}
                  <span className="sr-only">Zipcode: </span>
                  {developer.address.zipcode}
                  ,
                  <span className="sr-only">Country: </span>
                  {developer.address.country}
                </Typography>
              )}
          <br />
          { developer.website
              && (
                <Typography>
                  <strong>Website</strong>
                  <div>
                  <Typography><ChplLink
                    href={developer.website}
                  />
                  </Typography>
                  </div>
                </Typography>
              )}
        </div>
      </CardContent>
      { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']) && !isSplitting
          && (
            <CardActions className={classes.cardActions}>
              <ButtonGroup
                color="primary"
              >
                { can('edit')
                  && (
                    <ChplTooltip title={`Edit ${developer.name} Information`}>
                      <Button
                        variant="contained"
                        aria-label={`Edit ${developer.name} Information`}
                        onClick={edit}
                      >
                        <EditOutlinedIcon />
                      </Button>
                    </ChplTooltip>
                  )}
                { can('split')
                  && (
                  <ChplTooltip title={`Split ${developer.name}`}>
                    <Button
                      variant="outlined"
                      aria-label={`Split ${developer.name}`}
                      onClick={split}
                    >
                      <CallSplitIcon />
                    </Button>
                  </ChplTooltip>
                  )}
                { can('merge')
                  && (
                  <ChplTooltip title={`Merge ${developer.name}`}>
                    <Button
                      variant="outlined"
                      aria-label={`Merge ${developer.name}`}
                      onClick={merge}
                    >
                      <CallMergeIcon />
                    </Button>
                  </ChplTooltip>
                  )}
              </ButtonGroup>
            </CardActions>
          )}
    </Card>
  );
}

export default ChplDeveloperView;

ChplDeveloperView.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
  isSplitting: bool.isRequired,
};
