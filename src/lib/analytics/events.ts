/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProduct } from "@/types";
import { pushDataLayer } from "./dataLayer";
import { CartItem } from "@/types/cart.types";
import { cartValue, CURRENCY, mapItem } from "./analytics";

export const AnalyticsEvents = {
  viewItem(product: IProduct) {
    pushDataLayer({
      event: "view_item",

      ecommerce: {
        currency: CURRENCY,

        value: product.discountPrice || product.price,

        items: [mapItem(product)],
      },
    });
  },

  selectItem({
    product,
    index,
    listId,
    listName,
  }: {
    product: IProduct;
    index: number;
    listId: string;
    listName: string;
  }) {
    pushDataLayer({
      event: "select_item",

      ecommerce: {
        item_list_id: listId,

        item_list_name: listName,

        items: [mapItem(product, index, listId, listName)],
      },
    });
  },

  pageView({
    title,
    path,
    location,
  }: {
    title: string;
    path: string;
    location: string;
  }) {
    pushDataLayer({
      event: "page_view",

      page_title: title,

      page_path: path,

      page_location: location,
    });
  },

  addToCart(product: any) {
    pushDataLayer({
      event: "add_to_cart",

      ecommerce: {
        currency: CURRENCY,

        value: (product.discountPrice || product.price) * product.quantity,

        items: [mapItem(product)],
      },
    });
  },

  removeFromCart(product: CartItem) {
    pushDataLayer({
      event: "remove_from_cart",

      ecommerce: {
        currency: CURRENCY,

        value: (product.discountPrice || product.price) * product.quantity,

        items: [mapItem(product)],
      },
    });
  },

  viewCart(items: CartItem[]) {
    pushDataLayer({
      event: "view_cart",

      ecommerce: {
        currency: CURRENCY,

        value: cartValue(items),

        items: items.map((item) => mapItem(item)),
      },
    });
  },

  beginCheckout(items: any[]) {
    pushDataLayer({
      event: "begin_checkout",

      ecommerce: {
        currency: CURRENCY,

        value: cartValue(items),

        items: items.map((item) => mapItem(item)),
      },
    });
  },

  addShippingInfo({
    shippingTier,
    value,
    cartItems,
  }: {
    shippingTier: string;
    value: number;
    cartItems: CartItem[];
  }) {
    pushDataLayer({
      event: "add_shipping_info",

      ecommerce: {
        currency: CURRENCY,

        value,

        shipping_tier: shippingTier,

        items: cartItems.map((item) => mapItem(item)),
      },
    });
  },

  applyCoupon({
    coupon,
    discount,
    value,
    cartItems,
  }: {
    coupon: string;
    discount: number;
    value: number;
    cartItems: CartItem[];
  }) {
    pushDataLayer({
      event: "apply_coupon",

      ecommerce: {
        currency: CURRENCY,

        coupon,

        discount,

        value,

        items: cartItems.map((item) => mapItem(item)),
      },
    });
  },

  purchase({
    transactionId,
    value,
    shipping,
    tax = 0,
    coupon,
    cartItems,
  }: {
    transactionId: string;

    value: number;

    shipping: number;

    tax?: number;

    coupon?: string | null;

    cartItems: CartItem[];
  }) {
    pushDataLayer({
      event: "purchase",

      ecommerce: {
        transaction_id: transactionId,

        value,

        currency: CURRENCY,

        shipping,

        tax,

        coupon,

        items: cartItems.map((item) => mapItem(item)),
      },
    });
  },

  viewItemList({
    products,
    listId,
    listName,
  }: {
    products: IProduct[];
    listId: string;
    listName: string;
  }) {
    pushDataLayer({
      event: "view_item_list",

      ecommerce: {
        item_list_id: listId,

        item_list_name: listName,

        items: products.map((item, index) =>
          mapItem(item, index, listId, listName),
        ),
      },
    });
  },
};
