import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected pageWrapper: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this._counter = this.container.querySelector('.header__basket-counter');
		this._catalog = this.container.querySelector('.gallery');
		this.pageWrapper = this.container.querySelector('.page__wrapper');
		this.basketButton = this.container.querySelector('.header__basket');

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this._counter, value);
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleClass(this.pageWrapper, 'page__wrapper_locked', value);
	}
}
