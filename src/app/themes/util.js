const util = {
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
  },
  fullWidth: {
    gridColumnEnd: -1,
  },
  fullWidthGridRow: {
    gridColumn: '1 / -1',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  infoIcon: {
    float: 'right',
  },
  infoIconColor: {
    color: '#156dac',
  },
  linkWrap: {
    overflowWrap: 'anywhere',
  },
  removedText: {
    fontStyle: 'italic',
  },
};

export default util;
