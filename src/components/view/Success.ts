import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	protected _total: HTMLElement;
	protected finishButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this._total = this.container.querySelector('.order-success__description');
		this.finishButton = this.container.querySelector('.order-success__close');

		this.finishButton.addEventListener('click', () => {
			this.events.emit('order:finished');
		});
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
