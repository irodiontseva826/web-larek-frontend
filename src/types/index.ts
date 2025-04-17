export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
export type TProductCard = Omit<IProduct, 'description'>;

export type TProductPreview = IProduct;

export type TProductInBasket = Pick<IProduct, 'id' | 'title' | 'price'>;

export type PaymentMethod = 'cash' | 'card' | '';

export interface IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export type TOrderInfo = Omit<IOrder, 'total' | 'items'>;

export type TOrderData = Pick<IOrder, 'payment' | 'address'>;

export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

export interface IOrderResult {
	id: string;
	total: number;
}
