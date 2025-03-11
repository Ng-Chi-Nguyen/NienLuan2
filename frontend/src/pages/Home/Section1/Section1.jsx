
import { BtnDiamond } from '../../../components/Button/Button';
import React from 'react';
import './Section1.scss';
export default function Section1() {
   return (
      <>
         <div className="Section1">
            <div className="title">
               <h2>Đặt sân thuận tiện</h2>
               <h2>Sắp xếp trận đấu trong tích tắc!</h2>
            </div>
            <div className="listBtn">
               <BtnDiamond className='btnAddTournament' name="Đặt sân bóng" />
            </div>
         </div>
      </>
   )
}