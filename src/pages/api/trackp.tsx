//works only for my email and that too when server is running because i'm calling it from frontend

import { NextApiRequest, NextApiResponse } from 'next';
import cron from 'node-cron';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import nodemailer from 'nodemailer';

const url1 = 'https://www.flipkart.com/calvin-klein-euphoria-eau-de-parfum-100-ml/p/itmf3wgxrxc9hwyz?pid=PERDUERCXDENVDE8&lid=LSTPERDUERCXDENVDE81IDTR3&marketplace=FLIPKART&q=calvin+klein+perfume+for+women&store=g9b%2F0yh%2Fjhz&srno=s_1_3&otracker=AS_Query_OrganicAutoSuggest_3_21_na_na_na&otracker1=AS_Query_OrganicAutoSuggest_3_21_na_na_na&fm=search-autosuggest&iid=41a8ec0c-a3b5-46c4-ae69-457840ca6b27.PERDUERCXDENVDE8.SEARCH&ppt=sp&ppn=sp&ssid=scvpdaj4tc0000001694952760713&qH=37d108cfa0394d75';
const email1 = 'yjhala58@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NEXT_PUBLIC_user,
    pass: process.env.NEXT_PUBLIC_pass
  }
});

const sendEmail = async (subject: string, text: string) => {
  const mailOptions = {
    from: 'yjhala58@gmail.com',
    to: email1,
    subject,
    text
  };
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
};

const trackp = async () => {
  console.log("price tracking in process...");
  cron.schedule('0 * * * *', async () => {
    console.log('m running');
      const response = await fetch(url1);
      const html = await response.text();

      const dom = new JSDOM(html);
      const priceElement = dom.window.document.querySelector('div._30jeq3');
      const price = priceElement ? priceElement.textContent : 'price not found';

      console.log('Current Price:', price);

      await sendEmail('Price Tracking', `price tracking in progress...\ncurrent Price: ${price}`);

      console.log('price tracked.');
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("I'm in tracker");
  await trackp(); 
  res.status(200).json({ message: 'yeah' });
}
