🍽️ Restaurant Table Reservation API

A RESTful backend API for managing restaurant table reservations.
Built as part of a Backend Engineer Pre-Interview Exercise to demonstrate backend design, business logic handling, and API best practices.

📌 Overview

This project implements a restaurant table reservation system that allows:

Managing restaurants and tables

Creating, updating, and cancelling reservations

Preventing double bookings

Enforcing restaurant operating hours

Handling table capacity constraints

Managing waitlists when no tables are available

Suggesting optimized seating for party sizes

The system is designed to reflect real-world restaurant constraints and focuses on correctness, clarity, and maintainability.


🛠️ Tech Stack

Node.js

Express.js

Prisma ORM

MySQL

Jest + Supertest (testing)

Vercel (deployment)

Note: TypeScript, Redis, and Docker were not used.
Instead, emphasis was placed on business logic, data integrity, and API design.

src/
├── controllers/
│   ├── restaurant.controller.js
│   ├── table.controller.js
│   ├── reservation.controller.js
│   └── waitlist.controller.js
├── routes/
│   ├── restaurant.routes.js
│   ├── table.routes.js
│   ├── reservation.routes.js
│   └── waitlist.routes.js
├── prisma/
│   ├── schema.prisma
│   └── client.js
├── services/
│   └── availability.service.js
├── utils/
│   └── time.utils.js
├── tests/
│   └── reservation.test.js
└── app.js

🧩 Database Design
Key Entities

Restaurant

Name

Opening & closing hours (stored as integers, e.g. 10 → 10 AM)

Table

Unique table number per restaurant

Seating capacity

Reservation

Start and end time

Status (PENDING, CONFIRMED, COMPLETED, CANCELLED)

Waitlist

Captures unmet reservation requests

Design Decisions

startTime and endTime are stored explicitly to simplify overlap checks

Operating hours are stored as integers to avoid timezone complexity

Reservations are never deleted, only cancelled (audit safety)

Tables cannot be deleted if they have active reservations




⚠️ Known Limitations
No User Authentication
Anyone can create/delete restaurants or reservations (intentional for scope).
Basic Time Slot Calculation
Available slots endpoint not implemented (core requirement partially met via reservation validation).
No Pagination
Large result sets (e.g., reservations) are returned in full.
Static Peak Hours
Peak hours are hardcoded; not configurable per restaurant.


🌐 API Endpoints

🏨 Restaurant APIs

https://table-reservation-alpha.vercel.app/api/v1/restaurants/create 

https://table-reservation-alpha.vercel.app/api/v1/restaurants/getRestaurants 

https://table-reservation-alpha.vercel.app/api/v1/restaurants/getRestaurants/:id 

https://table-reservation-alpha.vercel.app/api/v1/restaurants/updateRestaurants/:id 

https://table-reservation-alpha.vercel.app/api/v1/restaurants/deleteRestaurants/:id

🪑 Table APIs

https://table-reservation-alpha.vercel.app/api/v1/tables/createTable 

https://table-reservation-alpha.vercel.app/api/v1/tables/getTables 

https://table-reservation-alpha.vercel.app/api/v1/tables/tables/:id 

https://table-reservation-alpha.vercel.app/api/v1/tables/updateTables/:id 

https://table-reservation-alpha.vercel.app/api/v1/tables/deleteTables/:id


Reservation API Endpoints:

https://table-reservation-alpha.vercel.app/api/v1/reservations/createReservation

https://table-reservation-alpha.vercel.app/api/v1/reservations/updateReservation/:id 

https://table-reservation-alpha.vercel.app/api/v1/reservations/deleteReservation/:id 

Get WaitList Api 

https://table-reservation-alpha.vercel.app/api/v1/waitlist/restaurants/:restaurantId

🛠️ Setup Instructions
Prerequisites
Node.js v18+
PostgreSQL database (Neon, Supabase, or local)
Vercel account (for deployment)
Local Development


1️⃣ Clone Repository
git clone https://github.com/isholah360/table-reservation
cd table-reservation

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables
create .env and add your suitable realtional database 
DATABASE_URL="mysql://user:password@localhost:3306/table_reservation"

4️⃣ Prisma Setup
npx prisma migrate dev
npx prisma generate

5️⃣ Start Server
npm run dev


🔮 What I Would Improve With More Time

Redis caching for availability checks

Role-based access (admin vs staff)

Pagination for reservations

Bulk table creation

Background jobs for notifications

Dockerized deployment

Load testing for peak hours

🌐 Scaling for Multiple Restaurants
This system is designed to scale horizontally:

Database: Partition by restaurantId for high-volume scenarios
Caching: Add Redis to cache table availability during peak hours
Asynchronous Processing: Offload notifications to queues (e.g., BullMQ)
Multi-Region Deployment: Deploy Vercel instances per geographic region with localized DBs
The current UUID-based relationships and stateless API design make it trivial to support thousands of restaurants without code changes.

Note 

For your local api 

🌐 API Endpoints

🏨 Restaurant APIs

/api/v1/restaurants/create 

/api/v1/restaurants/getRestaurants 

/api/v1/restaurants/getRestaurants/:id 

/api/v1/restaurants/updateRestaurants/:id

/api/v1/restaurants/deleteRestaurants/:id

🪑 Table APIs

/api/v1/tables/createTable 

/api/v1/tables/getTables 

/api/v1/tables/tables/:id 

/api/v1/tables/updateTables/:id 

/api/v1/tables/deleteTables/:id

Reservation API Endpoints:

/api/v1/reservations/createReservation

/api/v1/reservations/updateReservation/:id

/api/v1/reservations/deleteReservation/:id

Get WaitList Api

/api/v1/waitlist/restaurants/:restaurantId
