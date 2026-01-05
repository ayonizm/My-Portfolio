import { motion } from 'framer-motion';
import { FiHeart, FiCode } from 'react-icons/fi';

// Custom Codeforces icon (Official Colors)
const CodeforcesIcon = () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em">
        <path fill="#F44336" d="M24 19.5V12a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 18 12v7.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5z"></path>
        <path fill="#2196F3" d="M13.5 21a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 13.5 3h-3C9.673 3 9 3.672 9 4.5v15c0 .828.673 1.5 1.5 1.5h3z"></path>
        <path fill="#FFC107" d="M0 19.5c0 .828.673 1.5 1.5 1.5h3A1.5 1.5 0 0 0 6 19.5V9a1.5 1.5 0 0 0-1.5-1.5h-3C.673 7.5 0 8.172 0 9v10.5z"></path>
    </svg>
);

// Custom AtCoder icon (using code symbol)
const AtCoderIcon = () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <path d="M2 4v16h20V4H2zm18 14H4V6h16v12zM6 17l1.5-1.5L10 18l5-5 3 3-1.5 1.5L15 16l-5 5-3-3z" />
    </svg>
);

// Facebook Icon
const FacebookIcon = () => (
    <svg viewBox="0 0 266.893 266.895" width="1em" height="1em">
        <path fill="#485a96" d="M252.164 266.895c8.134 0 14.729-6.596 14.729-14.73V14.73c0-8.137-6.596-14.73-14.729-14.73H14.73C6.593 0 0 6.594 0 14.73v237.434c0 8.135 6.593 14.73 14.73 14.73h237.434z"></path>
        <path fill="#fff" d="M184.152 266.895V163.539h34.692l5.194-40.28h-39.887V97.542c0-11.662 3.238-19.609 19.962-19.609l21.329-.01V41.897c-3.689-.49-16.351-1.587-31.08-1.587-30.753 0-51.807 18.771-51.807 53.244v29.705h-34.781v40.28h34.781v103.355h41.597z"></path>
    </svg>
);

// Github Icon
const GithubIcon = () => (
    <svg viewBox="0 0 48 47" width="1em" height="1em">
        <path fill="#3E75C3" fillRule="evenodd" d="M23.999 0C10.745 0 0 10.787 0 24.097a24.09 24.09 0 0 0 16.414 22.861c1.2.222 1.639-.522 1.639-1.16 0-.573-.021-2.088-.034-4.098-6.676 1.456-8.085-3.23-8.085-3.23-1.09-2.784-2.663-3.525-2.663-3.525-2.18-1.495.165-1.465.165-1.465 2.407.17 3.674 2.483 3.674 2.483 2.143 3.683 5.618 2.62 6.986 2.002.217-1.557.838-2.619 1.524-3.221-5.33-.609-10.932-2.675-10.932-11.908 0-2.63.934-4.781 2.47-6.466-.247-.61-1.07-3.059.235-6.377 0 0 2.015-.647 6.6 2.47 1.915-.534 3.967-.801 6.008-.811 2.039.01 4.092.277 6.01.811 4.58-3.117 6.592-2.47 6.592-2.47 1.31 3.318.486 5.767.239 6.377 1.538 1.685 2.467 3.835 2.467 6.466 0 9.256-5.611 11.293-10.957 11.89.86.744 1.629 2.213 1.629 4.462 0 3.22-.03 5.819-.03 6.61 0 .644.432 1.394 1.65 1.157C41.13 43.763 48 34.738 48 24.097 48 10.787 37.254 0 23.999 0"></path>
    </svg>
);

