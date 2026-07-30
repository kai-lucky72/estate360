# Estate360 — Database Design

## 1. Entity-Relationship Overview

```
┌───────────┐     ┌──────────────┐     ┌──────────────┐
│   User    │◄────│  Property    │────►│ PropertyImage│
│(accounts) │1:N  │(properties)  │1:N  │              │
└─────┬─────┘     └──────┬───────┘     └──────────────┘
      │                  │
      │1:1               │1:1
      │                  │
┌─────┴──────┐  ┌───────┴────────┐
│Agent       │  │PropertyAnalytics│
│(agents)    │  │(analytics)     │
└─────┬──────┘  └────────────────┘
      │
      │1:N
      │
┌─────┴──────────┐
│AgentProperty   │
│Assignment      │
└────────────────┘

┌───────────┐     ┌───────────┐     ┌─────────────┐
│   User    │◄────│  Booking  │────►│  Contract   │
│ (tenant)  │1:N  │ (booking) │1:1  │ (contracts) │
└───────────┘     └───────────┘     └──────┬──────┘
      │                                     │
      │1:1                                  │1:1
      │                                     │
┌─────┴──────┐                     ┌────────┴───────┐
│  Tenant    │◄────────────────────│     Lease      │
│ (tenancy)  │1:N                  │   (tenancy)    │
└─────┬──────┘                     └────────┬───────┘
      │                                     │
      │1:N                                  │1:N
      │                                     │
┌─────┴──────────┐                 ┌────────┴────────┐
│  RentPayment   │                 │  Payment        │
│  (tenancy)     │                 │  (payments)     │
└────────────────┘                 └────────┬────────┘
                                            │
      ┌─────────────────────────────────────┘
      │1:N
┌─────┴──────────┐
│  Investment    │
│ (investments)  │
└────────────────┘

┌───────────┐     ┌──────────────┐
│ChatRoom   │◄────│   Message    │
│(chat)     │1:N  │   (chat)     │
└─────┬─────┘     └──────────────┘
      │
      │M:N (participants)
      │
┌─────┴─────┐
│   User    │
└───────────┘

┌───────────┐     ┌──────────────────┐
│   User    │◄────│  Notification    │
│(recipient)│1:N  │  (notifications) │
└───────────┘     └──────────────────┘

┌───────────┐     ┌───────────────────┐
│ Property  │◄────│  Review           │
│           │1:N  │  (reviews)        │
└───────────┘     └───────────────────┘

┌───────────┐     ┌──────────────────────┐
│ Property  │◄────│ MaintenanceRequest   │
│           │1:N  │ (maintenance)        │
└───────────┘     └──────────────────────┘
```

## 2. Complete Table Schema

### 2.1 accounts_user

Stores all platform users (tenants, owners, agents, admins, investors).

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| password | VARCHAR(128) | NOT NULL |
| last_login | TIMESTAMP | NULLABLE |
| is_superuser | BOOLEAN | NOT NULL, default=false |
| username | VARCHAR(150) | UNIQUE, NOT NULL |
| first_name | VARCHAR(150) | NOT NULL, default='' |
| last_name | VARCHAR(150) | NOT NULL, default='' |
| email | VARCHAR(254) | UNIQUE, NOT NULL |
| is_staff | BOOLEAN | NOT NULL, default=false |
| is_active | BOOLEAN | NOT NULL, default=true |
| date_joined | TIMESTAMP | NOT NULL |
| phone | VARCHAR(20) | NULLABLE |
| profile_image | VARCHAR(100) | NULLABLE |
| role | VARCHAR(20) | NOT NULL, choices: admin/agent/owner/tenant/investor |
| is_verified | BOOLEAN | NOT NULL, default=false |
| date_of_birth | DATE | NULLABLE |
| address | VARCHAR(255) | NULLABLE |

**Indexes**: username (unique), email (unique), role

---

### 2.2 properties_property

Core domain entity — each row is a property listing.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| owner_id | BIGINT | FK → accounts_user.id, NOT NULL |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NULLABLE |
| category | VARCHAR(20) | NOT NULL, choices: apartment/house/villa/land/office |
| location | VARCHAR(255) | NOT NULL |
| price | NUMERIC(14,2) | NOT NULL |
| size_sqft | INTEGER | NULLABLE |
| status | VARCHAR(20) | NOT NULL, default='available', choices: available/booked/rented/sold |
| main_image | VARCHAR(100) | NULLABLE |
| date_added | TIMESTAMP | NOT NULL, auto_now_add |

