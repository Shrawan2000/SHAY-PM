import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { Button, message } from "antd";
import { GetAllBids, GetProductById } from "../../apicalls/products";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Divider from "../../components/Divider";

import BidModal from "./BidModel";
import { render } from "react-dom";

function ProductInfo() {
  const { user } = useSelector((state) => state.users);
  const [showAddNewBid, setShowAddNewBid] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(id);
      dispatch(SetLoader(false));
      if (response.success) {
        const bidsResponse = await GetAllBids({ product: id });
        setProduct({
          ...response.data,
          bids: bidsResponse.data,
        });
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    product && (
      <div>
        <div className="grid grid-cols-2 gap-5 mt-5">
          {/* images */}
          <div className="flex flex-col gap-5 ">
            <img
              src={product.image[selectedImageIndex]}
              alt=""
              className="w-full h-96 object-cover rounded-md"
              
            />

            <div className="flex gap-5 object-cover">
              {product.image.map((images, index) => {
                return (
                  <img
                    src={images}
                    alt=""
                    className={
                      "w-20 h-20 object-cover rounded-md cursor-pointer" +
                      (selectedImageIndex === index
                        ? "border-1 border-green-600 border-dashed p-2"
                        : "")
                    }
                    onClick={() => {
                      setSelectedImageIndex(index);
                    }}
                  />
                );
              })}
            </div>
            <Divider />
            <div>
              <h1 className="text-gray-600 ">Added on</h1>
              <span className="text-gray-600 ">
                {moment(product.createdAt).format("MMM D ,  YYYY hh:mm A")}
              </span>
            </div>
          </div>
          {/* DETAILS */}
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-orange-900">
                {product.name}
              </h1>
              <span>{product.description}</span>
              <Divider />
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-orange-900">
                  Products details
                </h1>
                <div className="flex justify-between mt-2">
                  <span>Price</span>
                  <span>$ {product.price}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Category</span>
                  <span className="uppercase">{product.category}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Bill Available</span>
                  <span> {product.billAvailable ? "yes" : "No"}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Box Available</span>
                  <span>{product.boxAvailable ? "yes" : "No"}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Accessories Available</span>
                  <span>{product.accessoriesAvailable ? "yes" : "No"}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Warranty Available</span>
                  <span>{product.warrantyAvailable ? "yes" : "No"}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>purchased year</span>
                  <span>
                    {moment().subtract(product.age, "years").format("YYYY")}(
                    {product.age} years ago)
                  </span>
                </div>
              </div>
              <Divider />
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-orange-900">
                  Seller details
                </h1>
                <div className="flex justify-between mt-2">
                  <span>Name</span>
                  <span className="uppercase">{product.seller.name}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Email</span>
                  <span>{product.seller.email}</span>
                </div>
              </div>
              <Divider />
              <div className="flex flex-col mb-5">
                <div className="flex justify-between">
                  <h1 className="text-2xl font-semibold text-orange-900">
                    Bids
                  </h1>
                  <Button
                    onClick={() => setShowAddNewBid(!showAddNewBid)}
                    disabled={user._id === product.seller._id}
                  >
                    New Bid
                  </Button>
                </div>
              </div>
              {product.showBidsOnProductPage &&
                product?.bids?.map((bid) => {
                  return (
                    <div className="border border-gray-400 border-solid p-3 rounded mt-4">
                      <div className="flex justify-between  text-gray-700">
                        <span>Name</span>
                        <span>{bid.buyer.name}</span>
                      </div>
                      <div className="flex justify-between  text-gray-700">
                        <span>Bid Amount</span>
                        <span>$ {bid.bidAmount}</span>
                      </div>
                      <div className="flex justify-between  text-gray-700">
                        <span>Bid Place on</span>
                        <span>
                          {" "}
                          {moment(bid.createdAt).format("MMM D , YYYY hh:mm A")}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {showAddNewBid && (
          <BidModal
            product={product}
            reloadData={getData}
            showBidModal={showAddNewBid}
            setShowBidModal={setShowAddNewBid}
          />
        )}
      </div>
    )
  );
}

export default ProductInfo;
