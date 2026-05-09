import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendSMS({
  to,
  body,
}: {
  to: string;
  body: string;
}) {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_SMS_FROM,
      to,
    });
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('SMS error:', error);
    return { success: false, error };
  }
}

export async function sendWhatsApp({
  to,
  body,
}: {
  to: string;
  body: string;
}) {
  try {
    const message = await client.messages.create({
      body,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${to}`,
    });
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('WhatsApp error:', error);
    return { success: false, error };
  }
}