// Instagram Icon
const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em">
        <defs>
            <radialGradient id="insta-gradient" cx="12" cy="12" r="35.57" fx="-.863" fy="29.631" gradientUnits="userSpaceOnUse">
                <stop offset=".17" stopColor="#ffc900"></stop>
                <stop offset=".2" stopColor="#ffad15"></stop>
                <stop offset=".3" stopColor="#ff5658"></stop>
                <stop offset=".34" stopColor="#ff3372"></stop>
                <stop offset=".43" stopColor="#ec2799"></stop>
                <stop offset=".49" stopColor="#df20b3"></stop>
                <stop offset=".61" stopColor="#1820f1"></stop>
                <stop offset=".62" stopColor="#0020f9"></stop>
            </radialGradient>
        </defs>
        <g>
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path fill="url(#insta-gradient)" d="M1 12C1 4 4 1 12 1s11 3 11 11-3 11-11 11S1 20 1 12"></path>
            <path fill="#fff" d="M12 15.34h-.18a3.38 3.38 0 0 1-3.16-3.16 3.33 3.33 0 0 1 .91-2.48 3.38 3.38 0 0 1 2.43-1 3.34 3.34 0 0 1 2.77 1.47 3.27 3.27 0 0 1 .57 1.83 3.38 3.38 0 0 1-1 2.43 3.34 3.34 0 0 1-2.34.91zm0-5.4a2.07 2.07 0 0 0-2 2.17 2.05 2.05 0 0 0 1.94 1.94A2.07 2.07 0 0 0 14.06 12a2.13 2.13 0 0 0-.35-1.15A2.08 2.08 0 0 0 12 9.94zm4.42-1.56a.8.8 0 1 1-.8-.8.82.82 0 0 1 .31.07.8.8 0 0 1 .49.73z"></path>
            <path fill="#fff" d="M14.63 18.64H9.37a4 4 0 0 1-4-4V9.37a4 4 0 0 1 4-4h5.26a4 4 0 0 1 4 4v5.26a4 4 0 0 1-4 4.01Zm-5.26-12a2.74 2.74 0 0 0-2.73 2.73v5.26a2.74 2.74 0 0 0 2.73 2.73h5.26a2.74 2.74 0 0 0 2.73-2.73V9.37a2.74 2.74 0 0 0-2.73-2.73Z"></path>
        </g>
    </svg>
);

// LinkedIn Icon
const LinkedinIcon = () => (
    <svg viewBox="0 0 512 512" width="1em" height="1em">
        <g>
            <path fill="#0A7BBA" d="M506 256.879c0 138.066-111.934 250-250 250-138.067 0-250-111.934-250-250 0-138.067 111.933-250 250-250 138.066 0 250 111.933 250 250zm0 0"></path>
            <path fill="#F2F2F2" d="M405.36 276.985v103.076h-59.753v-96.157c0-24.153-8.617-40.647-30.269-40.647-16.493 0-26.308 11.119-30.638 21.869-1.588 3.83-1.98 9.161-1.98 14.558v100.378h-59.774s.805-162.873 0-179.734h59.774v25.478c-.108.196-.282.389-.392.585h.392v-.585c7.943-12.227 22.108-29.702 53.856-29.702 39.321 0 68.784 25.698 68.784 80.881zM160.452 113.698c-20.455 0-33.815 13.426-33.815 31.052 0 17.255 12.969 31.049 33.032 31.049h.37c20.846 0 33.815-13.793 33.815-31.049-.392-17.625-12.969-31.052-33.402-31.052zm-30.268 266.364h59.731V200.328h-59.731v179.734zm0 0"></path>
        </g>
    </svg>
);

// Mail Icon
const MailIcon = () => (
    <svg viewBox="0 0 120 120" width="1em" height="1em">
        <defs>
            <linearGradient id="mail-gradient" x1="50%" x2="50%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#008EE7"></stop>
                <stop offset="100%" stopColor="#00D6FA"></stop>
            </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
            <g>
                <rect width="120" height="120" x="0" y="0" fill="url(#mail-gradient)" rx="28"></rect>
                <path fill="#FFF" d="M25.114 84.964l21.196-21.95 5.13 5.165a12.553 12.553 0 0 0 17.84 0l4.64-4.672L94.666 84.99c-.331.07-.675.106-1.027.106H26.26c-.394 0-.778-.046-1.146-.132zm73.392-46.215c.087.37.133.755.133 1.151v40.196c0 1.29-.489 2.466-1.29 3.353L76.033 61.378l22.472-22.63zM21.36 81.094V40.9c0-.868.221-1.685.61-2.397l22.226 22.382L22.482 83.37a4.983 4.983 0 0 1-1.122-2.277zm75.467-45.046L67.189 65.685c-3.905 3.906-10.237 3.906-14.142 0L23.26 35.9c.835-.627 1.874-.999 3-.999h67.378a4.98 4.98 0 0 1 3.188 1.148z"></path>
            </g>
        </g>
    </svg>
);

