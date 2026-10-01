import React, { useEffect, useState } from 'react';
import { func, object } from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {
  useFetchUploadedDeveloper,
} from 'api/pending-listings';

const styles = {
  closeIcon: {
    marginTop: '8px',
  },
  differentValue: {
    backgroundColor: '#e6ea0b20',
  },
  sectionCell: {
    backgroundColor: '#f9f9f9',
    boxShadow: 'rgb(149 157 165 / 10%) 0px 4px 8px',
    fontWeight: 'bold',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
};

function ChplCompareUploadedAndSystemDevelopers(props) {
  const {
    dispatch,
    listing: { id },
    listing: { developer: system },
  } = props;
  const { data, isLoading, isSuccess } = useFetchUploadedDeveloper({ id });
  const [uploaded, setUploaded] = useState(null);

  useEffect(() => {
    setUploaded(data);
  }, [data]);

  const getRowStyles = (a, b) => {
    if (!a && !b) { return undefined; }
    if (a !== b) { return styles.differentValue; }
    return undefined;
  };

  if (isLoading || !isSuccess || !system?.name || !uploaded) { return <CircularProgress />; }

  return (
    <Card>
      <CardHeader
        title="Compare Information"
        action={(
          <IconButton
            variant="contained"
            color="primary"
            onClick={dispatch}
            sx={styles.closeIcon}
            size="large">
            <CloseIcon />
          </IconButton>
)}
      />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.visuallyHidden}>Section</TableCell>
                <TableCell>Existing Developer</TableCell>
                <TableCell>Uploaded Developer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={getRowStyles(system.name, uploaded.name)}
              >
                <TableCell sx={styles.sectionCell} scope="row">Developer Name</TableCell>
                <TableCell>{ system.name }</TableCell>
                <TableCell>{ uploaded.name }</TableCell>
              </TableRow>
              <TableRow
                sx={getRowStyles(system.website, uploaded.website)}
              >
                <TableCell sx={styles.sectionCell} scope="row">Website</TableCell>
                <TableCell>{ system.website }</TableCell>
                <TableCell>{ uploaded.website }</TableCell>
              </TableRow>
              <TableRow
                sx={(system.selfDeveloper !== uploaded.selfDeveloper) ? styles.differentValue : undefined}
              >
                <TableCell sx={styles.sectionCell} scope="row">Self-Developer</TableCell>
                <TableCell>{ system.selfDeveloper ? 'Yes' : 'No' }</TableCell>
                <TableCell>{ uploaded.selfDeveloper === null ? '' : (uploaded.selfDeveloper ? 'Yes' : 'No') }</TableCell>
              </TableRow>
              <TableRow
                sx={getRowStyles(system.address?.line1, uploaded.address?.line1)}
              >
                <TableCell sx={styles.sectionCell} scope="row">Line 1</TableCell>
                <TableCell>{ system.address?.line1 }</TableCell>
                <TableCell>{ uploaded.address?.line1 }</TableCell>
              </TableRow>
              <TableRow
                sx={getRowStyles(system.address?.line2, uploaded.address?.line2)}
              >
                <TableCell sx={styles.sectionCell} scope="row">Line 2</TableCell>
                <TableCell>{ system.address?.line2 }</TableCell>
                <TableCell>{ uploaded.address?.line2 }</TableCell>
              </TableRow>
              <TableRow
                sx={getRowStyles(system.address?.city, uploaded.address?.city)}
              >
                <TableCell sx={styles.sectionCell} scope="row">City</TableCell>
                <TableCell>{ system.address?.city }</TableCell>
                <TableCell>{ uploaded.address?.city }</TableCell>
              </TableRow>
              <TableRow
                sx={getRowStyles(system.address?.state, uploaded.address?.state)}
              >
                <TableCell sx={styles.sectionCell} scope="row">State</TableCell>
                <TableCell>{ system.address?.state }</TableCell>
                <TableCell>{ uploaded.address?.state }</TableCell>
              </TableRow>
              <TableRow
                sx={getRowStyles(system.address?.zipcode, uploaded.address?.zipcode)}
              >
                <TableCell sx={styles.sectionCell} scope="row">Zip</TableCell>
                <TableCell>{ system.address?.zipcode }</TableCell>
                <TableCell>{ uploaded.address?.zipcode }</TableCell>
              </TableRow>
              <TableRow
                sx={getRowStyles(system.address?.country, uploaded.address?.country)}
              >
                <TableCell sx={styles.sectionCell} scope="row">Country</TableCell>
                <TableCell>{ system.address?.country }</TableCell>
                <TableCell>{ uploaded.address?.country }</TableCell>
              </TableRow>
              <TableRow
                sx={getRowStyles(system.contact?.fullName, uploaded.contact?.fullName)}
              >
                <TableCell sx={styles.sectionCell} scope="row">Contact</TableCell>
                <TableCell>{ system.contact?.fullName }</TableCell>
                <TableCell>{ uploaded.contact?.fullName }</TableCell>
              </TableRow>
              <TableRow
                sx={getRowStyles(system.contact?.title, uploaded.contact?.title)}
              >
                <TableCell sx={styles.sectionCell} scope="row">Title</TableCell>
                <TableCell>{ system.contact?.title }</TableCell>
                <TableCell>{ uploaded.contact?.title }</TableCell>
              </TableRow>
              <TableRow
                sx={getRowStyles(system.contact?.email, uploaded.contact?.email)}
              >
                <TableCell sx={styles.sectionCell} scope="row">Email</TableCell>
                <TableCell>{ system.contact?.email }</TableCell>
                <TableCell>{ uploaded.contact?.email }</TableCell>
              </TableRow>
              <TableRow
                sx={getRowStyles(system.contact?.phoneNumber, uploaded.contact?.phoneNumber)}
              >
                <TableCell sx={styles.sectionCell} scope="row">Phone</TableCell>
                <TableCell>{ system.contact?.phoneNumber }</TableCell>
                <TableCell>{ uploaded.contact?.phoneNumber }</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default ChplCompareUploadedAndSystemDevelopers;

ChplCompareUploadedAndSystemDevelopers.propTypes = {
  dispatch: func.isRequired,
  listing: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
