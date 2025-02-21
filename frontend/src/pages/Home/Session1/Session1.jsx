
import { BtnDiamond } from '../../../components/Button/Button';
import React from 'react';
import './Session1.scss';
export default function Session1() {
   return (
      <>
         <div className="Session1">
            <div className="title">
               <h2>Tổ chức giải đấu dễ dàng</h2>
               <h2>Quản lý các đội tham gia đơn giản!</h2>
            </div>
            <div className="listBtn">
               <BtnDiamond className='btnAddTournament' name="Tạo giải đấu" />
               <BtnDiamond className='btnAddTournament' name="Tạo đội hình" />
            </div>
            <div className="title co-white">
               <h2>Đặt sân dễ dàng</h2>
               <div className="listBtn">
                  <BtnDiamond className='btnAddTournament' name="Đặt sân bóng" />
               </div>
            </div>
         </div>
      </>
   )
}