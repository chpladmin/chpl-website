import compareUser from './users.service';

// Newer user activity: account fields at the top level, status a string
const user = (overrides = {}) => ({
  cognitoId: '00000000-0000-0000-0000-000000000001',
  fullName: 'Pat Doe',
  email: 'pat@example.com',
  role: 'chpl-onc',
  subjectName: 'pat',
  accountLocked: false,
  accountEnabled: true,
  credentialsExpired: false,
  passwordResetRequired: false,
  lastLoggedInDate: 1700000000000,
  hash: 'abc',
  status: 'CONFIRMED',
  ...overrides,
});

// Older user activity: status an object of account fields
const legacyUser = (statusOverrides = {}) => ({
  fullName: 'Pat Doe',
  email: 'pat@example.com',
  status: {
    accountEnabled: true,
    accountLocked: false,
    credentialsExpired: false,
    role: 'chpl-onc',
    status: 'CONFIRMED',
    hash: 'abc',
    lastLoggedInDate: 1700000000000,
    ...statusOverrides,
  },
});

describe('compareUser', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('with status as a string', () => {
    it('reports nothing when the user is unchanged', () => {
      expect(compareUser(user(), user())).toEqual([]);
    });

    it('reports a status change', () => {
      expect(compareUser(user(), user({ status: 'FORCE_CHANGE_PASSWORD' })))
        .toEqual(['Status changed from "CONFIRMED" to "FORCE_CHANGE_PASSWORD"']);
    });

    it('reports the top-level account fields', () => {
      expect(compareUser(user(), user({ role: 'chpl-admin', subjectName: 'pat2', credentialsExpired: true }))).toEqual([
        'Role changed from "chpl-onc" to "chpl-admin"',
        'Subject Name changed from "pat" to "pat2"',
        'Credentials Expired changed from "No" to "Yes"',
      ]);
    });

    it('stays silent on bookkeeping fields', () => {
      expect(compareUser(user(), user({ hash: 'def', lastLoggedInDate: 1800000000000 }))).toEqual([]);
    });

    it('still reports the fields it already handled', () => {
      expect(compareUser(user(), user({ fullName: 'Pat Smith', accountLocked: true }))).toEqual([
        'Full Name changed from "Pat Doe" to "Pat Smith"',
        'Account Locked changed from "No" to "Yes"',
      ]);
    });
  });

  describe('with status as an object', () => {
    it('reports nothing when the user is unchanged', () => {
      expect(compareUser(legacyUser(), legacyUser())).toEqual([]);
    });

    it('lists the nested status changes under a Status heading', () => {
      expect(compareUser(legacyUser(), legacyUser({ accountLocked: true, status: 'FORCE_CHANGE_PASSWORD' }))).toEqual([
        'Status<ul><li>Locked changed from "No" to "Yes"</li><li>Status changed from "CONFIRMED" to "FORCE_CHANGE_PASSWORD"</li></ul>',
      ]);
    });

    it('stays silent on nested bookkeeping fields', () => {
      expect(compareUser(legacyUser(), legacyUser({ hash: 'def', lastLoggedInDate: 1800000000000 }))).toEqual([]);
    });
  });
});
