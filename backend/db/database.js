import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data.json');

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(
      DB_PATH,
      JSON.stringify({ users: [], chats: [], counters: { userId: 1, chatId: 1 } }, null, 2)
    );
  }
}

export function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

export function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function createUser({ name, email, password }) {
  const db = readDb();
  const existing = db.users.find((u) => u.email === email);
  if (existing) return null;

  const user = {
    id: db.counters.userId++,
    name,
    email,
    password,
    created_at: new Date().toISOString()
  };

  db.users.push(user);
  writeDb(db);
  return user;
}

export function findUserByEmail(email) {
  const db = readDb();
  return db.users.find((u) => u.email === email) || null;
}

export function findUserById(id) {
  const db = readDb();
  const user = db.users.find((u) => u.id === id);
  return user || null;
}

export function createChat({ userId, userMessage, botMessage }) {
  const db = readDb();
  const chat = {
    id: db.counters.chatId++,
    user_id: userId,
    user_message: userMessage,
    bot_message: botMessage,
    created_at: new Date().toISOString()
  };
  db.chats.push(chat);
  writeDb(db);
  return chat;
}

export function getChatsByUserId(userId) {
  const db = readDb();
  return db.chats
    .filter((c) => c.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20);
}

export function deleteChatsByUserId(userId) {
  const db = readDb();
  db.chats = db.chats.filter((c) => c.user_id !== userId);
  writeDb(db);
}