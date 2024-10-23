# Business Rules

- [x] There are 3 types of tickets i.e. Infant, Child, and Adult.
- [x] The ticket prices are based on the type of ticket (see table below).
- [x] The ticket purchaser declares how many and what type of tickets they want to buy.
- [x] Multiple tickets can be purchased at any given time.
- [x] Only a maximum of 25 tickets that can be purchased at a time.
- [x] Infants do not pay for a ticket and are not allocated a seat. They will be sitting on an Adult's lap.
- [x] Inferred: There must be an adult for each infant attending (each infant needs to be able to sit on an adults lap)
- [x] Child and Infant tickets cannot be purchased without purchasing an Adult ticket.
- There is an existing `TicketPaymentService` responsible for taking payments.
- There is an existing `SeatReservationService` responsible for reserving seats.

## Constraints

- [x] The TicketService interface CANNOT be modified.
- [x] The code in the thirdparty.\* packages CANNOT be modified.
- [x] The `TicketTypeRequest` MUST be an immutable object.

## Assumptions

You can assume:

- All accounts with an id greater than zero are valid. They also have sujicient funds to pay for any no of tickets.
- The `TicketPaymentService` implementation is an external provider with no defects. You do not need to worry about how the actual payment happens.
- The payment will always go through once a payment request has been made to the `TicketPaymentService`.
- The `SeatReservationService` implementation is an external provider with no defects. You do not need to worry about how the seat reservation algorithm works.
- The seat will always be reserved once a reservation request has been made to the `SeatReservationService`.

## Your Task

Provide a working implementation of a `TicketService` that:

- Considers the above objective, business rules, constraints & assumptions.
- Calculates the correct amount for the requested tickets and makes a payment request to the `TicketPaymentService`.
- Calculates the correct no of seats to reserve and makes a seat reservation request to the `SeatReservationService`.
- Rejects any invalid ticket purchase requests. It is up to you to identify what should be deemed as an invalid purchase request.”
