export const uploadImage = (req, res) => {
   if (!req.file) {
      return res.status(400).json({ message: "Không có file nào được tải lên!" });
   }

   // Trả về đường dẫn ảnh đã upload
   res.json({ imageUrl: `/image/uploads/${req.file.filename}` });
};
