
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const productId = parseInt(req.query.id as string);

  if (req.method === 'GET') {
    try {
      const product = await prisma.prices.findUnique({
        where: {
          id: productId,
        },
      });

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
