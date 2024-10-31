# CodeSangam


## Client Setup

The client-side of the CodeSangam platform is built using React. To run the client locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ContriHUB/CodeSangam.git
   ```

2. Navigate to the client folder:

   ```bash
   cd client
   ```

3. Create a `.env` file for the client and add the following environment variables:
   ```bash
   REACT_APP_BASE_URL=<your_base_url>
   PORT=<your_port>
   ```
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the client:
   ```bash
   npm start
   ```
   The client will now be running on `http://localhost:<PORT>/<REACT_APP_BASE_URL>`.

## Server Setup

The server-side of CodeSangam is responsible for handling API requests, user authentication, and other backend functionality. To run the server locally, follow these steps:

1. Navigate to the server folder:

   ```bash
   cd server
   ```

2. Create a `.env` file for the server with the following environment variables:

   ```bash
   PORT=<port_number>

   # OAuth
   CLIENT_ID=<your_client_id>
   CLIENT_SECRET=<your_client_secret>
   REDIRECT_URL=<your_redirect_url>

   # Configs
   BASE_URL=<base url>
   REGISTRATION_DEADLINE=<registration_deadline>
   DECLARE_RESULT=<result_declaration_date>

   # Secrets
   SESSION_SECRET=<your_session_secret>
   DB_URL=<your_database_url>
   CONTRI_DB_URL=<db connection url>
   ```

   - `PORT`: The port number where the server will run.
   - OAuth variables (`CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URL`): Used for authentication with OAuth.
   - `BASE_URL`: The base path for API routes.
   - `REGISTRATION_DEADLINE` and `DECLARE_RESULT`: Dates for event registration deadline and result declaration.
   - `SESSION_SECRET`: Used for securing user sessions.
   - `DB_URL`: Database URL for the event.
   - `CONTRI_DB_URL`: Connection string for the internal database.

3. Install dependencies:

   ```bash
   make
   ```

4. Run the server:
   ```bash
   make run
   ```

The server will now be running on `http://localhost:<PORT>/<BASE_URL>`.
