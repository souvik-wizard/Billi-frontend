export interface SellerDetails {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    pan: string;
    gst: string;
  }
  
export interface BillingDetails {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    stateCode: string;
  }
  
export interface ShippingDetails {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    stateCode: string;
  }
  
export interface OrderDetails {
    orderNo: string;
    orderDate: string;
  }
  
 export interface Item {
    description: string;
    unitPrice: number;
    quantity: number;
    discount?: number;
    taxRate: number;
    taxType: string;
  }
  