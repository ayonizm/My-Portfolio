import { motion } from 'framer-motion';
import {
    FiMail,
    FiPhone,
    FiInstagram,
    FiFacebook,
    FiHeart
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { SiCodeforces, SiAtcoder } from 'react-icons/si';

const Footer = () => {
    const socialLinks = [
        { icon: FiMail, href: 'mailto:contact@example.com', label: 'Email' },
        { icon: FiPhone, href: 'tel:+1234567890', label: 'Phone' },
        { icon: FaWhatsapp, href: 'https://wa.me/1234567890', label: 'WhatsApp' },
        { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
        { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
        { icon: SiCodeforces, href: 'https://codeforces.com/profile/ayonizm', label: 'Codeforces' },
        { icon: SiAtcoder, href: 'https://atcoder.jp/users/ayonizm', label: 'AtCoder' }
    ];

    return (
        <footer
            id="contact"
            style={{
                position: 'relative',
                zIndex: 1,
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-color)'
            }}
        >
            <div className="container" style={{ padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 'var(--spacing-xl)',
                        marginBottom: 'var(--spacing-xl)'
                    }}
                >
                    {/* Brand */}
                    <div>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 700,
                            marginBottom: 'var(--spacing-md)',
                            background: 'var(--accent-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Anisul Haque
                        </h3>
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: 'var(--text-sm)',
                            lineHeight: 1.8,
                            maxWidth: '300px'
                        }}>
                            Full Stack Developer crafting beautiful, high-performance digital experiences.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: 600,
                            marginBottom: 'var(--spacing-md)',
                            color: 'var(--text-primary)'
                        }}>
                            Quick Links
                        </h4>
                        <nav style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-sm)'
                        }}>
                            {['Home', 'Projects', 'Achievements', 'Contact'].map((link, i) => (
                                <motion.a
                                    key={link}
                                    href={`#${link.toLowerCase()}`}
                                    whileHover={{ x: 5, color: 'var(--accent-primary)' }}
                                    style={{
                                        color: 'var(--text-secondary)',
                                        fontSize: 'var(--text-sm)'
                                    }}
                                >
                                    {link}
                                </motion.a>
                            ))}
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: 600,
                            marginBottom: 'var(--spacing-md)',
                            color: 'var(--text-primary)'
                        }}>
                            Get In Touch
                        </h4>
                        <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-sm)',
                            flexWrap: 'wrap'
                        }}>
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target={social.href.startsWith('http') ? '_blank' : undefined}
                                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    whileHover={{
                                        scale: 1.15,
                                        y: -3,
                                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--text-secondary)',
                                        fontSize: '1.2rem'
                                    }}
                                    title={social.label}
                                >
                                    <social.icon />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Copyright */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{
                        paddingTop: 'var(--spacing-lg)',
                        borderTop: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}
                >
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: 'var(--text-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-xs)'
                    }}>
                        © {new Date().getFullYear()} Md.Anisul Haque Chowdhury. Made with{' '}
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <FiHeart style={{ color: '#ef4444', fill: '#ef4444' }} />
                        </motion.span>
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
