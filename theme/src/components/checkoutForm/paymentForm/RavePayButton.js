import React from 'react';

let scriptAdded = false;
export default class RavePayButton extends React.Component {
	constructor(props) {
		super(props);
	}

	addScript = () => {
		if (scriptAdded) {
			this.executeScript();
			return;
		}

		const SCRIPT_URL = 'https://rave-api-v2.herokuapp.com/flwv3-pug/getpaidx/api/flwpbf-inline.js';
		const container = document.body || document.head;
		const script = document.createElement('script');
		script.src = SCRIPT_URL;
		script.onload = () => {
			this.executeScript();
		};
		container.appendChild(script);
		scriptAdded = true;
	};

	executeScript = () => {
		const { formSettings, shopSettings, onPayment } = this.props;

		RavePayCheckout.init({
			data: formSettings.data,
			signature: formSettings.signature,
			language: formSettings.language,
			embedTo: '#ravepay_checkout',
			mode: 'embed'
		})
			.on('ravepay.callback', function(data) {
				if (data.status === 'success') {
					onPayment();
				}
			})
			.on('ravepay.ready', function(data) {
				// ready
			})
			.on('ravepay.close', function(data) {
				// close
			});
	};

	componentDidMount() {
		this.addScript();
	}

	componentDidUpdate() {
		this.executeScript();
	}

	render() {
		const { formSettings, shopSettings, onPayment } = this.props;

		return (
			<div>
				<div id="ravepay_checkout" />
			</div>
		);
	}
}
