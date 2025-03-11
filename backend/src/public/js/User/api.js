

document.addEventListener("click", function (event) {
   const button = event.target.closest(".edit-user-btn");

   // Kiểm tra nếu button tồn tại trước khi thao tác
   if (!button) return;

   event.preventDefault();
   console.log("OK");

   const userId = button.getAttribute("data-id");

   fetch(`/updateUser/${userId}`)
      .then(response => response.text())
      .then(html => {
         document.querySelector(".modelUpdateuser").innerHTML = html;
         const updateModal = new bootstrap.Modal(document.getElementById("updateUserModal"));
         updateModal.show();
      })
      .catch(error => console.error("Lỗi khi tải updateUser.ejs:", error));
});

//  delete user

document.addEventListener("click", async function (event) {
   const button = event.target.closest(".delete-user-btn");

   // Kiểm tra nếu button tồn tại trước khi thao tác
   if (!button) return;

   event.preventDefault();

   const userId = button.getAttribute("data-id");
   console.log(userId)
   if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;

   try {
      const response = await fetch(`/api/user/delete-user/${userId}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
         },
      });

      const result = await response.json();
      if (result) {
         this.location.reload();
      }

   } catch (error) {
      console.error("Lỗi khi gửi request:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
   }
});
