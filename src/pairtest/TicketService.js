import TicketPrices from "./lib/enums/TicketPrices.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  calculateTotalCost(ticketTypeRequests) {
    return ticketTypeRequests.reduce((total, ticketTypeRequest) => {
      const ticketType = ticketTypeRequest.getTicketType();
      const noOfTickets = ticketTypeRequest.getNoOfTickets();
      return total + TicketPrices[ticketType] * noOfTickets;
    }, 0);
  }

  createReceipt(accountId, ticketTypeRequests) {
    const breakdown = {
      adult: 0,
      child: 0,
      infant: 0,
    };

    ticketTypeRequests.forEach((ticketTypeRequest) => {
      const ticketType = ticketTypeRequest.getTicketType();
      const noOfTickets = ticketTypeRequest.getNoOfTickets();

      switch (ticketType) {
        case "ADULT":
          breakdown.adult += noOfTickets * TicketPrices.ADULT;
          break;
        case "CHILD":
          breakdown.child += noOfTickets * TicketPrices.CHILD;
          break;
        case "INFANT":
          breakdown.infant += noOfTickets * TicketPrices.INFANT;
          break;
      }
    });

    const total = this.calculateTotalCost(ticketTypeRequests);

    return {
      accountId,
      breakdown,
      total,
    };
  }

  checkPurchaseValidity(ticketTypeRequests) {
    const totals = ticketTypeRequests.reduce(
      (total, ticketTypeRequest) => {
        const ticketType = ticketTypeRequest.getTicketType();
        const noOfTickets = ticketTypeRequest.getNoOfTickets();

        total.total += noOfTickets;
        total[ticketType] += noOfTickets;

        return total;
      },
      { total: 0, ADULT: 0, CHILD: 0, INFANT: 0 }
    );

    if (totals.total > 25) {
      throw new InvalidPurchaseException(
        "Cannot purchase more than 25 tickets"
      );
    }

    if (!totals.ADULT) {
      throw new InvalidPurchaseException("There must be an accompanying adult");
    }

    if (totals.ADULT < totals.INFANT) {
      throw new InvalidPurchaseException(
        "There must an adult for each infant travelling"
      );
    }
  }

  //TODO
  reserveSeats(ticketTypeRequests) {}

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.checkPurchaseValidity(ticketTypeRequests);

    const receipt = this.createReceipt(accountId, ticketTypeRequests);

    return receipt;
  }
}
