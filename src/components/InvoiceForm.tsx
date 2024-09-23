import React, { useState } from "react";
import axios from "axios";
import {
  SellerDetails,
  BillingDetails,
  ShippingDetails,
  OrderDetails,
  Item,
} from "../types/index";

const InvoiceForm: React.FC = () => {
  const [formData, setFormData] = useState({
    sellerDetails: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      pan: "",
      gst: "",
    } as SellerDetails,
    billingDetails: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      stateCode: "",
    } as BillingDetails,
    shippingDetails: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      stateCode: "",
    } as ShippingDetails,
    orderDetails: {
      orderNo: "",
      orderDate: "",
    } as OrderDetails,
    items: [] as Item[],
    reverseCharge: "No",
    placeOfSupply: "",
    placeOfDelivery: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: keyof typeof formData
  ) => {
    const sectionData = formData[section] as Record<string, any>;
    setFormData({
      ...formData,
      [section]: {
        ...sectionData,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const items = [...formData.items];
    items[index] = {
      ...items[index],
      [e.target.name]: e.target.value,
    };
    setFormData({ ...formData, items });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: "",
          unitPrice: 0,
          quantity: 0,
          discount: 0,
          taxRate: 0,
          taxType: "",
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    const items = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-invoice",
        formData,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Invoice-${formData.orderDetails.orderNo}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating invoice", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      {/* Seller Details */}
      <h2 className="text-xl font-bold mb-4">Seller Details</h2>
      {Object.keys(formData.sellerDetails).map((key) => (
        <div className="mb-4" key={key}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <input
            name={key}
            type="text"
            value={(formData.sellerDetails as any)[key]}
            onChange={(e) => handleInputChange(e, "sellerDetails")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          />
        </div>
      ))}

      {/* Billing Details */}
      <h2 className="text-xl font-bold mb-4">Billing Details</h2>
      {Object.keys(formData.billingDetails).map((key) => (
        <div className="mb-4" key={key}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <input
            name={key}
            type="text"
            value={(formData.billingDetails as any)[key]}
            onChange={(e) => handleInputChange(e, "billingDetails")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          />
        </div>
      ))}

      {/* Shipping Details */}
      <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
      {Object.keys(formData.shippingDetails).map((key) => (
        <div className="mb-4" key={key}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <input
            name={key}
            type="text"
            value={(formData.shippingDetails as any)[key]}
            onChange={(e) => handleInputChange(e, "shippingDetails")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          />
        </div>
      ))}

      {/* Order Details */}
      <h2 className="text-xl font-bold mb-4">Order Details</h2>
      {Object.keys(formData.orderDetails).map((key) => (
        <div className="mb-4" key={key}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {key === "orderNo" ? "Order Number" : "Order Date"}
          </label>
          <input
            name={key}
            type={key === "orderDate" ? "date" : "text"}
            value={(formData.orderDetails as any)[key]}
            onChange={(e) => handleInputChange(e, "orderDetails")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          />
        </div>
      ))}

      {/* Items */}
      <h2 className="text-xl font-bold mb-4">Items</h2>
      {formData.items.map((item, index) => (
        <div key={index} className="mb-6 border-b pb-4">
          <h3 className="text-lg font-bold mb-2">Item {index + 1}</h3>
          {Object.keys(item).map((key) => (
            <div className="mb-4" key={key}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                name={key}
                type={
                  key === "description" || key === "taxType" ? "text" : "number"
                }
                value={(item as any)[key]}
                onChange={(e) => handleItemChange(e, index)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Remove Item
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6"
      >
        Add Item
      </button>

      {/* Reverse Charge */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Reverse Charge
        </label>
        <input
          name="reverseCharge"
          type="text"
          value={formData.reverseCharge}
          onChange={(e) =>
            setFormData({ ...formData, reverseCharge: e.target.value })
          }
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>

      {/* Place of Supply */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Place of Supply
        </label>
        <input
          name="placeOfSupply"
          type="text"
          value={formData.placeOfSupply}
          onChange={(e) =>
            setFormData({ ...formData, placeOfSupply: e.target.value })
          }
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>

      {/* Place of Delivery */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Place of Delivery
        </label>
        <input
          name="placeOfDelivery"
          type="text"
          value={formData.placeOfDelivery}
          onChange={(e) =>
            setFormData({ ...formData, placeOfDelivery: e.target.value })
          }
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate Invoice
      </button>
    </form>
  );
};

export default InvoiceForm;