**Indexes**: owner_id (FK), status, category, price, date_added

---

### 2.3 properties_propertyimage

Gallery images for a property.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| property_id | BIGINT | FK → properties_property.id, CASCADE |
| image | VARCHAR(100) | NOT NULL |
| caption | VARCHAR(255) | NULLABLE |

**Indexes**: property_id (FK)

---

### 2.4 properties_propertydocument

Documents attached to a property (e.g., title deed, floor plan).

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| property_id | BIGINT | FK → properties_property.id, CASCADE |
| file | VARCHAR(100) | NOT NULL |
| name | VARCHAR(100) | NOT NULL |

**Indexes**: property_id (FK)

---

### 2.5 agents_agent

Agent profiles, linked 1:1 to User.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| user_id | BIGINT | FK → accounts_user.id, UNIQUE, CASCADE |
| bio | TEXT | NULLABLE |
| license_number | VARCHAR(100) | UNIQUE, NOT NULL |
| phone | VARCHAR(20) | NULLABLE |
| profile_image | VARCHAR(100) | NULLABLE |
| verified | BOOLEAN | NOT NULL, default=false |
| rating | NUMERIC(3,2) | NOT NULL, default=0.00 |

**Indexes**: user_id (unique FK), license_number (unique)

---

### 2.6 agents_agentpropertyassignment

Many-to-many link between agents and properties.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| agent_id | BIGINT | FK → agents_agent.id, CASCADE |
| property_id | BIGINT | FK → properties_property.id, CASCADE |
| assigned_on | TIMESTAMP | auto_now_add |
| active | BOOLEAN | NOT NULL, default=true |

**Unique Constraint**: (agent_id, property_id)

---

### 2.7 agents_commission

Commission earned by agents on property transactions.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| agent_id | BIGINT | FK → agents_agent.id, CASCADE |
| property_id | BIGINT | FK → properties_property.id, CASCADE |
| amount | NUMERIC(10,2) | NOT NULL |
| date_earned | TIMESTAMP | auto_now_add |
| paid | BOOLEAN | NOT NULL, default=false |

**Indexes**: agent_id (FK), property_id (FK)

---

### 2.8 tenancy_tenant

Tenant profiles, linked 1:1 to User.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| user_id | BIGINT | FK → accounts_user.id, UNIQUE, CASCADE |
| phone_number | VARCHAR(20) | NOT NULL |
| id_number | VARCHAR(50) | UNIQUE, NOT NULL |
| emergency_contact | VARCHAR(100) | NULLABLE |
| move_in_date | DATE | NULLABLE |

**Indexes**: user_id (unique FK), id_number (unique)

---

### 2.9 tenancy_lease

Lease agreements between property owners and tenants.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| property_id | BIGINT | FK → properties_property.id, CASCADE |
| tenant_id | BIGINT | FK → tenancy_tenant.id, CASCADE |
| contract_id | BIGINT | FK → contracts_contract.id, SET_NULL, NULLABLE |
| start_date | DATE | NOT NULL |
| end_date | DATE | NOT NULL |
| rent_amount | NUMERIC(12,2) | NOT NULL |
| security_deposit | NUMERIC(12,2) | NOT NULL, default=0 |
| active | BOOLEAN | NOT NULL, default=true |

**Indexes**: property_id (FK), tenant_id (FK), active, start_date, end_date

---

### 2.10 tenancy_rentpayment

Rent payments made against a lease.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| lease_id | BIGINT | FK → tenancy_lease.id, CASCADE |
| payment_date | DATE | auto_now_add |
| amount_paid | NUMERIC(12,2) | NOT NULL |
| receipt_number | VARCHAR(50) | UNIQUE, NOT NULL |
| payment_method | VARCHAR(30) | NOT NULL, choices: cash/bank/mobile |
| verified | BOOLEAN | NOT NULL, default=false |

**Indexes**: lease_id (FK), receipt_number (unique), payment_date

---

### 2.11 booking_booking

