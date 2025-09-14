# How to set up the database locally

1. Install PostgreSQL & pgAdmin
Make sure they are downloaded and then find the following data (it can be found in pgAdmin or through command line commands. I recommend looking it up to find them)
- Port (Default is 5432)
- Username (Default is postgres)
- Password (The one set during installation)

- Using that data fill in this string and then put it into a .env file in the **Backend** folder, "DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:PORT/techConnectDB" (The data that needs changes is capitalized)


2. Create the Database locally
- Open pgAdmin -> Connect to server (Usually labeled postgreSQL) -> right click **Databases** -> Click **Create** -> Click **Database** -> Name: **techConnectDB**
- Next click the techConnectDB on the left and go to the SQL tab, then you will run the techConnectCreate.sql code found in the database files
- After this open the terminal and type "**cd backend**", then do npm install. The terminal path should be something like ../tc-capstone/backend.
- run "**npm run dev**", this should show a output similar to "Connect to DB: { now: (*Current Time*)}"

3. Using the Databases
- To run the app using this backend, you need two terminals, one open in the root /tc-capstone, and another in /tc-capstone/backend. This way we can simulate the backend and frontend connecting when run on seperate services.

Now that that is done, you can edit here are what each file does
- backend/database/db.js - This is the original connection to the database. No changes should need to be made here
- backend/index.js - This is what does the initial connection to the database when running the backend. This file is also the initial contact point, so any request to the backend goes here, so add a route to any controllers you create.
- backend/ - This is the folder where the controllers, middleware and backend scripts go.
- database/ - any files database related go here (shouldnt need alot added here as it just acts a bridge for queries)