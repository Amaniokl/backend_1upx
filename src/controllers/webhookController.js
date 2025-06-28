import { Webhook } from 'svix';
import { sendEmail } from '../services/mailService.js';
import dotenv from 'dotenv';

dotenv.config();

export const handleClerkWebhook = async (req, res) => {
//   const payload = req.body;
//   const headers = req.headers;

//   const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//   let evt;
//   try {
//     evt = wh.verify(payload, headers);
//   } catch (err) {
//     console.error('❌ Webhook verification failed:', err);
//     return res.status(400).send('Invalid signature');
//   }

//   const { type, data } = evt;

//   if (type === 'user.created') {
//     console.log('📩 Webhook received:', type);

//     const email = data.email_addresses?.[0]?.email_address;
//     const name = data.first_name || '';

//     const html = `
//       <div style="font-family: sans-serif;">
//         <h1>Hey ${name || 'there'}, welcome to 1upX 👋</h1>
//         <p>We're thrilled to have you on board.</p>
//         <p>Explore, create, and elevate your game with AI ✨</p>
//         <br/>
//         <p>– The 1upX Team</p>
//       </div>
//     `;

//     await sendEmail({
//       to: email,
//       subject: '🎉 Welcome to 1upX!',
//       html,
//     });
//   }

//   return res.status(200).json({ received: true });
};
