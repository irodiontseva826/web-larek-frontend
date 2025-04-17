import './scss/styles.scss';
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter, IEvents } from './components/base/events';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsData } from './components/model/ProductsData';
import { OrderData } from './components/model/OrderData';
import { Page } from './components/view/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { Card } from './components/view/Card';
import { IProduct, TOrderData, TOrderContacts } from './types';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events: IEvents = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

const productsData = new ProductsData(events);
const orderData = new OrderData(events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

events.on('catalog:changed', () => {
	page.catalog = productsData.products.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), events);
		return card.render({
			id: item.id,
			title: item.title,
			category: item.category,
			image: item.image,
			price: item.price,
		});
	});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('product:select', (data: { id: string }) => {
	productsData.preview = data.id;
});

events.on('preview:changed', (data: { id: string }) => {
	const product: IProduct = productsData.getProduct(data.id);
	const card = new Card(cloneTemplate(cardPreviewTemplate), events, () =>
		events.emit('product:add', product)
	);

	card.toggleButton(orderData.isInBasket(product.id) || product.price === null);

	modal.render({
		content: card.render({
			id: product.id,
			title: product.title,
			category: product.category,
			image: product.image,
			description: product.description,
			price: product.price,
		}),
	});
});

events.on('products:changed', () => {
	page.counter = orderData.products.length;
	basket.total = orderData.getTotal();
	basket.items = orderData.products.map((product) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), events, () =>
			events.emit('product:delete', product)
		);
		card.index = orderData.products.indexOf(product) + 1;
		return card.render({
			id: product.id,
			title: product.title,
			price: product.price,
		});
	});
	basket.toggleButton(orderData.products.length === 0);
});

events.on('product:add', (product: IProduct) => {
	orderData.addProduct(product);
	modal.close();
});

events.on('product:delete', (product: IProduct) => {
	orderData.deleteProduct(product.id);
});

events.on('basket:open', () => {
	basket.toggleButton(orderData.products.length === 0);
	modal.render({ content: basket.render() });
});

events.on('basket:submit', () => {
	modal.render({
		content: order.render({
			valid: order.valid,
			errors: order.errors,
			payment: orderData.order.payment,
			address: orderData.order.address,
		}),
	});
});

events.on('order:input', (data: { field: keyof TOrderData; value: string }) => {
	orderData.setOrderField(data.field, data.value);
	orderData.validateOrder();
});

events.on('orderFormErrors:change', (errors: Partial<TOrderData>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('. ');
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			valid: contacts.valid,
			errors: contacts.errors,
			email: orderData.order.email,
			phone: orderData.order.phone,
		}),
	});
});

events.on(
	'contacts:input',
	(data: { field: keyof TOrderContacts; value: string }) => {
		orderData.setContactsField(data.field, data.value);
		orderData.validateContacts();
	}
);

events.on('contactsFormErrors:change', (errors: Partial<TOrderContacts>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('. ');
});

events.on('contacts:submit', () => {
	api
		.postOrder(orderData.order)
		.then((result) => {
			success.total = result.total;
			orderData.clearBasket();
			orderData.clearOrder();
			order.clearFrom();
			contacts.clearFrom();
			modal.render({ content: success.render() });
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('order:finished', () => {
	modal.close();
});

api
	.getProductList()
	.then((products) => {
		productsData.products = products;
	})
	.catch((err) => {
		console.error(err);
	});
