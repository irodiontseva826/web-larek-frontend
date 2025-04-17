import { PaymentMethod, TOrderData } from '../../types';
import { Form } from '../common/Form';
import { IEvents } from '../base/events';

export class OrderForm extends Form<TOrderData> {
	protected paymentButtons: HTMLButtonElement[];
	protected _address: HTMLInputElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this.paymentButtons = Array.from(
			this.container.querySelectorAll('.button_alt')
		);
		this._address = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name as PaymentMethod;
				this.onInputChange('payment', button.name);
			});
		});
	}

	set payment(value: PaymentMethod) {
		this.paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === value);
		});
	}

	set address(value: string) {
		this._address.value = value;
	}
}
