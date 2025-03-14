import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let sql;

const connectDB = () => {
   try {
      sql = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
      console.log('Supabase connected successfully!');
   } catch (error) {
      console.error('Supabase connection error:', error);
      process.exit(1); // Dừng chương trình nếu kết nối thất bại
   }
};

export { sql, connectDB };