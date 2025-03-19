import { useState, useEffect } from 'react';
import { message } from "antd";
import './Header.scss';
import LogoAvatar from "../../assets/Logo.svg";
import { RiMenuUnfold4Line } from "react-icons/ri";

import { CiMenuBurger } from "react-icons/ci";
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
            const parsedUser = JSON.parse(storedUser);
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

   useEffect(() => {
      checkLogin();
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
      { path: "/", label: "Trang chủ" },
      { path: "/Schedule", label: "Đặt sân" },
   ];

   // Danh sách menu bên phải
   const menuRight = [
      { path: "/User", label: "Thông tin tài khoản" },
      { path: "/User", label: "Lịch đặt sân" },
   ];

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
            <div className="logo">
               <img src={LogoAvatar} alt="Logo" />
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
            <div className="menu" onClick={() => { setOpenRight(true); setOpenLeft(false); }}>
               <RiMenuUnfold4Line />
            </div>
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