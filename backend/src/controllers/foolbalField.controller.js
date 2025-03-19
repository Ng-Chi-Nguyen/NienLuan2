import { createFoolballFieldService, displayFoolbalField } from '../services/foolballField.service.js';

export const createFoolbalField = async (req, res) => {
   try {
      const { name, size, price, image, status, address, idBusiness } = req.body;
      if (!name || !size || !price || !image || status === undefined || address === undefined || idBusiness === undefined) {
         return res.status(400).json({ error: "Thiếu thông tin cần thiết!" });
      }
      const result = await createFoolballFieldService({ name, size, price, image, status, address, idBusiness });
      if (!result.success) {
         return res.status(500).json({ error: result.error });
      }
      res.json({
         message: result.message,
         data: result.data,
      });
   } catch (e) {
      console.log(e)
   }
}

export const getAllFoolbalField = async (req, res) => {
   try {
      let { id } = req.params;
      let idBusiness = Number(id);

      // console.log("idBusiness sau khi parse:", idBusiness);
      if (!idBusiness) {
         return res.json({ success: false, message: "Không thấy id doanh nghhiep" })
      }
      const result = await displayFoolbalField(idBusiness);

      if (!result.success) {
         return res.json({ result })
      }
      return res.status(200).json(result);
   } catch (e) {
      console.log(e)
   }
}