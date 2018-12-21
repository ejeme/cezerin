import React, { Component } from 'react';
// import the library
import Rave from 'react-flutterwave-rave';

export default class RavePay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: this.props.formSettings.ravePubKey, // RavePay PUBLIC KEY
			email: this.props.formSettings.email, // customer email
			amount: this.props.formSettings.amount // equals NGN 1000. Minimum amount allowed NGN 1 while on production or live system, it's 10
		};

		this.callback = this.callback.bind(this);
		this.close = this.close.bind(this);
	}
	callback = response => {
		console.log(response);
	};
	close = () => {
		console.log('Payment Closed');
	};

	render() {
		const { formSettings, shopSettings, onPayment, onCreateToken } = this.props;
		return (
			<div className="App">
				<Rave
					pay_button_text="Pay with Rave"
					class="Button"
					metadata={this.props.formSettings.data}
					reference={this.getReference()}
					email={this.state.email}
					amount={this.state.amount}
					ravePubKey={this.state.key}
					callback={this.callback}
					onclose={this.close}
					isProduction={false}
					tag="button"
				/>
			</div>
		);
	}
}
