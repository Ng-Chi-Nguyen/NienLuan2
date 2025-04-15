import {
   getFootballProvincesService,
   getFootballDistrictsService,
   getFootballWardsService
} from "../services/filter.service.js";

export const getFootballProvinces = async (req, res) => {
   let { id } = req.params;
   console.log(id)
   if (!id) {
      return res.json({
         sucess: false,
         message: "Không tìm thấy id tỉnh"
      })
   }
   let result = await getFootballProvincesService(id)
   if (!result.success) return res.json({
      success: result.success,
      message: result.message
   })
   // console.log(result)
   return res.json({
      success: result.success,
      message: result.message,
      data: result.data
   })
}

export const getFootballDistricts = async (req, res) => {
   let { id } = req.params;
   if (!id) return res.json({
      sucess: false,
      message: "Không tìm thấy id huyện mà bạn chọn"
   })
   let result = await getFootballDistrictsService(id)
   if (!result.success) return res.json({
      success: result.success,
      message: result.message
   })
   // console.log(result)
   return res.json({
      success: result.success,
      message: result.message,
      data: result.data
   })
}

export const getFootballWards = async (req, res) => {
   let { id } = req.params;
   if (!id) return res.json({
      sucess: false,
      message: "Không tìm thấy id xa mà bạn chọn"
   })
   let result = await getFootballWardsService(id)
   if (!result.success) return res.json({
      success: result.success,
      message: result.message
   })
   // console.log(result)
   return res.json({
      success: result.success,
      message: result.message,
      data: result.data
   })
}