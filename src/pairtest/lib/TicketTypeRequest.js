import TicketTypes from "./enums/TicketTypes.js";

/**
 * Immutable Object.
 */

export default class TicketTypeRequest {
  #ticketType;
  #noOfTickets;

  constructor(ticketType, noOfTickets) {
    if (!TicketTypes.includes(ticketType)) {
      throw new TypeError(
        `type must be ${TicketTypes.slice(0, -1).join(
          ", "
        )}, or ${TicketTypes.slice(-1)}`
      );
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new TypeError("noOfTickets must be an integer");
    }

    if (noOfTickets < 1) {
      throw new TypeError("noOfTickets must be a positive number");
    }

    this.#ticketType = ticketType;
    this.#noOfTickets = noOfTickets;

    Object.freeze(this);
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#ticketType;
  }
}
