import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';

describe('InvalidPurchaseException', () => {
  test('is an instance of Error', () => {
    const err = new InvalidPurchaseException('Bad purchase');
    expect(err).toBeInstanceOf(Error);
  });

  test('retains the message passed to constructor', () => {
    const msg = 'Too many tickets';
    const err = new InvalidPurchaseException(msg);
    expect(err.message).toBe(msg);
  });

  test('sets name to "InvalidPurchaseException"', () => {
    const err = new InvalidPurchaseException('Oops');
    expect(err.name).toBe('InvalidPurchaseException');
  });
});
