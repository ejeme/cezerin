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

		const SCRIPT_URL =
			'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/flwpbf-inline.js';
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

		document.getElementById('ravepay_checkout').innerHTML = null;

		var x = getpaidSetup(
			{
				PBFPubKey: formSettings.public_key,
				//customer_email: formSettings.order.email,
				amount: formSettings.amount,
				//txref: formSettings.order.id,
				onclose: function() {},
				callback: function(response) {
					var txref = response.tx.txRef; // collect txRef returned and pass to a 					server page to complete status check.
					console.log('This is the response returned after a charge', response);

					if (
						response.tx.chargeResponseCode == '00' ||
						response.tx.chargeResponseCode == '0'
					) {
						onPayment();
						// redirect to a success page
					} else {
						// redirect to a failure page.
					}

					x.close(); // use this to close the modal immediately after payment.
				}
			},
			'#ravepay_checkout'
		);
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
