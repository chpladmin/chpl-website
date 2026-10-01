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

  it('describes self-developer changes in both directions', () => {
    // booleans go through comparePrimitive, which treats false as empty
    expect(compareChangeRequest(demographics(), demographics({ selfDeveloper: true })))
      .toEqual(['Details<ul><li>Self-developer added: true</li></ul>']);
    expect(compareChangeRequest(demographics({ selfDeveloper: true }), demographics()))
      .toEqual(['Details<ul><li>Self-developer removed: true</li></ul>']);
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
