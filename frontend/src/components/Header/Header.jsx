import './Header.scss';
import LogoAvatar from "../../assets/Logo.svg";
import { RiMenuUnfold4Line } from "react-icons/ri";
import { Link } from 'react-router-dom';
export default function Header() {
   return (
      <>
         <div className="Header">
            <div className="Header-left">
               <div className="logo">
                  <img src={LogoAvatar} alt="Logo" />
               </div>
            </div>
            <div className="Header-center">
               <ul className='menuList'>
                  <li><Link to="/">Trang chủ</Link></li>
                  <li><Link to="/Shopping">Mua sắm</Link></li>
                  <li><Link to="/News">Tin tức</Link></li>
                  <li><Link to="/Tournament">Giải đấu</Link></li>
                  <li><Link to="/Team">Đội</Link></li>
                  <li><Link to="/Schedule">Lịch thi đấu</Link></li>
                  <li><Link to="/Rank">Bảng xếp hạng</Link></li>
               </ul>
            </div>
            <div className="Header-right">
               <div className="avatar"></div>
               <p className="name">Nguyễn Chí Nguyện</p>
               <div className="menu"><RiMenuUnfold4Line /></div>
            </div>
         </div>
      </>
   )
}