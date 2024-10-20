## ExchangeCar Backend Appication

## How to Run
### Prerequisites
- Node v20

- ```Docker``` installed

- Linux/MacOS, or Windows with WSL2, should have ```make``` installed

### Launch Postgres container
```
make postgres
```

### Create database
```
make createdb
```

### Create unaccent extension for database
```
make unaccent
```

### Seed mock data
*You need to seed mock data from '/docs/mock_data' into database*
```
make seed
```
### Run server 
.env
```
PORT=

POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_DATABASE_NAME=

JWT_ACCESS_TOKEN_EXPIRATION_TIME=
JWT_REFRESH_TOKEN_EXPIRATION_TIME=
OTP_EXPIRY_DURATION=


ADMIN_FIRST_NAME=
ADMIN_LAST_NAME=
ADMIN_PHONE_NUMBER=
ADMIN_EMAIL=
ADMIN_PASSWORD=

HASHING_SALT=

AWS_BUCKET_NAME=
AWS_BUCKET_REGION=
AWS_BUCKER_ACCESS_KEY= 
AWS_BUCKER_SECRET_KEY=

MOMO_PARTNER_CODE=
MOMO_PAYMENT_ACCESS_KEY=
MOMO_PAYMENT_SECRET_KEY=

TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

GROQ_API_KEY=
GROQ_API_KEY_LOCAL=
```

```
make server
```

## Database diagram
![rssagg](./docs/db.svg)

## API appendix

### Authentication & Authorization module
  
|Method|Endpoint|Description| Authentication |
|---|---|---|---|
|POST|/auth/request-otp/sign-up|Request to get OTP to verify user's email| No |
|POST|/auth/sign-up|Sign up| No |
|POST|/auth/sign-in/|Sign in| No |
|POST|/auth/refresh|Refresh access token by using refresh token rotation technique| No |
|POST|/auth/request-otp/reset-password|Request to get password reset code to reset user's password| No |
|POST|/auth/reset-password|Update new password| No |
|POST|/auth/change-password|Update new password| Yes |

### Customer module
|Method|Endpoint|Description| Authentication |
|---|---|---|---|
|POST|/customers/me|Get current customer's information| Yes |

### Post module
|Method|Endpoint|Description| Authentication |
|---|---|---|---|
|POST|/posts/query-table|Get query options for post filtering | No |

## References