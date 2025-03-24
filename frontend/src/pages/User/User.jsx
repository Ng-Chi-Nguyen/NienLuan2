import Header from "../../components/Header/Header";
import UserInfo from "./UserInfo/UserInfo";
import FoolbalField from "./FoolbalField/FoolbalField";
import './User.scss';

import Footer from "../../components/Footer/Footer";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



export default function User() {

   const [user, setUser] = useState(null);
   const navigate = useNavigate();


   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const userData = params.get("user");

      if (token && userData) {
         try {
            // 🛠 Parse userData trước khi lưu
            const parsedUser = JSON.parse(userData);

            // ✅ Lưu vào localStorage
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

   return (
      <>
         <Header />
         <div className="container">
            <div className="userPage">
               <UserInfo user={user} />
               <div className="table-booking">
                  <h4 className="title-table">Lịch đặt sân của tui</h4>
               </div>
               <FoolbalField user={user} />
            </div>

         </div >
         <Footer />
      </>
   );
}
