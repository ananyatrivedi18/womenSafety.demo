# ---------------------------------------------------------------------------
# SheShield environment variables
# Copy this file to ".env" (in the same /backend folder) and fill in values.
# The .env file is read by the "dotenv" package when the server starts.
# ---------------------------------------------------------------------------

# The port the Express server listens on.
PORT=5000

# Secret string used to sign and verify JWT tokens.
# Use a long, random value in a real project. NEVER commit your real secret.
JWT_SECRET=replace_this_with_a_long_random_secret_string

# How long a login token stays valid (examples: "1h", "2d", "7d").
JWT_EXPIRES_IN=2d
