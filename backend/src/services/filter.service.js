import { sql } from '../config/connect.js';

export const getFootballProvincesService = async (id) => {
   const { data, error } = await sql
      .from("FoolbalField")
      .select("*")
      .eq("idProvince", id)
   if (error) return {
      success: false,
      message: "Loi: " + error
   }
   return {
      success: true,
      message: "Tất cả sân bóng thuộc tỉnh mà bạn chọn",
      data
   }
}

export const getFootballDistrictsService = async (id) => {
   const { data, error } = await sql
      .from("FoolbalField")
      .select("*")
      .eq("idDistrict", id)
   if (error) return {
      success: false,
      message: "Loi: " + error
   }
   return {
      success: true,
      message: "Tất cả sân bóng thuộc huyen mà bạn chọn",
      data
   }
}

export const getFootballWardsService = async (id) => {
   const { data, error } = await sql
      .from("FoolbalField")
      .select("*")
      .eq("idWard", id)
   if (error) return {
      success: false,
      message: "Loi: " + error
   }
   return {
      success: true,
      message: "Tất cả sân bóng thuộc xa mà bạn chọn",
      data
   }
}