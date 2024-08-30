import twilio from "twilio";
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

export const GenerateAccessCode = () => {
    const code = Math.floor(Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

    return { code, expiry };
};

export const SendVerificationCode = async (code: number, toPhoneNumber: string) => {
    const response = await client.messages.create({
        body: `Your verification code is ${code}. It will expire in 30 mins.`,
        from: phoneNumber,
        to: toPhoneNumber.trim(),
    });

    console.log(111, response);
    return response;
};