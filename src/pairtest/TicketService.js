import TicketPrices from "./lib/enums/TicketPrices.js";
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
  purchaseTickets(accountId, ...ticketTypeRequests) {
    console.log("!!accountId", accountId);
    console.log("!!ticketTypeRequests", ticketTypeRequests);
    const receipt = this.createReceipt(accountId, ticketTypeRequests);

    return receipt;

    // throws InvalidPurchaseException
  }
}