// Phone Icon
const PhoneIcon = () => (
    <svg viewBox="0 0 64 64" width="1em" height="1em">
        <path fill="#3f4a59" d="M35.31 18.92c4.24 0 7.68 3.45 7.68 7.68 0 1.03.83 1.86 1.86 1.86 1.03 0 1.86-.83 1.86-1.86 0-6.28-5.11-11.4-11.4-11.4-.49 0-.96.2-1.31.55-.35.35-.55.82-.55 1.31 0 1.03.84 1.86 1.86 1.86z"></path>
        <path fill="#3f4a59" d="M35.98 7.98c-.49 0-.96.2-1.31.55-.35.35-.55.82-.55 1.31 0 1.03.84 1.86 1.86 1.86 7.85 0 14.23 6.38 14.23 14.23 0 1.03.84 1.86 1.86 1.86 1.03 0 1.86-.83 1.86-1.86 0-9.9-8.05-17.95-17.95-17.95z"></path>
        <path fill="#3f4a59" d="M35.5 3.72c6.06 0 11.76 2.36 16.04 6.65 4.29 4.29 6.65 9.98 6.65 16.05 0 1.02.83 1.86 1.86 1.86 1.03 0 1.86-.84 1.86-1.86 0-7.06-2.75-13.69-7.74-18.68A26.26 26.26 0 0 0 45.61 2C42.44.69 39.02 0 35.5 0a1.862 1.862 0 0 0-1.86 1.86c0 1.03.83 1.86 1.86 1.86z"></path>
        <path fill="#3177b0" d="M50.22 39.99c-.96-.96-2.53-.96-3.5 0l-3.49 3.49c-.09.1-.19.18-.3.26-.82.61-1.89.7-2.79.25-8.01-3.98-14.11-10.08-18.15-18.14-.46-.93-.37-2.01.24-2.82.07-.11.15-.2.25-.3l3.5-3.49c.96-.97.95-2.54-.01-3.5L15.49 5.26a2.41 2.41 0 0 0-1.74-.72h-.01c-.66 0-1.28.26-1.75.72L8.17 9.09 4.3 12.95c-2.31 2.31-2.87 5.77-1.4 8.6 9.34 18.29 23.35 32.3 41.64 41.64 1.05.55 2.19.81 3.32.81 1.92 0 3.83-.76 5.28-2.21 0-.01.01-.01.01-.02l2.51-2.73 1.23-1.23 3.83-3.83c.95-.97.95-2.55-.01-3.5L50.22 39.99z"></path>
    </svg>
);

// WhatsApp Icon
const WhatsappIcon = () => (
    <svg viewBox="0 0 102 102" width="1em" height="1em">
        <defs>
            <linearGradient id="whatsapp-gradient" x1=".5" x2=".5" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="#61fd7d"></stop>
                <stop offset="1" stopColor="#2bb826"></stop>
            </linearGradient>
        </defs>
        <path fill="url(#whatsapp-gradient)" d="M101.971 77.094c0 .558-.017 1.77-.051 2.705a53.717 53.717 0 0 1-.538 6.589 21.949 21.949 0 0 1-1.847 5.521 19.654 19.654 0 0 1-8.653 8.644 21.993 21.993 0 0 1-5.552 1.847 53.913 53.913 0 0 1-6.539.528c-.936.033-2.148.05-2.7.05l-50.223-.008c-.558 0-1.769-.017-2.705-.051a53.744 53.744 0 0 1-6.589-.538 21.951 21.951 0 0 1-5.521-1.847A19.654 19.654 0 0 1 2.4 91.881a21.988 21.988 0 0 1-1.843-5.552 53.954 53.954 0 0 1-.528-6.539 92.845 92.845 0 0 1-.05-2.7l.008-50.224c0-.558.017-1.77.051-2.705a53.738 53.738 0 0 1 .538-6.589 21.946 21.946 0 0 1 1.847-5.521A19.655 19.655 0 0 1 11.076 3.4a22 22 0 0 1 5.552-1.848 53.912 53.912 0 0 1 6.539-.528c.936-.033 2.148-.05 2.7-.05l50.228.012c.559 0 1.77.017 2.705.051a53.744 53.744 0 0 1 6.589.538 21.946 21.946 0 0 1 5.521 1.847 19.653 19.653 0 0 1 8.644 8.653 21.988 21.988 0 0 1 1.848 5.552 53.974 53.974 0 0 1 .528 6.539c.033.936.05 2.148.05 2.7l-.008 50.223Z" transform="translate(.021 -.978)"></path>
        <g>
            <path fill="#fff" d="M78.02 24.131A36.58 36.58 0 0 0 20.452 68.25l-5.189 18.948 19.39-5.085a36.561 36.561 0 0 0 17.479 4.451h.015A36.578 36.578 0 0 0 78.02 24.131ZM52.15 80.388h-.012a30.361 30.361 0 0 1-15.473-4.236l-1.11-.659-11.506 3.017 3.071-11.215-.723-1.15a30.4 30.4 0 1 1 25.754 14.242Zm16.67-22.761c-.914-.457-5.407-2.668-6.245-2.973s-1.447-.457-2.056.457-2.361 2.973-2.894 3.582-1.066.686-1.98.229a24.963 24.963 0 0 1-7.349-4.535 27.531 27.531 0 0 1-5.084-6.329c-.533-.915-.057-1.409.4-1.865.411-.409.914-1.067 1.371-1.6a6.23 6.23 0 0 0 .914-1.524 1.682 1.682 0 0 0-.076-1.6c-.228-.457-2.056-4.954-2.818-6.783-.742-1.782-1.5-1.541-2.056-1.568a36.004 36.004 0 0 0-1.752-.032 3.358 3.358 0 0 0-2.437 1.143 10.246 10.246 0 0 0-3.2 7.622c0 4.5 3.275 8.841 3.732 9.451s6.444 9.838 15.612 13.8a52.582 52.582 0 0 0 5.21 1.925 12.535 12.535 0 0 0 5.756.362c1.756-.262 5.407-2.21 6.169-4.344a7.635 7.635 0 0 0 .533-4.344c-.229-.381-.838-.61-1.752-1.067Z"></path>
        </g>
    </svg>
);

