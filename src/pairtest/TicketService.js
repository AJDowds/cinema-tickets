export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    console.log("!!accountId", accountId);
    console.log("!!ticketTypeRequests", ticketTypeRequests);

    // throws InvalidPurchaseException
  }
}
