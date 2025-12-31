import { motion } from 'framer-motion';

// Reusable limb component for articulated joints
const Limb = ({ x1, y1, x2, y2, animate, transition }) => (
    <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#ff6b6b"
        strokeWidth="2.5"
        strokeLinecap="round"
        animate={animate}
        transition={transition}
    />
);

export const StickPerson = ({ type = "standing", delay = 0, style }) => {
    // Shared transition settings for smooth looped animation
    const loopTransition = {
        duration: type === 'running' ? 0.6 : type === 'climbing' ? 1.5 : 1,
        repeat: Infinity,
        ease: "linear",
        delay: delay
    };

    // --- ANIMATION VARIANTS --- //

    // RUNNING (Cycle: 0.6s)
    const runningHead = { y: [0, 2, 0] };
    const runningTorso = { y1: [14, 16, 14], y2: [30, 32, 30] }; // Bouncing body

    // Running Arms (Swinging opposite)
    // Left Arm (Back then Forward)
    const runningLArm = {
        x2: [10, 28, 10],
        y2: [22, 18, 22]
    };
    // Right Arm (Forward then Back)
    const runningRArm = {
        x2: [28, 10, 28],
        y2: [18, 22, 18]
    };

    // Running Legs (Cycling)
    // Left Leg: Contact -> Push -> Lift -> Swing
    const runningLLeg = {
        x1: [20, 22, 20], y1: [30, 32, 30], // Hip moves
        x2: [20, 5, 20],  // Foot kicks back then forward
        y2: [45, 38, 45]  // Foot lifts
    };
    /* Since simple lines can't bend knees easily without more segments, 
       we simulate the stride by moving the endpoint. 
       For a truer stickman run, we angle the lines. */

    const runningLegLeft = {
        x2: [12, 28, 12],
        y2: [45, 40, 45]  // Up/down creates a circular motion
    };
    const runningLegRight = {
        x2: [28, 12, 28],
        y2: [40, 45, 40]
    };


    // DANCING (Cycle: 1s)
    // Side to side sway
    const dancingBody = { rotate: [-5, 5, -5], originX: "20px", originY: "30px" };
    const dancingHead = { x: [-2, 2, -2] };
    const dancingLArm = { x2: [10, 5, 10], y2: [25, 10, 25] }; // Waving
    const dancingRArm = { x2: [30, 35, 30], y2: [25, 10, 25] }; // Waving

    // CLIMBING (Cycle: 1.5s)
    // Hand over hand, foot over foot
    const climbingLArm = {
        y1: [18, 14, 18], // Shoulder moves
        y2: [10, 25, 10], // Hand reaches up (10) then pulls down (25)
        x2: [15, 15, 15]
    };
    const climbingRArm = {
        y1: [18, 14, 18],
        y2: [25, 10, 25], // Opposite phase
        x2: [25, 25, 25]
    };
    const climbingLLeg = {
        y1: [30, 28, 30],
        y2: [45, 35, 45], // Step up
        x2: [15, 15, 15]
    };
    const climbingRLeg = {
        y1: [30, 28, 30],
        y2: [35, 45, 35], // Step up
        x2: [25, 25, 25]
    };


    // --- RENDERING BASED ON TYPE --- //

    if (type === 'running') {
        return (
            <motion.svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible', ...style }}>
                <motion.circle cx="20" cy="10" r="4" stroke="#ff6b6b" strokeWidth="2.5" fill="none" animate={runningHead} transition={loopTransition} />
                {/* Body */}
                <motion.line x1="20" y1="14" x2="20" y2="30" stroke="#ff6b6b" strokeWidth="2.5" animate={runningTorso} transition={loopTransition} />

                {/* Legs */}
                <Limb x1="20" y1="30" x2="20" y2="45" animate={runningLegLeft} transition={loopTransition} />
                <Limb x1="20" y1="30" x2="20" y2="45" animate={runningLegRight} transition={loopTransition} />

                {/* Arms */}
                <Limb x1="20" y1="18" x2="10" y2="25" animate={runningLArm} transition={loopTransition} />
                <Limb x1="20" y1="18" x2="30" y2="25" animate={runningRArm} transition={loopTransition} />
            </motion.svg>
        );
    }

    if (type === 'climbing') {
        return (
            <motion.svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible', ...style }}>
                <circle cx="20" cy="10" r="4" stroke="#ff6b6b" strokeWidth="2.5" fill="none" />
                <line x1="20" y1="14" x2="20" y2="30" stroke="#ff6b6b" strokeWidth="2.5" />

                {/* Legs */}
                <Limb x1="20" y1="30" x2="15" y2="45" animate={climbingLLeg} transition={loopTransition} />
                <Limb x1="20" y1="30" x2="25" y2="45" animate={climbingRLeg} transition={loopTransition} />

                {/* Arms */}
                <Limb x1="20" y1="18" x2="15" y2="10" animate={climbingLArm} transition={loopTransition} />
                <Limb x1="20" y1="18" x2="25" y2="25" animate={climbingRArm} transition={loopTransition} />
            </motion.svg>
        );
    }

    // Default: Dancing
    return (
        <motion.svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible', ...style }}>
            <motion.g animate={dancingBody} transition={{ ...loopTransition, repeatType: "reverse" }}>
                <motion.circle cx="20" cy="10" r="4" stroke="#ff6b6b" strokeWidth="2.5" fill="none" animate={dancingHead} transition={{ ...loopTransition, repeatType: "reverse" }} />
                <line x1="20" y1="14" x2="20" y2="30" stroke="#ff6b6b" strokeWidth="2.5" />

                {/* Legs (Static stance but moving with body group) */}
                <line x1="20" y1="30" x2="12" y2="45" stroke="#ff6b6b" strokeWidth="2.5" />
                <line x1="20" y1="30" x2="28" y2="45" stroke="#ff6b6b" strokeWidth="2.5" />

                {/* Arms (Waving) */}
                <Limb x1="20" y1="18" x2="10" y2="25" animate={dancingLArm} transition={{ ...loopTransition, duration: 0.5, repeatType: "reverse" }} />
                <Limb x1="20" y1="18" x2="30" y2="25" animate={dancingRArm} transition={{ ...loopTransition, duration: 0.5, repeatType: "reverse", delay: 0.25 }} />
            </motion.g>
        </motion.svg>
    );
};

