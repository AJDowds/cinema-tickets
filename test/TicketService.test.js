import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import TicketService from "../src/pairtest/TicketService.js";
// Potential shape of receipt that will be created by purchaseTickets
// {
//   accountId: number,
//   breakdown: { adult: number, child: number, infant: number },
//   total: number
// }

test("Receipt contains the correct account ID", () => {
  const adultTicket = new TicketTypeRequest("ADULT", 1);

  const ticketService = new TicketService();

  const result = ticketService.purchaseTickets(12345, adultTicket);

  expect(result.accountId).toBe(12345);
});

test("Single ticket costs are correct", () => {
  const adultTicket = new TicketTypeRequest("ADULT", 1);
  const childTicket = new TicketTypeRequest("CHILD", 1);
  const infantTicket = new TicketTypeRequest("INFANT", 1);

  const ticketService = new TicketService();

  const result = ticketService.purchaseTickets(
    12345,
    adultTicket,
    childTicket,
    infantTicket
  );

  expect(result.breakdown.adult).toBe(25);
  expect(result.breakdown.child).toBe(15);
  expect(result.breakdown.infant).toBe(0);
});

test("Total cost is correct", () => {
  const adultTicket = new TicketTypeRequest("ADULT", 2);
  const childTicket = new TicketTypeRequest("CHILD", 2);
  const infantTicket = new TicketTypeRequest("INFANT", 2);

  const ticketService = new TicketService();

  const result = ticketService.purchaseTickets(
    12345,
    adultTicket,
    childTicket,
    infantTicket
  );

  expect(result.total).toBe(80);
});

test("Child and infant tickets require an adult", () => {
  const childTicket = new TicketTypeRequest("CHILD", 1);
  const infantTicket = new TicketTypeRequest("INFANT", 1);

  const ticketService = new TicketService();

  expect(() => {
    ticketService.purchaseTickets(12345, childTicket, infantTicket);
  }).toThrow("Child and infant tickets cannot be purchased without an adult");
});

test("Maximum of 25 tickets can be purchased", () => {
  const adultTicket = new TicketTypeRequest("ADULT", 26);

  const ticketService = new TicketService();

  expect(() => {
    ticketService.purchaseTickets(12345, adultTicket);
  }).toThrow("Cannot purchase more than 25 tickets");
});
