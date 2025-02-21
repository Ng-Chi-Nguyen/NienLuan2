import Header from "../../components/Header/Header";
import React from 'react';
import './Home.scss';
import Session1 from "./Session1/Session1";
import Session2 from "./Session2/Session2";
import Session3 from "./Session3/Session3";
import Footer from "../../components/Footer/Footer";
export default function Home() {
   return (
      <>
         <Header />
         <div className="HomePage">
            <div className="session1">
               <Session1 />
            </div>
            <div className="session2">
               <Session2 />
            </div>
         </div >
         <div className="session2">
            <Session3 />
         </div>
         <Footer />
      </>
   )
}