import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  purchaseTickets(accountId, ...ticketTypeRequests) {
    // validate accountId
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new TypeError('accountId must be a positive integer');
    }

    // tally tickets
    let adultCount = 0;
    let childCount = 0;
    let infantCount = 0;
    let totalCount = 0;

    for (const req of ticketTypeRequests) {
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

    // enforce business rules
    if (totalCount > 25) {
      throw new InvalidPurchaseException('Cannot purchase more than 25 tickets at once');
    }
    if ((childCount > 0 || infantCount > 0) && adultCount === 0) {
      throw new InvalidPurchaseException('Child and Infant tickets require at least one Adult ticket');
    }
    if (infantCount > adultCount) {
      throw new InvalidPurchaseException('Infants cannot exceed number of adults');
    }

    // calculate payment and seats
    const totalAmount = adultCount * 25 + childCount * 15;
    const seatsToReserve = adultCount + childCount;

    // call thirdparty services
    const paymentService = new TicketPaymentService();
    paymentService.makePayment(accountId, totalAmount);

    const reservationService = new SeatReservationService();
    reservationService.reserveSeat(accountId, seatsToReserve);
  }
}
