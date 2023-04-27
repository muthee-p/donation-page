const redirectToCheckout = async () => {
	//create stripe checkout
	const{
	data: {id},
	} =await axios.post('/api/checkout_sessions',{
		items: Object.entries(cartDetails).map(([_, { id, quantity }]) => ({
			price: id,
			quantity,
		})),
	});
	//redirect to checkout
	const stripe = await getStripe();
	await stripe.redirectToCheckout({ sessionId: id});
};

return 