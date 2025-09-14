import { testConnection, query } from "./database/db.js";

(async () => {
  await testConnection();
})();
