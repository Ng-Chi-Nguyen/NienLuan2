
import Header from "../../components/Header/Header";
import './Login.scss';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { IoBusinessOutline } from "react-icons/io5";
import { Tabs } from 'antd';
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { createUser } from "../../services/user.service";
import { createBusiness } from "../../services/business.service";
import { Message } from "../../utils/utils";
import { useLocation } from "react-router-dom";

export default function Login() {

   const location = useLocation();
   const messageBooking = location.state?.messageBooking;
   useEffect(() => {
      if (messageBooking) {
         Message("Thông báo", messageBooking, "success");
      }
      // Reset state để không hiển thị lại khi reload
      navigate(location.pathname, { replace: true, state: {} });
   }, [messageBooking]);

   const navigate = useNavigate();

   const [loading, setLoading] = useState(false); // Loading o dang ky
   const [message, setMessage] = useState("")
   const [showPassword, setShowPassword] = useState(false)

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

   // const togglePasswordVisibility = () => {
   //    setShowPassword(!showPassword);
   // };

   const isValidPassword = (password) => {
      if (password.length < 6) {
         setMessage("Mật khẩu phải có ít nhất 6 ký tự")
         return false;
      }
      if (!/[A-Z]/.test(password)) {
         setMessage("Mật khẩu phải chứa ít nhất 1 chữ hoa")
         return false;
      }
      if (!/[a-z]/.test(password)) {
         setMessage("Mật khẩu phải chứa ít nhất 1 chữ thường")
         return false;
      }
      if (!/[0-9]/.test(password)) {
         setMessage("Mật khẩu phải chứa ít nhất 1 số")
         return false;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
         setMessage("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt")
         return false;
      }
      return true;
   };

   const handleCreateUser = async (e) => {
      e.preventDefault();
      // Kiểm tra mật khẩu
      if (!isValidPassword(formData.password)) {
         return; // Nếu mật khẩu không hợp lệ, không tiếp tục xử lý
      }
      try {
         setLoading(true);
         // console.log("formData User:", formData);

         // Gọi hàm createUser từ service
         const response = await createUser(formData);
         // console.log("Phản hồi từ backend:", response);

         // Reset formData
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
         });

         setLoading(false);
         setLogin(!login); // Toggle login state sau khi đăng ký thành công
      } catch (error) {
         console.error("Lỗi đăng ký:", error.response?.data || error.message);
         alert("Đăng ký thất bại! Chi tiết lỗi: " + JSON.stringify(error.response?.data || error.message));
         setLoading(false); // Đảm bảo set lại loading khi xảy ra lỗi
      }
   };

   const handleCreateBusiness = async (e) => {
      e.preventDefault();
      // Kiểm tra mật khẩu
      if (!isValidPassword(formData.password)) {
         return; // Nếu mật khẩu không hợp lệ, không tiếp tục xử lý
      }
      try {
         setLoading(true);
         console.log("formData Business:", formData);

         // Gọi hàm createBusiness từ service
         const response = await createBusiness(formData);
         console.log("Phản hồi từ backend:", response);

         // Reset formData
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
         });

         setLoading(false);
         setLogin(!login); // Toggle login state sau khi đăng ký thành công
      } catch (error) {
         console.error("Lỗi đăng ký doanh nghiệp:", error.response?.data || error.message);
         alert("Đăng ký thất bại! Chi tiết lỗi: " + JSON.stringify(error.response?.data || error.message));
         setLoading(false); // Đảm bảo set lại loading khi xảy ra lỗi
      }
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      console.log("Dữ liệu form:", formData);
      try {
         setLoading(true);
         const response = await axios.post("/api/auth/login", {
            email: formData.email,
            password: formData.password
         });
         // console.log(response.data.message)
         setMessage(response.data.message)
         // console.log("Đăng nhập thành công:", response.data);

         // Lưu token vào localStorage hoặc state (tùy vào cách bạn xử lý đăng nhập)
         localStorage.setItem("token", response.data.token);
         localStorage.setItem("user", JSON.stringify(response.data.user)); // Lưu thông tin user

         navigate("/User");
         setLoading(false);
      } catch (error) {
         if (error.response) {
            // Lấy thông báo lỗi từ API
            console.error("Lỗi đăng nhập:", error.response.data.message);
            setMessage(error.response.data.message); // Hiển thị thông báo lỗi
         } else {
            console.error("Lỗi không xác định:", error.message);
            setMessage("Có lỗi xảy ra, vui lòng thử lại!");
         }
         setLoading(false);
      }
   };

   let handleSetPass = () => {
      setShowPassword(!showPassword)
   }
   // console.log(showPassword)
   const itemTabs = [
      {
         key: "1",
         label: "Tài khoản thường",
         icon: <CiUser />,
         children: (
            <div className="cardLogin user">
               <div className="social-login">
                  <a href="api/auth/google" className="login-gg">
                     <span><FaGoogle /></span>
                     <p>Đăng nhập Google</p>
                  </a>
                  {/* <button className="login-fb">
                     <span><FaFacebookF /></span>
                     <p>Đăng nhập Facebook</p>
                  </button> */}
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
                     <div className="pass">
                        <input
                           type={showPassword ? "text" : "password"}
                           name="password"
                           placeholder="Mật khẩu"
                           onChange={handleChange}
                           value={formData.password}
                        />
                        <span onClick={handleSetPass}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                     </div>

                     <select name="gender" onChange={handleChange} value={formData.gender}>
                        <option value="true">Nam</option>
                        <option value="false">Nữ</option>
                     </select>
                     <span className="error">{message}</span>
                     <input
                        type="text"
                        name="address"
                        className="address-input-user"
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
                  <a href="api/auth/google" className="login-gg">
                     <span><FaGoogle /></span>
                     <p>Đăng nhập Google</p>
                  </a>
                  {/* <button className="login-fb">
                     <span><FaFacebookF /></span>
                     <p>Đăng nhập Facebook</p>
                  </button> */}
               </div>
               <p className="text-center">Hoặc tạo tài khoản</p>
               <form onSubmit={handleCreateBusiness}>
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
                     <div className="item pass">
                        <input
                           type={showPassword ? "text" : "password"}
                           name="password"
                           placeholder="Mật khẩu"
                           onChange={handleChange}
                           value={formData.password}
                        />
                        <span onClick={handleSetPass}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                     </div>
                     <span className="error">{message}</span>
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
                  <span className="btn-switch" onClick={() => { setLogin(!login); setMessage("") }}> Đăng nhập</span>
               </p>
            </div >
         ) : (
            <div className="LoginPage">
               <div className="cardLogin loginFalse">
                  <div className="title">ĐĂNG NHẬP</div>
                  <div className="social-login">
                     <a href="api/auth/google" className="login-gg">
                        <span><FaGoogle /></span>
                        <p>Đăng nhập Google</p>
                     </a>
                     {/* <button className="login-fb">
                        <span><FaFacebookF /></span>
                        <p>Đăng nhập Facebook</p>
                     </button> */}
                  </div>
                  <p className="text-center">Hoặc đăng nhập Email</p>
                  <form onSubmit={handleLogin}>
                     <div className="row">
                        <div className="item">
                           <input
                              type="email"
                              name="email"
                              placeholder="Email"
                              onChange={handleChange}
                              value={formData.email}
                           />
                        </div>
                        <div className="item pass">
                           <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Mật khẩu"
                              onChange={handleChange}
                              value={formData.password}
                           />
                           <span onClick={handleSetPass}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                        </div>
                        <span className="error">{message}</span>
                        <button type="submit" disabled={loading}>{loading ? "Đang xử lý..." : "Đăng nhập"}</button>
                     </div>
                  </form>
                  <p className="text-center">Bạn chưa có tài khoản?
                     <span className="btn-switch" onClick={() => { setLogin(!login); setMessage("") }}> Đăng ký</span>
                  </p>
               </div>
            </div>
         )
         }
      </>
   );
}
