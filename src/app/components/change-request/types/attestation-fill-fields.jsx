const getDataElements = (items) => items.sort((a, b) => a.sortOrder - b.sortOrder)
  .map((item) => `${item.name}: ${item.formItems[0].submittedResponses[0].response}`)
  .reduce((obj, item, idx) => ({
    ...obj,
    [`field${idx + 1}`]: item,
  }), {});

const fillCustomFields = (item) => ({
  ...getDataElements(item.form.sectionHeadings),
  field6: item.signature,
  field7: item.signatureEmail,
});

export default fillCustomFields;
