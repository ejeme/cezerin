import Ravepay from 'ravepay';
import OrdersService from '../services/orders/orders';
import OrdertTansactionsService from '../services/orders/orderTransactions';

const getPaymentFormSettings = options => {
	const { gateway, gatewaySettings, order, amount, currency } = options;
	const formSettings = {
		order_id: order.id,
		amount,
		currency,
		email: order.email,
		public_key: gatewaySettings.public_key
	};
	return Promise.resolve(formSettings);
};

const processOrderPayment = async ({ order, gatewaySettings, settings }) => {
	try {
		const rave = Ravepay(
			gatewaySettings.public_key,
			gatewaySettings.secret_key,
			PRODUCTION_FLAG
		);
		const charge = await rave.Card.charge({
			amount: order.grand_total * 100,
			currency: settings.currency_code,
			description: `Order #${order.number}`,
			statement_descriptor: `Order #${order.number}`,
			metadata: {
				order_id: order.id
			},
			source: order.payment_token
		})
			.then(resp => {})
			.catch(err => {});

		// status: succeeded, pending, failed
		var payload = {
			//From the Rave website
			PBFPubKey: gatewaySettings.public_key,
			transaction_reference: ref,
			otp: ''
		};
		rave.Card.validate(payload)
			.then(resp => {
				//From the Rave Website
				return resp.body;
			})
			.catch(err => {});

		const paymentSucceeded =
			charge.status === 'succeeded' || resp.body === true;

		if (paymentSucceeded) {
			await OrdersService.updateOrder(order.id, {
				paid: true,
				date_paid: new Date()
			});
		}

		await OrdertTansactionsService.addTransaction(order.id, {
			transaction_id: charge.id,
			amount: charge.amount / 100,
			currency: charge.currency,
			status: charge.status,
			details: charge.outcome.seller_message,
			success: paymentSucceeded
		});

		return paymentSucceeded;
	} catch (err) {
		// handle errors
		return false;
	}
};

export default {
	getPaymentFormSettings,
	processOrderPayment
};
