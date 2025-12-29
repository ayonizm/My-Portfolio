import { motion } from 'framer-motion';
import { SiCodeforces, SiGithub } from 'react-icons/si';
import { FaScroll } from 'react-icons/fa';
import { useEffect, useState } from 'react';

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

const CpAnalysis = () => {
    const [cfStats, setCfStats] = useState({ solved: 0, rating: '...', rank: '...' });
    const [ghStats, setGhStats] = useState({ repos: 0, desc: 'Fetching...' });

    useEffect(() => {
        // Fetch Codeforces Data
        const fetchCfData = async () => {
            try {
                // Fetch User Info for Rating/Rank
                const infoRes = await fetch('https://codeforces.com/api/user.info?handles=ayon6594');
                const infoData = await infoRes.json();

                // Fetch Submissions for Solved Count
                const statusRes = await fetch('https://codeforces.com/api/user.status?handle=ayon6594');
                const statusData = await statusRes.json();

                if (infoData.status === 'OK' && statusData.status === 'OK') {
                    const user = infoData.result[0];

                    // Calculate unique solved problems
                    const solvedProblems = new Set();
                    statusData.result.forEach(submission => {
                        if (submission.verdict === 'OK') {
                            // Create a unique key for each problem (contestId + index)
                            solvedProblems.add(`${submission.problem.contestId}-${submission.problem.index}`);
                        }
                    });

                    setCfStats({
                        rating: user.maxRating || 0,
                        rank: user.maxRank ? (user.maxRank.charAt(0).toUpperCase() + user.maxRank.slice(1)) : 'Unrated',
                        solved: solvedProblems.size
                    });
                }
            } catch (error) {
                console.error("Failed to fetch Codeforces data:", error);
                setCfStats(prev => ({ ...prev, rating: 'Error', rank: 'Error' }));
            }
        };

        // Fetch GitHub Data
        const fetchGhData = async () => {
            try {
                const res = await fetch('https://api.github.com/users/ayonizm');
                const data = await res.json();

                if (data.public_repos !== undefined) {
                    setGhStats({
                        repos: data.public_repos,
                        desc: 'Public Repositories'
                    });
                }
            } catch (error) {
                console.error("Failed to fetch GitHub data:", error);
                setGhStats({ repos: 'Error', desc: 'Failed to fetch' });
            }
        };

        fetchCfData();
        fetchGhData();
    }, []);

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
                        value={cfStats.solved || '...'}
                        icon={SiCodeforces}
                        subtext={`Max Rating: ${cfStats.rating} (${cfStats.rank})`}
                        color="#F44336" // Codeforces red
                        delay={0.1}
                        type="problems"
                    />
                    <StatCard
                        title="GitHub Repos"
                        value={ghStats.repos || '...'}
                        icon={SiGithub}
                        subtext={ghStats.desc}
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
            </div>
        </section>
    );
};

export default CpAnalysis;
