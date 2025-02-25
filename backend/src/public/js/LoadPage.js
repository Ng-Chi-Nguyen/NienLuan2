document.addEventListener("DOMContentLoaded", function () {
   const menuItems = document.querySelectorAll(".menuList li");
   const contentDiv = document.getElementById("content");

   menuItems.forEach((item) => {
      item.addEventListener("click", function () {
         let page = this.id; // Lấy id của <li> để xác định trang cần load

         fetch(`/${page}`) // Gửi request đến server
            .then((response) => response.text())
            .then((data) => {
               contentDiv.innerHTML = data; // Load nội dung vào #content
               window.history.pushState({}, "", `/${page}`); // Cập nhật URL mà không load lại trang
            })
            .catch((error) => console.error("Lỗi tải trang:", error));
      });
   });
});
