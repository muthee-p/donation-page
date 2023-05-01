import {checkout} from '../../checkout';

export default async function handler(req, res) {
	if (req.method === 'POST'){
		const { name, amount } = req.body;
		//validate form data
		if(!name || !amount) {
			res.status(400).json({ error: 'Invalid form data'});
			return;
		}
		const parsedAmount = parseFloat(amount);
		if(isNaN(parsedAmount)|| parsedAmount < 1) {
			res.status(400).json({ error: 'Invalid donation amount'});
			return;
		}
		//create Checkout session
		try{
			const session = await getStripe.checkout.session.create({
				payment_method_types: ['card'],
				line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: 'Donation'
						},
						unit_amount: parsedAmount * 100
					},
					quantity: 1
				}],
				mode: 'payment',
				success_url: '${process.env.NEXT_PUBLIC_BASE_URL}/success',
				cancel_url: '${process.env.NEXT_PUBLIC_BASE_URL}/cancel'
			});
			res.status(200).json({sesionId: session.id});
		}catch (error){
			console.error(error);
			res.status(500).json({ error: 'Server error' });
		}
	}else {
		res.status(405).json({ error: 'method not allowed'});
	}
}