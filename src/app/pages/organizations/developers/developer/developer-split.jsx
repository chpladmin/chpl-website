import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { func } from 'prop-types';

import { usePostDeveloperSplit } from 'api/developer';
import ChplDeveloper from 'components/developer/developer';
import { ChplTooltip } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { DeveloperContext, useAnalyticsContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '375px',
    gridGap: '32px',
  },
  halfWidth: {
    width: 'auto',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  listItem: {
    fontSize: 'small',
    display: 'flex',
    justifyContent: 'space-between',
  },
  pageContainer: {
    padding: '32px 0px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gridGap: '32px',
    alignItems: 'stretch',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'flex-start',
    },
  },
  productList: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  productName: {
    width: '64%',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '32px',
  },
});

function ChplDeveloperSplit({ dispatch }) {
  const { analytics } = useAnalyticsContext();
  const { developer } = useContext(DeveloperContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostDeveloperSplit();
  const [products, setProducts] = useState([]);
  const [movingProducts, setMovingProducts] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setProducts(developer.products);
  }, [developer]);

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        dispatch('cancel');
        break;
      case 'save':
        setIsProcessing(true);
        eventTrack({
          ...analytics,
          event: 'Split Developer',
        });
        setErrorMessages([]);
        mutate({
          oldDeveloper: developer,
          newDeveloper: payload,
          oldProducts: products,
          newProducts: movingProducts,
        }, {
          onSuccess: (response) => {
            setIsProcessing(false);
            let body;
            if (!response.status || response.status === 200 || angular.isObject(response.status)) {
              enqueueSnackbar(`Split submitted. Your action has been submitted and you'll get an email at ${response.data.job.jobDataMap.user.email} when it's done`, {
                variant: 'success',
              });
              dispatch('cancel');
            } else if (response.data.errorMessages) {
              body = response.data.errorMessages.join(', ');
            } else if (response.data.error) {
              body = response.data.error;
            } else {
              body = 'An unexpected error has occurred.';
            }
            if (body) {
              enqueueSnackbar(body, {
                variant: 'error',
              });
            }
          },
          onError: (error) => {
            setIsProcessing(false);
            let body;
            if (error.data?.errorMessages) {
              setErrorMessages(error.data.errorMessages);
            } else if (error.response?.data?.errorMessages) {
              setErrorMessages(error.response.data.errorMessages);
            } else if (error.data?.error) {
              body = error.data.error;
            } else {
              body = 'An unexpected error has occurred.';
            }
            if (body) {
              enqueueSnackbar(body, {
                variant: 'error',
              });
            }
          },
        });
        break;
      // no default
    }
  };

  const moveProduct = (product, toNew) => {
    if (toNew) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setMovingProducts((prev) => [...prev, product]);
    } else {
      setProducts((prev) => [...prev, product]);
      setMovingProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  if (!developer) { return <CircularProgress />; }

  return (
    <>
      <Container disableGutters maxWidth="xl">
        <Box className={classes.pageContainer}>
          <Box className={classes.columnContainer}>
            <ChplDeveloper
              developer={developer}
              isSplitting
            />
          </Box>
          <Box>
            <ChplDeveloper
              developer={{}}
              dispatch={handleDispatch}
              isEditing
              isSplitting
              isInvalid={products.length === 0 || movingProducts.length === 0}
              isProcessing={isProcessing}
              errorMessages={errorMessages}
            />
          </Box>
          <Divider className={classes.fullWidth} />
          <Card>
            <CardHeader title="Products staying with original developer" />
            <CardContent>
              <List className={classes.productList}>
                {products.map((product) => (
                  <ListItem divider className={classes.listItem} dense key={product.id}>
                    <Box className={classes.productName}>
                      {product.name}
                    </Box>
                    <ChplTooltip
                      placement="top"
                      title="Move product to new developer"
                    >
                      <Button
                        endIcon={<ArrowForward />}
                        size="small"
                        color="secondary"
                        variant="contained"
                        onClick={() => moveProduct(product, true)}
                      >
                        Move
                      </Button>
                    </ChplTooltip>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Products moving to new developer" />
            <CardContent>
              <div>
                {movingProducts.length === 0 ? (
                  <Typography variant="body1" color="textSecondary" align="left">
                    No products selected. At least one product must be selected to move.
                  </Typography>
                ) : (
                  <List className={classes.productList}>
                    {movingProducts.map((product) => (
                      <ListItem divider className={classes.listItem} dense key={product.id}>
                        <Box className={classes.productName}>
                          {product.name}
                        </Box>
                        <ChplTooltip
                          placement="top"
                          title="Move product to original developer"
                        >
                          <Button
                            endIcon={<ArrowBack />}
                            size="small"
                            color="secondary"
                            variant="contained"
                            onClick={() => moveProduct(product, false)}
                          >
                            Move
                          </Button>
                        </ChplTooltip>
                      </ListItem>
                    ))}
                  </List>
                )}
              </div>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default ChplDeveloperSplit;

ChplDeveloperSplit.propTypes = {
  dispatch: func.isRequired,
};
