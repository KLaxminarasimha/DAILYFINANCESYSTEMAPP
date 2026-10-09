# Daily Finance System

A full-stack finance and loan-management application built with a React frontend and Spring Boot microservices. The system supports user registration and OTP verification, authentication, customer profiles, loan-plan eligibility, loan applications, EMI payments, fund management, and transaction reporting.

> **Project note:** This README documents the application structure and workflows. Exact screen fields and API details can vary with the implementation in the repository. Configure secrets through environment variables for any deployment beyond local development.

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Frontend screens and navigation](#frontend-screens-and-navigation)
- [Backend microservices](#backend-microservices)
- [End-to-end workflows](#end-to-end-workflows)
- [Payment workflow](#payment-workflow)
- [Database design](#database-design)
- [API gateway and service discovery](#api-gateway-and-service-discovery)
- [Run locally](#run-locally)
- [Testing with Postman](#testing-with-postman)
- [Security and production considerations](#security-and-production-considerations)

## Features

- User registration, OTP verification, and login
- JWT-based authentication flow
- Customer profile management for employee and business customer types
- Loan plans and eligibility checks based on customer income and available funds
- Loan application and loan-status tracking
- EMI, partial, and advance payment handling
- Fund balance and fund-movement management
- Transaction history and financial summary/reporting
- API gateway routing and service discovery through Consul
- Layered backend design with controllers, service interfaces/implementations, repositories, entities, and DTOs
- Service health checks through Spring Boot Actuator

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios, JavaScript |
| Backend | Java, Spring Boot, Spring MVC, Spring Data JPA, Hibernate |
| Security | Spring Security, password encoding, JWT |
| Microservices | Spring Cloud Gateway, Spring Cloud Consul, Spring Cloud LoadBalancer |
| Service communication | REST APIs using RestTemplate |
| Database | PostgreSQL; service-owned databases |
| Build and API tools | Maven, Git, GitHub, Postman |
| Monitoring | Spring Boot Actuator |

## Architecture

```text
                          CUSTOMER / USER
                                |
                                v
                     +----------------------+
                     | React + Vite UI      |
                     | Router + Axios       |
                     +----------+-----------+
                                |
                                v
                     +----------------------+
                     | API Gateway :9999    |
                     | Gateway routing      |
                     | JWT filter            |
                     +----------+-----------+
                                |
                      Service discovery/routing
                                |
                +---------------+----------------+
                |               |                |
                v               v                v
        +---------------+ +-------------+ +-------------+
        | Auth Service  | | Customer    | | Plan        |
        | :8081         | | Service     | | Service     |
        +-------+-------+ | :8082       | | :8083       |
                |         +------+------+ +------+------+
                v                |               |
           Auth DB                v               v
                            Customer DB        Plan DB

                +---------------+----------------+
                |               |                |
                v               v                v
        +---------------+ +-------------+ +-------------+
        | Loan Service  | | Fund        | | Payment     |
        | :8084         | | Service     | | Service     |
        +-------+-------+ | :8085       | | :8086       |
                |         +------+------+ +------+------+
                v                |               |
             Loan DB             v               v
                               Fund DB        Payment DB
                                                  |
                                                  v
                                        +------------------+
                                        | Transaction /    |
                                        | Report Service   |
                                        | :8087            |
                                        +--------+---------+
                                                 |
                                                 v
                                           Transaction DB

                     Consul service discovery :8500
```

Each microservice owns its business data. Services communicate through APIs rather than directly querying another service's database. The diagram is a logical view: actual runtime call paths depend on the operation.

### Service ports

| Component | Default port |
|---|---:|
| API Gateway | 9999 |
| Auth Service | 8081 |
| Customer Service | 8082 |
| Plan Service | 8083 |
| Loan Service | 8084 |
| Fund Service | 8085 |
| Payment Service | 8086 |
| Transaction / Report Service | 8087 |
| Consul | 8500 |

Ports are the project's documented local setup and may be changed in configuration.

## Frontend screens and navigation

The React frontend is organized around onboarding, customer information, loans, payments, and reporting. The following is a user-flow overview, not a pixel-perfect screenshot of the UI.

```text
+--------------------+
| Login              |
+---------+----------+
          | new user
          v
+--------------------+       +--------------------+
| Register           |------>| Verify OTP         |
+--------------------+       +---------+----------+
                                       |
                                       v
                                +--------------+
                                | Login        |
                                +------+-------+
                                       |
                                       v
                              +------------------+
                              | Dashboard        |
                              +--------+---------+
                                       |
             +-------------------------+-------------------------+
             |                         |                         |
             v                         v                         v
    +----------------+       +----------------+        +----------------+
    | Customer       |       | Plans / Apply   |        | Transactions   |
    | Profile        |       | for Loan        |        | / Reports      |
    +----------------+       +--------+-------+        +----------------+
                                      |
                                      v
                             +------------------+
                             | Loan Dashboard   |
                             | Loan details     |
                             +--------+---------+
                                      |
                                      v
                             +------------------+
                             | Payment Screen   |
                             | EMI / partial /  |
                             | advance payment  |
                             +--------+---------+
                                      |
                                      v
                             +------------------+
                             | Payment result   |
                             +--------+---------+
                                      |
                                      v
                             +------------------+
                             | Transaction      |
                             | history / summary|
                             +------------------+
```

### Screen guide

| Screen / page | Purpose |
|---|---|
| Register | Submit account registration details |
| Verify OTP | Verify the one-time password before account use |
| Login | Authenticate and obtain a JWT |
| Dashboard | Navigate to customer, loan, payment, and transaction areas |
| Create / view profile | Manage customer and income information |
| Employee / Business | Capture customer-type-specific profile information |
| KYC | Enter KYC information where supported |
| Guarantor | Manage guarantor details where supported |
| Plans | View loan plans and eligibility information |
| Apply Loan | Submit a selected loan-plan application |
| Loan Dashboard | View loans, balances, and loan status |
| Payment | Submit EMI, partial, or advance payment |
| Transactions | View recorded financial transactions |
| Dashboard / report summary | Review available financial totals |

Frontend API modules include files such as `src/api/axios.js`, `auth.js`, `loan.js`, `payment.js`, `plan.js`, and `transactions.js` in the documented frontend structure. Refer to the source for the exact current route names and form fields.

## Backend microservices

### 1. API Gateway — port 9999

- Entry point for frontend API requests.
- Routes requests to downstream services using service-discovery names such as `lb://loan-service`.
- Includes a JWT gateway filter that can parse the bearer token and forward the user identifier in an `X-USER-ID` header.
- The current filter should not be described as enforcing authentication on every route: requests without an Authorization header may continue through the chain. Review and tighten route security before production use.

### 2. Auth Service — port 8081

- Registration and login.
- Password hashing/verification through a password encoder.
- OTP creation and expiry validation.
- JWT generation after successful login.
- Authentication-related audit logging.

### 3. Customer Service — port 8082

- Customer profile creation and retrieval.
- Associates customer records with the authenticated user identifier.
- Supports employee/business customer information and income data used by plan eligibility.

### 4. Plan Service — port 8083

- Provides loan plan information.
- Retrieves relevant customer income and available-fund information through service APIs.
- Applies the project's plan eligibility rules.

### 5. Loan Service — port 8084

- Creates and retrieves loan records.
- Tracks disbursed amount, remaining amount, EMI, due/fine amounts, dates, remaining days, and loan status.
- Coordinates with other services for related financial operations.
- A loan generally remains `ACTIVE` while outstanding and becomes `CLOSED` when the remaining amount reaches zero.

### 6. Fund Service — port 8085

- Manages the organization's available fund balance and fund movements.
- Supports operations for loan disbursement and payment-related updates, as well as interest/penalty-related operations where exposed by the API.

### 7. Payment Service — port 8086

- Validates the customer and loan for a payment request.
- Checks that the loan belongs to the customer making the payment.
- Classifies payment as EMI, partial, or advance according to the implemented business rules.
- Coordinates fund and loan updates, persists payment information, and requests transaction recording.

### 8. Transaction / Report Service — port 8087

- Records financial ledger entries separately from loan and payment operational records.
- Supports transaction history and summary reporting.
- In the current business flow, loan disbursement is represented as a debit and customer payments as credits. Any displayed profit/summary is based on the project's implemented calculation, not necessarily a full accounting definition of profit.

## End-to-end workflows

### Registration and login

1. The user opens the React registration screen and submits account details.
2. The frontend calls the backend through the API Gateway.
3. Auth Service validates the request, stores the account with a hashed password, and creates an OTP with an expiry.
4. The user submits the OTP; Auth Service verifies it and marks the account as verified.
5. The user logs in with their credentials.
6. Auth Service validates the password and account status, then returns a JWT.
7. The frontend sends the token as `Authorization: Bearer <token>` on subsequent authenticated requests.

### Customer profile and eligible plans

1. The authenticated user creates or retrieves their customer profile.
2. Customer Service stores the profile and income information.
3. The frontend requests available plans.
4. Plan Service obtains the information it needs from Customer and Fund services.
5. Plan Service applies the configured eligibility checks and returns the plans/results to the frontend.

### Loan application

1. The user selects an eligible plan.
2. The frontend submits the loan application through the gateway.
3. Loan Service validates the customer and plan information.
4. The service creates the loan record and coordinates related fund and transaction operations.
5. The frontend displays the resulting loan information and status.

### Payment workflow

1. The frontend sends a payment request with the loan identifier and amount.
2. Payment Service retrieves the customer and loan information from their services.
3. It checks that the requested loan belongs to the authenticated customer.
4. It classifies the amount using the current payment rules.
5. It coordinates updates with Fund Service and Loan Service.
6. It saves the payment record and asks Transaction Service to record the financial transaction.
7. The frontend displays the payment result and the user can review transaction history.

```text
React Payment Screen
        |
        v
API Gateway
        |
        v
Payment Service
        |
        +----> Customer Service: identify customer
        |
        +----> Loan Service: fetch loan and verify ownership
        |
        +----> Payment calculation: EMI / partial / advance
        |
        +----> Fund Service: update fund balance
        |
        +----> Loan Service: update balance, due, fine, status
        |
        +----> Payment DB: persist payment
        |
        +----> Transaction Service: record ledger entry
        |
        v
Return payment result to frontend
```

### Payment types

- **EMI payment:** the amount matches the configured daily EMI.
- **Partial payment:** the amount is below the configured daily EMI; the current implementation applies its due/penalty rules.
- **Advance payment:** the amount exceeds the configured daily EMI; the implementation applies extra funds against outstanding due/fine/principal according to its business logic.

The exact calculation rules should be verified against the current service implementation before being presented as formal lending or accounting policy.

## Database design

The system follows service-owned database boundaries. The logical data areas are:

| Database area | Typical data |
|---|---|
| Auth DB | User account, password hash, OTP/expiry, verification status |
| Customer DB | Customer profile, customer type, income and profile details |
| Plan DB | Loan plan and plan configuration |
| Loan DB | Loan, disbursed/remaining amounts, EMI, due/fine, dates, status |
| Fund DB | Available organizational funds and fund movements |
| Payment DB | Payment amount, loan/customer identifiers, type, status, date |
| Transaction DB | Financial transaction entries and report data |

The backend uses JPA/Hibernate for persistence and `BigDecimal` for monetary values to avoid the common precision problems associated with binary floating-point types such as `double`.

## API gateway and service discovery

- The React application sends API requests to the gateway.
- Spring Cloud Gateway routes requests to the appropriate microservice.
- Consul provides service discovery; load-balanced service names are used instead of hard-coding every downstream host.
- Services mainly communicate synchronously through REST calls using `RestTemplate`.
- JWT handling and the `X-USER-ID` forwarding header form part of the current request flow; downstream services must still validate authorization and must not blindly trust a client-supplied identity header.

## Run locally

The following is a general startup checklist. Use the repository's actual configuration files and Maven/npm scripts for exact commands and prerequisites.

1. Install a compatible JDK, Maven, Node.js/npm, and PostgreSQL.
2. Configure PostgreSQL databases and credentials for the services.
3. Start Consul on port `8500`.
4. Configure each Spring Boot service's database URL, port, JWT settings, and service-discovery configuration.
5. Start Auth, Customer, Plan, Loan, Fund, Payment, and Transaction services on their configured ports.
6. Install frontend dependencies from the frontend directory with `npm install`.
7. Start the React/Vite development server using the npm script defined in `package.json` (commonly `npm run dev`).
8. Configure the frontend Axios base URL to point to the API Gateway at `http://localhost:9999` for local development.
9. Open the frontend URL printed by Vite and test the flow below.

Do not commit real passwords, JWT secrets, API keys, or production database credentials. Use environment variables or a secrets manager for deployment.

## Testing with Postman

Test the workflow in order so that each step has the identifiers and tokens required by the next step:

1. **Auth:** register → verify OTP → login.
2. **Customer:** create or retrieve the customer profile.
3. **Plans:** retrieve plans and check eligibility.
4. **Loan:** submit a loan application and retrieve loan details.
5. **Payment:** submit a payment for a loan owned by the authenticated customer.
6. **Fund:** verify the resulting fund changes using the available endpoints.
7. **Transactions:** retrieve transaction history and summary information.

Use the route mappings and request DTOs in the current source code as the source of truth for exact URLs, payload fields, and response structures. Include valid JWTs and required headers in requests.

## Security and production considerations

The project is a learning/full-stack microservices application. Before production use, consider:

- Require authentication and authorization explicitly for every protected gateway and service endpoint.
- Validate JWTs consistently; protect identity headers from spoofing and never trust client-provided user IDs.
- Move secrets and database credentials out of source-controlled configuration into environment variables or a secrets manager.
- Add idempotency keys and duplicate-payment protection.
- Handle partial failures across Fund, Loan, Payment, and Transaction services. The current synchronous REST workflow does not provide one atomic database transaction across all these services; consider a Saga and transactional outbox/reliable event approach.
- Consider asynchronous domain events through Kafka for workflows that do not need immediate synchronous completion.
- Add integration tests for failed downstream calls, duplicate requests, and concurrent payments.
- Use Flyway or Liquibase for controlled database migrations rather than relying on automatic schema updates in production.
- Standardize Spring Boot and Spring Cloud dependency versions.
- Add correlation IDs, distributed tracing, centralized logs, metrics, and alerts.
- Define and test financial rules for rounding, due amounts, penalties, reconciliation, and reporting.

## Interview summary

> I built a Daily Finance System with a React frontend and Spring Boot microservices. It covers registration, OTP verification, JWT-based login, customer profiles, plan eligibility, loan applications, EMI payments, fund management, and transaction reporting. The backend is split into Auth, Customer, Plan, Loan, Fund, Payment, and Transaction services, with PostgreSQL databases owned by the individual services. The React app calls the API Gateway, while Consul supports service discovery. Services communicate mainly through REST APIs. A key workflow is payment processing: the Payment Service validates the customer and loan, checks ownership, classifies the payment, coordinates updates with Fund and Loan services, stores the payment, and records the transaction. Important production improvements include idempotency, stronger authorization, secrets management, and reliable handling of cross-service failures.
