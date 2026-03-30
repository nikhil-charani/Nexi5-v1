import { useEffect, useRef } from "react";

export default function StarCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = [];
        const STAR_COUNT = 200;

        let mouse = { x: 0, y: 0, active: false };
        let lastMoveTime = Date.now();
        let exploded = false;

        window.addEventListener("mouseenter", () => (mouse.active = true));
        window.addEventListener("mouseleave", () => (mouse.active = false));

        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
            lastMoveTime = Date.now();
            exploded = false;
        });

        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                vx: 0,
                vy: 0,
            });
        }

        function explode(x, y) {
            for (let i = 0; i < 40; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3 + 1;

                stars.push({
                    x,
                    y,
                    size: Math.random() * 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    explosion: true,
                });
            }
        }

        function drawStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const idleTime = Date.now() - lastMoveTime;

            stars.forEach((star) => {
                let dx = mouse.x - star.x;
                let dy = mouse.y - star.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (mouse.active && !star.explosion) {
                    if (dist < 180) {
                        star.x += dx * 0.006;
                        star.y += dy * 0.006;
                    }
                } else if (star.explosion) {
                    star.x += star.vx;
                    star.y += star.vy;
                    star.vx *= 0.98;
                    star.vy *= 0.98;
                }

                const size = star.size + Math.min(2, 150 / dist);

                ctx.beginPath();
                ctx.arc(star.x, star.y, size, 0, Math.PI * 2);

                ctx.fillStyle = "#4fcfff";
                ctx.shadowColor = "#3ec3ff";
                ctx.shadowBlur = 10;

                ctx.fill();
            });

            if (mouse.active && idleTime > 1500 && !exploded) {
                explode(mouse.x, mouse.y);
                exploded = true;
            }

            requestAnimationFrame(drawStars);
        }

        drawStars();

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full z-[1]"
        />
    );
}
