import React, { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Skeleton,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import { useFetchRoles, usePutSubscriber } from 'api/subscriptions';
import { ChplLink, ChplSkeletonCard, ChplTextField } from 'components/util';
import { palette, theme, utilStyles } from 'themes';

const itemEnter = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateY(200%)',
  },
  '100%': {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

const validationSchema = yup.object({
  role: yup.object()
    .required('"I\'m interested because I\'m a..." is required'),
});

const styles = {
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
    animation: `${itemEnter} 1000ms ${theme.transitions.easing.easeInOut}`,
  },
};

// Same layout as ChplConfirmSubscription, which has its own header rather than
// a ChplPageHeader: the card with the role field and the confirm button
const loadingStyles = {
  page: {
    backgroundColor: palette.background,
    width: '100%',
  },
  header: {
    padding: '16px 0',
    marginTop: '-8px',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingTop: '32px',
    paddingBottom: '32px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
  },
  lines: {
    display: 'flex',
    flexDirection: 'column',
  },
};

function ChplConfirmSubscriptionLoading() {
  return (
    <Box sx={loadingStyles.page} role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>Loading subscription options</Box>
      <Box aria-hidden="true">
        <Box sx={loadingStyles.header}>
          <Container maxWidth="sm">
            <Skeleton variant="text" width="80%" height={56} />
          </Container>
        </Box>
        <Container maxWidth="sm">
          <Box sx={loadingStyles.body}>
            <ChplSkeletonCard>
              <Box sx={loadingStyles.content}>
                <Box sx={loadingStyles.lines}>
                  <Skeleton variant="text" width="100%" height={22} />
                  <Skeleton variant="text" width="100%" height={22} />
                  <Skeleton variant="text" width="55%" height={22} />
                </Box>
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '4px' }} />
                <Skeleton variant="rectangular" width={180} height={30} sx={{ borderRadius: '4px' }} />
              </Box>
            </ChplSkeletonCard>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

function ChplConfirmSubscription(props) {
  const { hash } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [roles, setRoles] = useState([]);
  const { data, isLoading, isSuccess } = useFetchRoles();
  const putSubscriber = usePutSubscriber();
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

  // Without this, the role field shows with nothing to choose until the roles arrive
  if (isLoading) { return <ChplConfirmSubscriptionLoading />; }

  return (
    <Box sx={styles.page}>
      <Box sx={styles.header}>
        <Container maxWidth="sm" sx={styles.headerContent}>
          <Typography variant="h1">
            Confirm Your Subscription
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="sm">
        <Box pt={8} pb={8} display="flex" flexDirection="column" gap="16px">
          <Card sx={styles.animatedItem}>
            <CardContent>
              <Box sx={styles.confirmSubscriptionCard}>
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
                     router={{ sref: 'subscriptions.manage', params: { hash } }}
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
