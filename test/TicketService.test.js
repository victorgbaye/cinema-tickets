import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  jest
} from '@jest/globals';

import TicketService from '../src/pairtest/TicketService.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';

describe('TicketService.purchaseTickets (with DI)', () => {
  let paymentMock;
  let reservationMock;
  let service;

  beforeEach(() => {
    // Create fresh mocks for each test
    paymentMock = { makePayment: jest.fn() };
    reservationMock = { reserveSeat: jest.fn() };

    // Inject mocks into the service
    service = new TicketService(paymentMock, reservationMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('throws TypeError for invalid accountId', () => {
    [0, -5, 1.2].forEach(id => {
      expect(() => service.purchaseTickets(id)).toThrow(TypeError);
    });
  });

  test('throws InvalidPurchaseException if total tickets > 25', () => {
    const requests = [
      new TicketTypeRequest('ADULT', 20),
      new TicketTypeRequest('CHILD', 6),
    ];
    expect(() => service.purchaseTickets(1, ...requests))
      .toThrow(InvalidPurchaseException);
  });

  test('throws InvalidPurchaseException if child without adult', () => {
    expect(() =>
      service.purchaseTickets(1, new TicketTypeRequest('CHILD', 1))
    ).toThrow(InvalidPurchaseException);
  });

  test('throws InvalidPurchaseException if infant without adult', () => {
    expect(() =>
      service.purchaseTickets(1, new TicketTypeRequest('INFANT', 2))
    ).toThrow(InvalidPurchaseException);
  });

  test('throws InvalidPurchaseException if infants exceed adults', () => {
    const requests = [
      new TicketTypeRequest('ADULT', 1),
      new TicketTypeRequest('INFANT', 2),
    ];
    expect(() => service.purchaseTickets(123, ...requests))
      .toThrow(InvalidPurchaseException);
  });

  test('calls makePayment and reserveSeat on valid purchase', () => {
    const requests = [
      new TicketTypeRequest('ADULT', 2),
      new TicketTypeRequest('CHILD', 3),
      new TicketTypeRequest('INFANT', 1),
    ];

    service.purchaseTickets(42, ...requests);

    // Payment: 2×25 + 3×15 = £95
    expect(paymentMock.makePayment).toHaveBeenCalledWith(42, 95);

    // Seats reserved: 2 adults + 3 children = 5
    expect(reservationMock.reserveSeat).toHaveBeenCalledWith(42, 5);
  });
});
