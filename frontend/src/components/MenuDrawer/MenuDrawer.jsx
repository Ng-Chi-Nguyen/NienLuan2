import { Drawer } from "antd";
import { Link } from "react-router-dom";
import './MenuDrawer.scss';
export default function MenuDrawer({ open, setOpen, isLoggedIn, handleLogout, placement, menuItems }) {

   return (
      <Drawer
         title={placement === "left" ? "Danh sách trang" : "Tài khoản"}
         placement={placement}
         onClose={() => setOpen(false)}
         open={open}
         width={placement === "left" ? 200 : 200}
      >
         <ul className="drawer-menu">
            {menuItems.map((item, index) => (
               <li key={index}>
                  <Link to={item.path} className="drawer-item"><span>{item.icon}</span> {item.label}</Link>
               </li>
            ))}
            {placement === "right" && isLoggedIn && (
               <p className="btn-logout" onClick={handleLogout}>Đăng xuất</p>
            )}
         </ul>
      </Drawer>
   );
}
