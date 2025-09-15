"use client";
import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay } },
});

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <motion.div {...fadeIn(0)}>
            <h3 className="text-2xl font-extrabold mb-4 tracking-tight">Laptop House</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for finding the perfect laptop.<br />
              Quality products, competitive prices, excellent service.
            </p>
          </motion.div>

          {/* <motion.div {...fadeIn(0.15)}>
            <h4 className="font-semibold mb-4 text-lg">Information</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors underline-animation">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/store-locator" className="hover:text-white transition-colors underline-animation">
                  Store Locator
                </Link>
              </li>
            </ul>
          </motion.div> */}
          <motion.div {...fadeIn(0.15)}>
            <h4 className="font-semibold mb-4 text-lg">Important Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors underline-animation">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors underline-animation">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors underline-animation">Refund, Return & Cancellation Policy</Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors underline-animation">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors underline-animation">Disclaimer</Link>
              </li>
            </ul>
          </motion.div>
          <motion.div {...fadeIn(0.3)}>
            <h4 className="font-semibold mb-4 text-lg">Customer Service</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors underline-animation">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors underline-animation">About Us</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors underline-animation">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/store-locator" className="hover:text-white transition-colors underline-animation">Store Locator</Link>
              </li>
              
            </ul>
          </motion.div>

          <motion.div {...fadeIn(0.45)}>
            <h4 className="font-semibold mb-4 text-lg">Help & Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
             
              <li>
                <Link href="mailto:ssgorle@gmail.com" className="hover:text-white transition-colors underline-animation">
                  Email Us : ssgorle@gmail.com
                </Link>
              </li>
              <li>
                <Link href="tel:+917219655222" className="hover:text-white transition-colors underline-animation">
                  Call Us : +91 7219655222
                </Link>
              </li>
              
              
             
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col md:flex-row md:justify-between md:items-center border-t border-gray-800 pt-8 text-center md:text-left text-gray-400"
          {...fadeIn(0.6)}
        >
          <div className="flex justify-center md:justify-start gap-6 mb-6 md:mb-0">
            <motion.a
              href="https://www.facebook.com/santoshvaishu25/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="group"
              whileHover={{ scale: 1.25, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Facebook className="w-7 h-7 text-blue-700 group-hover:text-blue-900 transition-colors" stroke="currentColor" strokeWidth={2} />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/my_laptop_house/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group"
              whileHover={{ scale: 1.25, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram className="w-7 h-7 text-pink-600 group-hover:text-pink-800 transition-colors" stroke="currentColor" strokeWidth={2} />
            </motion.a>
            <motion.a
              href="https://www.youtube.com/@HiTechVikas"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="group"
              whileHover={{ scale: 1.25, rotate: 0 }}
              whileTap={{ scale: 0.95 }}
            >
              <Youtube className="w-7 h-7 text-red-600 group-hover:text-red-800 transition-colors" stroke="currentColor" strokeWidth={2} />
            </motion.a>
          </div>
          <div>
            <p className="text-sm">&copy; 2024 Laptop House. All rights reserved.</p>
            <p className="mt-2 text-xs text-gray-500">
              Developed by Sachin Rathod |{" "}
              <a
                href="https://sachin-rathod.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                Contact Developer
              </a>
            </p>
          </div>
        </motion.div>
      </div>
      <style jsx>{`
        .underline-animation {
          position: relative;
          display: inline-block;
        }
        .underline-animation::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: currentColor;
          transition: width 0.3s;
        }
        .underline-animation:hover::after {
          width: 100%;
        }
      `}</style>
    </footer>
  );
}