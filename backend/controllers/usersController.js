import { clerkClient } from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/express";
import { handleEmployer, handleAdvisor, handleMember } from "../database/scripts/users.js";

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

    if (role != "employer" && role != "advisor" && role != "member") {
      return res.status(400).json({ error: "Role is invalid" });
    }

    if (role === "admin") {
      return res
        .status(400)
        .json({ error: "Cannot assign admin role, nice try" });
    }

    console.log("Updating metadata for:", userId, role);

    // Update Clerk metadata so the role shows in session tokens
    const updatedUser = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    // Prepare user data object once
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

    // Role-specific inserts
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

    res.json({ success: true, role, user: updatedUser });
  } catch (err) {
    console.error("Metadata update failed:", err);
    res.status(500).json({ error: "Failed to update metadata" });
  }
}
