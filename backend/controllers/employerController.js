import * as employer from "../database/scripts/employer.js";

export async function getAllEmployersController() {
  return await employer.getAllEmployers();
}

export async function getEmployerByIdController(clerk_id) {
  if (!clerk_id) throw new Error("clerk_id required");
  return await employer.getEmployerById(clerk_id);
}

export async function updateEmployerProfileController(body) {
  if (!body.clerk_id) throw new Error("clerk_id required");

  await employer.updateEmployerProfile({
    clerk_id: body.clerk_id,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone,
    company_name: body.company_name,
    company_role: body.company_role,
    company_id: body.company_id || null,
  });

  // always return latest data
  return await employer.getEmployerById(body.clerk_id);
}
