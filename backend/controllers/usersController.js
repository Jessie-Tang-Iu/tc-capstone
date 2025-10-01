import { clerkClient } from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/express";

export async function updateUserMetadata(req, res) {
  try {
    const { isAuthenticated, userId } = getAuth(req);
    if (!isAuthenticated || !userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { role } = req.body;
    console.log("Updating metadata for:", userId, role);

    const updatedUser = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Metadata update failed:", err);
    res.status(500).json({ error: "Failed to update metadata" });
  }
}