Property viewing bookings / appointment scheduling.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| property_id | BIGINT | FK → properties_property.id, CASCADE |
| client_id | BIGINT | FK → accounts_user.id, CASCADE |
| agent_id | BIGINT | FK → accounts_user.id, SET_NULL, NULLABLE |
| scheduled_date | DATE | NOT NULL |
| scheduled_time | TIME | NULLABLE |
| status | VARCHAR(20) | NOT NULL, default='pending', choices: pending/approved/rejected/completed/cancelled |
| notes | TEXT | NULLABLE |
| created_at | TIMESTAMP | auto_now_add |

**Indexes**: property_id (FK), client_id (FK), agent_id (FK), status, scheduled_date

---

### 2.12 contracts_contract

Digital contracts for property transactions (rent or sale).

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| booking_id | BIGINT | FK → booking_booking.id, UNIQUE, CASCADE |
| property_id | BIGINT | FK → properties_property.id, CASCADE |
| client_id | BIGINT | FK → accounts_user.id, CASCADE |
| agent_id | BIGINT | FK → accounts_user.id, SET_NULL, NULLABLE |
| start_date | DATE | NOT NULL |
| end_date | DATE | NOT NULL |
| rent_amount | NUMERIC(12,2) | NOT NULL |
| terms | TEXT | NOT NULL |
| client_signed | BOOLEAN | NOT NULL, default=false |
| agent_signed | BOOLEAN | NOT NULL, default=false |
| status | VARCHAR(20) | NOT NULL, default='draft', choices: draft/active/terminated/completed |
| created_at | TIMESTAMP | auto_now_add |

**Indexes**: booking_id (unique FK), property_id (FK), client_id (FK), agent_id (FK), status

---

### 2.13 payments_payment

Payment records for all transaction types.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| payer_id | BIGINT | FK → accounts_user.id, SET_NULL, NULLABLE |
| payment_type | VARCHAR(20) | NOT NULL, choices: rent/investment/contract/other |
| amount | NUMERIC(12,2) | NOT NULL |
| payment_method | VARCHAR(20) | NOT NULL, choices: cash/bank/mobile/card |
| reference | VARCHAR(100) | UNIQUE, NOT NULL |
| date | TIMESTAMP | auto_now_add |
| verified | BOOLEAN | NOT NULL, default=false |
| notes | TEXT | NULLABLE |
| lease_id | BIGINT | FK → tenancy_lease.id, SET_NULL, NULLABLE |
| investment_id | BIGINT | FK → investments_investment.id, SET_NULL, NULLABLE |
| contract_id | BIGINT | FK → contracts_contract.id, SET_NULL, NULLABLE |

**Indexes**: payer_id (FK), reference (unique), payment_type, date, lease_id (FK), investment_id (FK), contract_id (FK)

---

### 2.14 investments_investment

Property investment records.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| investor_id | BIGINT | FK → accounts_user.id, CASCADE |
| property_id | BIGINT | FK → properties_property.id, CASCADE |
| amount_invested | NUMERIC(14,2) | NOT NULL |
| share_percentage | NUMERIC(5,2) | NULLABLE |
| roi_estimate | NUMERIC(7,2) | NULLABLE |
| created_at | TIMESTAMP | auto_now_add |

**Indexes**: investor_id (FK), property_id (FK)

---

### 2.15 maintenance_maintenancerequest

Maintenance/repair requests for properties.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| property_id | BIGINT | FK → properties_property.id, CASCADE |
| requester_id | BIGINT | FK → accounts_user.id, CASCADE |
| description | TEXT | NOT NULL |
| status | VARCHAR(20) | NOT NULL, default='pending', choices: pending/in_progress/completed/cancelled |
| assigned_to_id | BIGINT | FK → accounts_user.id, SET_NULL, NULLABLE |
| created_at | TIMESTAMP | auto_now_add |
| resolved_at | TIMESTAMP | NULLABLE |

**Indexes**: property_id (FK), requester_id (FK), assigned_to_id (FK), status

---

### 2.16 reviews_review

Property ratings and reviews.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| reviewer_id | BIGINT | FK → accounts_user.id, CASCADE |
| property_id | BIGINT | FK → properties_property.id, CASCADE |
| rating | SMALLINT | NOT NULL, default=5 |
| comment | TEXT | NULLABLE |
| created_at | TIMESTAMP | auto_now_add |

**Indexes**: reviewer_id (FK), property_id (FK), rating

---

### 2.17 chat_chatroom

