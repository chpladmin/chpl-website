import React, { useEffect, useState } from 'react';
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
import { func, object } from 'prop-types';

import { usePostProductSplit } from 'api/product';
import ChplProduct from 'components/product/product';
import { ChplTooltip } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '375px',
    gridGap: '32px',
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
    minHeight: 'calc(100vh - 289px)',
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
  versionName: {
    width: '64%',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '32px',
  },
});

function ChplProductSplit({ dispatch, product }) {
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostProductSplit();
  const [versions, setVersions] = useState([]);
  const [movingVersions, setMovingVersions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setVersions(product.versions);
  }, []);

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        dispatch('cancel');
        break;
      case 'save':
        setIsProcessing(true);
        eventTrack({
          ...analytics,
          event: 'Split Product',
        });
        mutate({
          newProductCode: payload.code,
          newProductName: payload.name,
          newVersions: movingVersions,
          oldVersions: versions,
          oldProduct: product,
        }, {
          onSuccess: () => {
            setIsProcessing(false);
            enqueueSnackbar('The split was successful', {
              variant: 'success',
            });
            dispatch('cancel');
          },
          onError: (error) => {
            setIsProcessing(false);
            let body;
            if (error.data?.errorMessages) {
              body = error.data.errorMessages.join(', ');
            } else if (error.response?.data?.errorMessages) {
              body = error.response.data.errorMessages.join(', ');
            } else if (error.data?.error) {
              body = error.data.error;
            } else if (error.response.data.error) {
              body = error.response.data.error;
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

  const moveVersion = (version, toNew) => {
    if (toNew) {
      setVersions((prev) => prev.filter((p) => p.id !== version.id));
      setMovingVersions((prev) => [...prev, version]);
    } else {
      setVersions((prev) => [...prev, version]);
      setMovingVersions((prev) => prev.filter((p) => p.id !== version.id));
    }
  };

  if (!product) { return <CircularProgress />; }

  return (
    <>
      <Container disableGutters maxWidth="xl">
        <Box className={classes.pageContainer}>
          <Box className={classes.columnContainer}>
            <ChplProduct
              product={product}
              isSplitting
            />
          </Box>
          <Box>
            <ChplProduct
              product={{}}
              dispatch={handleDispatch}
              isEditing
              isSplitting
              isInvalid={versions.length === 0 || movingVersions.length === 0}
              isProcessing={isProcessing}
            />
          </Box>
          <Divider className={classes.fullWidthGridRow} />
          <Card>
            <CardHeader title="Versions staying with original Product" />
            <CardContent>
              { versions.length === 0 ? (
                <Typography variant="body1" color="textSecondary" align="left">
                  No versions selected. At least one version must remain with the Product.
                </Typography>
              ) : (
                <List className={classes.productList}>
                  {versions.map((version) => (
                    <ListItem divider className={classes.listItem} dense key={version.id}>
                      <Box className={classes.versionName}>
                        {version.version}
                      </Box>
                      <ChplTooltip
                        placement="top"
                        title="Move version to new product"
                      >
                        <Button
                          endIcon={<ArrowForward />}
                          size="small"
                          color="secondary"
                          variant="contained"
                          onClick={() => moveVersion(version, true)}
                        >
                          Move
                        </Button>
                      </ChplTooltip>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Versions moving to new Product" />
            <CardContent>
              { movingVersions.length === 0 ? (
                <Typography variant="body1" color="textSecondary" align="left">
                  No versions selected. At least one version must be selected to move.
                </Typography>
              ) : (
                <List className={classes.versionList}>
                  {movingVersions.map((version) => (
                    <ListItem divider className={classes.listItem} dense key={version.id}>
                      <Box className={classes.versionName}>
                        {version.version}
                      </Box>
                      <ChplTooltip
                        placement="top"
                        title="Move version to original product"
                      >
                        <Button
                          endIcon={<ArrowBack />}
                          size="small"
                          color="secondary"
                          variant="contained"
                          onClick={() => moveVersion(version, false)}
                        >
                          Move
                        </Button>
                      </ChplTooltip>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default ChplProductSplit;

ChplProductSplit.propTypes = {
  dispatch: func.isRequired,
  product: object.isRequired,
};
