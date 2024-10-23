import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import TicketService from "../src/pairtest/TicketService.js";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";

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

  expect(result.breakdown.ADULT).toBe(25);
  expect(result.breakdown.CHILD).toBe(15);
  expect(result.breakdown.INFANT).toBe(0);
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
  }).toThrow("There must be an accompanying adult");
});

test("There must an adult for each infant travelling", () => {
  const adultTicket = new TicketTypeRequest("ADULT", 1);
  const infantTicket = new TicketTypeRequest("INFANT", 2);

  const ticketService = new TicketService();

  expect(() => {
    ticketService.purchaseTickets(12345, adultTicket, infantTicket);
  }).toThrow("There must an adult for each infant travelling");
});

test("No ticket requetes provided", () => {
  const ticketService = new TicketService();

  expect(() => {
    ticketService.purchaseTickets(12345);
  }).toThrow("No ticket requests provided.");
});

test("Maximum of 25 tickets can be purchased", () => {
  const maximumAccepted = new TicketTypeRequest("ADULT", 25);
  const maximumExceeded = new TicketTypeRequest("ADULT", 26);

  const ticketService = new TicketService();

  expect(() => {
    ticketService.purchaseTickets(12345, maximumAccepted);
  }).not.toThrow();

  expect(() => {
    ticketService.purchaseTickets(12345, maximumExceeded);
  }).toThrow("Cannot purchase more than 25 tickets");
});

test("Infant not allocated a seat", () => {
  const adultTicket = new TicketTypeRequest("ADULT", 1);
  const childTicket = new TicketTypeRequest("CHILD", 1);
  const infantTicket = new TicketTypeRequest("INFANT", 1);

  const ticketService = new TicketService();

  const seatReservationServiceSpy = jest.spyOn(
    SeatReservationService.prototype,
    "reserveSeat"
  );
  ticketService.purchaseTickets(12345, adultTicket, childTicket, infantTicket);
  expect(seatReservationServiceSpy).toHaveBeenCalledWith(12345, 2);
});
