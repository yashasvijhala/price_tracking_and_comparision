import { GetServerSideProps, type NextPage } from "next";
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { supabase } from "../client";
import { prisma } from "@/lib/db";
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  myntra: string;
  nykaa: string;
  url: string;
}
interface HomePageProps {
  products: Product[];
}


export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      products: (await prisma.prices.findMany()).map((p) => ({
        ...p,
        id: p.id.toString(),
      })),
    },
  };
};

const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-black bg-opacity-75 absolute inset-0"></div>
      <div className="z-20 bg-gray-800 p-6 rounded-lg">
        <button onClick={onClose} className="text-white">
          &#x2715;
        </button>
        {children}
      </div>
    </div>
  );
};

const NavBar = () => {
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isSignupFormOpen, setIsSignupFormOpen] = useState(false);
  const handleLoginClick = () => {
    setIsLoginFormOpen(true);
  };

  const handleSignupClick = () => {
    setIsSignupFormOpen(true);
  };
  return (
    <nav className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Price Comparison App</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="text-lg font-semibold text-gray-400 hover:text-white"
          onClick={handleLoginClick}
        >
          Login
        </button>
        <button
          className="text-lg font-semibold text-gray-400 hover:text-white"
          onClick={handleSignupClick}
        >
          Signup
        </button>
        <a
          href="#"
          className="text-lg font-semibold text-gray-400 hover:text-white"
        >
          About
        </a>
      </div>
      {isLoginFormOpen && (
        <Modal onClose={() => setIsLoginFormOpen(false)}>
          <LoginForm onClose={() => setIsLoginFormOpen(false)} />
        </Modal>
      )}
      {isSignupFormOpen && (
        <Modal onClose={() => setIsSignupFormOpen(false)}>
          <SignupForm onClose={() => setIsSignupFormOpen(false)} />
        </Modal>
      )}
    </nav>
  );
};

const trackp = async () => {
  await fetch("http://localhost:3000/api/trackp");
};
trackp();

const LoginForm = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Login failed:", error.message);
    } else {
      console.log("Login successful for user:", data?.user);
      setLoginSuccess(true);
      setTimeout(() => {
        setLoginSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-4">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <div className="mb-4">
        <label className="block text-white mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
      <button
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none"
      >
        Login
      </button>
      <button
        onClick={onClose}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded ml-2 focus:outline-none"
      >
        Close
      </button>
      {loginSuccess && (
        <div className="mt-4 text-green-500">Successfully logged in!</div>
      )}
    </div>
  );
};

const SignupForm = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    const user = data?.user;

    console.log("Signup successful for user:", user);
    setSignupSuccess(true);
    setTimeout(() => {
      setSignupSuccess(false);
      onClose();
    }, 1000);
    onClose();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-4">
      <h2 className="text-xl font-semibold mb-4">Signup</h2>
      <div className="mb-4">
        <label className="block text-white mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
      <button
        onClick={handleSignup}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none"
      >
        Signup
      </button>
      <button
        onClick={onClose}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded ml-2 focus:outline-none"
      >
        Close
      </button>
      {signupSuccess && (
        <div className="mt-4 text-green-500">Successfully signed up!</div>
      )}
    </div>
  );
};

const SetPriceTrackerForm = ({ onClose }: { onClose: () => void }) => {
  const [price, setPrice] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const getprice = async () => {
    const res = await fetch("http://localhost:3000/api/getprice", {
      method: "POST",
      body: JSON.stringify({ url, email }),
    });
    const { price } = await res.json();
    setPrice(price);
    setShowMessage(true);
    console.log("price", price);
    setTimeout(() => {
      setShowMessage(false);
      onClose();
    }, 4000);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-4">
      <div className="flex justify-end">
        <button onClick={onClose} className="text-white">
          &#x2715;
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Set Price Tracker</h2>
      <div className="mb-4">
        <label className="block text-white mb-2">Product URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter product URL"
          className="rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Your Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
      <button
        onClick={getprice}
        type="button"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none"
      >
        Submit
      </button>

      {showMessage && (
        <div className="mt-4 text-white">
          You&apos;ll be updated whenever the price drops. Check your email for
          the current price of the product.
        </div>
      )}
    </div>
  );
};

