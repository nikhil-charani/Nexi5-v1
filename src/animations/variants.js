export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export const staggerContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12 }
    }
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 }
    }
};

export const parallaxBgMotion = {
    animate: { x: [0, 40, 0], y: [0, -20, 0] },
    transition: { duration: 18, repeat: Infinity, ease: "easeInOut" }
};

// Check if user is on mobile to reduce heavy animations
// using a state or simple window check for client-side rendering
export const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
