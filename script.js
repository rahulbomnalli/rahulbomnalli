// Particle Background Animation
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById("particleCanvas")
        this.ctx = this.canvas.getContext("2d")
        this.particles = []
        this.numberOfParticles = Math.min(50, Math.floor(window.innerWidth / 30))
        this.animationId = null

        this.init()
        this.animate()
        this.handleResize()
    }

    init() {
        this.setCanvasSize()
        this.createParticles()
    }

    setCanvasSize() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    createParticles() {
        this.particles = []
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas))
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.particles.forEach((particle) => {
            particle.update()
            particle.draw(this.ctx)
        })

        this.connectParticles()
        this.animationId = requestAnimationFrame(() => this.animate())
    }

    connectParticles() {
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a + 1; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x
                const dy = this.particles[a].y - this.particles[b].y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 100) {
                    const opacity = (1 - distance / 100) * 0.2
                    this.ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`
                    this.ctx.lineWidth = 1
                    this.ctx.beginPath()
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y)
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y)
                    this.ctx.stroke()
                }
            }
        }
    }

    handleResize() {
        let resizeTimeout
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => {
                this.setCanvasSize()
                this.numberOfParticles = Math.min(50, Math.floor(window.innerWidth / 30))
                this.createParticles()
            }, 150)
        })
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
        }
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = Math.random() * 0.2 - 0.1
        this.speedY = Math.random() * 0.2 - 0.1
        this.color = `rgba(16, 185, 129, ${Math.random() * 0.3 + 0.2})`
    }

    update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > this.canvas.width) this.x = 0
        else if (this.x < 0) this.x = this.canvas.width

        if (this.y > this.canvas.height) this.y = 0
        else if (this.y < 0) this.y = this.canvas.height
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver((entries) => this.handleIntersection(entries), {
            threshold: 0.1,
            rootMargin: "-30px",
        })

        this.init()
    }

    init() {
        const elementsToAnimate = document.querySelectorAll(
            ".section-title, .stat-item, .skill-category, .experience-item, .project-card, .education-item, .certification-item, .contact-description, .contact-buttons",
        )

        elementsToAnimate.forEach((el, index) => {
            el.style.transitionDelay = `${Math.min(index * 0.03, 0.3)}s`
            this.observer.observe(el)
        })
    }

    handleIntersection(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate")

                if (entry.target.classList.contains("skill-category")) {
                    this.animateSkillBars(entry.target)
                }

                if (entry.target.classList.contains("stat-item")) {
                    this.animateCounter(entry.target)
                }

                this.observer.unobserve(entry.target)
            }
        })
    }

    animateSkillBars(skillCategory) {
        const skillFills = skillCategory.querySelectorAll(".skill-fill")
        skillFills.forEach((fill, index) => {
            setTimeout(() => {
                const width = fill.getAttribute("data-width")
                fill.style.width = width + "%"
            }, index * 100)
        })
    }

    animateCounter(statItem) {
        const numberElement = statItem.querySelector(".stat-number")
        const target = Number.parseInt(numberElement.getAttribute("data-target"))
        const duration = 1000
        const increment = target / (duration / 16)
        let current = 0

        const updateCounter = () => {
            current += increment
            if (current < target) {
                numberElement.textContent = Math.floor(current)
                requestAnimationFrame(updateCounter)
            } else {
                numberElement.textContent = target
            }
        }

        updateCounter()
    }
}

// Smooth scrolling for anchor links
class SmoothScroll {
    constructor() {
        this.init()
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (e) => {
                e.preventDefault()
                const target = document.querySelector(anchor.getAttribute("href"))
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    })
                }
            })
        })
    }
}

// Parallax effect for hero section
class ParallaxEffect {
    constructor() {
        this.heroSection = document.getElementById("hero")
        this.init()
    }

    init() {
        let ticking = false

        const updateParallax = () => {
            const scrolled = window.pageYOffset
            const rate = scrolled * -0.3

            if (this.heroSection) {
                this.heroSection.style.transform = `translateY(${rate}px)`
            }
            ticking = false
        }

        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax)
                ticking = true
            }
        })
    }
}

// Enhanced project card effects
class ProjectCardEffects {
    constructor() {
        this.init()
    }

    init() {
        const projectCards = document.querySelectorAll(".project-card")

        projectCards.forEach((card) => {
            // Mouse move effect
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                const centerX = rect.width / 2
                const centerY = rect.height / 2

                const rotateX = (y - centerY) / 10
                const rotateY = (centerX - x) / 10

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`
            })

            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)"
            })
        })
    }
}

