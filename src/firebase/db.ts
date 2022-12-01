import app from './index.js';
import { getDatabase } from "firebase/database";

export const database = getDatabase(app);
