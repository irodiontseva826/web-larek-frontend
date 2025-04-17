import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { createElement } from '../../utils/utils';

interface IBasket {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasket> {
	protected _items: HTMLElement;
	protected _total: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this._items = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this.button = this.container.querySelector('.basket__button');

		this.button.addEventListener('click', () => {
			this.events.emit('basket:submit');
		});
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._items.replaceChildren(...items);
		} else {
			this._items.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Пусто',
				})
			);
		}
	}

	set total(value: number) {
		this.setText(this._total, `${value} синапсов`);
	}

	toggleButton(state: boolean) {
		this.setDisabled(this.button, state);
	}
}
