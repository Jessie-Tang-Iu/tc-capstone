import { clerkClient } from "@clerk/clerk-sdk-node";
import * as employer from "../database/scripts/employer.js";

export async function getAllEmployersController() {
  return await employer.getAllEmployers();
}

export async function getEmployerByIdController(clerk_id) {
  if (!clerk_id) throw new Error("clerk_id required");
  return await employer.getEmployerById(clerk_id);
}

export async function updateEmployerProfileController(body) {
  if (!body.id) throw new Error("clerk_id required");

  const res = await clerkClient.users.updateUser(body.id, {
    firstName: body.first_name,
    lastName: body.last_name,
    // notifyPrimaryEmailAddressChanged: true,
    // primaryEmailAddress: body.email,
    // primaryPhoneNumber: body.phone, 
  });

  console.log("Employer controller: ", res);

  await employer.updateEmployerProfile({
    clerk_id: body.id,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone,
    company_name: body.company_name,
    company_role: body.company_role,
  });

  // always return latest data
  return await employer.getEmployerById(body.id);
}
