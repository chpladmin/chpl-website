import compareChangeRequest from './change-requests.service';

const demographics = (overrides = {}) => ({
  details: {
    selfDeveloper: false,
    website: 'https://old.example.com',
    contact: {
      fullName: 'Pat Doe',
      email: 'pat@old.example.com',
      phoneNumber: '555-0100',
    },
    // line2 is optional and never an empty string. The key is always present,
    // and its value is undefined when it isn't set.
    address: {
      line1: '1 Main St',
      line2: undefined,
      city: 'Springfield',
      state: 'IL',
      zipcode: '62701',
      country: 'USA',
    },
    ...overrides,
  },
});

describe('compareChangeRequest', () => {
  it('reports nothing when the change request is unchanged', () => {
    expect(compareChangeRequest(demographics(), demographics())).toEqual([]);
  });

  it('describes changes to top level demographics fields', () => {
    const [message] = compareChangeRequest(
      demographics(),
      demographics({ website: 'https://new.example.com' }),
    );

    expect(message).toBe('Details<ul><li>Website changed from "https://old.example.com" to "https://new.example.com"</li></ul>');
  });

  it.each([
    [false, true, 'Self-developer changed from "No" to "Yes"'],
    [true, false, 'Self-developer changed from "Yes" to "No"'],
    [undefined, true, 'Self-developer set to "Yes"'],
    [undefined, false, 'Self-developer set to "No"'],
    [true, undefined, 'Self-developer cleared (was "Yes")'],
    [false, undefined, 'Self-developer cleared (was "No")'],
  ])('describes self-developer going from %p to %p', (before, after, expected) => {
    expect(compareChangeRequest(
      demographics({ selfDeveloper: before }),
      demographics({ selfDeveloper: after }),
    )).toEqual([`Details<ul><li>${expected}</li></ul>`]);
  });

  it('nests contact changes under a Contact heading', () => {
    const before = demographics();
    const after = demographics({
      contact: {
        fullName: 'Pat Q. Doe',
        email: 'pat@new.example.com',
        phoneNumber: '555-0199',
      },
    });

    expect(compareChangeRequest(before, after)).toEqual([
      'Details<ul><li>Contact<ul>'
        + '<li>Full Name changed from "Pat Doe" to "Pat Q. Doe"</li>'
        + '<li>Email changed from "pat@old.example.com" to "pat@new.example.com"</li>'
        + '<li>Phone Number changed from "555-0100" to "555-0199"</li>'
        + '</ul></li></ul>',
    ]);
  });

  it('nests address changes under an Address heading', () => {
    const before = demographics();
    const after = demographics({
      address: {
        line1: '2 Main St',
        city: 'Shelbyville',
        state: 'IN',
        zipcode: '46176',
        country: 'United States',
      },
    });

    expect(compareChangeRequest(before, after)).toEqual([
      'Details<ul><li>Address<ul>'
        + '<li>Street Line 1 changed from "1 Main St" to "2 Main St"</li>'
        + '<li>City changed from "Springfield" to "Shelbyville"</li>'
        + '<li>State changed from "IL" to "IN"</li>'
        + '<li>Zipcode changed from "62701" to "46176"</li>'
        + '<li>Country changed from "USA" to "United States"</li>'
        + '</ul></li></ul>',
    ]);
  });

  describe('the optional street line 2', () => {
    const withLine2 = (line2) => {
      const cr = demographics();
      cr.details.address.line2 = line2;
      return cr;
    };
    const line2Message = (message) => [`Details<ul><li>Address<ul><li>${message}</li></ul></li></ul>`];

    it('reports it being added', () => {
      expect(compareChangeRequest(demographics(), withLine2('Suite 5')))
        .toEqual(line2Message('Street Line 2 added: Suite 5'));
    });

    it('reports it being removed', () => {
      expect(compareChangeRequest(withLine2('Suite 5'), demographics()))
        .toEqual(line2Message('Street Line 2 removed: Suite 5'));
    });

    it('reports it being changed', () => {
      expect(compareChangeRequest(withLine2('Suite 5'), withLine2('Suite 6')))
        .toEqual(line2Message('Street Line 2 changed from "Suite 5" to "Suite 6"'));
    });

    it('reports nothing while it stays unset', () => {
      expect(compareChangeRequest(demographics(), demographics())).toEqual([]);
    });
  });

  it('ignores fields that have no lookup entry', () => {
    const debug = jest.spyOn(console, 'debug').mockImplementation(() => {});

    expect(compareChangeRequest(
      demographics({ unmappedField: 'before' }),
      demographics({ unmappedField: 'after' }),
    )).toEqual([]);
    expect(debug).toHaveBeenCalledWith(expect.stringContaining('root.details.unmappedField'));

    debug.mockRestore();
  });
});

