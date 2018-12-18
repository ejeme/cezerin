import React, { Component } from 'react'
    // import the library
    import RavePaymentModal from 'react-ravepayment'
 
    export default class RavePay extends Component {
 
    		state = {
    		  key: this.props.formSettings.ravePubKey, // RavePay PUBLIC KEY
    		  email: this.props.formSettings.email, // customer email
    		  amount: this.props.formSettings.amount // equals NGN 1000. Minimum amount allowed NGN 1 while on production or live system, it's 10
    	    }
 
    	  callback = (response) => {
    		  console.log(response);
 
    	  }
 
    	  close = () => {
    		  console.log("Payment closed");
    	  }
 
    	  getReference = () => {
    		  let text = "";
    		  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";
 
    		  for( let i=0; i < 10; i++ )
    			  text += possible.charAt(Math.floor(Math.random() * possible.length));
 
              return text;
    	  }
 
    	render () {
            const { formSettings, shopSettings, onPayment, onCreateToken } = this.props;
        return (
          <div className='App'>
            <p className='App-intro'>
    	        <RavePaymentModal
    		        text="Make Payment"
    		        class="payButton"
    		        metadata={this.props.formSettings.data}
    		        reference={this.getReference()}
    		        email={this.state.email}
    		        amount={this.state.amount}
    		        ravePubKey={this.state.key}
    		        callback={this.callback}
    		        close={this.close}
                    isProduction={false}
                    tag="button"
    	        />
            </p>
          </div>
        )
      }
    }
 