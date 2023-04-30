import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
 import CheckoutForm from './components/CheckoutForm';
 import getStripe from '../../getStripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Donation() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (event) => {
  	event.preventDefault();

  	// const { sessionId } = await response.json();
  	// // redirect to stripe Checkout
  	// const stripe = await stripePromise;

  	// create a new Stripe Checkout Session
  	const session = await fetch('/api/create-checkout-session',{
  		method: 'POST',
  		headers: {
  			'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({ name, amount }),
  	}).then((res) => res.json());

  	//retrieve session ID from response
  	const { id: sessionId } = await response.json();

  	//redirect user to the stripe checkout page
  	const stripe = await stripePromise;
  	const result = await stripe.redirectToCheckout({
  		sessionId
  	});
  	if (result.error) {
  		console.error(result.error);
  	}
  };

  return(
  	<Elements stripe={stripePromise}>
  	<CheckoutForm
  		name={name}
  		setName={setName}
  		amount={amount}
  		setAmount={setAmount}
  		handleSubmit={handleSubmit}
  	/>
  	</Elements>
  	);
}