describe('compareChangeRequest for attestations', () => {
  // the shape of a real attestation change request, with question text shortened
  const response = (id, text) => ({
    id, message: null, response: text, sortOrder: null,
  });
  const COMPLIANT = response(1, 'Compliant');
  const NONCOMPLIANT = response(2, 'Noncompliant');
  const NOT_UNDER_CAP = response(6, 'Not under a CAP');
  const UNDER_OPEN_CAP = response(7, 'Under an open CAP');
  const COMPLETED_CAP = response(8, 'Completed a CAP during the specified Attestation Period');

  const section = (id, name, sortOrder, submitted, followUp) => ({
    id,
    name,
    sortOrder,
    formItems: [{
      id: id * 10,
      parentResponse: null,
      question: { id, question: `Do you comply with ${name}?` },
      required: true,
      sortOrder: 1,
      submittedResponses: submitted,
      childFormItems: [{
        childFormItems: [],
        id: (id * 10) + 1,
        parentResponse: NONCOMPLIANT,
        question: { id: 6, question: 'For a selection of "Noncompliant", please indicate the status of a CAP' },
        required: false,
        sortOrder: 1,
        submittedResponses: followUp,
      }],
    }],
  });

  const attestation = (sectionHeadings) => ({
    changeRequestType: { id: 3, name: 'Developer Attestation Change Request' },
    details: {
      attestationPeriod: { id: 11, description: 'Tenth Period' },
      form: {
        id: 5, description: 'Attestation Period', instructions: 'Select one response', sectionHeadings,
      },
      signature: 'Developer User',
      signatureEmail: 'developer@example.com',
    },
  });

  const expectChanges = (sections) => [
    `Details<ul><li>Attestations Submission<ul><li>Attestations changes<ul>${sections
      .map(([name, changes]) => `<li>${name} changes<ul>${changes.map((c) => `<li>${c}</li>`).join('')}</ul></li>`)
      .join('')}</ul></li></ul></li></ul>`,
  ];

  it('describes changed answers and follow-up answers for each section, in form order', () => {
    // sections arrive out of order, as they do from the API
    const before = attestation([
      section(5, 'Application Programming Interfaces', 4, [NONCOMPLIANT], [UNDER_OPEN_CAP, NOT_UNDER_CAP]),
      section(2, 'Assurances', 2, [NONCOMPLIANT], [NOT_UNDER_CAP]),
      section(4, 'Real World Testing', 5, [NONCOMPLIANT], [COMPLETED_CAP, UNDER_OPEN_CAP]),
      section(3, 'Communications', 3, [COMPLIANT], []),
      section(1, 'Information Blocking', 1, [COMPLIANT], []),
    ]);
    const after = attestation([
      section(5, 'Application Programming Interfaces', 4, [NONCOMPLIANT], [NOT_UNDER_CAP]),
      section(2, 'Assurances', 2, [COMPLIANT], []),
      section(4, 'Real World Testing', 5, [COMPLIANT], []),
      section(3, 'Communications', 3, [NONCOMPLIANT], [NOT_UNDER_CAP, UNDER_OPEN_CAP]),
      section(1, 'Information Blocking', 1, [NONCOMPLIANT], [NOT_UNDER_CAP]),
    ]);

    expect(compareChangeRequest(before, after)).toEqual(expectChanges([
      ['Information Blocking', [
        'Response changed from "Compliant" to "Noncompliant"',
        'Follow-up response for "Noncompliant" added: Not under a CAP',
      ]],
      ['Assurances', [
        'Response changed from "Noncompliant" to "Compliant"',
        'Follow-up response for "Noncompliant" removed: Not under a CAP',
      ]],
      ['Communications', [
        'Response changed from "Compliant" to "Noncompliant"',
        'Follow-up response for "Noncompliant" added: Not under a CAP',
        'Follow-up response for "Noncompliant" added: Under an open CAP',
      ]],
      ['Application Programming Interfaces', [
        'Follow-up response for "Noncompliant" removed: Under an open CAP',
      ]],
      ['Real World Testing', [
        'Response changed from "Noncompliant" to "Compliant"',
        'Follow-up response for "Noncompliant" removed: Completed a CAP during the specified Attestation Period',
        'Follow-up response for "Noncompliant" removed: Under an open CAP',
      ]],
    ]));
  });

  it('reports nothing when no answers changed', () => {
    const form = () => attestation([
      section(1, 'Information Blocking', 1, [NONCOMPLIANT], [NOT_UNDER_CAP, UNDER_OPEN_CAP]),
      section(3, 'Communications', 3, [COMPLIANT], []),
    ]);

    expect(compareChangeRequest(form(), form())).toEqual([]);
  });

  it('ignores the order of multiple-choice answers', () => {
    const before = attestation([section(1, 'Information Blocking', 1, [NONCOMPLIANT], [NOT_UNDER_CAP, UNDER_OPEN_CAP])]);
    const after = attestation([section(1, 'Information Blocking', 1, [NONCOMPLIANT], [UNDER_OPEN_CAP, NOT_UNDER_CAP])]);

    expect(compareChangeRequest(before, after)).toEqual([]);
  });

  it('only lists the sections that changed', () => {
    const before = attestation([
      section(1, 'Information Blocking', 1, [COMPLIANT], []),
      section(3, 'Communications', 3, [COMPLIANT], []),
    ]);
    const after = attestation([
      section(1, 'Information Blocking', 1, [COMPLIANT], []),
      section(3, 'Communications', 3, [NONCOMPLIANT], []),
    ]);

    expect(compareChangeRequest(before, after)).toEqual(expectChanges([
      ['Communications', ['Response changed from "Compliant" to "Noncompliant"']],
    ]));
  });
});
