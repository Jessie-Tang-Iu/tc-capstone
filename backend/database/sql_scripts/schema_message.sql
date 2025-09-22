-- Recreate (or ALTER if you already have it)
DROP TABLE IF EXISTS message CASCADE;

CREATE TABLE message (
  id               BIGSERIAL PRIMARY KEY,
  sent_user_id     TEXT NOT NULL,
  receive_user_id  TEXT NOT NULL,
  content          TEXT NOT NULL,
  sent_at          TIMESTAMP NOT NULL DEFAULT now(),
  status           CHAR(1) NOT NULL DEFAULT 'S',
  -- every pair (A,B) maps to the same conversation_id
  conversation_id  TEXT GENERATED ALWAYS AS
    (LEAST(sent_user_id, receive_user_id) || ':' || GREATEST(sent_user_id, receive_user_id))
  STORED
);

-- helpful indexes
CREATE INDEX IF NOT EXISTS idx_message_sender       ON message (sent_user_id);
CREATE INDEX IF NOT EXISTS idx_message_receiver     ON message (receive_user_id);
CREATE INDEX IF NOT EXISTS idx_message_conversation ON message (conversation_id);

-- ---- seed data for testing ----
TRUNCATE message RESTART IDENTITY;

-- fixed test ids
-- ME
--   11111111-1111-1111-1111-111111111111
-- peers
--   99999999-9999-9999-9999-999999999999
--   22222222-2222-2222-2222-222222222222

INSERT INTO message (sent_user_id, receive_user_id, content, status) VALUES
('11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', 'Hey there, this is ME sending the first test message.', 'S'),
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'Hi ME! Got your message just fine.', 'R'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Hello user 2222, testing another peer chat.', 'S'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Replying to ME from user 2222.', 'D'),
('11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', 'Follow-up message to user 9999.', 'S');

-- not involving ME
INSERT INTO message (sent_user_id, receive_user_id, content, status) VALUES
('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'This chat is between 3333 and 4444 only.', 'S'),
('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Reply back to 3333 from 4444.', 'R');