import {
   getAllProvinces,
   getAllDistricts,
   getAllWards,
   getProvinceByIdService,
   getDistrictByIdService,
   getWatdByIdService,
   getAddressById
} from "../services/address.service.js";

export const getProvinces = async (req, res) => {
   try {
      const result = await getAllProvinces();
      if (!result.success) {
         return res.status(400).json(result);
      }

      res.status(200).json(result);
   } catch (error) {
      console.error("Lỗi lấy danh sách tỉnh:", error);
      res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
   }
};

export const getProvince = async (req, res) => {
   const { id } = req.params;
   // console.log("idProvince nhận được từ URL:", id);
   if (!id) {
      return res.status(400).json({ success: false, message: "Không tìm thấy idProvince trong request" });
   }
   try {
      const result = await getProvinceByIdService(id);
      if (result.success) {
         return res.json(result.data); // Trả về dữ liệu nếu thành công
      }
      return res.status(500).json({ success: false, message: result.message }); // Trả về thông báo lỗi nếu không thành công
   } catch (e) {
      console.log(e);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
   }
};


export const getDistricts = async (req, res) => {
   let { id } = req.params;
   let idProvince = String(id);
   // console.log(idProvince)
   try {
      const result = await getAllDistricts(idProvince);
      if (!result.success) {
         return res.status(400).json(result);
      }

      res.status(200).json(result);
   } catch (error) {
      console.error("Lỗi lấy danh sách huyện:", error);
      res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
   }
};

export const getDistrict = async (req, res) => {
   const { id } = req.params;
   // console.log("idProvince nhận được từ URL:", id);
   if (!id) {
      return res.status(400).json({ success: false, message: "Không tìm thấy idDistrict trong request" });
   }
   try {
      const result = await getDistrictByIdService(id);
      if (result.success) {
         return res.json(result.data); // Trả về dữ liệu nếu thành công
      }
      return res.status(500).json({ success: false, message: result.message }); // Trả về thông báo lỗi nếu không thành công
   } catch (e) {
      console.log(e);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
   }
};

export const getWards = async (req, res) => {
   let { id } = req.params;
   let idDistrict = String(id);
   // console.log(idDistrict)
   try {
      const result = await getAllWards(idDistrict);
      if (!result.success) {
         return res.status(400).json(result);
      }

      res.status(200).json(result);
   } catch (error) {
      console.error("Lỗi lấy danh sách huyện:", error);
      res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
   }
};

export const getWard = async (req, res) => {
   const { id } = req.params;
   // console.log("idProvince nhận được từ URL:", id);
   if (!id) {
      return res.status(400).json({ success: false, message: "Không tìm thấy idWard trong request" });
   }
   try {
      const result = await getWatdByIdService(id);
      if (result.success) {
         return res.json(result.data); // Trả về dữ liệu nếu thành công
      }
      return res.status(500).json({ success: false, message: result.message }); // Trả về thông báo lỗi nếu không thành công
   } catch (e) {
      console.log(e);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
   }
};

export const getAddress = async (req, res) => {
   try {
      const { idProvince, idDistrict, idWard } = req.params;

      // console.log(idProvince, idDistrict, idWard)

      const address = await getAddressById(idProvince, idDistrict, idWard);

      if (!address) {
         return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ" });
      }

      return res.json({ success: true, data: address });
   } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
      res.status(500).json({ success: false, message: "Lỗi server" });
   }
}