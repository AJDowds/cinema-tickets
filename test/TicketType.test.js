import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

test("Ticket types are correct", () => {
  const validTicketTypes = ["ADULT", "CHILD", "INFANT"];

  validTicketTypes.forEach((type) => {
    const tickets = new TicketTypeRequest(type, 2);
    expect(tickets.getTicketType()).toBe(type);
  });
});

test("Ticket numbers are correct", () => {
  const validTicketTypes = ["ADULT", "CHILD", "INFANT"];
  const numOfTickets = 2;

  validTicketTypes.forEach((type) => {
    const tickets = new TicketTypeRequest(type, numOfTickets);
    expect(tickets.getNoOfTickets()).toBe(numOfTickets);
  });
});

test("Throws error on invalid ticket type", () => {
  expect(() => {
    new TicketTypeRequest("INVALID_TYPE", 2);
  }).toThrow("type must be ADULT, CHILD, or INFANT");
});

test("Throws error if noOfTickets is not an integer", () => {
  expect(() => {
    new TicketTypeRequest("ADULT", 2.5);
  }).toThrow("noOfTickets must be an integer");

  expect(() => {
    new TicketTypeRequest("ADULT", "two");
  }).toThrow("noOfTickets must be an integer");
});
