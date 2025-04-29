import React, { useState } from 'react';
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
  makeStyles,
} from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { func, object } from 'prop-types';

import { usePutVersion } from 'api/version';
import { ChplTooltip } from 'components/util';
import ChplVersion from 'components/version/version';
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
    paddingBottom: '60vh',
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
  itemName: {
    width: '64%',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '32px',
  },
});

function ChplVersionMerge({ dispatch, product, version }) {
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePutVersion();
  const [mergingVersions, setMergingVersions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        dispatch('cancel');
        break;
      case 'save':
        setIsProcessing(true);
        eventTrack({
          ...analytics,
          event: 'Merge Versions',
        });
        mutate({
          version: payload,
          versionIds: [...mergingVersions.map((v) => v.id), version.id],
          newProductId: product.id,
        }, {
          onSuccess: () => {
            setIsProcessing(false);
            enqueueSnackbar('The merge was successful', {
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

  const moveVersion = (v, toNew) => {
    if (toNew) {
      setMergingVersions((prev) => [...prev, v]);
    } else {
      setMergingVersions((prev) => prev.filter((p) => p.id !== v.id));
    }
  };

  if (!product) { return <CircularProgress />; }

  return (
    <>
      <Container disableGutters maxWidth="xl">
        <Box className={classes.pageContainer}>
          <Box>
            <ChplVersion
              version={version}
              dispatch={handleDispatch}
              isEditing
              isInvalid={mergingVersions.length < 1}
              isProcessing={isProcessing}
            />
          </Box>
          <Divider className={classes.fullWidthGridRow} />
          <Card>
            <CardHeader title="Add Versions to merge" />
            <CardContent>
              <List className={classes.productList}>
                { product.versions
                  .filter((ver) => mergingVersions.every((v) => v.id !== ver.id))
                  .filter((ver) => ver.id !== version.id)
                  .map((item) => (
                    <ListItem divider className={classes.listItem} dense key={item.id}>
                      <Box className={classes.itemName}>
                        {item.version}
                      </Box>
                      <ChplTooltip
                        placement="top"
                        title="Merge into new version"
                      >
                        <Button
                          endIcon={<ArrowForward />}
                          size="small"
                          color="secondary"
                          variant="contained"
                          onClick={() => moveVersion(item, true)}
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
            <CardHeader title="Versions to Merge" />
            <CardContent>
              <List className={classes.listingList}>
                <ListItem>{ version.version }</ListItem>
                { mergingVersions.map((item) => (
                  <ListItem divider className={classes.listItem} dense key={item.id}>
                    <Box className={classes.itemName}>
                      {item.version}
                    </Box>
                    <ChplTooltip
                      placement="top"
                      title="Remove version from merge"
                    >
                      <Button
                        endIcon={<ArrowBack />}
                        size="small"
                        color="secondary"
                        variant="contained"
                        onClick={() => moveVersion(item, false)}
                      >
                        Move
                      </Button>
                    </ChplTooltip>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default ChplVersionMerge;

ChplVersionMerge.propTypes = {
  dispatch: func.isRequired,
  product: object.isRequired,
  version: object.isRequired,
};
