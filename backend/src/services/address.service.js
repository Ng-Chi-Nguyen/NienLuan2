import { sql } from '../config/connect.js';

// Lấy danh sách tất cả tỉnh
export const getAllProvinces = async () => {
   try {
      const { data, error } = await sql
         .from("provinces")
         .select("*")
      if (error) {
         throw new Error(error.message);
      }
      return { success: true, data };
   } catch (error) {
      return { success: false, message: error.message };
   }
};

export const getProvinceByIdService = async (idProvince) => {
   try {
      const { data, error } = await sql
         .from("provinces")
         .select("*")
         .eq("code", idProvince)
         .single();

      if (error) {
         return { uccess: false, message: error }
      }
      return { success: true, data }
   } catch (e) {
      console.log(e)
   }
}


export const getAllDistricts = async (idProvince) => {
   try {
      const { data, error } = await sql
         .from("districts")
         .select("*")
         .eq("province_code", idProvince);

      if (error) {
         throw new Error(error.message);
      }
      return { success: true, data };
   } catch (error) {
      return { success: false, message: error.message };
   }
};

export const getDistrictByIdService = async (idDistrict) => {
   try {
      const { data, error } = await sql
         .from("districts")
         .select("*")
         .eq("code", idDistrict)
         .single();

      if (error) {
         return { success: false, message: message.error }
      }
      return { success: true, data }
   } catch (e) {
      console.log(e)
   }
}


export const getAllWards = async (idDistrict) => {
   try {
      const { data, error } = await sql
         .from("wards")
         .select("*")
         .eq("district_code", idDistrict);

      if (error) {
         throw new Error(error.message);
      }
      return { success: true, data };
   } catch (error) {
      return { success: false, message: error.message };
   }
};

export const getWatdByIdService = async (idWard) => {
   try {
      const { data, error } = await sql
         .from("wards")
         .select("*")
         .eq("code", idWard)
         .single();

      if (error) {
         return { success: false, message: message.error }
      }
      return { success: true, data }
   } catch (e) {
      console.log(e)
   }
}