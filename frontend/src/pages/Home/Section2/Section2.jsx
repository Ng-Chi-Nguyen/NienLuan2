import './Section2.scss';
export default function Section2() {
   return (
      <>
         <div className="Section2">
            <div className="container">
               <div className="title">
                  <h2>Đặt sân thi đấu</h2>
               </div>
               <div className="Execute row gx-3">
                  <div className="Box col-xl-4 col-md-4 col-sm-12">
                     <span>1</span>
                     <div className='content'>
                        <h3>Đặt sân</h3>
                        <p>Chọn sân - Chọn khung giờ phù hợp</p>
                     </div>
                  </div>
                  <div className="Box col-xl-4 col-md-4 col-sm-12">
                     <span>2</span>
                     <div className='content'>
                        <h3>Xác nhận đặt sân</h3>
                        <p>Nhập đầy đủ thông tin</p>
                        <p>Xác nhận đặt sân thành công</p>
                     </div>
                  </div>
                  <div className="Box col-xl-4 col-md-4 col-sm-12">
                     <span>3</span>
                     <div className='content'>
                        <h3>Hoàn tất & ra sân</h3>
                        <p>Tập hợp đồng đội</p>
                        <p>Chuẩn bị chiến đấu thôi! ⚽</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
} 