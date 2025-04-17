import {
	IProduct,
	TOrderInfo,
	TOrderData,
	TOrderContacts,
	IOrder,
	PaymentMethod,
} from '../../types';
import { IEvents } from '../base/events';

interface IOrderData {
	products: IProduct[];
	order: IOrder;
	addProduct(product: IProduct): void;
	deleteProduct(productId: string): void;
	clearBasket(): void;
}

export class OrderData implements IOrderData {
	protected _products: IProduct[] = [];
	protected _orderInfo: TOrderInfo = {
		payment: '',
		address: '',
		email: '',
		phone: '',
	};
	protected events: IEvents;
	protected formErrors: Partial<Record<keyof TOrderInfo, string>>;

	constructor(events: IEvents) {
		this.events = events;
	}

	set products(products: IProduct[]) {
		this._products = products;
		this.events.emit('products:changed');
	}

	get products() {
		return this._products;
	}

	set orderInfo(orderInfo: TOrderInfo) {
		this._orderInfo = orderInfo;
	}

	get orderInfo() {
		return this._orderInfo;
	}

	getTotal(): number {
		return this._products.reduce((a, product) => a + product.price, 0);
	}

	get order() {
		const order: IOrder = {
			...this._orderInfo,
			total: this.getTotal(),
			items: this._products.map((product) => product.id),
		};
		return order;
	}

	isInBasket(id: string): boolean {
		return this.order.items.includes(id);
	}

	addProduct(product: IProduct) {
		this._products.push(product);
		this.events.emit('products:changed');
	}

	deleteProduct(productId: string) {
		this._products = this._products.filter(
			(product) => product.id !== productId
		);
		this.events.emit('products:changed');
	}

	clearBasket() {
		this._products = [];
		this.events.emit('products:changed');
	}

	clearOrder() {
		this._orderInfo = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
	}

	protected setPayment(method: PaymentMethod) {
		this._orderInfo.payment = method;
	}

	setOrderField(field: keyof TOrderData, value: string) {
		if (field === 'payment') {
			this.setPayment(value as PaymentMethod);
		} else {
			this._orderInfo[field] = value;
		}
	}

	setContactsField(field: keyof TOrderContacts, value: string) {
		this._orderInfo[field] = value;
	}

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this._orderInfo.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this._orderInfo.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this._orderInfo.email) {
			errors.email = 'Необходимо указать электронную почту';
		}
		if (!this._orderInfo.phone) {
			errors.phone = 'Необходимо указать номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
