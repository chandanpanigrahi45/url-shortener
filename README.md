
# URL Shortener with Analytics Dashboard

A full-stack URL shortener built with Node.js, Express, and EJS. Supports custom aliases, link expiry, QR code generation, and a server-rendered analytics dashboard with click tracking by date, referrer, and device.

## Features

- Shorten any URL, with optional custom alias
- Set link expiry (1 / 7 / 30 / 90 days, or never)
- Auto-generated QR code for every short link
- Redis-cached redirects for low-latency lookups on hot links
- Analytics dashboard: total clicks, clicks-by-day chart, top referrers, device breakdown
- Rate-limited link creation to prevent abuse

## Stack

- **Backend:** Node.js, Express.js
- **Templating:** EJS (server-rendered)
- **Database:** MongoDB (link + click data)
- **Cache:** Redis (short-code → URL lookups)
- **Other:** qrcode, nanoid, ua-parser-js, express-rate-limit

## Running locally with Docker (recommended)

```bash
git clone https://github.com/chandanpanigrahi45/url-shortener.git
cd url-shortener
cp .env.example .env
docker-compose up --build
```

Visit `http://localhost:3000`.


## Project structure

```
url-shortener/
├── config/     
├── models/        
├── routes/        
├── utils/       
├── views/         
├── public/        
├── server.js
├── docker-compose.yml
└── Dockerfile
```

## How it works

1. A user submits a URL (optionally with a custom alias and expiry).
2. The server generates a 7-character short code (or validates the custom alias), saves it to MongoDB, and returns a QR code.
3. On redirect, the server first checks Redis for a cached lookup. On a cache miss, it falls back to MongoDB and warms the cache for next time.
4. Each click is logged asynchronously (referrer, device, browser) so the redirect itself stays fast.
5. The dashboard aggregates click data with MongoDB's aggregation pipeline to show trends over the last 14 days.