const VJudgeIcon = () => (
    <svg viewBox="0 0 512 512" width="1em" height="1em">
        <path fill="#e0e0e0" d="M0 0h512v512H0z" opacity="0" />
        <path fill="#ffffff" d="M74.8 128l57.6 256h64l-57.6-256H74.8zM224 128l128 256 128-256h-64L352 291.2 288 128H224z" />
    </svg>
);


const Footer = () => {
    const socialLinks = [
        { icon: <FacebookIcon />, url: 'https://www.facebook.com/fahim.ahmed.74747', label: 'Facebook', color: '#1877f2' },
        { icon: <InstagramIcon />, url: 'https://www.instagram.com/fahim_ahmed_007?igsh=dHo1ZHpqbmtnaGY1', label: 'Instagram', color: '#e4405f' },
        { icon: <WhatsappIcon />, url: 'https://wa.me/8801832918792', label: 'WhatsApp', color: '#25d366' },
        { icon: <LinkedinIcon />, url: 'https://www.linkedin.com/in/md-fahim-ahmed-674377347/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', label: 'LinkedIn', color: '#0077b5' },
        { icon: <MailIcon />, url: 'mailto:fahimahmed89747@gmail.com', label: 'Email', color: '#ea4335' },
        { icon: <PhoneIcon />, url: 'tel:+8801832918792', label: 'Phone', color: '#3f4a59' },
    ];

    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact" className="footer" style={{
            background: 'var(--bg-secondary)',
            padding: 'var(--spacing-2xl) 0 var(--spacing-lg)',
            borderTop: '1px solid var(--border-color)'
        }}>
            <div className="container">
                <div className="footer-content" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-xl)',
                    marginBottom: 'var(--spacing-2xl)'
                }}>
                    {/* Brand */}
                    <div className="footer-brand">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{
                                fontSize: 'var(--text-2xl)',
                                fontFamily: 'var(--font-display)',
                                margin: '0 0 var(--spacing-md)'
                            }}
                        >
                            Ayon Chowdhury
                        </motion.h3>
                        <p style={{
                            color: 'var(--text-muted)',
                            lineHeight: 1.6,
                            maxWidth: '300px'
                        }}>
                            Competitive Programmer | Curious About Neural Networks
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Quick Links</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            {['About', 'Projects', 'Achievements', 'Contact'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    style={{
                                        color: 'var(--text-secondary)',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="footer-contact">
                        <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Get in Touch</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            <a href="mailto:fahimahmed89747@gmail.com" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none'
                            }}>
                                <MailIcon /> fahimahmed89747@gmail.com
                            </a>
                            <a href="tel:+880 1832-918792" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none'
                            }}>
                                <PhoneIcon /> +880 1832-918792
                            </a>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="footer-social" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'var(--spacing-md)',
                    marginTop: 'var(--spacing-xl)',
                    marginBottom: 'var(--spacing-xl)',
                    flexWrap: 'wrap'
                }}>
                    {socialLinks.map((link, index) => (
                        <motion.a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                color: 'var(--text-muted)', // Default gray, but icons are full color!
                                fontSize: '1.5rem',
                                transition: 'color 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title={link.label}
                        >
                            {link.icon}
                        </motion.a>
                    ))}
                </div>

                <div className="footer-bottom" style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: 'var(--spacing-lg)',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: 'var(--text-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                }}>
                    <p>&copy; {currentYear} Ayon Chowdhury. All rights reserved.</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Built with <FiHeart style={{ color: 'var(--accent-primary)' }} /> and <FiCode style={{ color: 'var(--accent-primary)' }} />
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
