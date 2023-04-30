import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

 const handleSubmit = async (event) => {
  	event.preventDefault();
  	if(!name) {
  		alert('Please enter your name');
  		return;
  	}
  	const parsedAmount = parseFloat(amount);
  	if (isNaN(parsedAmount) || parsedAmount < 1){
  		alert('Please enter a valid donation amount');
  		return;
  	}
  	//send form data to server to create checkout session
  	const response = await fetch('/api/create-checkout-session', {
  		method: 'POST',
  		headers: {
  			'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({ name, amount })
  	});

  	const session = await response.json();
  	// redirect to stripe Checkout
  	const stripe = await stripePromise;

  	await stripe.redirectToCheckout({
  		sessionId: session.id
  	});
  };

  return (
  	<div>
      <h1>Donate to our charity</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} required className='text-black'placeholder='enter name'/>
        </label>
        <br />
        <label>
          Amount:
          <input type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} required className='text-black'placeholder='enter amount' />
        </label>
        <br />
        <button type="submit" className='p-2 bg-gray-700 text-gray-200 hover:bg-gray-800 rounded-2'>Donate</button>
      </form>
    </div>
  	);
};

const WrapperCheckoutForm = () => (
	<Elements stripe={stripePromise}>
		<CheckoutForm />
		</Elements>
	)

export default WrapperCheckoutForm;