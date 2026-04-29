'use client'

import { canvas } from "leaflet"
import { useEffect, useRef } from "react"

// ---------- Types ----------

interface Particle {
    x: number
    y: number
    vx: number // velocity x
    vy: number // velocity y
    life: number // 0 to 1, where 0 is dead
    decay: number // how fast it fades out
    size: number
    hue: number // gold range: 35-55
}

interface Rune {
    x: number
    y: number
    char: string
    opacity: number
    targetOpacity: number
    size: number
    fadeSpeed: number
}

// ---------- Constants ----------

// Only draw in side gutters so content is never obscured
// GUTTER_WIDTH is how many px from each edge we're allowed to draw within
const GUTTER_WIDTH = 220

// Temp rune characters
const RUNE_CHARS = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ']

// ---------- Helper Functions ----------

function randomBetween(a: number, b: number) {
    return a + Math.random() * (b - a)
}

// Spawns a new particle in either gutter
function spawnParticle(canvasWidth: number, canvasHeight: number): Particle {
    const side = Math.random() < 0.5 ? 'left' : 'right'
    const x = side === 'left' ? randomBetween(10, GUTTER_WIDTH) : randomBetween(canvasWidth - GUTTER_WIDTH, canvasWidth - 10)

    return {
        x,
        y: randomBetween(canvasHeight * 0.1, canvasHeight * 0.9),
        vx: randomBetween(-0.08, 0.08),
        vy: randomBetween(-0.25, -0.06), // drift upward
        life: 1,
        decay: randomBetween(0.0008, 0.002),
        size: randomBetween(1.5, 3.5),
        hue: randomBetween(35, 55),
    }
}

// ---------- Component ----------
export default function MagicBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas)
            return
        const ctx = canvas.getContext('2d')
        if (!ctx)
            return

        // ---------- Resize Handler ----------
        // We need the cavnas px dims to match the screen.
        // devicePixelRatio handles retina/HiDPI screen, so without this, everything
        // would look blurry on modern displays
        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            canvas.width = window.innerWidth * dpr
            canvas.height = window.innerHeight * dpr
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            ctx.scale(dpr, dpr)
        }
        resize()
        window.addEventListener('resize', resize)

        // ---------- State ----------
        const particles: Particle[] = []
        const MAX_PARTICLES = 30

        const runes: Rune[] = Array.from({ length: 18 }, () => {
            const side = Math.random() < 0.5 ? 'left' : 'right'
            const w = window.innerWidth
            const h = window.innerHeight
            return {
                x: side === 'left' ? randomBetween(20, GUTTER_WIDTH - 20) : randomBetween(w - GUTTER_WIDTH + 20, w - 20),
                y: randomBetween(h * 0.05, h * 0.95),
                char: RUNE_CHARS[Math.floor(Math.random() * RUNE_CHARS.length)],
                opacity: 0,
                targetOpacity: randomBetween(0.04, 0.12),
                size: randomBetween(14, 28),
                fadeSpeed: randomBetween(0.0002, 0.0005),
            }
        })

        let animId: number
        let frame = 0

        // ---------- Main draw loop ----------
        // 1. Clear the canvas
        // 2. Update state (move things, age things, spawn new things)
        // 3. Draw everything
        // 4. Request next frame
        const draw = () => {
            animId = requestAnimationFrame(draw)
            frame++

            const w = window.innerWidth
            const h = window.innerHeight

            // Clear using clearRect instead of fillRect keeps the canvas transparent so the CSS bg shows through beneath it
            ctx.clearRect(0, 0, w, h)

            // ---------- Spawn particles ----------
            // Every # frames, try to add a particle if we're under the cap
            if (frame % 12 === 0 && particles.length < MAX_PARTICLES) {
                particles.push(spawnParticle(w, h))
            }

            // ---------- Update and draw particles ----------
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i]

                // Move
                p.x += p.vx
                p.y += p.vy
                p.life -= p.decay

                // Remove dead particles
                if (p.life <= 0) {
                    particles.splice(i, 1)
                    continue
                }

                // Draw
                const alpha = p.life * 0.6 // fade as it ages
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
                grad.addColorStop(0, `hsla(${p.hue}, 70%, 70%, ${alpha})`)
                grad.addColorStop(0.4, `hsla(${p.hue}, 60%, 55%, ${alpha * 0.5})`)
                grad.addColorStop(1, `hsla(${p.hue}, 50%, 40%, 0)`)

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
                ctx.fillStyle = grad
                ctx.fill()
            }

            // ---------- Update and draw runes ----------
            for (const rune of runes) {
                // Pulse toward target opacity, then flip target to create a breathing effect
                rune.opacity += (rune.targetOpacity - rune.opacity) * rune.fadeSpeed * 60
                if (Math.abs(rune.opacity - rune.targetOpacity) < 0.005) {
                    rune.targetOpacity = rune.targetOpacity > 0.02 ? randomBetween(0.01, 0.03) : randomBetween(0.06, 0.14)
                }

                ctx.save()
                ctx.globalAlpha = rune.opacity
                ctx.font = `${rune.size}px 'Cinzel', serif`
                ctx.fillStyle = `hsl(42, 60%, 65%)`
                ctx.fillText(rune.char, rune.x, rune.y)
                ctx.restore()
            }
        }

        draw()

        // ---------- Cleanup ----------
        // This runes when the component unmounts (or naving away from page).
        // W/o this, the animation loop would keep running in the bg
        // wasting CPU/GPU even when not visible
        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    )
}