import { sql } from '../config/connect.js';

let createUserService = async (userData) => {
   const { name, email, password, phone, gender } = userData;
   const { data } = await sql.from('User').insert([
      { name, email, password, phone, gender }
   ]);
   return { success: true, data };
}

export { createUserService };
