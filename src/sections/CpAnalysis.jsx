import { motion } from 'framer-motion';
import { SiCodeforces, SiGithub } from 'react-icons/si';
import { FaScroll } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import atcoderIcon from '../assets/atcoder.svg';

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
                {value ?? '...'}
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
    // Initialize with null so we can show loading '...' until data arrives or fallback triggers
    const [cfStats, setCfStats] = useState({ solved: null, rating: '...', rank: '...' });
    const [ghStats, setGhStats] = useState({ repos: 3, desc: 'Public Repositories' });
    const [acStats, setAcStats] = useState({ solved: null, rating: '...', rank: '...' });

    useEffect(() => {
        // Fetch Codeforces Data
        const fetchCfData = async () => {
            try {
                // Fetch User Info for Rating/Rank
                const infoRes = await fetch('https://codeforces.com/api/user.info?handles=ayon6594');
                const infoData = await infoRes.json();

                // Fetch Submissions for Solved Count
                const statusRes = await fetch('https://codeforces.com/api/user.status?handle=ayon6594&from=1&count=50000');
                const statusData = await statusRes.json();

                if (infoData.status === 'OK' && statusData.status === 'OK') {
                    const user = infoData.result[0];

                    // Calculate unique solved problems
                    const solvedProblems = new Set();
                    statusData.result.forEach(submission => {
                        if (submission.verdict === 'OK') {
                            // Create a unique key: contestId-index is standard, fallback to name if contestId is missing (e.g. some gym/old problems)
                            const key = submission.problem.contestId
                                ? `${submission.problem.contestId}-${submission.problem.index}`
                                : submission.problem.name;
                            solvedProblems.add(key);
                        }
                    });

                    // The public API only returns public submissions.
                    // Profile count (693) - Public API count (614) = 79 private/group problems.
                    const PRIVATE_SOLVED_OFFSET = 79;

                    setCfStats({
                        rating: user.maxRating || 0,
                        rank: user.maxRank ? (user.maxRank.charAt(0).toUpperCase() + user.maxRank.slice(1)) : 'Unrated',
                        solved: solvedProblems.size + PRIVATE_SOLVED_OFFSET
                    });
                } else {
                    throw new Error("CF API Error");
                }
            } catch (error) {
                console.error("Failed to fetch Codeforces data, using fallback:", error);
                // Fallback to approximate known stats if API fails
                setCfStats({ rating: '1420', rank: 'Specialist', solved: 693 });
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
                } else {
                    throw new Error("GitHub API Error");
                }
            } catch (error) {
                console.error("Failed to fetch GitHub data, using fallback:", error);
                // Fallback to the real number if API fails
                setGhStats({ repos: 3, desc: 'Public Repositories' });
            }
        };

        // Fetch AtCoder Data
        const fetchAcData = async () => {
            let solvedCount = 119; // Default/Fallback
            let currentRating = 212; // Default/Fallback
            let rank = 'Gray';

            try {
                // Fetch User Rating via Contest History
                // https://kenkoooo.com/atcoder/atcoder-api/v3/user/contest_history?user=ayonizm
                try {
                    const historyRes = await fetch('https://kenkoooo.com/atcoder/atcoder-api/v3/user/contest_history?user=ayonizm');
                    const historyData = await historyRes.json();

                    if (Array.isArray(historyData) && historyData.length > 0) {
                        currentRating = historyData[historyData.length - 1].NewRating;
                    }
                } catch (e) {
                    console.warn("AC History fetch failed", e);
                }

                // Fetch Submissions for Solved Count
                // https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=ayonizm&from_second=0
                try {
                    const subRes = await fetch('https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=ayonizm&from_second=0');
                    const subData = await subRes.json();

                    if (Array.isArray(subData)) {
                        const uniqueAc = new Set();
                        subData.forEach(sub => {
                            if (sub.result === 'AC') {
                                uniqueAc.add(sub.problem_id);
                            }
                        });
                        solvedCount = uniqueAc.size;
                    }
                } catch (e) {
                    console.warn("AC Submissions fetch failed", e);
                }

                // Determine Rank Color/Name
                if (currentRating > 0) {
                    if (currentRating < 400) rank = 'Gray';
                    else if (currentRating < 800) rank = 'Brown';
                    else if (currentRating < 1200) rank = 'Green';
                    else if (currentRating < 1600) rank = 'Cyan';
                    else if (currentRating < 2000) rank = 'Blue';
                    else if (currentRating < 2400) rank = 'Yellow';
                    else if (currentRating < 2800) rank = 'Orange';
                    else rank = 'Red';
                }

                setAcStats({
                    solved: solvedCount,
                    rating: currentRating,
                    rank: rank
                });

            } catch (error) {
                console.error("Failed to fetch AtCoder data:", error);
                // Hard fallback if everything crashes
                setAcStats({ solved: 119, rating: 212, rank: 'Gray' });
            }
        };

        fetchCfData();
        // fetchGhData(); // Using static count of 3 as requested
        fetchAcData();
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

                <div className="grid grid-4">
                    <StatCard
                        title="Codeforces Solved"
                        value={cfStats.solved}
                        icon={SiCodeforces}
                        subtext={`Max Rating: ${cfStats.rating} (${cfStats.rank})`}
                        color="#F44336" // Codeforces red
                        delay={0.1}
                        type="problems"
                    />
                    <StatCard
                        title="GitHub Repos"
                        value={ghStats.repos}
                        icon={SiGithub}
                        subtext={ghStats.desc}
                        color="#2dba4e" // GitHub green
                        delay={0.2}
                        type="commits"
                    />
                    <StatCard
                        title="AtCoder Solved"
                        value={acStats.solved}
                        icon={() => <img src={atcoderIcon} alt="AtCoder" style={{ width: '1em', height: '1em' }} />}
                        subtext={`Max Rating: ${acStats.rating} (${acStats.rank})`}
                        color="#000000" // AtCoder Black
                        delay={0.3}
                        type="problems"
                    />
                    <StatCard
                        title="Research Papers"
                        value="0"
                        icon={FaScroll}
                        subtext="Will do in future"
                        color="#8b5cf6" // Purple
                        delay={0.4}
                        type="research"
                    />
                </div>

                <div style={{
                    marginTop: 'var(--spacing-2xl)',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <motion.a
                        href="/analysis"
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        View Detailed Analysis
                    </motion.a>
                </div>
            </div>
        </section>
    );
};

export default CpAnalysis;