const HomePage = (props: { products: Product[] }) => {
  const [product, setProduct] = useState("");
  const [searchedProduct, setSearchedProduct] = useState<Product | null>(null);
  const [isSetPriceTrackerOpen, setIsSetPriceTrackerOpen] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  const handleSearch = async () => {
    if (product.trim() !== "") {
      setShowWelcomeMessage(false);
      const searched = props.products.find((item: Product) =>
        item.name.toLowerCase().includes(product.toLowerCase())
      );
      setSearchedProduct(searched || null);
    }
    else {
        console.error("Product data not available!");
      }
  };

  const handleSetPriceTrackerClick = () => {
    setIsSetPriceTrackerOpen(!isSetPriceTrackerOpen);
  };

  const products = props.products;

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white p-8">
      <NavBar />

      <div className="py-8 text-center mb-8">
        <div className="flex items-center justify-center">
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Enter a product"
            className="rounded-full p-3 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white"
          />
          <button
            onClick={handleSearch}
            className="ml-2 bg-gradient-to-r from-red-500 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold py-3 px-6 rounded-full focus:outline-none"
          >
            Search
          </button>
        </div>
      </div>

      <div className="py-8 text-center mb-8">
        {showWelcomeMessage && ( // Conditionally render the welcome message
          <div className="mb-4 text-2xl font-bold">
            Welcome, Achilles! Spartans are waiting for you... <br></br>Enter a
            product to search.
          </div>
        )}
      </div>

      {searchedProduct && (
        <div className="flex flex-col items-center mt-4">
          <h2 className="text-2xl font-bold mb-2">Search Result</h2>
          <div className="flex flex-col items-center">
            <img
              src={searchedProduct.url}
              alt={searchedProduct.name}
              className="mt-4 h-56 w-auto object-cover rounded-lg"
            />
            <p className="mt-4 text-xl font-semibold">{searchedProduct.name}</p>
            <p className="text-base mt-2">
              <span className="text-yellow-400">Myntra Price:</span> Rs.
              {searchedProduct.myntra}
            </p>
            <p className="text-base">
              <span className="text-yellow-400">Nykaa Price:</span> Rs.
              {searchedProduct.nykaa}
            </p>

            {searchedProduct.myntra && searchedProduct.nykaa && (
              <p className="text-base mt-2 text-gray-400">
                Price Difference: Rs.
                {Math.abs(
                  parseInt(searchedProduct.myntra) -
                    parseInt(searchedProduct.nykaa)
                )}
              </p>
            )}

            {searchedProduct.myntra && searchedProduct.nykaa && (
              <p
                className={`text-base mt-2 ${
                  parseInt(searchedProduct.myntra) <
                  parseInt(searchedProduct.nykaa)
                    ? "text-green-500"
                    : "text-green-500"
                }`}
              >
                {parseInt(searchedProduct.myntra) <
                parseInt(searchedProduct.nykaa)
                  ? "Yay! Myntra has a discount for you."
                  : "Yay! Nykaa has a discount for you."}
              </p>
            )}
          </div>
        </div>
      )}
      

      <div className="mt-8">
  <h2 className="text-2xl font-bold mb-4">All Products</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {products.map((product) => (
     <Link href="/item/[id]/prod" as={`/item/${product.id}/prod`} key={product.id}>
        <div className="bg-gray-800 p-4 rounded-lg">
          <img
            src={product.url}
            alt={product.name}
            className="w-full h-48 object-cover mb-4"
          />
          <p className="text-xl font-semibold mb-2">{product.name}</p>
          <p className="text-base">Myntra Price: Rs.{product.myntra}</p>
          <p className="text-base">Nykaa Price: Rs.{product.nykaa}</p>
        </div>
      </Link>
    ))}
  </div>
</div>





      <div className="flex-grow"></div>

      <div className="fixed bottom-8 right-8">
        <button
          onClick={handleSetPriceTrackerClick}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-full focus:outline-none"
        >
          Set Price Tracker
        </button>
      </div>

      {isSetPriceTrackerOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="bg-black bg-opacity-75 absolute inset-0"></div>
          <div className="z-20">
            <SetPriceTrackerForm
              onClose={() => setIsSetPriceTrackerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
