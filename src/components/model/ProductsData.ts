import { IProduct } from '../../types';
import { IEvents } from '../base/events';

interface IProductsData {
	products: IProduct[];
	preview: string;
	getProduct(id: string): IProduct;
}

export class ProductsData implements IProductsData {
	protected _products: IProduct[];
	protected _preview: string;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set products(products: IProduct[]) {
		this._products = products;
		this.events.emit('catalog:changed');
	}

	get products() {
		return this._products;
	}

	getProduct(id: string): IProduct {
		return this._products.find((product) => product.id === id);
	}

	set preview(id: string) {
		this._preview = id;
		this.events.emit('preview:changed', { id: this._preview });
	}

	get preview() {
		return this._preview;
	}
}
