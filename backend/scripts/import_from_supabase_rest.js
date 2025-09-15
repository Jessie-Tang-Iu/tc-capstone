// node scripts/import_from_supabase_rest.js
import "dotenv/config";
import pg from "pg";
const { Pool } = pg;

/** ---------- ENV ---------- */
const LURL = process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL;
const SURL = process.env.SUPABASE_URL;
const SRK = process.env.SUPABASE_SERVICE_ROLE;

if (!LURL)
  throw new Error(
    "LOCAL_DATABASE_URL or DATABASE_URL must be set in /backend/.env"
  );
if (!SURL) throw new Error("SUPABASE_URL is missing in /backend/.env");
if (!SRK) throw new Error("SUPABASE_SERVICE_ROLE is missing in /backend/.env");

const local = new Pool({ connectionString: LURL });

/** ---------- helpers ---------- */
async function fetchAll(table, select = "*") {
  const url = `${SURL}/rest/v1/${table}?select=${encodeURIComponent(
    select
  )}&limit=20000`;
  const res = await fetch(url, {
    headers: {
      apikey: SRK,
      Authorization: `Bearer ${SRK}`,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${table} fetch failed: ${res.status} ${body}`);
  }
  return res.json();
}

const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const pick = (o, keys, fallback = null) => {
  for (const k of keys) if (hasOwn(o, k)) return o[k];
  return fallback;
};

/** ---------- main ---------- */
/** ---------- main ---------- */
async function main() {
  // 1) users (try 'user', then fall back to 'profiles')
  let users = [];
  try {
    users = await fetchAll("user", "*");
  } catch (_) {
    /* ignore */
  }
  if (!users.length) {
    try {
      users = await fetchAll("profiles", "*");
    } catch (_) {
      /* ignore */
    }
  }

  console.log("users", users.length);

  // Map Supabase user id (uuid or numeric) -> local integer user.id
  const supaUserIdToLocalId = new Map();

  if (users.length) {
    const c = await local.connect();
    try {
      await c.query("BEGIN");
      for (const r of users) {
        const email =
          pick(r, ["email"])?.trim().toLowerCase() ||
          pick(r, ["user_email"])?.trim().toLowerCase() ||
          null;
        if (!email) continue;

        const firstname = pick(r, ["firstname", "first_name"], null);
        const lastname = pick(r, ["lastname", "last_name"], null);
        const username = pick(r, ["username"], null);
        const status = pick(r, ["status"], "active");
        const role = pick(r, ["role"], null);

        const { rows } = await c.query(
          'INSERT INTO "user"(email, firstname, lastname, username, status, role, supabase_id) ' +
            "VALUES ($1,$2,$3,$4,$5,$6,$7) " +
            "ON CONFLICT (email) DO UPDATE SET firstname=EXCLUDED.firstname, lastname=EXCLUDED.lastname, username=EXCLUDED.username, status=EXCLUDED.status, role=EXCLUDED.role " +
            "RETURNING id",
          [
            email,
            firstname,
            lastname,
            username,
            status,
            role,
            pick(r, ["id"], null),
          ]
        );

        const localId = rows[0]?.id;
        // record mapping from supabase user id -> local int user.id
        const supaId = pick(r, ["id"], null);
        if (supaId && localId) supaUserIdToLocalId.set(String(supaId), localId);
      }
      await c.query("COMMIT");
    } finally {
      c.release();
    }
  }

  // 2) workshops (your version worked; keeping as-is)
  const workshops = await fetchAll("workshop", "*");
  console.log("workshop", workshops.length);
  if (workshops.length) {
    const c = await local.connect();
    try {
      await c.query("BEGIN");
      for (const r of workshops) {
        await c.query(
          `INSERT INTO workshop
            (id, title, date, start_time, status, location, description, image_url, "maxCapacity", "currentCapacity", "registrationDeadline", supabase_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
           ON CONFLICT (id) DO UPDATE SET
             title=EXCLUDED.title,
             date=EXCLUDED.date,
             start_time=EXCLUDED.start_time,
             status=EXCLUDED.status,
             location=EXCLUDED.location,
             description=EXCLUDED.description,
             image_url=EXCLUDED.image_url,
             "maxCapacity"=EXCLUDED."maxCapacity",
             "currentCapacity"=EXCLUDED."currentCapacity",
             "registrationDeadline"=EXCLUDED."registrationDeadline"`,
          [
            pick(r, ["id"]),
            pick(r, ["title"], null),
            pick(r, ["date", "workshop_date"], null),
            pick(r, ["start_time", "startTime", "start_at"], null),
            pick(r, ["status"], "active"),
            pick(r, ["location", "localtion", "place"], null),
            pick(r, ["description", "details"], null),
            pick(r, ["image_url", "imageUrl", "image"], null),
            pick(r, ["maxCapacity", "maxcapacity", "max_capacity"], null),
            pick(
              r,
              ["currentCapacity", "currentcapacity", "current_capacity"],
              0
            ),
            pick(r, ["registrationDeadline", "registration_deadline"], null),
            pick(r, ["id"], null), // store supabase id for traceability
          ]
        );
      }
      await c.query("COMMIT");
    } finally {
      c.release();
    }
  }

  // Build a quick map of local workshops by Supabase id (string)
  const { rows: localWsRows } = await local.query(
    "SELECT id, supabase_id::text AS supa FROM workshop WHERE supabase_id IS NOT NULL"
  );
  const supaWsIdToLocalId = new Map(
    localWsRows.filter((r) => r.supa).map((r) => [r.supa, r.id])
  );

  // 3) bookings — DO NOT insert id; map user/workshop FKs; let SERIAL generate
  const bookings = await fetchAll("workshop_booking", "*");
  console.log("workshop_booking", bookings.length);
  if (bookings.length) {
    const c = await local.connect();
    try {
      await c.query("BEGIN");
      for (const r of bookings) {
        const supaUserId = String(pick(r, ["userID", "user_id", "userid"], ""));
        const supaWsId = String(
          pick(r, ["workshopID", "workshop_id", "workshopid"], "")
        );

        const localUserID = supaUserIdToLocalId.get(supaUserId) || null;
        const localWorkshopID =
          supaWsId && supaWsIdToLocalId.has(supaWsId)
            ? supaWsIdToLocalId.get(supaWsId)
            : Number.isInteger(r.workshopID)
            ? r.workshopID
            : null;

        // If we can’t resolve FKs, skip this row to avoid FK violations
        if (!localWorkshopID) continue;

        await c.query(
          'INSERT INTO workshop_booking ("userID","workshopID",status, supabase_id) ' +
            "VALUES ($1,$2,$3,$4) " +
            // unique(userID, workshopID) guard means duplicate will be rejected; we can choose to ignore silent dupes:
            "ON CONFLICT ON CONSTRAINT uq_booking DO NOTHING",
          [
            localUserID, // can be null if you’re OK with that; otherwise skip if null
            localWorkshopID,
            pick(r, ["status"], "active"),
            pick(r, ["id"], null), // store original supabase booking id
          ]
        );
      }
      await c.query("COMMIT");
    } finally {
      c.release();
    }
  }

  // fix sequences (safe even if tables empty)
  await local.query(`
  SELECT setval(
    pg_get_serial_sequence('"user"', 'id'),
    COALESCE((SELECT MAX(id) FROM "user"), 1),
    (SELECT MAX(id) IS NOT NULL FROM "user")
  );
`);
  await local.query(`
  SELECT setval(
    pg_get_serial_sequence('workshop', 'id'),
    COALESCE((SELECT MAX(id) FROM workshop), 1),
    (SELECT MAX(id) IS NOT NULL FROM workshop)
  );
`);
  await local.query(`
  SELECT setval(
    pg_get_serial_sequence('workshop_booking', 'id'),
    COALESCE((SELECT MAX(id) FROM workshop_booking), 1),
    (SELECT MAX(id) IS NOT NULL FROM workshop_booking)
  );
`);

  console.log("All done ");
  await local.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

//node scripts/import_from_supabase_rest.js
