import { useDispatch, useSelector } from "react-redux";
import { Fieldset } from "primereact/fieldset";
import { selectCurrentOrder } from "../../../redux/slices/ordersSlice";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

import "./Order.scss";
import { useState } from "react";
import Stock from "../Stock/Stock";

const Order = () => {
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectCurrentOrder);

  const [visibleBottom, setVisibleBottom] = useState(false);

  return (
    <div className="">
      <div className="surface-ground px-4 pb-8 pt-4 md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column">
        <Fieldset
          legend={
            <div className="flex align-items-center">
              <span className="font-bold">Customer Details</span>
            </div>
          }
          className="w-full custom-fieldset"
        >
          <div className="m-2 text-lg">
            <span className="font-bold">Name: </span>{" "}
            <span>{currentOrder.customer.name}</span>
          </div>
          <div className="m-2 text-lg">
            <span className="font-bold">Phone: </span>{" "}
            <span>{currentOrder.customer.phone}</span>
          </div>
          <div className="m-2 text-lg">
            <span className="font-bold">Address: </span>{" "}
            <span>{currentOrder.customer.address}</span>
          </div>
        </Fieldset>

        <Fieldset
          legend={
            <div className="flex align-items-center">
              <span className="font-bold mr-2">Order Details</span>
              <Button label="Add Item" icon="pi pi-plus" onClick={() => setVisibleBottom(true)} />
            </div>
          }
          className="mt-2 w-full custom-fieldset"
        >

          {
            currentOrder.items.map((item,index) => {
              return <Avatar label="U" />
            })
          }
          <Divider type="solid" />
          <div className="m-2 text-lg">
            <span className="font-bold">Total Price: </span>{" "}
            <span>{currentOrder.totalPrice} EGP</span>
          </div>
        </Fieldset>
      </div>
      <Sidebar
        visible={visibleBottom}
        position="bottom"
        onHide={() => setVisibleBottom(false)}
        className="custom-downbar"
      >
        <Stock fromOrder/>
      </Sidebar>
    </div>
  );
};

export default Order;
