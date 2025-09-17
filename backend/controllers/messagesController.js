// backend/controllers/messagesController.js
import * as messages from "../scripts/messages.js";

/** Get inbox (latest message per conversation for a user) */
export async function getInboxController(userId, opts = {}) {
  if (!userId) throw new Error("User ID required");
  return await messages.getInbox(userId, opts);
}

/** Get all messages for a user (timeline view) */
export async function getAllMessagesForUserController(userId, opts = {}) {
  if (!userId) throw new Error("User ID required");
  return await messages.getAllMessagesForUser(userId, opts);
}

/** Get 1:1 conversation between two users */
export async function getConversationController(userA, userB) {
  if (!userA || !userB) throw new Error("Both user IDs required");
  return await messages.getConversation(userA, userB);
}

/** Create a new message */
export async function createMessageController(body) {
  const { sent_user_id, receive_user_id, content, status } = body;
  if (!sent_user_id || !receive_user_id || !content) {
    throw new Error("Sender, receiver, and content are required");
  }
  return await messages.createMessage({
    sent_user_id,
    receive_user_id,
    content,
    status: status || "S",
  });
}

/** Mark a message as delivered */
export async function markDeliveredController(id) {
  if (!id) throw new Error("Message ID required");
  return await messages.markDelivered(id);
}

/** Mark a message as read */
export async function markReadByIdController(id) {
  if (!id) throw new Error("Message ID required");
  return await messages.markReadById(id);
}

/** Delete a message */
export async function deleteMessageController(id) {
  if (!id) throw new Error("Message ID required");
  return await messages.deleteMessage(id);
}

/** Seed demo messages */
export async function seedMessagesController(me, other) {
  if (!me || !other) throw new Error("Both user IDs required");
  return await messages.seedSevenMessages({ me, other });
}

/** Mark all messages from one user to another as read */
export async function markReadByPairController(fromUser, toUser) {
  if (!fromUser || !toUser) throw new Error("Both user IDs required");
  return await messages.markReadByPair({ fromUser, toUser });
}

/** Delete all messages in a conversation */
export async function deleteConversationController(conversationId) {
  if (!conversationId) throw new Error("Conversation ID required");
  return await messages.deleteConversation(conversationId);
}
