import { sendEmail } from '@/lib/nodemailer';
import { JSDOM } from 'jsdom';
import { NextApiRequest, NextApiResponse } from 'next';


const getprice = async (req: NextApiRequest, res: NextApiResponse) => {

  const body = JSON.parse(req.body)
  const {url , email} = body

  const response = await fetch(url);
  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const price = document.querySelector('div._30jeq3')?.textContent;
  console.log("price", price);
  console.log(await sendEmail(email, price || ''));
  res.status(200).json({ price });
};



export default getprice;
