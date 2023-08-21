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
import CheckIcon from '@material-ui/icons/Check';
import { string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import { useFetchRoles, usePutSubscriber } from 'api/subscriptions';
import { ChplLink, ChplTextField } from 'components/util';
import { palette, theme, utilStyles } from 'themes';

const validationSchema = yup.object({
  role: yup.object()
    .required('"I\'m interested because I\'m a..." is required'),
});

const useStyles = makeStyles({
  ...utilStyles,
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
  page: {
    backgroundColor: `${palette.background} !important`,
    width: '100%',
  },
  confirmSubscriptionCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: '8px 0',
    gap: '16px',
    alignItems: 'flex-start',
  },
  animatedItem: {
    animation: `$myEffect 1000ms ${theme.transitions.easing.easeInOut}`,
  },
  '@keyframes myEffect': {
    '0%': {
      opacity: 0,
      transform: 'translateY(200%)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
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
        const { errorMessages } = error.response.data;
        const body = `Error: ${errorMessages.join('; ')}`;
        enqueueSnackbar(body, { variant: 'error' });
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
        <Container maxWidth="sm" className={classes.headerContent}>
          <Typography variant="h1">
            Confirm Your Subscription
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="sm">
        <Box pt={8} pb={8} display="flex" flexDirection="column" gridGap="16px">
          <Card className={classes.animatedItem}>
            <CardContent>
              <Box className={classes.confirmSubscriptionCard}>
                <Typography gutterBottom>To complete the subscription process and tailor your experience, we kindly ask you to select your area of interest from the dropdown menu provided below and confirm your subscription</Typography>
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
                  color="primary"
                  variant="contained"
                  onClick={confirm}
                  endIcon={<CheckIcon fontSize="small" />}
                  disabled={formik.values.role === ''}
                >
                  Confirm
                </Button>
              </Box>
            </CardContent>
          </Card>
          { isConfirmed
           && (
             <Card>
               <CardContent>
                 <Typography>
                   You may manage your subscriptions at
                   {' '}
                   <ChplLink
                     href={`#/subscriptions/manage/${hash}`}
                     text="the manage subscriptions page"
                     external={false}
                     inline
                     router={{ sref: 'subscriptions.manage', options: { hash } }}
                   />
                 </Typography>
               </CardContent>
             </Card>
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
