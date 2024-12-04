import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import {
  Timeline,
} from '@material-ui/lab';
import TrackChangesOutlined from '@material-ui/icons/TrackChangesOutlined';
import { arrayOf, object } from 'prop-types';

import ChplActivityDetails from './activity-details';

import {
  useFetchProductActivitiesMetadata,
  useFetchVersionActivitiesMetadata,
} from 'api/activity';
import { compareProduct } from 'components/activity/services/products.service';
import { ChplDialogTitle, ChplTooltip } from 'components/util';

const useStyles = makeStyles({
  legendTitle: {
    fontSize: '1.25em',
  },
});

function ChplProductsHistory({ products }) {
  const [activities, setActivities] = useState([]);
  const [evaluatedActivities, setEvaluatedActivities] = useState([]);
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState([]);
  const classes = useStyles();

  const productQuery = useFetchProductActivitiesMetadata({
    products,
    enabled: open,
  });

  const versionQuery = useFetchVersionActivitiesMetadata({
    versions,
    enabled: open,
  });

  useEffect(() => {
    setVersions(products.flatMap((product) => product.versions));
  }, [products]);

  useEffect(() => {
    productQuery.forEach((q) => {
      if (q.isLoading || q.isError || !q.data || evaluatedActivities.includes(q.data.id)) { return; }
      setActivities((prev) => [
        ...prev,
        ...q.data.data,
      ]);
      setEvaluatedActivities((prev) => [...prev, q.data.id]);
    });
  }, [productQuery]);

  useEffect(() => {
    versionQuery.forEach((q) => {
      if (q.isLoading || q.isError || !q.data || evaluatedActivities.includes(q.data.id)) { return; }
      setActivities((prev) => [
        ...prev,
        ...q.data.data,
      ]);
      setEvaluatedActivities((prev) => [...prev, q.data.id]);
    });
  }, [versionQuery]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ChplTooltip title="Product/Version History">
        <Button
          id="view-history"
          aria-label="Open History"
          color="secondary"
          variant="contained"
          onClick={handleClickOpen}
          endIcon={<TrackChangesOutlined />}
          size="small"
          style={{ fontSize: 'small' }}
        >
          History
        </Button>
      </ChplTooltip>
      <Dialog
        onClose={handleClose}
        aria-labelledby="view-history"
        open={open}
        maxWidth="sm"
      >
        <ChplDialogTitle
          id="history-title"
          onClose={handleClose}
          className={classes.legendTitle}
        >
          Product/Version History
        </ChplDialogTitle>
        <DialogContent dividers>
          <Timeline>
            { activities
              .sort((a, b) => (a.date < b.date ? 1 : -1))
              .map((activity, idx, arr) => (
                <ChplActivityDetails
                  key={activity.id}
                  activity={activity}
                  interpret={compareProduct}
                  last={idx === arr.length - 1}
                  title={activity.concept === 'PRODUCT' ? 'Product ' : 'Version '}
                />
              ))}
          </Timeline>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChplProductsHistory;

ChplProductsHistory.propTypes = {
  products: arrayOf(object).isRequired,
};
