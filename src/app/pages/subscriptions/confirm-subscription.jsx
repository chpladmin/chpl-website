import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import Image from '../../../assets/images/mySubsriptions.png';

import { useFetchRoles, usePutSubscriber } from 'api/subscriptions';
import { ChplLink, ChplTextField } from 'components/util';
import { palette, theme, utilStyles } from 'themes';

const validationSchema = yup.object({
  role: yup.object()
    .required('"I\'m interested because I\'m a..." is required'),
});

const useStyles = makeStyles({
  ...utilStyles,
  chplLeftHandFormat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    padding: '32px 0',
    width: '100%',
    backgroundColor: `${palette.background}`,
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  header: {
    backgroundColor: `${palette.white} !important`,
    padding: '16px 0',
    marginTop: '-8px',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mySubsciptionImagery: {
    backgroundImage: `url(${Image})`,
    minHeight: '164px',
    width: '100%',
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    marginTop: '-16px',
  },
  page: {
    backgroundColor: `${palette.background} !important`,
    width: '100%',
  },
  subscriptionTotalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '16px',
    alignItems: 'center',
  },
});

function ChplConfirmSubscription(props) {
  const { hash } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [roles, setRoles] = useState([]);
  const { data, isLoading, isSuccess } = useFetchRoles();
  const putSubscriber = usePutSubscriber();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setRoles(data.sort((a, b) => (a.sortOrder - b.sortOrder)));
  }, [data, isLoading, isSuccess]);

  const confirm = () => {
    putSubscriber.mutate({
      subscriberId: hash,
      roleId: formik.values.role.id,
    }, {
      onSuccess: () => {
        enqueueSnackbar('Your subscription has been confirmed', { variant: 'success' });
        setIsConfirmed(true);
      },
      onError: (error) => {
        enqueueSnackbar(error.response.data.error, { variant: 'error' });
      },
    });
  };

  formik = useFormik({
    validationSchema,
    initialValues: {
      role: '',
    },
    onSubmit: () => {
      confirm();
    },
  });

  if (!roles || !hash) { return null; }

  return (
    <Box className={classes.page}>
      <Box className={classes.header}>
        <Container className={classes.headerContent}>
          <Typography variant="h1">
            Confirm Subscription
          </Typography>
        </Container>
      </Box>
      <Container>
        <Box className={classes.chplLeftHandFormat}>
          <Card>
            <Box className={classes.mySubsciptionImagery} />
            <CardContent>
              <Typography gutterBottom variant="h4" component="h2"><strong>Welcome to your subscription page!</strong></Typography>
              <Typography>Here, you can easily view and manage your subscriptions.</Typography>
            </CardContent>
          </Card>
          <Box className={classes.subscriptionTotalContainer}>
            <ChplTextField
              select
              id="role"
              name="role"
              label="I'm interested because I'm a..."
              required
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.role && !!formik.errors.role}
              helperText={formik.touched.role && formik.errors.role}
            >
              {roles.map((item) => (
                <MenuItem value={item} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </ChplTextField>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={confirm}
              endIcon={<SendIcon fontSize="small" />}
            >
              Subscribe
            </Button>
          </Box>
          { isConfirmed
            && (
              <Typography>
                You may manage your subscriptions at
                {' '}
                <ChplLink
                  href={`#/subscriptions/manage/${hash}`}
                  text="the manage subscriptions page"
                  external={false}
                  router={{ sref: 'subscriptions.manage', options: { hash } }}
                />
              </Typography>
            )}
        </Box>
      </Container>
    </Box>
  );
}

export default ChplConfirmSubscription;

ChplConfirmSubscription.propTypes = {
  hash: string.isRequired,
};
