import Header from "../../components/Header/Header";
import Logo from "../../assets/backgroung-lien-quan.jpg";
export default function Rank() {
   return (
      <>
         <Header />
         <div className="RankPage">
            Rank page
            <img src={Logo} alt="" />
         </div>
      </>
   )
}