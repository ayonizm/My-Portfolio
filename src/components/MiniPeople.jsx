import { motion } from 'framer-motion';

export const StickPerson = ({ type = "standing", delay = 0, style }) => {
    const strokeColor = "#ff6b6b"; // Reddish color like the sketch
    const strokeWidth = 2.5;

    const variants = {
        dancing: {
            y: [0, -5, 0],
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse", delay }
        },
        running: {
            x: [0, 20, 0],
            transition: { duration: 1.5, repeat: Infinity, ease: "linear", delay }
        },
        climbing: {
            y: [0, -40],
            x: [0, 15],
            transition: { duration: 2, repeat: Infinity, ease: "linear", delay }
        }
    };

    return (
        <motion.svg
            width="40"
            height="50"
            viewBox="0 0 40 50"
            style={{ overflow: 'visible', ...style }}
            variants={variants}
            animate={type}
        >
            {/* Head */}
            <circle cx="20" cy="10" r="4" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />

            {/* Body */}
            <line x1="20" y1="14" x2="20" y2="30" stroke={strokeColor} strokeWidth={strokeWidth} />

            {/* Arms */}
            <motion.g
                animate={type === "dancing" ? { rotate: [0, 20, -20, 0], originX: "20px", originY: "18px" } : {}}
                transition={{ duration: 0.4, repeat: Infinity }}
            >
                <line x1="20" y1="18" x2="10" y2="25" stroke={strokeColor} strokeWidth={strokeWidth} />
                <line x1="20" y1="18" x2="30" y2="25" stroke={strokeColor} strokeWidth={strokeWidth} />
            </motion.g>

            {/* Legs */}
            <motion.g
                animate={type === "running" ? { rotateX: [0, 30, 0] } : {}}
            >
                <line x1="20" y1="30" x2="12" y2="45" stroke={strokeColor} strokeWidth={strokeWidth} />
                <line x1="20" y1="30" x2="28" y2="45" stroke={strokeColor} strokeWidth={strokeWidth} />
            </motion.g>
        </motion.svg>
    );
};

export const Ladder = ({ height = 100, style }) => {
    const strokeColor = "#ff6b6b";

    return (
        <svg width="30" height={height} style={{ overflow: 'visible', ...style }}>
            {/* Rails */}
            <line x1="5" y1="0" x2="5" y2={height} stroke={strokeColor} strokeWidth="2" />
            <line x1="25" y1="0" x2="25" y2={height} stroke={strokeColor} strokeWidth="2" />

            {/* Rungs */}
            {Array.from({ length: Math.floor(height / 10) }).map((_, i) => (
                <line
                    key={i}
                    x1="5"
                    y1={i * 15 + 5}
                    x2="25"
                    y2={i * 15 + 5}
                    stroke={strokeColor}
                    strokeWidth="2"
                />
            ))}
        </svg>
    );
};

export const MiniPeopleScene = () => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
            {/* Dancer on top left (Md) */}
            <div style={{ position: 'absolute', top: '-10%', left: '10%' }}>
                <StickPerson type="dancing" />
            </div>

            {/* Dancer in middle top */}
            <div style={{ position: 'absolute', top: '-15%', left: '50%' }}>
                <StickPerson type="dancing" delay={0.2} />
            </div>

            {/* Ladder Connector (Haque -> Chowdhury) */}
            <div style={{ position: 'absolute', top: '45%', left: '40%', transform: 'rotate(-20deg)' }}>
                <Ladder height={60} />
                <motion.div
                    style={{ position: 'absolute', bottom: 0, left: -5 }}
                    animate={{ y: [0, -50], x: [0, 5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                    <StickPerson type="climbing" />
                </motion.div>
            </div>

            {/* Runner on bottom right words */}
            <div style={{ position: 'absolute', bottom: '10%', right: '10%' }}>
                <StickPerson type="running" />
            </div>
        </div>
    );
};
