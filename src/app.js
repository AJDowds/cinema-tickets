import TicketTypeRequest from "./pairtest/lib/TicketTypeRequest.js";
import TicketService from "./pairtest/TicketService.js";

const ticketService = new TicketService();

const adultTickets = new TicketTypeRequest("ADULT", 2);
const childTickets = new TicketTypeRequest("CHILD", 2);
const infantTickets = new TicketTypeRequest("INFANT", 2);

try {
  const result = ticketService.purchaseTickets(
    12345,
    adultTickets,
    childTickets,
    infantTickets
  );

  console.log("!!result", result);
} catch (error) {
  console.error(error.message);
}
