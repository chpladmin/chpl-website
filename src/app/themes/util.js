const util = {
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  deleteButtonOutlined: {
    border: '1px solid #c44f65',
    backgroundColor: '#ffffff',
    color: '#c44f65',
    '&:hover': {
      backgroundColor: '#c44f6525',
      color: '#c44f65',
    },
  },
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'inset rgb(30 36 42 / 2%) -16px 0px 16px 0px',
    backgroundColor: '#f9f9f9',
    zIndex: 1,
    overflowWrap:'anywhere', 
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
  noWrap: {
    whiteSpace: 'nowrap',
  },
  removedText: {
    fontStyle: 'italic',
  },
  oneThirdWidth: {
    width: '33%',
  },
  halfWidth: {
    width: '50%',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
};

export default util;
