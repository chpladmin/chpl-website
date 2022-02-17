const getDataElements = (items) => items.sort((a, b) => a.attestation.sortOrder - b.attestation.sortOrder)
  .map((item) => `${item.attestation.condition.name}: ${item.response.response}`)
  .reduce((obj, item, idx) => ({
    ...obj,
    [`field${idx + 1}`]: item,
  }), {});

const fillCustomFields = (item) => ({
  ...getDataElements(item.attestationResponses),
  field6: item.signature,
  field7: item.signatureEmail,
});

export default fillCustomFields;
