import { Collapse } from 'antd';
import 'antd/dist/reset.css'; // Import CSS của Ant Design
import './Section4.scss';
import phone from "../../../assets/phone.png";
import fb from "../../../assets/acebook.webp";
import email from "../../../assets/email.webp";
import zalo from "../../../assets/zalo.png";
import tiktok from "../../../assets/tiktok.png";
export default function Session4() {
   const faqItems = [
      {
         key: '1',
         label: 'Làm thế nào để đặt sân bóng?',
         children: (
            <>
               <p>• Bạn chỉ cần chọn sân, khung giờ phù hợp và xác nhận đặt sân qua hệ thống.</p>
               <p>• Sau khi xác nhận, bạn có thể thanh toán online hoặc trực tiếp tại sân.</p>
               <p>• Hệ thống sẽ gửi thông tin đặt sân qua email hoặc tin nhắn.</p>
            </>
         ),
      },
      {
         key: '2',
         label: 'Tôi có thể hủy hoặc thay đổi lịch đặt sân không?',
         children: (
            <>
               <p>• Bạn có thể hủy hoặc thay đổi lịch đặt sân trước ít nhất 2 giờ trước giờ đá.</p>
               <p>• Nếu đã thanh toán, hệ thống sẽ hoàn tiền theo chính sách hoàn tiền.</p>
               <p>• Một số sân có thể tính phí hủy nếu quá gần thời gian đã đặt.</p>
            </>
         ),
      },
      {
         key: '3',
         label: 'Tôi có thể đặt sân trước bao lâu?',
         children: (
            <>
               <p>• Bạn có thể đặt sân trước tối đa 7 ngày để đảm bảo có sân trống vào thời gian mong muốn.</p>
               <p>• Một số sân có thể chấp nhận đặt trước xa hơn nếu bạn liên hệ trực tiếp với quản lý sân.</p>
               <p>• Nếu đặt sân vào giờ cao điểm, nên đặt trước ít nhất 3 ngày để tránh hết chỗ.</p>
            </>
         ),
      },
      {
         key: '4',
         label: 'Có những phương thức thanh toán nào?',
         children: (
            <>
               <p>• Bạn có thể thanh toán bằng tiền mặt tại sân.</p>
               <p>• Hệ thống hỗ trợ thanh toán qua chuyển khoản ngân hàng.</p>
               <p>• Các ví điện tử như Momo, ZaloPay, và VNPay cũng được hỗ trợ.</p>
               <p>• Một số sân có chính sách thanh toán sau khi chơi, nhưng cần liên hệ trước.</p>
            </>
         ),
      },
      {
         key: '5',
         label: 'Tôi có thể thuê bóng và áo đấu tại sân không?',
         children: (
            <>
               <p>• Có, hầu hết các sân đều có dịch vụ cho thuê bóng với mức phí hợp lý.</p>
               <p>• Nếu bạn cần thuê áo đấu, nên đặt trước để đảm bảo có đủ số lượng.</p>
               <p>• Một số sân còn hỗ trợ thuê giày hoặc các phụ kiện đi kèm.</p>
            </>
         ),
      },
      {
         key: '6',
         label: 'Có chính sách giảm giá hay khuyến mãi không?',
         children: (
            <>
               <p>• Hệ thống thường xuyên có chương trình khuyến mãi cho khách hàng mới.</p>
               <p>• Giảm giá khi đặt sân theo nhóm lớn hoặc đặt theo giờ cố định hàng tuần.</p>
               <p>• Theo dõi ứng dụng hoặc website để cập nhật các ưu đãi mới nhất.</p>
            </>
         ),
      },
      {
         key: '7',
         label: 'Tôi có thể đặt sân theo giờ cố định hàng tuần không?',
         children: (
            <>
               <p>• Có, bạn có thể liên hệ trực tiếp với quản lý sân để đặt lịch cố định.</p>
               <p>• Đặt sân cố định thường có ưu đãi tốt hơn so với đặt lẻ từng ngày.</p>
               <p>• Nếu không thể tham gia vào tuần nào đó, cần báo trước để tránh mất suất.</p>
            </>
         ),
      },
   ];


   return (
      <>
         <div className="container">
            <div className="Section4">
               <h2 className="title text-center">FAQs – Câu hỏi thường gặp</h2>
               <div className="bodyContentFAQs">
                  <Collapse accordion items={faqItems} />
               </div>
               <div className="support">
                  <h2 className="title text-center">Liên hệ với chúng tôi để nhận hỗ trợ qua</h2>
                  <div className="bodyImg row">
                     <a href="/" target="_blank"><img src={phone} alt="" /></a>
                     <a href="/" target="_blank"><img src={fb} alt="" /></a>
                     <a href="/" target="_blank"><img src={email} alt="" /></a>
                     <a href="/" target="_blank"><img src={zalo} alt="" /></a>
                     <a href="/" target="_blank"><img src={tiktok} alt="" /></a>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}