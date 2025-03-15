import { sql } from '../config/connect.js';

let createBunessService = async (bunessData) => {
   const { name, email, password, phone, address, owner_name, license_number, tax_code, established_date } = bunessData;
   console.log(bunessData)
   const { data, error } = await sql.from('Business')
      .insert([{ name, email, password, phone, address, owner_name, license_number, tax_code, established_date }])
      .select("*");
   if (error) {
      console.error("❌ Lỗi insert vào Supabase:", error);
      return { success: false, error };
   }
   return data;
}

export { createBunessService };