Chat rooms for agent-tenant communication.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| name | VARCHAR(255) | UNIQUE, NOT NULL |
| property_id | BIGINT | FK → properties_property.id, SET_NULL, NULLABLE |
| created_at | TIMESTAMP | auto_now_add |

**Indexes**: name (unique), property_id (FK)

**M2M**: participants → accounts_user (chatroom_participants join table)

---

### 2.18 chat_message

Individual messages within chat rooms.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| room_id | BIGINT | FK → chat_chatroom.id, SET_NULL, NULLABLE |
| sender_id | BIGINT | FK → accounts_user.id, CASCADE |
| content | TEXT | NOT NULL |
| is_read | BOOLEAN | NOT NULL, default=false |
| timestamp | TIMESTAMP | auto_now_add |

**Indexes**: room_id (FK), sender_id (FK), timestamp

---

### 2.19 notifications_notification

In-app notifications for all platform events.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| recipient_id | BIGINT | FK → accounts_user.id, CASCADE |
| sender_id | BIGINT | FK → accounts_user.id, SET_NULL, NULLABLE |
| title | VARCHAR(255) | NOT NULL |
| message | TEXT | NOT NULL |
| notification_type | VARCHAR(30) | NOT NULL, choices: payment/booking/contract/maintenance/system/message/investment/alert |
| is_read | BOOLEAN | NOT NULL, default=false |
| timestamp | TIMESTAMP | NOT NULL, default=now() |
| related_object_id | VARCHAR(255) | NULLABLE |
| related_app | VARCHAR(100) | NULLABLE |

**Indexes**: recipient_id (FK), sender_id (FK), notification_type, is_read, timestamp

---

### 2.20 analytics_propertyanalytics

Aggregated analytics per property.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| property_id | BIGINT | FK → properties_property.id, UNIQUE, CASCADE |
| views | INTEGER | NOT NULL, default=0 |
| inquiries | INTEGER | NOT NULL, default=0 |
| favorites | INTEGER | NOT NULL, default=0 |
| average_rating | FLOAT | NOT NULL, default=0.0 |
| last_updated | TIMESTAMP | auto_now |

**Indexes**: property_id (unique FK), views, average_rating

---

### 2.21 analytics_agentperformance

Aggregated performance metrics per agent.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| agent_id | BIGINT | FK → agents_agent.id, UNIQUE, CASCADE |
| total_sales | NUMERIC(12,2) | NOT NULL, default=0.00 |
| total_rentals | INTEGER | NOT NULL, default=0 |
| client_satisfaction | FLOAT | NOT NULL, default=0.0 |
| response_time | FLOAT | NOT NULL, default=0.0 (hours) |
| ranking_score | FLOAT | NOT NULL, default=0.0 |
| updated_at | TIMESTAMP | auto_now |

**Indexes**: agent_id (unique FK)

---

### 2.22 analytics_investmenttrend

ROI trend tracking for investments.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| investment_id | BIGINT | FK → investments_investment.id, CASCADE |
| investor_id | BIGINT | FK → accounts_user.id, CASCADE |
| trend_type | VARCHAR(50) | NOT NULL, choices: growth/decline/stable |
| roi_percentage | FLOAT | NOT NULL, default=0.0 |
| trend_date | TIMESTAMP | auto_now_add |

**Indexes**: investment_id (FK), investor_id (FK), trend_date

---

### 2.23 admin_dashboard_dashboardstat

Daily platform statistics for the admin dashboard.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| date | DATE | NOT NULL |
| total_users | INTEGER | NOT NULL, default=0 |
| total_properties | INTEGER | NOT NULL, default=0 |
| total_contracts | INTEGER | NOT NULL, default=0 |
| total_payments | NUMERIC(12,2) | NOT NULL, default=0 |

**Unique Constraint**: (date)
**Indexes**: date (unique)

---

### 2.24 admin_dashboard_systemlog

Audit log of admin actions.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| actor_id | BIGINT | FK → accounts_user.id, SET_NULL, NULLABLE |
| action | VARCHAR(255) | NOT NULL |
| details | TEXT | NULLABLE |
| timestamp | TIMESTAMP | auto_now_add |

**Indexes**: actor_id (FK), action, timestamp

---

### 2.25 admin_dashboard_systemreport

