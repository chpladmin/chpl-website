import React, { useContext, useState } from 'react';
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

import { usePutProduct } from 'api/product';
import { ChplTooltip } from 'components/util';
import ChplProduct from 'components/product/product';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext, DeveloperContext } from 'shared/contexts';
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
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'flex-start',
    },
  },
  itemList: {
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

function ChplProductMerge({ dispatch, product }) {
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePutProduct();
  const { developer } = useContext(DeveloperContext);
  const [mergingProducts, setMergingProducts] = useState([]);
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
          event: 'Merge Products',
        });
        mutate({
          product: payload,
          productIds: [...mergingProducts.map((v) => v.id), product.id],
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

  const moveProduct = (p, toNew) => {
    if (toNew) {
      setMergingProducts((prev) => [...prev, p]);
    } else {
      setMergingProducts((prev) => prev.filter((prod) => prod.id !== p.id));
    }
  };

  if (!developer) { return <CircularProgress />; }

  return (
    <>
      <Container disableGutters maxWidth="xl">
        <Box className={classes.pageContainer}>
          <Box>
            <ChplProduct
              product={product}
              dispatch={handleDispatch}
              isEditing
              isInvalid={mergingProducts.length < 1}
              isProcessing={isProcessing}
            />
          </Box>
          <Divider className={classes.fullWidthGridRow} />
          <Card>
            <CardHeader title="Add Products to merge" />
            <CardContent>
              <List className={classes.itemList}>
                { developer.products
                  .filter((prod) => mergingProducts.every((p) => p.id !== prod.id))
                  .filter((prod) => prod.id !== product.id)
                  .sort((a, b) => (a.name < b.name ? -1 : 1))
                  .map((item) => (
                    <ListItem divider className={classes.listItem} dense key={item.id}>
                      <Box className={classes.itemName}>
                        {item.name}
                      </Box>
                      <ChplTooltip
                        placement="top"
                        title="Merge into new product"
                      >
                        <Button
                          endIcon={<ArrowForward />}
                          size="small"
                          color="secondary"
                          variant="contained"
                          onClick={() => moveProduct(item, true)}
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
            <CardHeader title="Products to Merge" />
            <CardContent>
              <List className={classes.itemList}>
                <ListItem>{ product.name }</ListItem>
                { mergingProducts
                  .sort((a, b) => (a.name < b.name ? -1 : 1))
                  .map((item) => (
                    <ListItem divider className={classes.listItem} dense key={item.id}>
                      <Box className={classes.itemName}>
                        {item.name}
                      </Box>
                      <ChplTooltip
                        placement="top"
                        title="Remove product from merge"
                      >
                        <Button
                          endIcon={<ArrowBack />}
                          size="small"
                          color="secondary"
                          variant="contained"
                          onClick={() => moveProduct(item, false)}
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

export default ChplProductMerge;

ChplProductMerge.propTypes = {
  dispatch: func.isRequired,
  product: object.isRequired,
};
