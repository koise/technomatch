import React from "react";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import "../../../scss/Components/Partials/Footer.scss";

const Footer = () => {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
    >
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} TechnoClash. All rights reserved.</p>
        <div className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
