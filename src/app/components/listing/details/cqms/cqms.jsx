import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { arrayOf, bool } from 'prop-types';

import { ChplTooltip } from 'components/util';
import { getCqmDisplayValue, sortCqms } from 'services/cqms.service';
import {
  certificationEdition,
  cqm as cqmType,
} from 'shared/prop-types';
import { utilStyles } from 'themes';

const styles = {
  helperText: {
    padding: '16px 0',
  },
  disabledRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  tableScrolling: {
    overflowX: 'auto',
    width: '100%',
  },
};

function ChplCqms({ cqms, edition: initialEdition = undefined, viewAll: initialViewAll }) {
  const [viewAll, setViewAll] = useState(false);
  const [edition, setEdition] = useState(undefined);

  useEffect(() => {
    setEdition(initialEdition);
    setViewAll(initialViewAll);
  }, [initialEdition, initialViewAll]);

  const getCriteriaCells = (cqm) => [1, 2, 3, 4].map((num) => {
    const meets = cqm.criteria.find((crit) => crit.certificationNumber === `170.315 (c)(${num})`);
    return (
      <TableCell key={num}>
        <Box component="span" sx={utilStyles.srOnly}>
          { meets ? 'meets' : 'does not meet' }
          170.315 (c)(
          {num}
          )
        </Box>
        { meets ? <CheckIcon fontSize="large" /> : <NotInterestedIcon color="disabled" fontSize="large" /> }
      </TableCell>
    );
  });

  return (
    <>
      { (edition === null || edition?.name === '2015')
        && (
          <Typography sx={styles.helperText}>
            Note 170.315 (c)(3) has two versions, so please check the criterion in the “Certification Criteria” section above to determine which version applies here.
          </Typography>
        )}
      <Card sx={styles.tableScrolling}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{ edition !== null && edition?.name === '2011' ? 'Meets' : 'Version' }</TableCell>
              <TableCell>Quality Measure</TableCell>
              { (edition === null || edition?.name === '2015')
              && (
                <>
                  <TableCell>170.315 (c)(1)</TableCell>
                  <TableCell>170.315 (c)(2)</TableCell>
                  <TableCell>170.315 (c)(3)</TableCell>
                  <TableCell>170.315 (c)(4)</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            { cqms.filter((cqm) => viewAll || cqm.success)
              .sort(sortCqms)
              .map((cqm) => (
                <TableRow
                  key={cqm.id ?? cqm.cmsId}
                  sx={[!cqm.success && styles.disabledRow]}
                >
                  <TableCell>
                    <Box component="span" sx={utilStyles.srOnly}>{ cqm.success ? 'meets' : 'does not meet' }</Box>
                    { edition?.name !== null && edition?.name === '2011' && cqm.success
                      && (
                        <CheckIcon fontSize="large" />
                      )}
                    { cqm.successVersions?.length > 0 && cqm.successVersions.join(', ') }
                  </TableCell>
                  <TableCell>
                    <ChplTooltip title={cqm.description ?? 'unknown'}>
                      <Typography>
                        { getCqmDisplayValue(cqm) }
                        :
                        {' '}
                        { cqm.title ?? 'unknown' }
                      </Typography>
                    </ChplTooltip>
                  </TableCell>
                  { (edition === null || edition?.name === '2015') && getCriteriaCells(cqm) }
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}

export default ChplCqms;

ChplCqms.propTypes = {
  cqms: arrayOf(cqmType).isRequired,
  edition: certificationEdition,
  viewAll: bool.isRequired,
};
