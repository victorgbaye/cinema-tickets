import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import { PRICES, MAX_TICKETS } from '../config.js';

export default class TicketService {
  constructor(paymentService, reservationService) {
    this.paymentService = paymentService;
    this.reservationService = reservationService;
  }

  purchaseTickets(accountId, ...ticketRequests) {
    // validate accountId
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new TypeError('accountId must be a positive integer');
    }

    if (ticketRequests.length === 0) {
      return;
    }

    // total tickets
    let adultCount = 0;
    let childCount = 0;
    let infantCount = 0;
    let totalCount = 0;

    for (const req of ticketRequests) {
      if (!(req instanceof TicketTypeRequest)) {
        throw new TypeError('Invalid ticket request');
      }
      const type = req.getTicketType();
      const count = req.getNoOfTickets();
      totalCount += count;
      if (type === 'ADULT') adultCount += count;
      else if (type === 'CHILD') childCount += count;
      else if (type === 'INFANT') infantCount += count;
    }

    // business rules
    if (totalCount > MAX_TICKETS) {
      throw new InvalidPurchaseException(
        `Cannot purchase more than ${MAX_TICKETS} tickets at once`
      );
    }
    if ((childCount > 0 || infantCount > 0) && adultCount === 0) {
      throw new InvalidPurchaseException(
        'Child and Infant tickets require at least one Adult ticket'
      );
    }
    if (infantCount > adultCount) {
      throw new InvalidPurchaseException(
        'Infants cannot exceed number of adults'
      );
    }

    // calculate payment and seats
    const totalAmount =
      adultCount * PRICES.ADULT + childCount * PRICES.CHILD + infantCount * PRICES.INFANT;
    const seatsToReserve = adultCount + childCount;

    // delegate to injected services
    this.paymentService.makePayment(accountId, totalAmount);
    this.reservationService.reserveSeat(accountId, seatsToReserve);
  }
}
