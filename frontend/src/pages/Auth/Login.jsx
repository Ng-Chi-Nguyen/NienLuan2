import Header from "../../components/Header/Header";
import './Login.scss';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { IoBusinessOutline } from "react-icons/io5";
import { Tabs } from 'antd';
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import axios from "axios";
export default function Login() {

   const navigate = useNavigate();

   const [loading, setLoading] = useState(false); // Loading o dang ky


   const [formData, setFormData] = useState({
      name: "",
      phone: "",
      email: "",
      password: "",
      gender: true,
      address: "",
      owner_name: "",
      license_number: "",
      tax_code: "",
      established_date: ""
   });


   const handleChange = (e) => {
      let { name, value } = e.target;

      if (name === "gender") {
         value = value === "true"; // Chuyển "true" thành true, "false" thành false
      }

      setFormData({ ...formData, [name]: value });
   };

   const handleCreateUser = async (e) => {
      e.preventDefault();
      try {
         setLoading(true);
         console.log("formData User:", formData)
         const response = await axios.post("/api/user/", formData);
         console.log("Phản hồi từ backend:", response.data);
         setFormData({
            name: "",
            phone: "",
            email: "",
            password: "",
            gender: true,
            address: "",
            owner_name: "",
            license_number: "",
            tax_code: "",
            established_date: ""
         })
         setLoading(false);
         setLogin(!login)
      } catch (error) {
         console.error("Lỗi đăng ký:", error.response?.data || error.message);
         alert("Đăng ký thất bại! Chi tiết lỗi: " + JSON.stringify(error.response?.data || error.message));
      }
   };

   const handleCreateBuness = async (e) => {
      e.preventDefault()
      try {
         setLoading(true);
         console.log("formData Buness:", formData)
         const response = await axios.post("/api/buness/", formData);
         console.log("Phản hồi từ backend:", response.data);
         setFormData({
            name: "",
            phone: "",
            email: "",
            password: "",
            gender: true,
            address: "",
            owner_name: "",
            license_number: "",
            tax_code: "",
            established_date: ""
         })
         setLoading(false);
         setLogin(!login)
      } catch (error) {
         console.error("Lỗi đăng ký:", error.response?.data || error.message);
         alert("Đăng ký thất bại! Chi tiết lỗi: " + JSON.stringify(error.response?.data || error.message));
      }
   }


   const handleLogin = async (e) => {
      e.preventDefault();
      console.log("Dữ liệu form:", formData);
      try {
         setLoading(true);
         const response = await axios.post("/api/auth/login", {
            email: formData.email,
            password: formData.password
         });

         console.log("Đăng nhập thành công:", response.data);

         // Lưu token vào localStorage hoặc state (tùy vào cách bạn xử lý đăng nhập)
         localStorage.setItem("token", response.data.token);
         localStorage.setItem("user", JSON.stringify(response.data.user)); // Lưu thông tin user

         navigate("/User");
         setLoading(false);
      } catch (e) {
         console.log(e)
         setLoading(false);
      }
   };



   const itemTabs = [
      {
         key: "1",
         label: "Tài khoản thường",
         icon: <CiUser />,
         children: (
            <div className="cardLogin user">
               <div className="social-login">
                  <button className="login-gg">
                     <span><FaGoogle /></span>
                     <p>Đăng nhập Google</p>
                  </button>
                  <button className="login-fb">
                     <span><FaFacebookF /></span>
                     <p>Đăng nhập Facebook</p>
                  </button>
               </div>
               <p className="text-center">Hoặc tạo tài khoản</p>
               <form onSubmit={handleCreateUser}>
                  <div className="row">
                     <input
                        type="text"
                        name="name"
                        placeholder="Họ và tên"
                        onChange={handleChange}
                        value={formData.name}
                     />
                     <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        onChange={handleChange}
                        value={formData.phone}
                     />
                     <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={formData.email}
                     />
                     <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        onChange={handleChange}
                        value={formData.password}
                     />
                     <select name="gender" onChange={handleChange} value={formData.gender}>
                        <option value="true">Nam</option>
                        <option value="false">Nữ</option>
                     </select>
                     <input
                        type="text"
                        name="address"
                        placeholder="Địa chỉ"
                        onChange={handleChange}
                        value={formData.address}
                     />
                     <button type="submit" disabled={loading}> {loading ? "Đang xử lý..." : "Đăng ký"}</button>
                  </div>
               </form>
            </div>
         )
      },
      {
         key: "2",
         label: "Tài khoản doanh nghiệp",
         icon: <IoBusinessOutline />,
         children: (
            <div className="cardLogin buness">
               <div className="social-login">
                  <button className="login-gg">
                     <span><FaGoogle /></span>
                     <p>Đăng nhập Google</p>
                  </button>
                  <button className="login-fb">
                     <span><FaFacebookF /></span>
                     <p>Đăng nhập Facebook</p>
                  </button>
               </div>
               <p className="text-center">Hoặc tạo tài khoản</p>
               <form onSubmit={handleCreateBuness}>
                  <div className="row">
                     <input
                        type="text"
                        name="name"
                        placeholder="Tên cửa hàng"
                        onChange={handleChange}
                        value={formData.name}
                     />
                     <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        onChange={handleChange}
                        value={formData.phone}
                     />
                     <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={formData.email}
                     />
                     <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        onChange={handleChange}
                        value={formData.password}
                     />
                     <input
                        type="text"
                        name="address"
                        placeholder="Địa chỉ"
                        onChange={handleChange}
                        value={formData.address}
                     />
                     <input
                        type="text"
                        name="owner_name"
                        placeholder="Tên chủ doanh nghiệp"
                        onChange={handleChange}
                        value={formData.owner_name}
                     />
                     <input
                        type="text"
                        name="license_number"
                        placeholder="Số giấy phép kinh doanh"
                        onChange={handleChange}
                        value={formData.license_number}
                     />
                     <input
                        type="text"
                        name="tax_code"
                        placeholder="Mã số thuế"
                        onChange={handleChange}
                        value={formData.tax_code}
                     />
                     <input
                        type="date"
                        name="established_date"
                        placeholder="Ngày thành lập"
                        onChange={handleChange}
                        value={formData.established_date}
                     />
                     <button type="submit" disabled={loading}> {loading ? "Đang xử lý..." : "Đăng ký"}</button>
                  </div>
               </form>
            </div>
         )
      }
   ]

   const [login, setLogin] = useState(false)



   return (
      <>
         <Header />
         {login ? (
            <div className="LoginPage">
               <div className="title">ĐĂNG KÝ</div>
               <Tabs
                  defaultActiveKey="1" items={itemTabs}
                  centered="true"
               />
               <p className="text-center">Bạn đã có tài khoản?
                  <span className="btn-switch" onClick={() => setLogin(!login)}> Đăng nhập</span>
               </p>
            </div>
         ) : (
            <div className="LoginPage">
               <div className="cardLogin loginFalse">
                  <div className="title">ĐĂNG NHẬP</div>
                  <div className="social-login">
                     <a href="api/auth/google" className="login-gg">
                        <span><FaGoogle /></span>
                        <p>Đăng nhập Google</p>
                     </a>
                     <button className="login-fb">
                        <span><FaFacebookF /></span>
                        <p>Đăng nhập Facebook</p>
                     </button>
                  </div>
                  <p className="text-center">Hoặc đăng nhập Email</p>
                  <form onSubmit={handleLogin}>
                     <div className="row">
                        <input
                           type="email"
                           name="email"
                           placeholder="Email"
                           onChange={handleChange}
                           value={formData.email}
                        />
                        <input
                           type="password"
                           name="password"
                           placeholder="Mật khẩu"
                           onChange={handleChange}
                           value={formData.password}
                        />
                        <button type="submit" disabled={loading}>{loading ? "Đang xử lý..." : "Đăng nhập"}</button>
                     </div>
                  </form>
                  <p className="text-center">Bạn chưa có tài khoản?
                     <span className="btn-switch" onClick={() => setLogin(!login)}> Đăng ký</span>
                  </p>
               </div>
            </div>
         )}
      </>
   );
}
