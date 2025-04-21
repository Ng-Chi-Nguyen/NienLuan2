import { useState, useEffect } from 'react';
import { message } from "antd";
import './Header.scss';
import LogoAvatar from "../../assets/logo-sport.png";

import { RiMenuUnfold4Line } from "react-icons/ri";
import { IoHomeOutline, IoFootballOutline } from "react-icons/io5";
import { CiMenuBurger } from "react-icons/ci";
import { FaRegUser, FaRegCalendarCheck } from "react-icons/fa";

import { Link, useNavigate } from 'react-router-dom';

import MenuDrawer from "../MenuDrawer/MenuDrawer";

export default function Header() {
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   const [openLeft, setOpenLeft] = useState(false);  // Trạng thái menu trái
   const [openRight, setOpenRight] = useState(false); // Trạng thái menu phải
   const [user, setUser] = useState(null);
   const [isLoggedIn, setIsLoggedIn] = useState(false);

   const checkLogin = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
         try {
            // Parse user từ string JSON thành object 
            const parsedUser = JSON.parse(storedUser);
            // Nếu object hợp lệ
            if (parsedUser && parsedUser.name) {
               setUser(parsedUser);
               setIsLoggedIn(true);
            } else {
               throw new Error("Dữ liệu user không hợp lệ");
            }
         } catch (error) {
            console.error("Lỗi khi parse JSON:", error);
            localStorage.removeItem("user");
            setUser(null);
            setIsLoggedIn(false);
         }
      } else {
         setUser(null);
         setIsLoggedIn(false);
      }
   };
   // Chạy khi component render lần đầu (vì dependency rỗng)
   useEffect(() => {
      checkLogin();
      // Lắng nghe sự kiện storage → khi có thay đổi localStorage (ở tab khác), sẽ tự cập nhật lại user.
      window.addEventListener("storage", checkLogin);
      return () => window.removeEventListener("storage", checkLogin);
   }, []);

   const handleLogout = () => {
      setLoading(true);
      message.loading({ content: "Đang đăng xuất...", duration: 1.5 });

      setTimeout(() => {
         localStorage.removeItem("token");
         localStorage.removeItem("user");
         setUser(null);
         setIsLoggedIn(false);
         setLoading(false);
         navigate("/Login");
      }, 1500);
   };
   // console.log(isLoggedIn)

   // Danh sách menu bên trái
   const menuLeft = [
      { path: "/", label: "Trang chủ", icon: <IoHomeOutline /> },
      { path: "/Schedule", label: "Đặt sân", icon: <IoFootballOutline /> },
   ];

   // Danh sách menu bên phải
   const menuRight = [
      { path: "/User", label: "Thông tin tài khoản", icon: <FaRegUser /> },
      { path: "/User", label: "Lịch đặt sân", icon: <FaRegCalendarCheck /> },
   ];

   let handleHomePage = () => {
      navigate("/");
   }

   return (
      <div className="Header">
         <div className="Header-left">
            <div className="menu" onClick={() => { setOpenLeft(true); setOpenRight(false); }}>
               <CiMenuBurger />
            </div>
            <MenuDrawer
               open={openLeft}
               setOpen={setOpenLeft}
               isLoggedIn={isLoggedIn}
               handleLogout={handleLogout}
               placement="left"
               menuItems={menuLeft}
            />
            <div className="logo" onClick={handleHomePage}>
               <img src={LogoAvatar} alt="Logo" /> <span>BOOKING</span>
            </div>
         </div>
         <div className="Header-center">

         </div>
         <div className="Header-right">
            {isLoggedIn ? (
               <div className="user-info">
                  <div className="avatar">
                     <img src={user.avatar_url ? user.avatar_url : ""} alt="" />
                  </div>
                  <Link to="/User"><p className="name">{user?.name}</p></Link>
               </div>
            ) : (
               <Link to="/Login" className="btn-login">Đăng nhập</Link>
            )}
            {isLoggedIn ? (
               <div className="menu" onClick={() => { setOpenRight(true); setOpenLeft(false); }}>
                  <RiMenuUnfold4Line />
               </div>
            ) : (
               <></>
            )}
            <MenuDrawer
               open={openRight}
               setOpen={setOpenRight}
               isLoggedIn={isLoggedIn}
               handleLogout={handleLogout}
               placement="right"
               menuItems={menuRight}
            />
         </div>
      </div>
   );
}