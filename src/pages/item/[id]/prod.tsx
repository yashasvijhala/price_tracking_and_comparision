// pages/item/[id]/prod.tsx

import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import { useEffect, useState } from 'react';

const prisma = new PrismaClient();

interface ProductDetails {
  id: number;
  name: string | null;
  myntra: string | null;
  nykaa: string | null;
  url: string | null;
}

interface ProductDetailsPageProps {
  product: ProductDetails;
}

const ProductDetailsPage = ({ product }: ProductDetailsPageProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-black text-white p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-lg">Myntra Price: Rs. {product.myntra}</p>
        <p className="text-lg">Nykaa Price: Rs. {product.nykaa}</p>
        <img
          src={product.url}
          alt={product.name}
          className="mt-4 mx-auto max-w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await prisma.prices.findMany();

  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ProductDetailsPageProps> = async ({ params }) => {
  const productId = parseInt(params?.id as string, 10);
  const product = await prisma.prices.findUnique({
    where: { id: productId },
  });

  if (!product) {
    console.error('Product not found');
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: {
        id: product.id,
        name: product.name ?? '', 
        myntra: product.myntra ?? null,
        nykaa: product.nykaa ?? null,
        url: product.url ?? null,
      },
    },
    revalidate: 60,
  };
};

export default ProductDetailsPage;
