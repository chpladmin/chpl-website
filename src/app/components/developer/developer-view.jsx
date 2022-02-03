import React, { useContext, useEffect, useState } from 'react';
import {
  func,
} from 'prop-types';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import GroupIcon from '@material-ui/icons/Group';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { ChplLink, ChplTooltip } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { developer as developerPropType } from 'shared/prop-types';
import { UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '286px',
    gap: '8px',
  },
});

function ChplDeveloperView(props) {
  const DateUtil = getAngularService('DateUtil');
  const [developer, setDeveloper] = useState({});
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    setDeveloper(props.developer);
  }, [props.developer]); // eslint-disable-line react/destructuring-assignment

  const edit = () => {
    props.dispatch('edit', developer);
  };

  return (
      <Card
        title={`${developer.name} Information`}
      >
        <CardHeader
          title={developer.name}
        />
        <CardContent className={classes.content}>
          <div>
            <Typography>
              <strong>Developer code</strong>
              <br />
              {developer.developerCode}
            </Typography>
            <Typography>
              <strong>Self-developer</strong>
              <br />
              {developer.selfDeveloper ? 'Yes' : 'No'}
            </Typography>
            { developer.statusEvents
              ?.sort((a, b) => b.statusDate - a.statusDate)
              .map((status) => (
                <Typography key={status.id}>
                  <strong>Status</strong>
                  <br />
                  {status.status.status} as of { DateUtil.getDisplayDateFormat(status.statusDate) }
                  { status.reason
                    && (
                      <>
                      <br />
                        {status.reason}
                      </>
                    )}
                </Typography>
              ))}
          </div>
          <div>
            { developer.contact
              && (
                <Typography>
                  <strong>Contact</strong>
                  <br />
                  <span className="sr-only">Full name: </span>{developer.contact.fullName}
                  {developer.contact.title
                   && (
                     <>
                       , <span className="sr-only">Title: </span>{developer.contact.title}
                     </>
                   )}
                  <br />
                  <span className="sr-only">Phone: </span>{developer.contact.phoneNumber}<br />
                  <span className="sr-only">Email: </span>{developer.contact.email}
                </Typography>
              )}
            { developer.address
              && (
                <Typography>
                  <strong>Address</strong>
                  <br />
                  <span className="sr-only">Line 1: </span>{developer.address.line1}
                  {developer.address.line2
                   && (
                     <>
                     , <span className="sr-only">Line 2: </span>{developer.address.line2}
                     </>
                   )}
                  <br />
                  <span className="sr-only">City: </span>{developer.address.city}, <span className="sr-only">State: </span>{developer.address.state} <span className="sr-only">Zipcode: </span>{developer.address.zipcode}, <span className="sr-only">Country: </span>{developer.address.country}
                </Typography>
              )}
            { developer.website
              && (
                <Typography>
                  <strong>Website</strong>
                  <br />
                  <ChplLink
                    href={developer.website}
                  />
                </Typography>
              )}
          </div>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <ButtonGroup
            color="primary"
          >
            <ChplTooltip title={`Edit ${developer.fullName}`}>
              <Button
                variant="contained"
                aria-label={`Edit ${developer.fullName}`}
                onClick={edit}
              >
                <EditOutlinedIcon />
              </Button>
            </ChplTooltip>
            <ChplTooltip title={`Impersonate ${developer.fullName}`}>
              <Button
                variant="outlined"
                aria-label={`Impersonate ${developer.fullName}`}
                onClick={() => {}}
              >
                <GroupIcon />
              </Button>
            </ChplTooltip>
          </ButtonGroup>
        </CardActions>
      </Card>
  );
}

export default ChplDeveloperView;

ChplDeveloperView.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
};
