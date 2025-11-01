import React, { useEffect, useState } from 'react';
import '../styles/LandingPage.css';
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Printer, Copy, BookOpen, Truck, Check, Star, MapPin, Phone, Mail, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebookF,
    faTwitter,
    faInstagram,
    faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';

// You can download the JSON file from the share URL or use the URL directly
// import successAnimation from './payment-success.json';  // Assuming you downloaded the JSON file

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeTestimonial, setActiveTestimonial] = useState(0)


    const testimonials = [
        {
            text: "AutoPrintX delivered my thesis prints on time with excellent quality. Their service is outstanding!",
            author: "John Doe",
            role: "University Student",
            rating: 5,
        },
        {
            text: "As a business owner, I rely on AutoPrintX for all my document printing needs. Fast, reliable, and professional.",
            author: "Sarah Johnson",
            role: "Business Owner",
            rating: 5,
        },
        {
            text: "The quality of their color prints is exceptional. I've been using their services for my design portfolio for years.",
            author: "Michael Chen",
            role: "Graphic Designer",
            rating: 5,
        },
    ]

    useEffect(() => {
        document.title = 'AutoPrintX';

        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [testimonials.length])

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    }
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    }
    const [isActive, setIsActive] = useState(false);
    const toggleMenu = () => {
        setIsActive(!isActive);
    };
    return (
        <div>
            <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <nav className="navbar">
                    <motion.div className="logo"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}>
                        <h1>Auto<span>PrintX</span></h1>
                    </motion.div>
                    <ul className={`nav-links ${isActive ? "active" : ""}`}>
                        <li><a href="/" className="active">Home</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="/login" className="dashboard btn-secondary">Dashboard</a></li>
                    </ul>
                    <div className={`hamburger ${isActive ? "active" : ""}`}
                        onClick={toggleMenu}
                    >
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </div>
                </nav>
            </motion.header>


            <main>
                <section className="hero">
                    <div className="hero-content">

                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <h1>Smart Document Printing Solutions</h1>
                            <p>Fast, reliable, and high-quality printing services for all your document needs</p>
                            <div className="hero-buttons">
                                <motion.a
                                    href="#services"
                                    className="btn-primary"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Our Services
                                </motion.a>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>

                                    <motion.a
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        href="/exitstingshops"
                                        className="btn-secondary"
                                    >
                                        Order Now
                                    </motion.a>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        className="hero-image"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <img src="https://placehold.co/600x400/0a2463/white?text=AutoPrintX" alt="Document Printing" />
                    </motion.div>
                </section>


                {/* Features Section */}
                <section className="features" id="services">
                    <motion.h2 className="section-title" {...fadeInUp}>
                        Our Services
                    </motion.h2>
                    <motion.div
                        className="features-container"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                icon: Printer,
                                title: "Document Printing",
                                desc: "High-quality printing for all document types with various paper options.",
                            },
                            {
                                icon: Copy,
                                title: "Copying Services",
                                desc: "Fast and reliable copying services for documents of all sizes.",
                            },
                            {
                                icon: BookOpen,
                                title: "Binding & Finishing",
                                desc: "Professional binding and finishing options for your documents.",
                            },
                            {
                                icon: Truck,
                                title: "Delivery Services",
                                desc: "Quick delivery of your printed documents to your doorstep.",
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card"
                                variants={fadeInUp}
                                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            >
                                <div className="feature-icon">
                                    <feature.icon size={40} />
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>


                {/* How It Works Section */}
                <section className="how-it-works">
                    <motion.h2 className="section-title" {...fadeInUp}>
                        How It Works
                    </motion.h2>
                    <motion.div
                        className="steps-container"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            { number: "1", title: "Upload Documents", desc: "Upload your documents through our secure platform." },
                            { number: "2", title: "Choose Options", desc: "Select paper type, size, color, and binding options." },
                            { number: "3", title: "Make Payment", desc: "Secure payment through multiple payment options." },
                            { number: "4", title: "Get Delivery", desc: "Receive your printed documents at your doorstep." },
                        ].map((step, index) => (
                            <motion.div key={index} className="step" variants={fadeInUp}>
                                <motion.div className="step-number" whileHover={{ scale: 1.1 }}>
                                    {step.number}
                                </motion.div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>


                {/* Pricing Section */}
                <section className="pricing">
                    <motion.h2 className="section-title" {...fadeInUp}>
                        Pricing Plans
                    </motion.h2>
                    <motion.div
                        className="pricing-container"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                title: "Basic",
                                price: "$0.10",
                                period: "/page",
                                features: ["Black & White Printing", "Standard Paper", "No Binding", "Self Pickup"],
                                popular: false,
                            },
                            {
                                title: "Standard",
                                price: "$0.25",
                                period: "/page",
                                features: ["Color Printing", "Premium Paper", "Basic Binding", "Local Delivery"],
                                popular: true,
                            },
                            {
                                title: "Premium",
                                price: "$0.40",
                                period: "/page",
                                features: ["High-Quality Color", "Premium Glossy Paper", "Professional Binding", "Express Delivery"],
                                popular: false,
                            },
                        ].map((plan, index) => (
                            <motion.div
                                key={index}
                                className={`pricing-card ${plan.popular ? "featured" : ""}`}
                                variants={fadeInUp}
                                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            >
                                {plan.popular && <div className="popular">Most Popular</div>}
                                <h3>{plan.title}</h3>
                                <div className="price">
                                    {plan.price}
                                    <span>{plan.period}</span>
                                </div>
                                <ul>
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx}>
                                            <Check size={16} /> {feature}
                                        </li>
                                    ))}
                                </ul>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link to="/" className="btn-primary">
                                        Choose Plan
                                    </Link>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>


                {/* Testimonials Section */}
                <section className="testimonials" id="about">
                    <motion.h2 className="section-title" {...fadeInUp}>
                        What Our Customers Say
                    </motion.h2>
                    <div className="testimonials-container">
                        <motion.div
                            className="testimonial-card active"
                            key={activeTestimonial}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="testimonial-text">
                                <div className="stars">
                                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                                        <Star key={i} size={20} fill="currentColor" />
                                    ))}
                                </div>
                                <p>"{testimonials[activeTestimonial].text}"</p>
                            </div>
                            <div className="testimonial-author">
                                <img
                                    src={`https://placehold.co/100x100/0a2463/white?text=${testimonials[activeTestimonial].author.charAt(0)}`}
                                    alt={testimonials[activeTestimonial].author}
                                />
                                <div>
                                    <h4>{testimonials[activeTestimonial].author}</h4>
                                    <p>{testimonials[activeTestimonial].role}</p>
                                </div>
                            </div>
                        </motion.div>
                        <div className="testimonial-dots">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === activeTestimonial ? "active" : ""}`}
                                    onClick={() => setActiveTestimonial(index)}
                                />
                            ))}
                        </div>
                    </div>
                </section>


                {/* Contact Section */}
                <section className="contact" id="contact">
                    <motion.h2 className="section-title" {...fadeInUp}>
                        Contact Us
                    </motion.h2>
                    <div className="contact-container">
                        <motion.div
                            className="contact-info"
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                        >
                            <div className="contact-item">
                                <MapPin size={24} />
                                <p>123 Printing Street, Document City</p>
                            </div>
                            <div className="contact-item">
                                <Phone size={24} />
                                <p>+1 (555) 123-4567</p>
                            </div>
                            <div className="contact-item">
                                <Mail size={24} />
                                <p>info@autoprintx.com</p>
                            </div>
                            <div className="contact-item">
                                <Clock size={24} />
                                <p>Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="contact-form"
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                        >
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id="name" name="name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input type="text" id="subject" name="subject" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" name="message" rows="5" required></textarea>
                                </div>
                                <motion.button
                                    type="submit"
                                    className="btn-primary"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Send Message
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </section>

                {/* New Features Section */}
                <section className="home-features">
                    <div className="feature-card">
                        <h2>Effortless Organization</h2>
                        <p>Categorize, tag, and search your documents with ease.</p>
                    </div>
                    <div className="feature-card">
                        <h2>AI-Powered Insights</h2>
                        <p>Extract key information and get smart summaries.</p>
                    </div>
                    <div className="feature-card">
                        <h2>Secure & Accessible</h2>
                        <p>Access your documents anytime, anywhere, with top-notch security.</p>
                    </div>
                </section>

                {/* New CTA Section */}
                <section className="home-cta">
                    <Link to="/login" className="cta-button">
                        Get Started
                    </Link>
                    <Link to="/dashboard" className="cta-button secondary">
                        View Dashboard Demo
                    </Link>
                </section>

            </main>

            <footer>
                <div className="footer-container">
                    <div className="footer-logo">
                        <h2>Auto<span>PrintX</span></h2>
                        <p>Smart Document Printing Solutions</p>
                    </div>
                    <div className="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="services">Services</a></li>
                            <li><a href="about">About Us</a></li>
                            <li><a href="contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h3>Services</h3>
                        <ul>
                            <li><a href="#">Document Printing</a></li>
                            <li><a href="#">Copying Services</a></li>
                            <li><a href="#">Binding & Finishing</a></li>
                            <li><a href="#">Delivery Services</a></li>
                        </ul>
                    </div>
                    <div className="footer-newsletter">
                        <h3>Subscribe to Our Newsletter</h3>
                        <form id="newsletterForm">
                            <input type="email" placeholder="Your Email Address" required />
                            <button type="submit" className="btn-primary">Subscribe</button>
                        </form>
                        <div className="social-icons">
                            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 AutoPrintX. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

