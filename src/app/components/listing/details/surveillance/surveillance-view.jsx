import { useState } from 'react';
import surveillance from '../../../../shared/prop-types/surveillance';

const useStyles = makeStyles(() => ({
  iconSpacing: {
    marginLeft: '4px',
  },
  unindentedData: {
    marginLeft: '-25px',
  },
}));

function ChplSurveillanceView(props) {
  const surveillance = useState(props.surveillance)[0];

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Surveillance Table">
        <TableHead>
          <TableRow>
            <TableCell
              style={{ width: '33%' }}
            >
              Attribute
            </TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key="additionalSoftware">
            <TableCell component="th" scope="row">
              Date Surveillance Began
              <ChplTooltip title="The date surveillance was initiated">
                <InfoOutlinedIcon
                  className={classes.iconSpacing}
                />
              </ChplTooltip>
            </TableCell>
            <TableCell>{ surveillance.startDate }</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ChplSurveillanceView.propTypes = {
  surveillance,
};
