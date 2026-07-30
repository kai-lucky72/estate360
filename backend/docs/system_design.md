# Estate360 — System Design

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐    │
│  │ Browser  │   │ Mobile   │   │ 3rd-party API    │    │
│  │ (Next.js)│   │ (future) │   │ Consumers         │    │
│  └────┬─────┘   └────┬─────┘   └────────┬─────────┘    │
│       │              │                   │              │
└───────┼──────────────┼───────────────────┼──────────────┘
        │              │                   │
        │        ┌─────┴─────────────────────┐
        │        │    Nginx (Reverse Proxy)   │
        │        │  - SSL/TLS termination     │
        │        │  - Static file serving     │
        │        │  - WebSocket upgrade        │
        │        └──────────┬─────────────────┘
        │                   │
┌───────┼───────────────────┼──────────────────────────────┐
│       │      Application Layer                           │
│       │    ┌──────────────┴──────────────┐               │
│       │    │      Daphne (ASGI Server)    │               │
│       │    │  - HTTP requests             │               │
│       │    │  - WebSocket connections     │               │
│       │    └──────────────┬──────────────┘               │
│       │                   │                              │
│       │    ┌──────────────┴──────────────┐               │
│       │    │     Django (ASGI App)        │               │
│       │    │                              │               │
│       │    │  ProtocolTypeRouter          │               │
│       │    │   ├── HTTP → get_asgi_app()  │               │
│       │    │   └── WS   → AuthMiddleware  │               │
│       │    │              └── URLRouter   │               │
│       │    └──────────────────────────────┘               │
└───────┼───────────────────┼──────────────────────────────┘
        │                   │
┌───────┼───────────────────┼──────────────────────────────┐
│       │    Service Layer                                 │
│       │                                                  │
│       │  ┌─────────────┐   ┌─────────────────────┐      │
│       │  │  PostgreSQL │   │      Redis           │      │
│       │  │  - Primary  │   │  - Channels/cache    │      │
│       │  │    data     │   │  - Session store     │      │
│       │  │  - Reliable │   │  - Rate limiting     │      │
│       │  └─────────────┘   └─────────────────────┘      │
│       │                                                  │
└───────┼──────────────────────────────────────────────────┘
```

## 2. Django App Architecture

```
estate360/
│
├── accounts/          # User auth & profiles
├── properties/        # Core domain — property listings
├── agents/             # Agent profiles & assignments
├── tenancy/            # Tenants, leases, rent payments
├── booking/            # Property viewing bookings
├── contracts/          # Digital lease/sale contracts
├── payments/           # Payment processing & records
├── investments/        # Property investment tracking
├── maintenance/        # Maintenance request tracking
├── reviews/            # Property ratings & reviews
├── chat/               # Real-time messaging (WebSocket)
├── notifications/      # In-app notification system
├── analytics/          # Property, agent & investment analytics
├── admin_dashboard/    # Admin-only summary & management
├── core/               # Shared permissions & utilities
├── healthcheck/        # Health check endpoint
└── api/                # Unified API routing
```

## 3. Request Lifecycle

### HTTP Request
```
Browser → Nginx (:80) → Daphne (:8000) → Django ProtocolTypeRouter
                                          → HTTP handler
                                          → Middleware stack
                                          → URL resolver
                                          → View/ViewSet
                                          → Serializer
                                          → Database (PostgreSQL)
                                          → JSON Response
                                          → Nginx → Browser
```

### WebSocket Connection
```
Browser → Nginx (:80, Upgrade) → Daphne (:8000)
                                  → ProtocolTypeRouter
                                  → AuthMiddlewareStack
                                  → URLRouter (ws/chat/)
                                  → ChatConsumer
                                  → Redis Channel Layer (pub/sub)
                                  → Real-time messages
```

## 4. Authentication Flow

```
Client                          Server
  │                                │
  │  POST /api/token/              │
  │  {email, password}             │
  │ ───────────────────────────►   │
  │                                │  Validate credentials
  │                                │  Generate JWT (access + refresh)
  │  {access_token, refresh_token} │
  │ ◄───────────────────────────   │
  │                                │
  │  GET /api/properties/          │
  │  Authorization: Bearer <jwt>   │
  │ ───────────────────────────►   │
  │                                │  Verify JWT signature
  │                                │  Extract user from payload
  │                                │  Check permissions
  │                                │  Return data
  │  {...response...}             │
  │ ◄───────────────────────────   │
```

## 5. Data Flow — Property Listing Lifecycle

```
1. Agent lists property
   └── POST /api/properties/ → Property model created
       └── Notification sent to subscribed users
       └── Analytics record initialized

2. Tenant books viewing
   └── POST /api/bookings/ → Booking model created
       └── Notification sent to agent & tenant
       └── Chat room created for agent↔tenant

3. Tenant signs contract
   └── POST /api/contracts/ → Contract model created
       └── Lease created (tenancy app)
       └── Property status → "rented"

4. Tenant pays rent
   └── POST /api/payments/ → Payment model created
       └── RentPayment recorded (tenancy app)
       └── Notification sent
       └── Analytics updated
```

## 6. Deployment Architecture

| Component | Technology | Port | Scaling |
|-----------|-----------|------|---------|
| Reverse Proxy | Nginx 1.25 | 80/443 | Horizontal |
| ASGI Server | Daphne | 8000 | Horizontal |
| Web Framework | Django 5.2 | — | — |
| Database | PostgreSQL 15 | 5432 | Primary/Replica |
| Cache/Channel | Redis 7 | 6379 | Cluster |
| Frontend | Next.js 16 | 3000 | Vercel/Static |

## 7. Security Architecture

- **JWT Authentication** — Short-lived access tokens + refresh tokens
- **Rate Limiting** — Per-user and per-anon throttles (env configurable)
- **CORS** — Whitelist-based origin control
- **Permission Classes** — 5 custom permissions (IsAdminOrReadOnly, IsOwner, IsAdminOnly, IsOwnerOrAdmin, IsAgent)
- **Environment Isolation** — All secrets via env vars, never in code
- **Docker Network Isolation** — Only Nginx exposed to host; DB/Redis internal
- **Cookie Security** — HTTPOnly, Secure in production
