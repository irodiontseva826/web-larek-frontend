import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IForm {
	errors: string;
	valid: boolean;
}

export class Form<T> extends Component<IForm> {
	protected _valid: boolean;
	protected _errors: string;
	protected errorsContainer: HTMLElement;
	protected submitButton: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this._valid = false;
		this._errors = '';
		this.errorsContainer = this.container.querySelector('.form__errors');
		this.submitButton = this.container.querySelector('button[type=submit]');

		this.container.addEventListener('input', (evt: Event) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}:input`, { field, value });
	}

	set errors(value: string) {
		this._errors = value;
		this.setText(this.errorsContainer, value);
	}

	get errors() {
		return this._errors;
	}

	set valid(state: boolean) {
		this._valid = state;
		this.setDisabled(this.submitButton, !state);
	}

	get valid() {
		return this._valid;
	}

	clearFrom() {
		this._valid = false;
		this._errors = '';
	}

	render(state: Partial<T> & IForm): HTMLElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
