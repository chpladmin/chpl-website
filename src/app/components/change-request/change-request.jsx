import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import Moment from 'react-moment';

import { getAngularService } from '../../services/angular-react-helper';
import { changeRequest as changeRequestProp } from '../../shared/prop-types';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
  productCard: {
    paddingBottom: '8px',
  },
  productCardHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto 11fr',
    padding: '16px',
    gap: '16px',
    alignItems: 'center',
  },
  subProductCardHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  versionProductCardHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto 1fr',
    gap: '8px',
    alignItems: 'center',
  },
  widgetProductContainer: {
    alignContent: 'space-between',
    display: 'grid',
    gap: '8px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    gap: '8px',

  },
  subcontent: {
    display: 'grid',
    gap: '8px',
  },

  developerAvatar: {
    color: '#156dac',
    backgroundColor: '#f5f9fd',
  },

  activeStatus: {
    color: '#66926d',
    marginLeft: '4px',
  },
});

const getInitials = (name) => name.split(' ').map((c) => c.substring(0, 1).toUpperCase()).join('');

function ChplChangeRequest(props) {
  /* eslint-disable react/destructuring-assignment */
  const DateUtil = getAngularService('DateUtil');
  const [changeRequest, setChangeRequest] = useState(props.changeRequest);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  return (
        <div>
            <Card className={classes.productCard} >
                <div className={classes.productCardHeaderContainer}>
                  <Avatar className={classes.developerAvatar}>{getInitials(changeRequest.developer.name)}</Avatar>
                    <div className={classes.subProductCardHeaderContainer}>
                      <Typography variant='h5'>{changeRequest.changeRequestType.name}</Typography>
                        <div className={classes.versionProductCardHeaderContainer}>
                            <Typography variant='subtitle2'>Developer:</Typography>
                          <Typography variant='body1'>{changeRequest.developer.name}</Typography>
                            <Typography variant='subtitle2'>Creation Date:</Typography>
                          <Typography variant='body1'>{DateUtil.getDisplayDateFormat(changeRequest.submittedDate)}</Typography>|
                            <Typography variant='subtitle2'>Request Status:</Typography>
                          <Typography variant='body1'>{changeRequest.currentStatus.changeRequestStatusType.name}</Typography>|
                            <Typography variant='subtitle2'>Time Since Last Status Change:</Typography>
                          <Typography variant='body1'><Moment fromNow>{changeRequest.currentStatus.statusChangeDate}</Moment></Typography>|
                        </div>
                    </div>
                </div>
                <Divider />
                <CardContent className={classes.content}>
                    <div className={classes.subcontent}>
                        <div>
                            <Typography variant='subtitle1'>
                                Edition{' '}
                            </Typography>
                            <Typography varient='body1'>
                                2015
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.subcontent}>
                        <div>
                            <Typography variant='subtitle1'>
                                CHPL ID{' '}
                            </Typography>
                            <Typography varient='body1'>
                                15.04.04.1447.Beac.AU.08.1.200220
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.widgetProductContainer}>
                        <div>
                            <Button color='secondary' variant='contained' fullWidth>
                                CERT ID

                            </Button>
                        </div>
                        <div>
                            <Button color='secondary' variant='contained' fullWidth>
                                COMPARE

                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div >
    );
}

export default ChplChangeRequest;

ChplChangeRequest.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  dispatch: func.isRequired,
};
