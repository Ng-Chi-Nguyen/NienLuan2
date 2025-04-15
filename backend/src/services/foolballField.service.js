import { sql } from '../config/connect.js';


let createFoolballFieldService = async (fieldData) => {
   try {
      const { name, size, price, status, idProvince, idDistrict, idWard, address, idBusiness, images } = fieldData;

      // Kiểm tra dữ liệu đầu vào
      if (!name || !size || !price || status == null || !address || !idBusiness) {
         return { success: false, error: "Thiếu thông tin cần thiết!" };
      }

      // Kiểm tra sân bóng đã tồn tại chưa
      const { data: existingFields, error: existingFieldsError } = await sql
         .from('FoolbalField')
         .select('id')
         .eq("name", name);

      if (existingFieldsError) {
         console.error("Lỗi khi kiểm tra trường bóng đá:", existingFieldsError);
         return { success: false, error: existingFieldsError.message };
      }

      if (existingFields.length > 0) {
         return { success: false, error: "Trường bóng đá đã tồn tại!" };
      }

      // Tạo sân bóng mới
      const { data, error } = await sql
         .from('FoolbalField')
         .insert([
            {
               name,
               size,
               price,
               status,
               idProvince,
               idDistrict,
               idWard,
               address,
               idBusiness,
            }
         ])
         .select('*')
         .single();

      if (error) {
         console.error("Lỗi insert vào Supabase:", error);
         return { success: false, error: error.message };
      }

      const fieldId = data.id;  // Lấy ID của sân bóng vừa tạo

      // Nếu có ảnh, lưu vào bảng FootballFieldImages
      if (images.length > 0) {
         const imageData = images.map(url => ({ id_FField: fieldId, image_url: url }));

         const { error: imageError } = await sql
            .from("FootballFieldImages")
            .insert(imageData);

         if (imageError) {
            console.error("Lỗi khi lưu ảnh:", imageError);
            return { success: false, error: "Lỗi khi lưu ảnh!" };
         }
      }

      return { success: true, data };

   } catch (e) {
      console.error("Lỗi hệ thống:", e);
      return { success: false, error: "Lỗi hệ thống!" };
   }
};

let displayFoolbalFieldIdService = async (idBusiness) => {
   try {
      if (!idBusiness) {
         return { success: false, error: "Thiếu idBusiness!" };
      }
      const { data, error } = await sql
         .from('FoolbalField')
         .select("*")
         .eq("idBusiness", idBusiness)

      if (error) {
         return { success: false, message: error.message }
      }
      return {
         success: true,
         data: data
      }
   } catch (e) {
      console.log(e)
   }
}

let displayOneFoolbalFieldIdService = async (id) => {
   try {
      if (!id) {
         return { success: false, error: "Thiếu idBusiness!" };
      }
      const { data, error } = await sql
         .from('FoolbalField')
         .select("*")
         .eq("id", id)

      if (error) {
         return { success: false, message: error.message }
      }
      return {
         success: true,
         data: data
      }
   } catch (e) {
      console.log(e)
   }
}

let updateFootballFieldService = async (id, updateData) => {
   try {
      // console.log("Dữ liệu nhận để cập nhật:", updateData);

      // Lấy dữ liệu cũ trước khi cập nhật
      const { data: currentData, error: fetchError } = await sql
         .from("FoolbalField")
         .select("*")
         .eq("id", id)
         .single();

      if (fetchError) return { success: false, error: "Không tìm thấy sân bóng!" };

      // Xóa các trường không có trong DB
      delete updateData.created_at;  // Giữ nguyên ngày tạo
      delete updateData.key;         // Xóa 'key' vì không có trong bảng

      const updatedData = { ...currentData, ...updateData };

      // Cập nhật dữ liệu
      const { data: updatedField, error: updateError } = await sql
         .from("FoolbalField")
         .update(updatedData)
         .eq("id", id)
         .select("*")
         .single();

      if (updateError) return { success: false, error: updateError.message };

      return { success: true, data: updatedField };
   } catch (e) {
      console.error("Lỗi hệ thống:", e);
      return { success: false, error: "Lỗi hệ thống!" };
   }
};

