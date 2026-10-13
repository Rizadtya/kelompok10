import { generateHandler } from '../server/handlers.js';
import { withPost } from './_lib.js';

export default withPost(generateHandler);
