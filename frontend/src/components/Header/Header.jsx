import { useState, useEffect } from 'react';
import { Drawer, message } from "antd";
import './Header.scss';
import LogoAvatar from "../../assets/Logo.svg";
import { RiMenuUnfold4Line } from "react-icons/ri";
import { PiNewspaper } from "react-icons/pi";
import { FaHome } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";
import { GiTargetPrize, GiTeamIdea } from "react-icons/gi";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
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
   console.log(isLoggedIn)
   return (
      <div className="Header">
         <div className="Header-left">
            <span><CiMenuBurger /></span>
            <div className="logo">
               <img src={LogoAvatar} alt="Logo" />
            </div>
         </div>
         <div className="Header-center">
            <ul className='menuList'>
               <li><Link to="/" className='item'><p>Trang chủ</p><span><FaHome /></span></Link></li>
               <li><Link to="/Shopping" className='item'><p>Mua sắm</p><span><MdOutlineShoppingCartCheckout /></span></Link></li>
               <li><Link to="/News" className='item'><p>Tin tức</p><span><PiNewspaper /></span></Link></li>
               <li><Link to="/Tournament" className='item'><p>Giải đấu</p><span><GiTargetPrize /></span></Link></li>
               <li><Link to="/Team" className='item'><p>Đội</p><span><GiTeamIdea /></span></Link></li>
               <li><Link to="/Schedule" className='item'><p>Đặt sân</p><span><TbBrandBooking /></span></Link></li>
            </ul>
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
            <div className="menu" onClick={() => setOpen(true)}><RiMenuUnfold4Line /></div>
            <Drawer
               title="Menu"
               placement="right"
               onClose={() => setOpen(false)}
               open={open}
               width="150"
            >
               {isLoggedIn ? (
                  <p className="btn-logout" onClick={handleLogout}>Đăng xuất</p>
               ) : (
                  <Link to="/Login" className="btn-login">Đăng nhập</Link>
               )}
            </Drawer>
         </div>
      </div>
   );
}