const deleteFootballFieldService = async (idFF) => {
   try {
      // Xóa tất cả ảnh liên quan trước
      const { error: imageError } = await sql
         .from("FootballFieldImages")
         .delete()
         .eq("id_FField", idFF);

      if (imageError) {
         return {
            success: false,
            message: "Lỗi khi xóa ảnh sân bóng: " + imageError.message,
         };
      }

      // Xóa sân bóng sau khi đã xóa ảnh
      const { error, count } = await sql
         .from("FoolbalField")
         .delete()
         .eq("id", idFF);

      if (error) {
         return {
            success: false,
            message: "Lỗi khi xóa sân bóng: " + error.message,
         };
      }

      if (count === 0) {
         return {
            success: false,
            message: "Không tìm thấy sân bóng để xóa",
         };
      }

      return {
         success: true,
         message: "Xóa sân bóng thành công",
      };
   } catch (e) {
      return {
         success: false,
         message: "Lỗi hệ thống: " + e.message,
      };
   }
};

const getAllFoolbalFieldService = async () => {
   try {
      const { data, error } = await sql
         .from("FoolbalField")
         .select("*")
         .eq("status", true);

      if (error) {
         return {
            success: false,
            message: error.message || "Lỗi truy vấn dữ liệu"
         };
      }

      return {
         success: true,
         data
      };
   } catch (e) {
      console.log("Lỗi trong getAllFoolbalFieldService:", e);
      return {
         success: false,
         message: "Lỗi khi lấy dữ liệu sân bóng"
      };
   }
};

const updateFootballFieldImageService = async (id, imageUrls) => {
   try {
      // Kiểm tra xem sân bóng có tồn tại không
      const { data: currentData, error: fetchError } = await sql
         .from("FoolbalField")
         .select("*")
         .eq("id", id)
         .single();

      if (fetchError || !currentData) {
         return { success: false, error: "Không tìm thấy sân bóng!" };
      }

      // Kiểm tra imageUrls có hợp lệ không
      if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
         return { success: false, error: "Không có ảnh hợp lệ để cập nhật!" };
      }

      // Xóa ảnh cũ
      await sql.from("FootballFieldImages").delete().eq("id_FField", id);

      // Thêm ảnh mới
      const imageData = imageUrls.map(url => ({ id_FField: id, image_url: url }));
      const { error: imageError } = await sql.from("FootballFieldImages").insert(imageData);

      if (imageError) {
         console.error("Lỗi khi lưu ảnh:", imageError);
         return { success: false, error: "Lỗi khi lưu ảnh!" };
      }

      return { success: true, data: imageData };

   } catch (error) {
      console.error("Lỗi hệ thống:", error);
      return { success: false, error: "Lỗi hệ thống!" };
   }
};

const getFootballFieldImageService = async (fieldId) => {
   // console.log(fieldId)
   try {
      // Lấy danh sách ảnh từ bảng FootballFieldImages
      const { data: images, error } = await sql
         .from("FootballFieldImages")
         .select("image_url")
         .eq("id_FField", fieldId)
         .order("created_at", { ascending: true }) // Lấy ảnh cũ nhất làm ảnh mô tả anh nao cu se dung dau list

      if (error || !images.length) {
         return { success: false, message: "Không tìm thấy ảnh!" };
      }
      // Chỉ lấy ảnh đầu tiên làm ảnh mô tả
      return { success: true, image: images };
   } catch (error) {
      console.error("Lỗi khi lấy ảnh sân bóng:", error);
      return { success: false, message: "Lỗi server!" };
   }
};

export {
   createFoolballFieldService,
   displayFoolbalFieldIdService,
   updateFootballFieldService,
   deleteFootballFieldService,
   getAllFoolbalFieldService,
   updateFootballFieldImageService,
   getFootballFieldImageService,
   displayOneFoolbalFieldIdService
}