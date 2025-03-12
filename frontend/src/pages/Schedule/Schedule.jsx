import { BtnAdd, Search } from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import './Schedule.scss';
import { FaPhoneAlt, FaMapMarkedAlt } from "react-icons/fa";
import { Pagination } from 'antd';
export default function Schedule() {

   return (
      <>
         <Header />
         <div className="SchedulePage">
            <div className="container">
               <div className="row">
                  <div className="left col-xl-2">
                     <h4>Lọc sân bóng</h4>
                     <select name="" id="">
                        <option value="">Tỉnh - thành phố</option>
                     </select>
                     <select name="" id="">
                        <option value="">Quận - huyện</option>
                     </select>
                     <select name="" id="">
                        <option value="">Xã - phường</option>
                     </select>
                  </div>
                  <div className="right col-xl-10">
                     <div className="mg-r row justify-content-center">
                        <Search name="Tìm sân bóng" />
                     </div>
                     <h2 className="text-center">Bãi sân</h2>
                     <div className="row">
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                     </div>
                  </div>
               </div>
               <Pagination align="end" defaultCurrent={1} total={50} />
            </div>
         </div>
      </>
   );
}
