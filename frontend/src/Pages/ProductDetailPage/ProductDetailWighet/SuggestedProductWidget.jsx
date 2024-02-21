import ProductCard from "../../../Components/Layout/ProductCard/ProductCard";
import PropTypes from "prop-types";
export default function SuggestedProductWidget({ data }) {
  return (
    <div>
      {data && (
        <div className="w-11/12 mx-auto p-4">
          <h1 className="text-[27px] mb-4 text-center md:text-start border-b  font-[600] font-Roboto pb-[20px]">
            Related Products
          </h1>
          <div className="grid grid-cols-2 gap-[20px] md:grid-cols-3 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {data && data.map((d, i) => <ProductCard data={d} key={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
SuggestedProductWidget.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};
