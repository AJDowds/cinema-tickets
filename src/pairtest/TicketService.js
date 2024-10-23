import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketPrices from "./lib/enums/TicketPrices.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  #calculateTicketCounts(ticketTypeRequests) {
    return ticketTypeRequests.reduce(
      (result, ticketTypeRequest) => {
        const ticketType = ticketTypeRequest.getTicketType();
        const noOfTickets = ticketTypeRequest.getNoOfTickets();

        result.total += noOfTickets;

        if (!result[ticketType]) {
          result[ticketType] = 0;
        }

        result[ticketType] += noOfTickets;

        return result;
      },
      { total: 0 }
    );
  }

  #createReceipt(accountId, ticketTypeRequests) {
    const ticketCounts = this.#calculateTicketCounts(ticketTypeRequests);

    let total = 0;
    const breakdown = Object.keys(ticketCounts)
      .filter((type) => type !== "total")
      .reduce((result, type) => {
        const cost = ticketCounts[type] * TicketPrices[type];
        result[type] = cost;
        total += cost;
        return result;
      }, {});

    return {
      accountId,
      breakdown,
      total,
    };
  }

  #checkPurchaseValidity(ticketTypeRequests) {
    if (ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException("No ticket requests provided.");
    }

    const ticketCounts = this.#calculateTicketCounts(ticketTypeRequests);

    if (ticketCounts.total < 1) {
      throw new InvalidPurchaseException(
        "At least one ticket must be purchased."
      );
    }

    if (ticketCounts.total > 25) {
      throw new InvalidPurchaseException(
        "Cannot purchase more than 25 tickets"
      );
    }

    if (!ticketCounts.ADULT) {
      throw new InvalidPurchaseException("There must be an accompanying adult");
    }

    if (ticketCounts.ADULT < ticketCounts.INFANT) {
      throw new InvalidPurchaseException(
        "There must an adult for each infant travelling"
      );
    }
  }

  #reserveSeats(accountId, ticketTypeRequests) {
    const ticketCounts = this.#calculateTicketCounts(ticketTypeRequests);
    const nonInfantSeatsTotal = ticketCounts.total - (ticketCounts.INFANT || 0);

    const seatReservationService = new SeatReservationService();
    seatReservationService.reserveSeat(accountId, nonInfantSeatsTotal);
  }

  #makePayment(accountId, total) {
    const ticketPaymentService = new TicketPaymentService();
    ticketPaymentService.makePayment(accountId, total);
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#checkPurchaseValidity(ticketTypeRequests);

    this.#reserveSeats(accountId, ticketTypeRequests);

    const receipt = this.#createReceipt(accountId, ticketTypeRequests);

    this.#makePayment(accountId, receipt.total);

    return receipt;
  }
}
