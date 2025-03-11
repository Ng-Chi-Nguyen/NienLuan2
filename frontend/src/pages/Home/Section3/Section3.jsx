import React from 'react';
import { PiComputerTower } from "react-icons/pi";
import { TbRocket } from "react-icons/tb";
import { ImCalendar } from "react-icons/im";
import { RiDeviceLine } from "react-icons/ri";
import { FaAddressCard } from "react-icons/fa";
import { MdContentPasteSearch, MdTouchApp, MdSupportAgent } from "react-icons/md";

import './Section3.scss';
export default function Section3() {
   return (
      <>
         <div className="container">
            <div className="Section3">
               <div className="title">
                  <h2>Chức năng hệ thống của chúng tôi</h2>
               </div>
               <div className="Body row g-3 gx-3">
                  <div className="Box col-xl-3 col-md-3 col-sm-6">
                     <span className="icon"><PiComputerTower /></span>
                     <div className="title-item">Đặt sân nhanh chóng</div>
                     <div className="content">
                        <p>Chỉ với vài thao tác đơn giản, bạn có thể tìm và đặt sân bóng phù hợp theo nhu cầu.</p>
                        <p>Hiện nay, nhiều chủ sân vẫn lựa chọn cách ghi chép thủ công bằng giấy hoặc File excel dẫn đến nhằm lẫn, chồng chéo lịch của khách hàng</p>
                     </div>
                  </div>
                  <div className="Box col-xl-3 col-md-3 col-sm-6">
                     <span className="icon"><ImCalendar /></span>
                     <div className="title-item">Quản lý lịch đặt sân dễ dàng</div>
                     <div className="content">
                        <p>Theo dõi sân đã đặt, cập nhật thời gian, thay đổi thông tin nhanh chóng.</p>
                        <p>Không lo lỡ hẹn! Hệ thống giúp bạn theo dõi chi tiết lịch đặt sân, nhắc nhở thời gian thi đấu và hỗ trợ thay đổi thông tin linh hoạt chỉ với vài thao tác đơn giản.</p>
                     </div>
                  </div>
                  <div className="Box col-xl-3 col-md-3 col-sm-6">
                     <span className="icon"><MdContentPasteSearch /></span>
                     <div className="title-item">Tìm kiếm sân tiện lợi</div>
                     <div className="content">
                        <p>Hệ thống giúp bạn lọc sân theo vị trí, giá cả, khung giờ trống để lựa chọn dễ dàng.</p>
                        <p>Dễ dàng so sánh và lựa chọn sân phù hợp với nhu cầu của bạn. Chỉ cần vài cú nhấp chuột, bạn có thể tìm thấy sân gần nhất với mức giá hợp lý và khung giờ phù hợp.</p>
                     </div>
                  </div>
                  <div className="Box col-xl-3 col-md-3 col-sm-6">
                     <span className="icon"><MdTouchApp /></span>
                     <div className="title-item">Giao diện thân thiện, dễ sử dụng</div>
                     <div className="content">
                        <p>Đặt sân chỉ trong vài giây, không cần gọi điện hay đến tận nơi, mọi lứa tuổi đều có thể sữ dụng dễ dàng.</p>
                        <p>Thiết kế trực quan, đơn giản giúp bạn thao tác dễ dàng ngay từ lần đầu sử dụng. Dù trên điện thoại hay máy tính, mọi thao tác đều nhanh chóng và thuận tiện.</p>
                     </div>
                  </div>
                  <div className="Box col-xl-3 col-md-3 col-sm-6">
                     <span className="icon"><RiDeviceLine /></span>
                     <div className="title-item">Tương thích đa nền tảng</div>
                     <div className="content">
                        <p>Dùng trên máy tính, điện thoại, tablet mọi lúc, mọi nơi.</p>
                        <p>Giao diện được tối ưu hóa cho mọi thiết bị, giúp bạn trải nghiệm mượt mà dù sử dụng trên Windows, macOS, iOS hay Android.</p>
                     </div>
                  </div>
                  <div className="Box col-xl-3 col-md-3 col-sm-6">
                     <span className="icon"><TbRocket /></span>
                     <div className="title-item">Hệ thống nhanh chóng, chính xác</div>
                     <div className="content">
                        <p>Đảm bảo mọi thông tin được cập nhật theo thời gian thực.</p>
                        <p>Mọi thao tác đều được xử lý ngay lập tức, giúp bạn không bỏ lỡ bất kỳ cơ hội nào. Dữ liệu luôn được cập nhật kịp thời và chính xác.</p>
                     </div>
                  </div>
                  <div className="Box col-xl-3 col-md-3 col-sm-6">
                     <span className="icon"><FaAddressCard /></span>
                     <div className="title-item">Bắt đầu ngay hôm nay!</div>
                     <div className="content">
                        <p>Đăng ký tài khoản và trải nghiệm ngay nền tảng đặt sân bóng tiện lợi nhất!</p>
                        <p>Tham gia ngay để trải nghiệm hệ thống đặt sân hiện đại, thao tác dễ dàng, giúp bạn nhanh chóng tìm được sân phù hợp mà không mất nhiều thời gian!</p>
                     </div>
                  </div>
                  <div className="Box col-xl-3 col-md-3 col-sm-6">
                     <span className="icon"><MdSupportAgent /></span>
                     <div className="title-item">Hỗ trợ khách hàng 24/7</div>
                     <div className="content">
                        <p>Luôn sẵn sàng giải đáp thắc mắc và hỗ trợ đặt sân bất kỳ lúc nào bạn cần.</p>
                        <p>Đội ngũ chăm sóc khách hàng luôn sẵn sàng tư vấn, giải đáp mọi thắc mắc và hỗ trợ bạn đặt sân mọi lúc, mọi nơi!</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}