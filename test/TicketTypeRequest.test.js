import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest'

describe('TicketTypeRequest', () => {
  test('returns correct type and count', () => {
    const req = new TicketTypeRequest('ADULT', 3);
    expect(req.getTicketType()).toBe('ADULT');
    expect(req.getNoOfTickets()).toBe(3);
  });

  test('throws for invalid type', () => {
    expect(() => new TicketTypeRequest('VETRAN', 1))
      .toThrow(TypeError);
  });

  test('throws for non-integer count', () => {
    expect(() => new TicketTypeRequest('ADULT', 1.5))
      .toThrow(TypeError);
  });
});