export const Ladder = ({ height = 100, style }) => {
    const strokeColor = "#ff6b6b";

    return (
        <svg width="40" height={height} style={{ overflow: 'visible', ...style }}>
            {/* Rails */}
            <line x1="10" y1="0" x2="10" y2={height} stroke={strokeColor} strokeWidth="2" />
            <line x1="30" y1="0" x2="30" y2={height} stroke={strokeColor} strokeWidth="2" />

            {/* Rungs */}
            {Array.from({ length: Math.floor(height / 12) }).map((_, i) => (
                <line
                    key={i}
                    x1="10"
                    y1={i * 15 + 5}
                    x2="30"
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
            <div style={{ position: 'absolute', top: '-12%', left: '12%' }}>
                <StickPerson type="dancing" />
            </div>

            {/* Dancer in middle top */}
            <div style={{ position: 'absolute', top: '-18%', left: '55%' }}>
                <StickPerson type="dancing" delay={0.3} />
            </div>

            {/* Ladder Connector (Haque -> Chowdhury) 
                Adjusted position to align with 'Haque' ending and 'Chowdhury' middle
            */}
            <div style={{ position: 'absolute', top: '42%', left: '42%', transform: 'rotate(-15deg)' }}>
                <Ladder height={70} />
                <motion.div
                    style={{ position: 'absolute', bottom: -10, left: -2 }}
                    animate={{ y: [0, -60] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                    <StickPerson type="climbing" />
                </motion.div>
            </div>

            {/* Runner on bottom right 
                 Running back and forth
             */}
            <motion.div
                style={{ position: 'absolute', bottom: '8%', right: '15%' }}
                animate={{ x: [0, -100, 0], scaleX: [1, -1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
                <StickPerson type="running" />
            </motion.div>
        </div>
    );
};