// Enhanced certification animation
class CertificationAnimation {
    constructor() {
        this.init()
    }

    init() {
        const bullets = document.querySelectorAll(".certification-bullet")
        bullets.forEach((bullet, index) => {
            bullet.style.animationDelay = `${index * 0.2}s`
        })
    }
}

// Scroll progress indicator
class ScrollProgress {
    constructor() {
        this.createProgressBar()
        this.updateProgress()
    }

    createProgressBar() {
        const progressBar = document.createElement("div")
        progressBar.id = "scroll-progress"
        document.body.appendChild(progressBar)
    }

    updateProgress() {
        let ticking = false

        const updateBar = () => {
            const scrollTop = window.pageYOffset
            const docHeight = document.body.scrollHeight - window.innerHeight
            const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100)

            const progressBar = document.getElementById("scroll-progress")
            if (progressBar) {
                progressBar.style.width = scrollPercent + "%"
            }
            ticking = false
        }

        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(updateBar)
                ticking = true
            }
        })
    }
}

// Enhanced button interactions
class ButtonEffects {
    constructor() {
        this.init()
    }

    init() {
        const buttons = document.querySelectorAll(".btn")

        buttons.forEach((button) => {
            button.addEventListener("mouseenter", this.createRipple)
            button.addEventListener("touchstart", this.createRipple, { passive: true })
        })
    }

    createRipple(e) {
        const button = e.currentTarget
        const ripple = document.createElement("span")

        ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      transform: scale(0);
      animation: ripple 0.4s linear;
      pointer-events: none;
    `

        const rect = button.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        ripple.style.width = ripple.style.height = size + "px"
        ripple.style.left = rect.width / 2 - size / 2 + "px"
        ripple.style.top = rect.height / 2 - size / 2 + "px"

        button.style.position = "relative"
        button.appendChild(ripple)

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple)
            }
        }, 400)
    }
}

// Loading manager
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById("loading-screen")
        this.init()
    }

    init() {
        // Hide loading screen after content loads
        window.addEventListener("load", () => {
            setTimeout(() => {
                this.loadingScreen.classList.add("hidden")
                document.body.style.overflow = "auto"

                // Remove loading screen after animation
                setTimeout(() => {
                    if (this.loadingScreen.parentNode) {
                        this.loadingScreen.parentNode.removeChild(this.loadingScreen)
                    }
                }, 300)
            }, 500)
        })

        // Fallback timeout
        setTimeout(() => {
            this.loadingScreen.classList.add("hidden")
        }, 3000)
    }
}

// Performance monitor
class PerformanceMonitor {
    constructor() {
        this.init()
    }

    init() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty("--animation-duration", "0.2s")
        }

        // Pause animations when tab is not visible
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                document.body.style.animationPlayState = "paused"
            } else {
                document.body.style.animationPlayState = "running"
            }
        })
    }
}

// Initialize all animations and effects
document.addEventListener("DOMContentLoaded", () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (!prefersReducedMotion.matches) {
        window.particleBackground = new ParticleBackground()
    }

    new LoadingManager()
    new AnimationObserver()
    new SmoothScroll()
    new ParallaxEffect()
    new ProjectCardEffects()
    new CertificationAnimation()
    new ScrollProgress()
    new ButtonEffects()
    new PerformanceMonitor()

    // Add ripple animation CSS
    const style = document.createElement("style")
    style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `
    document.head.appendChild(style)

    // Optimize scroll performance
    let scrollTimeout
    let isScrolling = false

    window.addEventListener(
        "scroll",
        () => {
            if (!isScrolling) {
                document.body.classList.add("scrolling")
                isScrolling = true
            }

            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove("scrolling")
                isScrolling = false
            }, 150)
        },
        { passive: true },
    )
})

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
    if (window.particleBackground) {
        window.particleBackground.destroy()
    }
})
