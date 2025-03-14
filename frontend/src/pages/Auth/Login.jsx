import Header from "../../components/Header/Header";
import './Login.scss';
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { IoBusinessOutline } from "react-icons/io5";
import { Tabs } from 'antd';
import { FaGoogle, FaFacebookF } from "react-icons/fa";
export default function Rank() {
   const [formData, setFormData] = useState({
      fullName: "",
      phone: "",
      email: "",
      password: "",
      address: ""
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleCreateUser = (e) => {
      e.preventDefault();
      console.log("Dữ liệu form:", formData);
   };

   const handleLogin = (e) => {
      e.preventDefault();
      console.log("Dữ liệu form:", formData);
   };

   const itemTabs = [
      {
         key: "1",
         label: "Tài khoản thường",
         icon: <CiUser />,
         children: (
            <div className="cardLogin">
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
                     <input type="text" name="fullName" placeholder="Họ và tên" onChange={handleChange} />
                     <input type="tel" name="phone" placeholder="Số điện thoại" onChange={handleChange} />
                     <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                     <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} />
                     <input type="text" name="address" placeholder="Địa chỉ" onChange={handleChange} />
                     <button type="submit">Đăng ký</button>
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
            <div className="cardLogin">
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
                     <input type="text" name="fullName" placeholder="Tên cửa hàng" onChange={handleChange} />
                     <input type="tel" name="phone" placeholder="Số điện thoại" onChange={handleChange} />
                     <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                     <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} />
                     <input type="text" name="address" placeholder="Địa chỉ" onChange={handleChange} />
                     <input type="text" name="owner_name" placeholder="Tên chủ doanh nghiệp" onChange={handleChange} />
                     <input type="text" name="license_number" placeholder="Số giấy phép kinh doanh" onChange={handleChange} />
                     <input type="text" name="tax_code" placeholder="Mã số thuế" onChange={handleChange} />
                     <input type="date" name="established_date" placeholder="Ngày thành lập" onChange={handleChange} />
                     <button type="submit">Đăng ký</button>
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
                     <button className="login-gg">
                        <span><FaGoogle /></span>
                        <p>Đăng nhập Google</p>
                     </button>
                     <button className="login-fb">
                        <span><FaFacebookF /></span>
                        <p>Đăng nhập Facebook</p>
                     </button>
                  </div>
                  <p className="text-center">Hoặc đăng nhập Email</p>
                  <form onSubmit={handleLogin}>
                     <div className="row">
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                        <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} />
                        <button type="submit">Đăng nhập</button>
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