Snapshot report of overall platform health.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, auto-increment |
| total_users | INTEGER | NOT NULL, default=0 |
| total_properties | INTEGER | NOT NULL, default=0 |
| total_revenue | NUMERIC(16,2) | NOT NULL, default=0 |
| updated_at | TIMESTAMP | auto_now |

---

## 3. Relationship Summary

| # | From | To | Type | Via |
|---|------|----|------|-----|
| 1 | User | Agent | 1:1 | agents_agent.user_id |
| 2 | User | Tenant | 1:1 | tenancy_tenant.user_id |
| 3 | User | Property | 1:N | properties_property.owner_id |
| 4 | User | Booking (client) | 1:N | booking_booking.client_id |
| 5 | User | Booking (agent) | 1:N | booking_booking.agent_id |
| 6 | User | Contract (client) | 1:N | contracts_contract.client_id |
| 7 | User | Contract (agent) | 1:N | contracts_contract.agent_id |
| 8 | User | Payment | 1:N | payments_payment.payer_id |
| 9 | User | Maintenance (requester) | 1:N | maintenance_maintenancerequest.requester_id |
| 10 | User | Maintenance (assignee) | 1:N | maintenance_maintenancerequest.assigned_to_id |
| 11 | User | Investment | 1:N | investments_investment.investor_id |
| 12 | User | Review | 1:N | reviews_review.reviewer_id |
| 13 | User | Notification (recipient) | 1:N | notifications_notification.recipient_id |
| 14 | User | Notification (sender) | 1:N | notifications_notification.sender_id |
| 15 | User | ChatRoom | M:N | chat_chatroom.participants |
| 16 | User | Message | 1:N | chat_message.sender_id |
| 17 | Property | PropertyImage | 1:N | properties_propertyimage.property_id |
| 18 | Property | PropertyDocument | 1:N | properties_propertydocument.property_id |
| 19 | Property | PropertyAnalytics | 1:1 | analytics_propertyanalytics.property_id |
| 20 | Property | AgentPropertyAssignment | 1:N | agents_agentpropertyassignment.property_id |
| 21 | Property | Commission | 1:N | agents_commission.property_id |
| 22 | Property | Lease | 1:N | tenancy_lease.property_id |
| 23 | Property | Booking | 1:N | booking_booking.property_id |
| 24 | Property | Contract | 1:N | contracts_contract.property_id |
| 25 | Property | MaintenanceRequest | 1:N | maintenance_maintenancerequest.property_id |
| 26 | Property | Investment | 1:N | investments_investment.property_id |
| 27 | Property | Review | 1:N | reviews_review.property_id |
| 28 | Agent | AgentPropertyAssignment | 1:N | agents_agentpropertyassignment.agent_id |
| 29 | Agent | Commission | 1:N | agents_commission.agent_id |
| 30 | Agent | AgentPerformance | 1:1 | analytics_agentperformance.agent_id |
| 31 | Booking | Contract | 1:1 | contracts_contract.booking_id |
| 32 | Contract | Lease | 1:1 | tenancy_lease.contract_id |
| 33 | Contract | Payment | 1:N | payments_payment.contract_id |
| 34 | Lease | RentPayment | 1:N | tenancy_rentpayment.lease_id |
| 35 | Lease | Payment | 1:N | payments_payment.lease_id |
| 36 | Investment | Payment | 1:N | payments_payment.investment_id |
| 37 | Investment | InvestmentTrend | 1:N | analytics_investmenttrend.investment_id |
| 38 | ChatRoom | Message | 1:N | chat_message.room_id |

## 4. Indexing Strategy

- **All FK columns** — Indexed for JOIN performance
- **All unique columns** — Unique index for referential integrity
- **Frequently filtered columns** — status, date, role, payment_type, notification_type, is_read, verified
- **Sort columns** — date_added, created_at, timestamp, payment_date (for ORDER BY)
- **Composite unique constraints** — (agent_id, property_id) on AgentPropertyAssignment, (date) on DashboardStat

## 5. Referential Integrity

| Rule | Applied To |
|------|-----------|
| CASCADE | Core relationships (user→profile, property→images, etc.) |
| SET_NULL | Soft references (contract.agent, maintenance.assigned_to, payment.payer) |
| PROTECT | Not used (CASCADE preferred for data cleanup) |

## 6. Total Tables: 25
