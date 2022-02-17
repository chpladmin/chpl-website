const fillCustomFields = (item) => ({
  field1: `Was: "${item.developer.website}"`,
  field2: `Submitted: "${item.details.website}"`,
  ...Array(5)
    .fill('')
    .reduce((obj, v, idx) => ({
      ...obj,
      [`field${idx + 3}`]: v,
    }), {}),
});

export default fillCustomFields;
