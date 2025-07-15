# Cinema Tickets

A Node.js solution for the DWP "Cinema Tickets" coding exercise. This project demonstrates a test-driven implementation of a `TicketService` that enforces business rules, calculates payments, and reserves seats via the in-built thirdparty services.

---

## Table of Contents

1. [Overview](#overview)  
2. [Business Rules](#business-rules)  
3. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
4. [Running Tests](#running-tests)  

---

## Overview

This exercise implements:

- **`TicketTypeRequest`** — an immutable object representing a request for a given ticket type and quantity.  
- **`InvalidPurchaseException`** — a custom error for business-rule violations.  
- **`TicketService`** — the core service that:
  1. Validates inputs (account ID, ticket types/counts).  
  2. Enforces business rules.  
  3. Calculates total payment and seats required.  
  4. Delegates payment to `TicketPaymentService`.  
  5. Delegates seat reservation to `SeatReservationService`.  

All code is written in native ES modules and tested with Jest in a strict TDD approach.

---

## Business Rules

1. **Ticket Types & Prices**  
   - **INFANT** — £0 (no seat; sits on adult's lap)  
   - **CHILD**  — £15  
   - **ADULT**  — £25  

2. **Purchase Constraints**  
   - **Maximum 25 tickets** per transaction (sum of adults + children + infants).  
   - **Children & Infants require at least one Adult** in the same request.  
   - **Infants ≤ Adults** (one lap per adult).  
   - **Seats reserved only** for Adults and Children.  

---

## Getting Started

### Prerequisites

- Node.js ≥ 20  
- npm (Node package manager)  

### Installation

```bash
git clone https://github.com/victorgbaye/cinema-tickets.git
cd cinema-tickets
npm install
```

---

## Running Tests

To run the full test suite:

```bash
npm test
```