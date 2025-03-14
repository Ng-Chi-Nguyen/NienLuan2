
import './Header.scss';
import LogoAvatar from "../../assets/Logo.svg";
// import { RiMenuUnfold4Line } from "react-icons/ri";
import { PiNewspaper } from "react-icons/pi";
import { FaHome } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";
import { GiTargetPrize, GiTeamIdea } from "react-icons/gi";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";

import { Link } from 'react-router-dom';

export default function Header() {
   return (
      <>
         <div className="Header">
            <div className="Header-left">
               <span><CiMenuBurger /></span>
               <div className="logo">
                  <img src={LogoAvatar} alt="Logo" />
               </div>
            </div>
            <div className="Header-center">
               <ul className='menuList'>
                  <li>
                     <Link to="/" className='item'>
                        <p>Trang chủ</p>
                        <span><FaHome /></span>
                     </Link>
                  </li>
                  <li>
                     <Link to="/Shopping" className='item'>
                        <p>Mua sắm</p>
                        <span><MdOutlineShoppingCartCheckout /></span>
                     </Link>
                  </li>
                  <li>
                     <Link to="/News" className='item'>
                        <p>Tin tức</p>
                        <span><PiNewspaper /></span>
                     </Link></li>
                  <li>
                     <Link to="/Tournament" className='item'>
                        <p>Giải đấu</p>
                        <span><GiTargetPrize /></span>
                     </Link>
                  </li>
                  <li>
                     <Link to="/Team" className='item'>
                        <p>Đội</p>
                        <span><GiTeamIdea /></span>
                     </Link>
                  </li>
                  <li>
                     <Link to="/Schedule" className='item'>
                        <p>Đặt sân</p>
                        <span><TbBrandBooking /></span>
                     </Link>
                  </li>
                  {/* <li><Link to="/Rank">Bảng xếp hạng</Link></li> */}
               </ul>
            </div>
            <div className="Header-right">
               {/* <div className="avatar"></div>
               <p className="name">Nguyễn Chí Nguyện</p>
               <div className="menu"><RiMenuUnfold4Line /></div> */}
               <Link to="/Login">Đăng nhập</Link>
            </div>
         </div>
      </>
   )
}