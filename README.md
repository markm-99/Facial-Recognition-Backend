# Facial-Recognition-App-backend
This Node.js server code sets up routes for user authentication and registration using Express and bcrypt for hashing passwords. It includes functionality for signing in, registering new users, fetching user profiles, and updating user entries. The code interacts with a mock database to securely store user information, using bcrypt for password hashing and comparison.

Key points:
- Routes are defined for `/signin`, `/register`, `/profile/:id`, and `/image`.
- The `/signin` route compares user input to hashed passwords in the database for authentication.
- The `/register` route creates a new user in the database with a hashed password.
- The `/profile/:id` route fetches a user profile based on the provided ID.
- The `/image` route updates the entry count for a user.
- The code uses bcrypt for password hashing and comparison.
- The server listens on port 3001.
