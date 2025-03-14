import { sql } from '../config/connect.js';

let createUserService = async (userData) => {
   const { name, email, password, phone, gender, address } = userData;
   const { data, error } = await sql.from('User')
      .insert([{ name, email, password, phone, gender, address }])
      .select("*");
   if (error) {
      console.error("❌ Lỗi insert vào Supabase:", error);
      return { success: false, error };
   }
   return data;
}

export { createUserService };
