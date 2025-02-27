function deleteUser(userId) {
   fetch(`/api/user/delete-user/${userId}`, {
      method: "DELETE",
   })
      .then(response => response.json())
      .then(data => {
         if (data.errCode === 0) {
            // Xóa user khỏi giao diện
            let userRow = document.querySelector(`a[href="/api/user/delete-user/${userId}"]`);
            if (userRow) {
               userRow.closest("tr").remove();
            }
            window.location.href = "/user";
         }
      })
      .catch(error => console.error("Lỗi khi xóa:", error));
}


document.addEventListener("DOMContentLoaded", function () {
   document.querySelectorAll(".delete-user-btn").forEach(button => {
      button.addEventListener("click", function (event) {
         event.preventDefault(); // Ngăn chặn chuyển trang
         let userId = this.getAttribute("href").split("/").pop(); // Lấy ID từ URL
         deleteUser(userId); // Gọi hàm xóa
      });
   });
});



document.addEventListener("DOMContentLoaded", function () {
   const editButtons = document.querySelectorAll(".edit-user-btn");

   editButtons.forEach(button => {
      button.addEventListener("click", function (event) {
         event.preventDefault();
         const userId = this.getAttribute("data-id");

         // Gửi yêu cầu fetch để lấy giao diện updateUser.ejs
         fetch(`/user/updateUser/${userId}`)
            .then(response => response.text())
            .then(html => {
               document.querySelector(".modelUpdateuser").innerHTML = html;

               // Hiển thị modal
               const updateModal = new bootstrap.Modal(document.getElementById("updateUserModal"));
               updateModal.show();
            })
            .catch(error => console.error("Lỗi khi tải updateUser.ejs:", error));
      });
   });
});
