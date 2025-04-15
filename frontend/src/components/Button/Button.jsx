import './Button.scss';
import { CiSearch } from "react-icons/ci";

export const BtnDiamond = (props) => {
   const { name } = props;
   return <button className="btn-parallelogram"><span>{name}</span></button>;
};

export const BtnAdd = (props) => {
   const { name } = props;
   return <button className="btn-add"><span>{name}</span></button>;
};

export const Search = (props) => {
   const { name, onChange } = props;
   return <div className='search'>
      <input type='text' placeholder={name} onChange={onChange} />
      <span><CiSearch /></span>
   </div>;
};

