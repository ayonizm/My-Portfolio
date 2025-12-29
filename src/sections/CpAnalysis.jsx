import { motion } from 'framer-motion';
import { SiCodeforces, SiGithub } from 'react-icons/si';
import { FaScroll, FaCode, FaGitAlt } from 'react-icons/fa';
import { IoStatsChart } from 'react-icons/io5';

const StatCard = ({ title, value, icon: Icon, subtext, color, delay, type }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="glass-card"
            style={{
                padding: 'var(--spacing-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                zIndex: 0
            }} />

            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-md)',
                color: color,
                fontSize: '1.8rem',
                border: `1px solid ${color}30`,
                zIndex: 1
            }}>
                <Icon />
            </div>

            <h3 style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-base)',
                marginBottom: 'var(--spacing-xs)',
                fontWeight: 500,
                zIndex: 1
            }}>
                {title}
            </h3>

            <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-xs)',
                fontFamily: 'var(--font-display)',
                zIndex: 1,
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px'
            }}>
                {value}
                {type === 'problems' && <span style={{ fontSize: '1rem', color: color }}>+</span>}
            </div>

            <p style={{
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)',
                zIndex: 1
            }}>
                {subtext}
            </p>

            {/* Visual Graph/Bar based on type */}
            <div style={{
                width: '100%',
                height: '4px',
                background: 'var(--bg-tertiary)',
                borderRadius: '2px',
                marginTop: 'var(--spacing-md)',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }} // Just full width for effect, or calculated
                    transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.2 }}
                    style={{
                        height: '100%',
                        background: color,
                        width: type === 'research' ? '0%' : '75%', // Mock percentage
                        borderRadius: '2px',
                        boxShadow: `0 0 10px ${color}`
                    }}
                />
            </div>
        </motion.div>
    );
};

// Custom Graph Component for "Creativity"
const ActivityGraph = () => {
    // Mock data points for a graph
    const points = [10, 40, 30, 70, 45, 80, 55, 90, 60, 100];

    return (
        <div style={{
            height: '200px',
            width: '100%',
            marginTop: 'var(--spacing-xl)',
            position: 'relative',
            background: 'var(--bg-glass)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-md)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden'
        }}>
            <h4 style={{
                position: 'absolute',
                top: '15px',
                left: '20px',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <IoStatsChart style={{ color: 'var(--accent-primary)' }} />
                Activity Overview
            </h4>

            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '100%',
                paddingTop: '30px',
                gap: '8px'
            }}>
                {points.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${p}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        style={{
                            flex: 1,
                            background: `linear-gradient(to top, var(--accent-primary), transparent)`,
                            borderRadius: '4px',
                            opacity: 0.6,
                            position: 'relative'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 1 + i * 0.1 }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                background: 'var(--accent-secondary)',
                                boxShadow: '0 0 8px var(--accent-secondary)'
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Grid lines */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: -1,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }} />
        </div>
    );
};

const CpAnalysis = () => {
    return (
        <section className="section" id="cp-analysis">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}
                >
                    <motion.span
                        style={{
                            color: 'var(--accent-primary)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginBottom: 'var(--spacing-sm)',
                            display: 'block'
                        }}
                    >
                        Problem Solving
                    </motion.span>
                    <h2 className="section-title" style={{ margin: 0 }}>
                        Ayon's CP Analysis
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        maxWidth: '600px',
                        margin: 'var(--spacing-md) auto 0'
                    }}>
                        Tracking my progress in competitive programming, open source contributions, and research.
                    </p>
                </motion.div>

                <div className="grid grid-3">
                    <StatCard
                        title="Codeforces Solved"
                        value="350"
                        icon={SiCodeforces}
                        subtext="Max Rating: 1420 (Specialist)"
                        color="#F44336" // Codeforces red
                        delay={0.1}
                        type="problems"
                    />
                    <StatCard
                        title="GitHub Commits"
                        value="1,245"
                        icon={SiGithub}
                        subtext="Contributions in last year"
                        color="#2dba4e" // GitHub green
                        delay={0.2}
                        type="commits"
                    />
                    <StatCard
                        title="Research Papers"
                        value="0"
                        icon={FaScroll}
                        subtext="Working on the first one..."
                        color="#8b5cf6" // Purple
                        delay={0.3}
                        type="research"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <ActivityGraph />
                </motion.div>
            </div>
        </section>
    );
};

export default CpAnalysis;
