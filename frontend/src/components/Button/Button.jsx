import './Button.scss';
export const BtnDiamond = (props) => {
   const { name } = props;
   return <button className="btn-parallelogram"><span>{name}</span></button>;
};