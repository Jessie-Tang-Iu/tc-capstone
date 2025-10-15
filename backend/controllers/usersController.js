import { clerkClient } from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/express";
import { handleEmployer, handleAdvisor, handleMember, getUserdataByClerkID } from "../database/scripts/users.js";

export async function updateUserMetadata(req, res) {
  try {
    const { isAuthenticated, userId } = getAuth(req);
    if (!isAuthenticated || !userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Create Variables from req.body, used later for DB inserts
    let {
      role,
      username,
      firstName,
      lastName,
      email,
      phone,
      companyName,
      companyRole,
      companyId,
      advisorTitle,
    } = req.body;

    // Fun validation easter egg if someone tries to send their own request with the admin role
    if (role === "admin") {
      return res
        .status(400)
        .json({ error: "Cannot assign admin role, nice try" });
    }

    // Checks that the roles sent are the valid ones that users can assign themselves already
    if (role != "employer" && role != "advisor" && role != "member") {
      return res.status(400).json({ error: "Role is invalid" });
    }

    console.log("Updating metadata for:", userId, role); // Debug log, remove in deployment

    // Update Clerk metadata so the role shows in session tokens for page auth
    const updatedUser = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    // Prepare user data object to be sent to the database scripts. This contains all data that could be sent from the three registration pages
    const userData = {
      clerkId: userId,
      role,
      username,
      firstName,
      lastName,
      email,
      phone,
      companyName,
      companyRole,
      companyId,
      advisorTitle,
    };

    // Role-specific inserts, calls the specific function based on the role
    switch (role) {
      case "employer":
        await handleEmployer(userData);
        break;
      case "advisor":
        await handleAdvisor(userData);
        break;
      case "member":
        await handleMember(userData);
        break;
    }


    return res.json({ success: true, user: updatedUser }); // Returns the updated user
  } catch (err) {
    console.error("Metadata update failed:", err);
    res.status(500).json({ error: "Failed to update metadata" });
  }
}

export async function fetchUserDataByID(req, res) {
  try {
    const { isAuthenticated } = getAuth(req);
    if (!isAuthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { clerk_id } = req.params;
    if (!clerk_id) {
      return res.status(400).json({ error: "Missing clerk_id" });
    }

    const user = await getUserdataByClerkID(clerk_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return only these 3 fields
    return res.json({
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
    });
  } catch (err) {
    console.error("Error fetching user by clerk_id:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}