import { IProduct } from '../../types';
import { categories } from '../../utils/constants';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Card extends Component<IProduct> {
	protected _id: string;
	protected _description: HTMLElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _index: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEvents,
		callback?: Function
	) {
		super(container);
		this._category = this.container.querySelector('.card__category');
		this._description = this.container.querySelector('.card__text');
		this._index = this.container.querySelector('.basket__item-index');
		this._image = this.container.querySelector('.card__image');
		this._price = this.container.querySelector('.card__price');
		this._title = this.container.querySelector('.card__title');
		this.button = this.container.querySelector('.card__button');

		if (callback) {
			this.button.addEventListener('click', callback.bind(this));
		} else {
			this.container.addEventListener('click', () => {
				this.events.emit('product:select', { id: this._id });
			});
		}
	}

	set id(id: string) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${categories[value]}`;
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set image(src: string) {
		this.setImage(this._image, src, this.title);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	toggleButton(state: boolean) {
		this.setDisabled(this.button, state);
	}
}
