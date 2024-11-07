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
import { ChplDialogTitle, ChplTooltip } from 'components/util';

const useStyles = makeStyles({
  legendTitle: {
    fontSize: '1.25em',
  },
});

const interpret = (a, b) => {
  console.log({a, b});
  return `${a.id}-${b.id}`;
};

function ChplProductsHistory({ products }) {
  const [activities, setActivities] = useState([]);
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
    const vs = products
          .flatMap((product) => product.versions)
          .filter((version) => version.version !== 'All'); // todo remove when angularjs component is removed
    setVersions(vs);
  }, [products]);

  useEffect(() => {
    console.log(productQuery.isLoading, versionQuery.isLoading, productQuery.isError, versionQuery.isError);
    if (productQuery.isLoading || versionQuery.isLoading) { return; }
    if (productQuery.isError || versionQuery.isError || !productQuery.data || !versionQuery.data) {
      setActivities([]);
      return;
    }
    console.log(productQuery.data, versionQuery.data);
    setActivities(productQuery.data
      .concat(versionQuery.data)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .map((activity, idx, arr) => (
        <ChplActivityDetails
          key={activity.id}
          activity={activity}
          interpret={interpret}
          last={idx === arr.length - 1}
        />
      )));
  }, [productQuery.isError, versionQuery.isError, productQuery.isLoading, versionQuery.isLoading, productQuery.data, versionQuery.data]);

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
            { activities.map((activity) => activity) }
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
