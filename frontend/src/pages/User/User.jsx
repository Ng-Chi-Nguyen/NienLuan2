import Header from "../../components/Header/Header";
import UserInfo from "./UserInfo/UserInfo";
import FoolbalField from "./FoolbalField/FoolbalField";
import './User.scss';
import { Tabs, FloatButton } from 'antd';
import Footer from "../../components/Footer/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingUser, BookingFootball, NextLavel } from "./Booking/Booking";
import StatisticalDate from "./Statistical_Date/Statistical_Date";
import StatisticalMonth from "./Statistical_Month/Statistical_Month";
import { PiRocket } from "react-icons/pi";

export default function User() {

   const [user, setUser] = useState(null);
   const navigate = useNavigate();
   const [alignValue,] = useState('center');

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const userData = params.get("user");

      if (token && userData) {
         try {
            // Parse userData trước khi lưu
            const parsedUser = JSON.parse(userData);

            // Lưu vào localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(parsedUser));

            setUser(parsedUser);

            navigate("/User", { replace: true });
         } catch (error) {
            console.error("Lỗi parse userData:", error);
         }
      } else {
         const storedUser = localStorage.getItem("user");
         if (storedUser) {
            try {
               setUser(JSON.parse(storedUser));
            } catch (error) {
               console.error("Lỗi khi parse user từ localStorage:", error);
            }
         }
      }
   }, [navigate]);

   if (!user) {
      return <p>Loading user...</p>;
   }

   // console.log(user)

   const items = [
      { key: '1', label: 'Lịch đặt sân của tôi', children: <BookingUser user={user} /> },
      { key: '2', label: user.type === "user" ? 'Nâng lên tài khoản doanh nghiệp' : "Lịch đắt sân bóng của tôi hôm nay", children: user.type === "business" ? <BookingFootball user={user} /> : <NextLavel /> },
   ];

   return (
      <>
         <Header />
         <div className="container">
            <div className="userPage">
               <UserInfo user={user} />
               <div className="table-booking">
                  <div className="header">
                     <Tabs
                        defaultActiveKey="1"
                        items={items}
                        indicator={{ size: origin => origin - 20, align: alignValue }}
                     />
                  </div>
               </div>
               {user.type === "business" ? (
                  <>
                     <FoolbalField user={user} />
                     <div className="Statistical">
                        <h2 className="title">Thống kê</h2>
                        <StatisticalDate user={user} />
                        <StatisticalMonth user={user} />
                     </div>
                  </>
               ) : (<></>)}

            </div>
         </div >
         <div className="BackTop">
            <FloatButton.BackTop
               visibilityHeight={300}
               icon={<PiRocket />}
               style={{ right: 50, bottom: 60, fontSize: 50, color: "orange" }}
            />
         </div>
         <Footer />
      </>
   );
}
