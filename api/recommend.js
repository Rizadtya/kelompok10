import { recommendHandler } from '../server/handlers.js';
import { withPost } from './_lib.js';

export default withPost(recommendHandler, { requireAuth: true });
