import React from 'react';
import {
  Box, Card, CardContent, Typography,
} from '@mui/material';
import {
  arrayOf,
  node,
  number,
  oneOfType,
  shape,
  string,
} from 'prop-types';

import { theme } from 'themes';

const styles = {
  card: {
    marginBottom: theme.spacing(1.5),
    transition: theme.transitions.create('box-shadow'),
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  },
  cardContent: {
    padding: theme.spacing(4, 8),
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'stretch',
    flexDirection: 'column',
    '&:last-child': {
      paddingBottom: '16px',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  },
  contentBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    flex: 1,
  },
  detailsRow: {
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: theme.spacing(1.5, 3),
    paddingTop: theme.spacing(1.25),
  },
  field: {
    alignItems: 'flex-start',
    display: 'flex',
    flex: '0 1 auto',
    flexDirection: 'column',
    gap: theme.spacing(0.25),
    minWidth: 0,
  },
  fieldValue: {
    fontSize: '1.1em',
    fontWeight: 400,
    lineHeight: 1.25,
    minWidth: 0,
    '& a': {
      fontSize: '1.1em',
      fontWeight: 700,
    },
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    minWidth: 0,
  },
  primaryRow: {
    alignItems: 'flex-start',
    display: 'flex',
    gap: theme.spacing(1.25, 3.5),
    minWidth: 0,
  },
  fieldLabel: {
    color: theme.palette.text.primary,
    fontSize: '0.85em',
    fontWeight: 600,
    lineHeight: 1.1,
  },
  fieldLabelIcon: {
    alignItems: 'center',
    display: 'inline-flex',
    height: '16px',
    '& button': {
      height: '18px',
      padding: 0,
      width: '18px',
    },
    '& svg': {
      fontSize: '16px',
    },
  },
  fieldLabelRow: {
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(0.5),
    minHeight: '16px',
    paddingTop: theme.spacing(0.25),
  },
  titleField: {
    flex: '1 1 200px',
  },
  titleFieldWide: {
    flex: '1.75 1 320px',
  },
  actionsContainer: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    justifyContent: 'space-between',
    minHeight: '100%',
    [theme.breakpoints.down('lg')]: {
      alignItems: 'stretch',
      width: '100%',
    },
    // actions sit below the details here; lay the buttons out in a row instead of a column
    '@media (min-width: 800px) and (max-width: 1199.95px)': {
      borderTop: `1px solid ${theme.palette.divider}`,
      paddingTop: theme.spacing(1.5),
      '& > *': {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: theme.spacing(1),
        '& > *': {
          flex: 1,
        },
      },
    },
  },
  titleValue: {
    fontSize: '1.35em',
    fontWeight: 700,
    lineHeight: 1.25,
    minWidth: 0,
  },
};

function ChplSearchResultCard({
  cardTitle,
  cardTitleValue,
  titleIconButton = undefined,
  additionalTitleContent = undefined,
  fieldGroups = [],
  actions = undefined,
}) {
  return (
    <Card sx={styles.card}>
      <CardContent sx={styles.cardContent}>
        <Box sx={styles.contentBody}>
          { (cardTitle || cardTitleValue)
            && (
              <Box sx={styles.titleSection}>
                <Box sx={styles.primaryRow}>
                  <Box sx={cardTitle ? styles.titleFieldWide : styles.titleField}>
                    <Box sx={styles.fieldLabelRow}>
                      <Typography sx={styles.fieldLabel}>
                        { cardTitle || 'Product' }
                      </Typography>
                      { titleIconButton
                        && (
                          <Box sx={styles.fieldLabelIcon}>
                            { titleIconButton }
                          </Box>
                        )}
                    </Box>
                    <Typography sx={styles.titleValue}>
                      { cardTitleValue }
                    </Typography>
                  </Box>
                  { additionalTitleContent
                    && (
                      <Box>
                        { additionalTitleContent }
                      </Box>
                    )}
                </Box>
              </Box>
            )}
          { fieldGroups.map((group, groupIndex) => (
            <Box
              key={group.map((f) => f.label).join('-')}
              sx={groupIndex < 2 ? styles.primaryRow : styles.detailsRow}
            >
              { group.map((field) => (
                <Box
                  key={field.label}
                  sx={{ ...styles.field, ...field.style, flex: field.style?.flex ?? '1 1 200px' }}
                >
                  <Box sx={styles.fieldLabelRow}>
                    <Typography sx={styles.fieldLabel}>
                      { field.label }
                    </Typography>
                    { field.iconButton
                      && (
                        <Box sx={styles.fieldLabelIcon}>
                          { field.iconButton }
                        </Box>
                      )}
                  </Box>
                  <Typography sx={styles.fieldValue}>
                    { field.value ?? field.fallback ?? 'N/A' }
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <Box sx={styles.actionsContainer}>
          { actions }
        </Box>
      </CardContent>
    </Card>
  );
}

export default ChplSearchResultCard;

ChplSearchResultCard.propTypes = {
  cardTitle: string,
  cardTitleValue: oneOfType([string, node]),
  titleIconButton: node,
  additionalTitleContent: node,
  fieldGroups: arrayOf(
    arrayOf(
      shape({
        label: string.isRequired,
        value: oneOfType([string, number, node]),
        fallback: string,
        style: shape({}),
        iconButton: node,
      }),
    ),
  ).isRequired,
  actions: node,
};
