const fillCustomFields = (item) => ({
  field1: `Self-developer was: "${item.developer.selfDeveloper ? 'Yes' : 'No'}"`,
  field2: `Submitted Self-developer: "${item.details.selfDeveloper ? 'Yes' : 'No'}"`,
  field3: `Website was: "${item.developer.website}"`,
  field4: `Submitted website: "${item.details.website}"`,
  ...Array(3)
    .fill('')
    .reduce((obj, v, idx) => ({
      ...obj,
      [`field${idx + 5}`]: v,
    }), {}),
});

export default fillCustomFields;
