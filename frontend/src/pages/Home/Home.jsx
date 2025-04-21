import Header from "../../components/Header/Header";
import React from 'react';
import './Home.scss';
import Session1 from "./Section1/Section1";
import Session2 from "./Section2/Section2";
import Session3 from "./Section3/Section3";
import Session4 from "./Section4/Section4";
import Footer from "../../components/Footer/Footer";
import { FloatButton } from 'antd';
import { PiRocket } from "react-icons/pi";
export default function Home() {
   return (
      <>
         <Header />
         <div className="HomePage">
            <Session1 />
            <Session2 />
            <Session3 />
            <Session4 />
         </div>
         <div className="BackTop">
            <FloatButton.BackTop
               visibilityHeight={300}
               icon={<PiRocket />}
               style={{ right: 50, bottom: 60, fontSize: 50, color: "orange" }}
            />
         </div>
         <Footer />
      </>
   )
}