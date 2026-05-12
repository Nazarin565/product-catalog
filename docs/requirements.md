# Requirements

## Backend

Build two microservices:

### Products service (port 3000)

- Expose three REST endpoints:
  - Create a product (`id`, `name`, `description`, `price`)
  - Delete a product
  - List products with pagination
- Publish an event to the Notifications service via a message broker on every write operation (create / delete)

### Notifications service (port 3001)

- Consume and log messages received from the Products service

## Frontend

Build a client-side application:

- Display a paginated list of products
- Provide a "Create Product" button that opens a dialog with a creation form
- Allow deleting a product with a confirmation dialog

## Technical requirements

- Write all code in TypeScript
- Use NestJS as the backend framework
- Use PostgreSQL as the database
- Manage the database schema via migrations using Drizzle ORM
- Use a message broker for inter-service communication (AWS SQS via LocalStack)
- Build the frontend with Next.js (App Router)
