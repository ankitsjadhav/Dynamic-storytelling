export function CinematicBackground() {
    return (
        <div
            className="fixed inset-0 z-0 animate-gradient-shift"
            style={{
                background:
                    "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
                backgroundSize: "400% 400%",
            }}
        >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        </div>
    );
}
