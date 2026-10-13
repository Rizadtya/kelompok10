import { statusHandler } from '../server/handlers.js';
import { sendJson } from './_lib.js';

export default function handler(_req, res) {
  return sendJson(res, 200, statusHandler());
}
