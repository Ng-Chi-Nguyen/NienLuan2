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
         return { success: false, message: error }
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
      return { success: true, data, message: "Lấy thành công danh sách xã" };
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


export const getAddressById = async (provinceId, districtId, wardId) => {
   try {
      // console.log("Querying Province:", provinceId);
      // console.log("Querying District:", districtId);
      // console.log("Querying Ward:", wardId);

      const { data: provinceData, error: provinceError } = await sql
         .from("provinces")
         .select("name, administrative_unit_id")
         .eq("code", provinceId)
         .single();

      const { data: districtData, error: districtError } = await sql
         .from("districts")
         .select("name, administrative_unit_id")
         .eq("code", districtId)
         .single();

      const { data: wardData, error: wardError } = await sql
         .from("wards")
         .select("name, administrative_unit_id")
         .eq("code", wardId)
         .single();

      // Kiểm tra nếu không có dữ liệu
      if (!provinceData || !districtData || !wardData) {
         console.warn("Không tìm thấy địa chỉ:", { provinceData, districtData, wardData });
         return null;
      }

      const adminUnitMap = {
         1: "Thành phố",
         2: "Tỉnh",
         3: "Thành phố thuộc TP",
         4: "Thành phố thuộc tỉnh",
         5: "Quận",
         6: "Thị xã",
         7: "Huyện",
         8: "Phường",
         9: "Thị trấn",
         10: "Xã",
      };


      const provinceName = `${adminUnitMap[provinceData.administrative_unit_id]} ${provinceData.name}`;
      const districtName = `${adminUnitMap[districtData.administrative_unit_id]} ${districtData.name}`;
      const wardName = `${adminUnitMap[wardData.administrative_unit_id]} ${wardData.name}`;

      return `${wardName}, ${districtName}, ${provinceName}`;
   } catch (error) {
      console.error("Lỗi trong service getAddressById:", error);
      return null;
   }
};
