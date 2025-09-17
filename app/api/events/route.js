import {
  getEventsController,
  createEventController,
} from "@/backend/controllers/eventsController"; // Import controller functions

// The GET function calls getEventsController (acts as middleman).
// It retrieves all events, and controller handles validation/logic.
// If successful, returns events with 200 status. If error, return 400.
export async function GET() {
  try {
    const events = await getEventsController();
    return new Response(JSON.stringify(events), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
}

// The POST function takes body (title, date, start_time, etc.)
// It calls createEventController to validate and save to DB.
// If successful, returns new event with 201 status. If error, return 400.
export async function POST(req) {
  try {
    const body = await req.json();
    const newEvent = await createEventController(body);
    return new Response(JSON.stringify(newEvent), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
}
