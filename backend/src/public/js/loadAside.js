$(document).ready(function () {
   // Hàm load nội dung dựa trên URL hash
   function loadContent() {
      let page = window.location.hash.substring(1); // Lấy phần sau dấu #
      if (!page) {
         page = "home"; // Nếu không có hash, mặc định load index
      }
      if ($(".content-body").attr("data-current") !== page) {
         $(".content-body").attr("data-current", page); // Lưu trạng thái trang hiện tại
         $(".content-body").load("/" + page);
      }
   }

   // Khi bấm nút, thay đổi hash URL mà không reload trang
   $(".nav-link").click(function (e) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ `<a>`
      let page = $(this).attr("data-page"); // Lấy giá trị từ data-page
      if ($(".content-body").attr("data-current") !== page) {
         window.location.hash = page; // Thay đổi hash URL
         loadContent(); // Load nội dung mới
      }
   });

   // Khi người dùng bấm Back/Forward trên trình duyệt
   $(window).on("hashchange", function () {
      loadContent();
   });

   // Gọi hàm loadContent khi trang vừa load
   loadContent();
});

