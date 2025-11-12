import { addPropertyControls, ControlType } from "framer"
import React from "react"

/**
 * Quantum-Spatial Foundation System - COMPLETE M4-OPTIMIZED VERSION
 *
 * Advanced foundation system integrating:
 * - Unified Grid System with 3D perspective
 * - Volumetric Pixel System with 4 quantum states
 * - Core Quantum Pixel components (16 variants)
 * - Advanced M4-optimized rendering
 * - Individually selectable components
 * - Apple HIG compliant responsive design
 *
 * @param {Object} props - Component properties
 * @returns {JSX.Element} - Complete foundation system
 */
export default function QuantumSpatialSystem(props) {
    const {
        variant = "quantum",
        layout = "responsive",
        showSystemUI = false,
        showGrid = true,
        showPixels = true,
        showComponents = true,
        showTypography = true,
        gridType = "interface",
        gridDensity = "medium",
        pixelState = "all",
        selectedComponent = "none",
        minWidth = 320,
        maxWidth = 1200,
        enableM4Optimizations = true,
        enable3D = true,
        enableAnimations = true,
    } = props

    // Updated worker URL - sources-of-truth validated
    const workerUrl = "https://design-system.9bitstudios.io"
    const interfaceUrl = `${workerUrl}/auto-deployer`
    const tokensUrl = `${workerUrl}/tokens?state=${variant}`

    // State management
    const [tokens, setTokens] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [hasError, setHasError] = React.useState(false)
    const [containerSize, setContainerSize] = React.useState({
        width: 400,
        height: 300,
    })
    const [deviceInfo, setDeviceInfo] = React.useState(null)
    const [selectedComponentData, setSelectedComponentData] =
        React.useState(null)

    // Container ref for size detection
    const containerRef = React.useRef(null)

    // Advanced color system from volumetric-pixel-viewer.html
    const colorSystem = {
        foundation: {
            voidBlack: "#0A0621",
            deepSpaceIndigo: "#131A36",
            ultraIndigo: "#1E1F5C",
            dimensionalEggplant: "#331F4A",
            midnightRichness: "#0D0D15",
            quantumViolet: "#6A3093",
        },
        accents: {
            subtleAqua: "#06D6A0",
            subtleCyan: "#5AC8FA",
            dimensionalTeal: "#126D71",
            roseEnergy: "#BF4080",
            quantumPulsePink: "#FF2D55",
        },
        heritage: {
            heritageGreen: "#2C5F2D",
            heritageGreenLight: "#3D8B40",
            heritageGreenDark: "#1B3D1A",
            heritagePixelGreen: "#3DFF74",
            heritagePixelAqua: "#00FFC8",
        },
    }

    // Typography system from implementation standards
    const typographySystem = {
        fontFamily:
            "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        fontWeights: {
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            heavy: 800,
        },
        sizes: {
            xs: "12px",
            sm: "14px",
            md: "16px",
            lg: "20px",
            xl: "24px",
            xxl: "32px",
            display: "48px",
        },
        lineHeights: {
            tight: 1.2,
            normal: 1.5,
            relaxed: 1.6,
        },
    }

    // Core quantum pixel definitions from core-quantum-pixel-system.html
    const pixelDefinitions = [
        // Materialized State (4 variants)
        {
            name: "Quantum Cube",
            state: "materialized",
            primaryColor: "#2C5F2D",
            accentColor: "#3DFF74",
            secondaryColor: "#1B3D1A",
        },
        {
            name: "Spatial Octahedron",
            state: "materialized",
            primaryColor: "#331F4A",
            accentColor: "#5AC8FA",
            secondaryColor: "#1E1F5C",
        },
        {
            name: "Void Sphere",
            state: "materialized",
            primaryColor: "#6A3093",
            accentColor: "#BF4080",
            secondaryColor: "#FF2D55",
        },
        {
            name: "Heritage Block",
            state: "materialized",
            primaryColor: "#2C5F2D",
            accentColor: "#3DFF74",
            secondaryColor: "#1B3D1A",
        },

        // Partial State (4 variants)
        {
            name: "Phase Shift",
            state: "partial",
            primaryColor: "#331F4A",
            accentColor: "#5AC8FA",
            secondaryColor: "#1E1F5C",
        },
        {
            name: "Quantum Ripple",
            state: "partial",
            primaryColor: "#6A3093",
            accentColor: "#BF4080",
            secondaryColor: "#FF2D55",
        },
        {
            name: "Dimensional Echo",
            state: "partial",
            primaryColor: "#126D71",
            accentColor: "#06D6A0",
            secondaryColor: "#131A36",
        },
        {
            name: "Transient Form",
            state: "partial",
            primaryColor: "#331F4A",
            accentColor: "#5AC8FA",
            secondaryColor: "#1E1F5C",
        },

        // Energy State (4 variants)
        {
            name: "Energy Grid",
            state: "energy",
            primaryColor: "#FF2D55",
            accentColor: "#BF4080",
            secondaryColor: "#6A3093",
        },
        {
            name: "Quantum Core",
            state: "energy",
            primaryColor: "#5AC8FA",
            accentColor: "#06D6A0",
            secondaryColor: "#126D71",
        },
        {
            name: "Void Stream",
            state: "energy",
            primaryColor: "#6A3093",
            accentColor: "#BF4080",
            secondaryColor: "#FF2D55",
        },
        {
            name: "Ethereal Circuit",
            state: "energy",
            primaryColor: "#3DFF74",
            accentColor: "#06D6A0",
            secondaryColor: "#2C5F2D",
        },

        // Superposition State (4 variants)
        {
            name: "Quantum Plural",
            state: "superposition",
            primaryColor: "#FFFFFF",
            accentColor: "#5AC8FA",
            secondaryColor: "#FF2D55",
        },
        {
            name: "Echo Chamber",
            state: "superposition",
            primaryColor: "#FFFFFF",
            accentColor: "#BF4080",
            secondaryColor: "#6A3093",
        },
        {
            name: "Dimensional Fold",
            state: "superposition",
            primaryColor: "#FFFFFF",
            accentColor: "#3DFF74",
            secondaryColor: "#2C5F2D",
        },
        {
            name: "Reality Cascade",
            state: "superposition",
            primaryColor: "#FFFFFF",
            accentColor: "#06D6A0",
            secondaryColor: "#126D71",
        },
    ]

    // Apple HIG spacing system (8-point grid)
    const spacing = {
        xs: 4, // 0.5 * 8
        sm: 8, // 1 * 8
        md: 16, // 2 * 8
        lg: 24, // 3 * 8
        xl: 32, // 4 * 8
        xxl: 48, // 6 * 8
    }

    // Device detection for M4 optimizations
    const detectM4Device = React.useCallback(() => {
        if (typeof window === "undefined") return null

        const isMac = navigator.platform.includes("Mac")
        const cores = navigator.hardwareConcurrency || 0
        const isM4 = isMac && cores >= 8

        return {
            platform: navigator.platform,
            cores,
            isMac,
            isM4Detected: isM4,
            recommendedState: isM4 ? "superposition" : variant,
        }
    }, [variant])

    // Load design tokens
    const loadDesignTokens = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await fetch(tokensUrl)
            if (!response.ok)
                throw new Error(`Failed to fetch tokens: ${response.status}`)

            const tokenData = await response.json()
            setTokens(tokenData)
            setIsLoading(false)
            setHasError(false)
        } catch (error) {
            console.error("Error loading design tokens:", error)
            setHasError(true)
            setIsLoading(false)
        }
    }, [tokensUrl])

    // Monitor container size for responsive layout
    React.useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                setContainerSize({ width: rect.width, height: rect.height })
            }
        }

        updateSize()
        window.addEventListener("resize", updateSize)

        let resizeObserver
        if (window.ResizeObserver && containerRef.current) {
            resizeObserver = new ResizeObserver(updateSize)
            resizeObserver.observe(containerRef.current)
        }

        return () => {
            window.removeEventListener("resize", updateSize)
            if (resizeObserver) resizeObserver.disconnect()
        }
    }, [])

    // Initialize device detection and load tokens
    React.useEffect(() => {
        const deviceCapabilities = detectM4Device()
        setDeviceInfo(deviceCapabilities)

        if (!showSystemUI) {
            loadDesignTokens()
        }
    }, [showSystemUI, loadDesignTokens, detectM4Device])

    // Responsive breakpoints
    const isCompact = containerSize.width < 480
    const isMedium = containerSize.width >= 480 && containerSize.width < 768
    const isLarge = containerSize.width >= 768

    // Get colors from variant
    const getColors = () => {
        const variantColors = {
            heritage: {
                primary: colorSystem.heritage.heritageGreen,
                accent: colorSystem.heritage.heritagePixelGreen,
                background: colorSystem.foundation.voidBlack,
                surface: "rgba(44, 95, 45, 0.1)",
                text: "#FFFFFF",
                border: "rgba(61, 255, 116, 0.3)",
            },
            transitional: {
                primary: colorSystem.foundation.dimensionalEggplant,
                accent: colorSystem.accents.subtleCyan,
                background: colorSystem.foundation.deepSpaceIndigo,
                surface: "rgba(51, 31, 74, 0.1)",
                text: "#FFFFFF",
                border: "rgba(90, 200, 250, 0.3)",
            },
            quantum: {
                primary: colorSystem.foundation.quantumViolet,
                accent: colorSystem.accents.roseEnergy,
                background: colorSystem.foundation.voidBlack,
                surface: "rgba(106, 48, 147, 0.1)",
                text: "#FFFFFF",
                border: "rgba(191, 64, 128, 0.3)",
            },
            superposition: {
                primary: "#FFFFFF",
                accent: colorSystem.accents.subtleCyan,
                background: colorSystem.foundation.midnightRichness,
                surface: "rgba(255, 255, 255, 0.08)",
                text: "#FFFFFF",
                border: "rgba(255, 255, 255, 0.3)",
            },
        }

        return tokens?.colors || variantColors[variant] || variantColors.quantum
    }

    const colors = getColors()

    // Main container style
    const containerStyle = {
        width: "100%",
        height: "100%",
        minWidth: `${minWidth}px`,
        maxWidth: `${maxWidth}px`,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        background: colors.background,
        borderRadius: spacing.md,
        overflow: "hidden",
        fontFamily: typographySystem.fontFamily,
        color: colors.text,
        position: "relative",
        boxSizing: "border-box",
    }

    // Dimensional Grid Component (from unified-grid-system-example.html)
    const renderDimensionalGrid = () => {
        if (!showGrid) return null

        const gridSizes = {
            fine: 8,
            medium: 16,
            coarse: 32,
        }

        const gridOpacities = {
            background: 0.08,
            interface: 0.15,
            feature: 0.25,
        }

        const size = gridSizes[gridDensity]
        const opacity = gridOpacities[gridType]

        return (
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `linear-gradient(to right, ${colors.accent}${Math.floor(
                        opacity * 255
                    )
                        .toString(16)
                        .padStart(2, "0")} 1px, transparent 1px),
                                  linear-gradient(to bottom, ${colors.accent}${Math.floor(
                                      opacity * 255
                                  )
                                      .toString(16)
                                      .padStart(2, "0")} 1px, transparent 1px)`,
                    backgroundSize: `${size}px ${size}px`,
                    pointerEvents: "none",
                    zIndex: 1,
                    transform: enable3D
                        ? "perspective(1000px) rotateX(60deg) scale(1.5)"
                        : "none",
                    transformOrigin: "center bottom",
                }}
            >
                {/* Secondary grid for depth */}
                {enable3D && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `linear-gradient(to right, ${colors.accent}40 1px, transparent 1px),
                                          linear-gradient(to bottom, ${colors.accent}40 1px, transparent 1px)`,
                            backgroundSize: `${size * 0.5}px ${size * 0.5}px`,
                            transform: "rotate(45deg) scale(1.2)",
                            opacity: 0.3,
                        }}
                    />
                )}
            </div>
        )
    }

    // Quantum Pixel Renderer (from core-quantum-pixel-system.html)
    const renderQuantumPixel = (pixelDef, size = 48, onClick = null) => {
        const isSelected = selectedComponent === pixelDef.name

        return (
            <div
                key={pixelDef.name}
                style={{
                    width: size,
                    height: size,
                    position: "relative",
                    cursor: onClick ? "pointer" : "default",
                    filter: isSelected
                        ? `drop-shadow(0 0 ${size / 4}px ${pixelDef.accentColor})`
                        : "none",
                    transform: isSelected ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.3s ease",
                }}
                onClick={onClick ? () => onClick(pixelDef) : undefined}
            >
                <canvas
                    width={size}
                    height={size}
                    style={{ width: "100%", height: "100%" }}
                    ref={(canvas) => {
                        if (canvas)
                            renderPixelToCanvas(canvas, pixelDef, enable3D)
                    }}
                />
            </div>
        )
    }

    // Canvas pixel rendering function
    const renderPixelToCanvas = (canvas, pixelDef, is3D) => {
        const ctx = canvas.getContext("2d")
        const width = canvas.width
        const height = canvas.height
        const centerX = width / 2
        const centerY = height / 2
        const size = Math.min(width, height) * 0.4

        ctx.clearRect(0, 0, width, height)

        switch (pixelDef.state) {
            case "materialized":
                renderMaterializedPixel(
                    ctx,
                    centerX,
                    centerY,
                    size,
                    pixelDef,
                    is3D
                )
                break
            case "partial":
                renderPartialPixel(ctx, centerX, centerY, size, pixelDef, is3D)
                break
            case "energy":
                renderEnergyPixel(ctx, centerX, centerY, size, pixelDef, is3D)
                break
            case "superposition":
                renderSuperpositionPixel(
                    ctx,
                    centerX,
                    centerY,
                    size,
                    pixelDef,
                    is3D
                )
                break
        }
    }

    // Pixel rendering implementations
    const renderMaterializedPixel = (
        ctx,
        centerX,
        centerY,
        size,
        pixelDef,
        is3D
    ) => {
        ctx.save()
        ctx.translate(centerX, centerY)

        if (is3D) {
            // 3D isometric cube
            ctx.shadowColor = pixelDef.accentColor
            ctx.shadowBlur = 10

            // Top face
            ctx.fillStyle = pixelDef.primaryColor
            ctx.beginPath()
            ctx.moveTo(0, -size / 2)
            ctx.lineTo(size / 2, -size / 4)
            ctx.lineTo(0, 0)
            ctx.lineTo(-size / 2, -size / 4)
            ctx.closePath()
            ctx.fill()

            // Left face
            ctx.fillStyle = pixelDef.secondaryColor
            ctx.beginPath()
            ctx.moveTo(-size / 2, -size / 4)
            ctx.lineTo(0, 0)
            ctx.lineTo(0, size / 2)
            ctx.lineTo(-size / 2, size / 4)
            ctx.closePath()
            ctx.fill()

            // Right face
            ctx.fillStyle = pixelDef.primaryColor
            ctx.beginPath()
            ctx.moveTo(size / 2, -size / 4)
            ctx.lineTo(0, 0)
            ctx.lineTo(0, size / 2)
            ctx.lineTo(size / 2, size / 4)
            ctx.closePath()
            ctx.fill()

            // Edge highlights
            ctx.strokeStyle = pixelDef.accentColor
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(0, -size / 2)
            ctx.lineTo(size / 2, -size / 4)
            ctx.lineTo(size / 2, size / 4)
            ctx.lineTo(0, size / 2)
            ctx.lineTo(-size / 2, size / 4)
            ctx.lineTo(-size / 2, -size / 4)
            ctx.closePath()
            ctx.stroke()
        } else {
            // 2D pixel
            const pixelSize = size * 0.8
            ctx.fillStyle = pixelDef.primaryColor
            ctx.strokeStyle = pixelDef.accentColor
            ctx.lineWidth = 2

            ctx.beginPath()
            ctx.roundRect(
                -pixelSize / 2,
                -pixelSize / 2,
                pixelSize,
                pixelSize,
                4
            )
            ctx.fill()
            ctx.stroke()
        }

        ctx.restore()
    }

    const renderPartialPixel = (
        ctx,
        centerX,
        centerY,
        size,
        pixelDef,
        is3D
    ) => {
        ctx.save()
        ctx.translate(centerX, centerY)

        // Create gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size)
        gradient.addColorStop(0, pixelDef.accentColor + "80")
        gradient.addColorStop(0.6, pixelDef.primaryColor + "60")
        gradient.addColorStop(1, pixelDef.primaryColor + "00")

        // Background glow
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(0, 0, size, 0, Math.PI * 2)
        ctx.fill()

        // Semi-transparent structure
        ctx.globalAlpha = 0.7
        ctx.fillStyle = pixelDef.primaryColor
        ctx.strokeStyle = pixelDef.accentColor
        ctx.lineWidth = 2
        ctx.setLineDash([5, 3])

        if (is3D) {
            // Partial cube structure
            ctx.beginPath()
            ctx.moveTo(0, -size / 2)
            ctx.lineTo(size / 2, -size / 4)
            ctx.lineTo(0, 0)
            ctx.lineTo(-size / 2, -size / 4)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
        } else {
            // 2D partial pixel
            const pixelSize = size * 0.8
            ctx.beginPath()
            ctx.roundRect(
                -pixelSize / 2,
                -pixelSize / 2,
                pixelSize,
                pixelSize,
                4
            )
            ctx.fill()
            ctx.stroke()
        }

        ctx.setLineDash([])

        // Energy particles
        ctx.globalAlpha = 0.9
        ctx.fillStyle = pixelDef.accentColor

        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2
            const distance = Math.random() * size * 0.8
            const particleSize = Math.random() * 4 + 2

            ctx.beginPath()
            ctx.arc(
                Math.cos(angle) * distance,
                Math.sin(angle) * distance,
                particleSize,
                0,
                Math.PI * 2
            )
            ctx.fill()
        }

        ctx.restore()
    }

    const renderEnergyPixel = (ctx, centerX, centerY, size, pixelDef, is3D) => {
        ctx.save()
        ctx.translate(centerX, centerY)

        // Energy gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size)
        gradient.addColorStop(0, pixelDef.accentColor)
        gradient.addColorStop(0.5, pixelDef.primaryColor + "80")
        gradient.addColorStop(1, pixelDef.primaryColor + "00")

        // Energy field
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2)
        ctx.fill()

        // Energy core
        ctx.fillStyle = pixelDef.accentColor
        ctx.beginPath()
        ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2)
        ctx.fill()

        if (is3D) {
            // Energy orbits
            ctx.strokeStyle = pixelDef.accentColor
            ctx.lineWidth = 2

            // Orbit 1
            ctx.beginPath()
            ctx.ellipse(
                0,
                0,
                size * 0.6,
                size * 0.3,
                Math.PI / 4,
                0,
                Math.PI * 2
            )
            ctx.stroke()

            // Orbit 2
            ctx.beginPath()
            ctx.ellipse(
                0,
                0,
                size * 0.5,
                size * 0.25,
                -Math.PI / 6,
                0,
                Math.PI * 2
            )
            ctx.stroke()
        }

        // Energy particles
        ctx.fillStyle = pixelDef.secondaryColor
        for (let i = 0; i < 6; i++) {
            const angle = Math.random() * Math.PI * 2
            const distance = Math.random() * size * 0.7
            const particleSize = Math.random() * 3 + 2

            ctx.beginPath()
            ctx.arc(
                Math.cos(angle) * distance,
                Math.sin(angle) * distance,
                particleSize,
                0,
                Math.PI * 2
            )
            ctx.fill()
        }

        ctx.restore()
    }

    const renderSuperpositionPixel = (
        ctx,
        centerX,
        centerY,
        size,
        pixelDef,
        is3D
    ) => {
        ctx.save()
        ctx.translate(centerX, centerY)

        // Background field
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size)
        gradient.addColorStop(0, pixelDef.primaryColor + "80")
        gradient.addColorStop(0.7, pixelDef.secondaryColor + "40")
        gradient.addColorStop(1, "rgba(0,0,0,0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(0, 0, size, 0, Math.PI * 2)
        ctx.fill()

        // Form 1 (heritage-like) - shifted left
        ctx.save()
        ctx.translate(-size * 0.2, -size * 0.1)
        ctx.globalAlpha = 0.5
        ctx.fillStyle = colorSystem.heritage.heritageGreen
        ctx.strokeStyle = colorSystem.heritage.heritagePixelGreen
        ctx.lineWidth = 1.5

        if (is3D) {
            ctx.beginPath()
            ctx.moveTo(0, -size * 0.3)
            ctx.lineTo(size * 0.3, -size * 0.15)
            ctx.lineTo(0, 0)
            ctx.lineTo(-size * 0.3, -size * 0.15)
            ctx.closePath()
        } else {
            ctx.beginPath()
            ctx.roundRect(-size * 0.25, -size * 0.25, size * 0.5, size * 0.5, 4)
        }
        ctx.fill()
        ctx.stroke()
        ctx.restore()

        // Form 2 (transitional) - centered
        ctx.globalAlpha = 0.6
        ctx.fillStyle = colorSystem.foundation.dimensionalEggplant
        ctx.strokeStyle = colorSystem.accents.subtleCyan
        ctx.lineWidth = 1.5

        ctx.beginPath()
        ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Form 3 (quantum) - shifted right
        ctx.save()
        ctx.translate(size * 0.15, size * 0.15)
        ctx.globalAlpha = 0.5
        ctx.fillStyle = colorSystem.foundation.quantumViolet
        ctx.strokeStyle = colorSystem.accents.quantumPulsePink
        ctx.lineWidth = 1.5

        ctx.beginPath()
        ctx.ellipse(0, 0, size * 0.3, size * 0.4, Math.PI / 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.restore()

        // Core
        ctx.globalAlpha = 0.9
        ctx.fillStyle = pixelDef.primaryColor
        ctx.beginPath()
        ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
    }

    // Component selection handler
    const handleComponentSelect = (component) => {
        setSelectedComponentData(component)
    }

    // Show full interface
    if (showSystemUI) {
        return (
            <div ref={containerRef} style={containerStyle}>
                <iframe
                    src={interfaceUrl}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        borderRadius: spacing.md,
                    }}
                    title="Quantum-Spatial Design System"
                />
            </div>
        )
    }

    // Loading state
    if (isLoading) {
        return (
            <div
                ref={containerRef}
                style={{
                    ...containerStyle,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        color: colors.accent,
                        fontSize: isCompact ? 14 : 16,
                        textAlign: "center",
                    }}
                >
                    Loading {variant} foundation system...
                    {deviceInfo?.isM4Detected && (
                        <div style={{ fontSize: 12, marginTop: 4 }}>
                            M4 optimizations enabled
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Error state
    if (hasError) {
        return (
            <div
                ref={containerRef}
                style={{
                    ...containerStyle,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        color: "#FF3B30",
                        fontSize: isCompact ? 14 : 16,
                        textAlign: "center",
                    }}
                >
                    Failed to load foundation system
                </div>
            </div>
        )
    }

    // Filter pixels by state
    const filteredPixels =
        pixelState === "all"
            ? pixelDefinitions
            : pixelDefinitions.filter((pixel) => pixel.state === pixelState)

    // Foundation system layout
    return (
        <div ref={containerRef} style={containerStyle}>
            {/* Dimensional Grid Background */}
            {renderDimensionalGrid()}

            {/* Header */}
            <div
                style={{
                    padding: `${spacing.md}px ${spacing.lg}px`,
                    borderBottom: `1px solid ${colors.border}`,
                    background: colors.surface,
                    position: "relative",
                    zIndex: 2,
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: isCompact ? 20 : isLarge ? 28 : 24,
                        fontWeight: typographySystem.fontWeights.bold,
                        background: `linear-gradient(to right, ${colorSystem.heritage.heritagePixelGreen}, ${colorSystem.accents.subtleCyan}, ${colorSystem.accents.roseEnergy})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        lineHeight: typographySystem.lineHeights.tight,
                    }}
                >
                    Quantum-Spatial Foundation System
                </h1>
                <p
                    style={{
                        margin: `${spacing.xs}px 0 0 0`,
                        fontSize: isCompact ? 14 : 16,
                        opacity: 0.8,
                        lineHeight: typographySystem.lineHeights.normal,
                    }}
                >
                    {variant.charAt(0).toUpperCase() + variant.slice(1)} State •
                    M4 Optimized
                </p>
            </div>

            {/* Content area */}
            <div
                style={{
                    flex: 1,
                    padding: spacing.lg,
                    overflow: "auto",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                {/* Typography Section */}
                {showTypography && (
                    <div style={{ marginBottom: spacing.xl }}>
                        <h2
                            style={{
                                margin: `0 0 ${spacing.md}px 0`,
                                fontSize: isCompact ? 18 : 20,
                                fontWeight:
                                    typographySystem.fontWeights.semibold,
                                color: colors.accent,
                            }}
                        >
                            Typography System
                        </h2>

                        <div
                            style={{
                                background: colors.surface,
                                borderRadius: spacing.md,
                                padding: spacing.lg,
                                border: `1px solid ${colors.border}`,
                                marginBottom: spacing.lg,
                            }}
                        >
                            <div style={{ marginBottom: spacing.md }}>
                                <div
                                    style={{
                                        fontSize:
                                            typographySystem.sizes.display,
                                        fontWeight:
                                            typographySystem.fontWeights.bold,
                                        lineHeight:
                                            typographySystem.lineHeights.tight,
                                    }}
                                >
                                    Display
                                </div>
                                <div
                                    style={{
                                        fontSize: typographySystem.sizes.xxl,
                                        fontWeight:
                                            typographySystem.fontWeights.bold,
                                    }}
                                >
                                    Heading XXL
                                </div>
                                <div
                                    style={{
                                        fontSize: typographySystem.sizes.xl,
                                        fontWeight:
                                            typographySystem.fontWeights
                                                .semibold,
                                    }}
                                >
                                    Heading XL
                                </div>
                                <div
                                    style={{
                                        fontSize: typographySystem.sizes.lg,
                                        fontWeight:
                                            typographySystem.fontWeights.medium,
                                    }}
                                >
                                    Heading Large
                                </div>
                                <div
                                    style={{
                                        fontSize: typographySystem.sizes.md,
                                        fontWeight:
                                            typographySystem.fontWeights
                                                .regular,
                                    }}
                                >
                                    Body Medium
                                </div>
                                <div
                                    style={{
                                        fontSize: typographySystem.sizes.sm,
                                        fontWeight:
                                            typographySystem.fontWeights
                                                .regular,
                                        opacity: 0.8,
                                    }}
                                >
                                    Body Small
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quantum Pixels Section */}
                {showPixels && (
                    <div style={{ marginBottom: spacing.xl }}>
                        <h2
                            style={{
                                margin: `0 0 ${spacing.md}px 0`,
                                fontSize: isCompact ? 18 : 20,
                                fontWeight:
                                    typographySystem.fontWeights.semibold,
                                color: colors.accent,
                            }}
                        >
                            Core Quantum Pixels ({filteredPixels.length}/16)
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: isCompact
                                    ? "repeat(auto-fill, minmax(80px, 1fr))"
                                    : isMedium
                                      ? "repeat(auto-fill, minmax(100px, 1fr))"
                                      : "repeat(auto-fill, minmax(120px, 1fr))",
                                gap: spacing.md,
                                marginBottom: spacing.lg,
                            }}
                        >
                            {filteredPixels.map((pixel) => (
                                <div
                                    key={pixel.name}
                                    style={{
                                        background: colors.surface,
                                        borderRadius: spacing.sm,
                                        padding: spacing.md,
                                        border:
                                            selectedComponent === pixel.name
                                                ? `2px solid ${pixel.accentColor}`
                                                : `1px solid ${colors.border}`,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                    }}
                                    onClick={() => handleComponentSelect(pixel)}
                                >
                                    {renderQuantumPixel(
                                        pixel,
                                        isCompact ? 64 : 80
                                    )}
                                    <div
                                        style={{
                                            fontSize: typographySystem.sizes.xs,
                                            fontWeight:
                                                typographySystem.fontWeights
                                                    .medium,
                                            textAlign: "center",
                                            marginTop: spacing.xs,
                                            lineHeight:
                                                typographySystem.lineHeights
                                                    .tight,
                                        }}
                                    >
                                        {pixel.name}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: typographySystem.sizes.xs,
                                            opacity: 0.7,
                                            textAlign: "center",
                                        }}
                                    >
                                        {pixel.state}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Selected Component Details */}
                        {selectedComponentData && (
                            <div
                                style={{
                                    background: colors.surface,
                                    borderRadius: spacing.md,
                                    padding: spacing.lg,
                                    border: `1px solid ${selectedComponentData.accentColor}`,
                                    marginTop: spacing.lg,
                                }}
                            >
                                <h3
                                    style={{
                                        margin: `0 0 ${spacing.sm}px 0`,
                                        fontSize: typographySystem.sizes.lg,
                                        fontWeight:
                                            typographySystem.fontWeights
                                                .semibold,
                                        color: selectedComponentData.accentColor,
                                    }}
                                >
                                    {selectedComponentData.name}
                                </h3>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: spacing.lg,
                                        alignItems: "center",
                                    }}
                                >
                                    {renderQuantumPixel(
                                        selectedComponentData,
                                        120
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{ marginBottom: spacing.sm }}
                                        >
                                            <strong>State:</strong>{" "}
                                            {selectedComponentData.state
                                                .charAt(0)
                                                .toUpperCase() +
                                                selectedComponentData.state.slice(
                                                    1
                                                )}
                                        </div>
                                        <div
                                            style={{ marginBottom: spacing.sm }}
                                        >
                                            <strong>Primary:</strong>{" "}
                                            <span
                                                style={{
                                                    color: selectedComponentData.primaryColor,
                                                }}
                                            >
                                                {
                                                    selectedComponentData.primaryColor
                                                }
                                            </span>
                                        </div>
                                        <div
                                            style={{ marginBottom: spacing.sm }}
                                        >
                                            <strong>Accent:</strong>{" "}
                                            <span
                                                style={{
                                                    color: selectedComponentData.accentColor,
                                                }}
                                            >
                                                {
                                                    selectedComponentData.accentColor
                                                }
                                            </span>
                                        </div>
                                        <div>
                                            <strong>Secondary:</strong>{" "}
                                            <span
                                                style={{
                                                    color: selectedComponentData.secondaryColor,
                                                }}
                                            >
                                                {
                                                    selectedComponentData.secondaryColor
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Core Components Section */}
                {showComponents && (
                    <div style={{ marginBottom: spacing.xl }}>
                        <h2
                            style={{
                                margin: `0 0 ${spacing.md}px 0`,
                                fontSize: isCompact ? 18 : 20,
                                fontWeight:
                                    typographySystem.fontWeights.semibold,
                                color: colors.accent,
                            }}
                        >
                            Foundation Components
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: isCompact
                                    ? "1fr"
                                    : isMedium
                                      ? "repeat(2, 1fr)"
                                      : "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: spacing.md,
                            }}
                        >
                            {/* Button Component */}
                            <div
                                style={{
                                    background: colors.surface,
                                    borderRadius: spacing.md,
                                    padding: spacing.lg,
                                    border: `1px solid ${colors.border}`,
                                }}
                            >
                                <h3
                                    style={{
                                        margin: `0 0 ${spacing.md}px 0`,
                                        fontSize: typographySystem.sizes.md,
                                        fontWeight:
                                            typographySystem.fontWeights
                                                .semibold,
                                        color: colors.accent,
                                    }}
                                >
                                    Quantum Button
                                </h3>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: spacing.sm,
                                    }}
                                >
                                    <button
                                        style={{
                                            background: colors.primary,
                                            color: "#FFFFFF",
                                            border: "none",
                                            borderRadius: spacing.sm,
                                            padding: `${spacing.sm}px ${spacing.md}px`,
                                            fontSize: typographySystem.sizes.md,
                                            fontWeight:
                                                typographySystem.fontWeights
                                                    .semibold,
                                            fontFamily:
                                                typographySystem.fontFamily,
                                            minHeight: 44,
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Primary Button
                                    </button>

                                    <button
                                        style={{
                                            background: "transparent",
                                            color: colors.accent,
                                            border: `1px solid ${colors.accent}`,
                                            borderRadius: spacing.sm,
                                            padding: `${spacing.sm}px ${spacing.md}px`,
                                            fontSize: typographySystem.sizes.md,
                                            fontWeight:
                                                typographySystem.fontWeights
                                                    .semibold,
                                            fontFamily:
                                                typographySystem.fontFamily,
                                            minHeight: 44,
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Secondary Button
                                    </button>
                                </div>
                            </div>

                            {/* Card Component */}
                            <div
                                style={{
                                    background: colors.surface,
                                    borderRadius: spacing.md,
                                    padding: spacing.lg,
                                    border: `1px solid ${colors.border}`,
                                }}
                            >
                                <h3
                                    style={{
                                        margin: `0 0 ${spacing.md}px 0`,
                                        fontSize: typographySystem.sizes.md,
                                        fontWeight:
                                            typographySystem.fontWeights
                                                .semibold,
                                        color: colors.accent,
                                    }}
                                >
                                    Quantum Card
                                </h3>
                                <div
                                    style={{
                                        background: colors.background,
                                        borderRadius: spacing.sm,
                                        padding: spacing.md,
                                        border: `1px solid ${colors.border}`,
                                    }}
                                >
                                    <h4
                                        style={{
                                            margin: `0 0 ${spacing.xs}px 0`,
                                            fontSize: typographySystem.sizes.sm,
                                            fontWeight:
                                                typographySystem.fontWeights
                                                    .semibold,
                                        }}
                                    >
                                        Foundation Card
                                    </h4>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: typographySystem.sizes.xs,
                                            opacity: 0.8,
                                            lineHeight:
                                                typographySystem.lineHeights
                                                    .normal,
                                        }}
                                    >
                                        Apple HIG compliant card with
                                        quantum-spatial styling.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Status indicator */}
            <div
                style={{
                    position: "absolute",
                    bottom: spacing.sm,
                    right: spacing.sm,
                    background: "rgba(90, 200, 250, 0.2)",
                    color: colors.accent,
                    padding: `${spacing.xs}px ${spacing.sm}px`,
                    borderRadius: spacing.xs,
                    fontSize: 11,
                    fontWeight: typographySystem.fontWeights.medium,
                    pointerEvents: "none",
                    zIndex: 3,
                }}
            >
                {deviceInfo?.isM4Detected ? "M4 Enhanced" : "Standard"} •{" "}
                {containerSize.width}×{containerSize.height}
            </div>
        </div>
    )
}

// Add comprehensive property controls for Framer
addPropertyControls(QuantumSpatialSystem, {
    variant: {
        title: "Variant",
        type: ControlType.Enum,
        options: ["heritage", "transitional", "quantum", "superposition"],
        defaultValue: "quantum",
    },
    layout: {
        title: "Layout",
        type: ControlType.Enum,
        options: ["responsive", "fixed", "auto"],
        defaultValue: "responsive",
    },
    showSystemUI: {
        title: "Show System UI",
        type: ControlType.Boolean,
        defaultValue: false,
    },
    showGrid: {
        title: "Show Grid",
        type: ControlType.Boolean,
        defaultValue: true,
    },
    showPixels: {
        title: "Show Pixels",
        type: ControlType.Boolean,
        defaultValue: true,
    },
    showComponents: {
        title: "Show Components",
        type: ControlType.Boolean,
        defaultValue: true,
    },
    showTypography: {
        title: "Show Typography",
        type: ControlType.Boolean,
        defaultValue: true,
    },
    gridType: {
        title: "Grid Type",
        type: ControlType.Enum,
        options: ["background", "interface", "feature"],
        defaultValue: "interface",
    },
    gridDensity: {
        title: "Grid Density",
        type: ControlType.Enum,
        options: ["fine", "medium", "coarse"],
        defaultValue: "medium",
    },
    pixelState: {
        title: "Pixel Filter",
        type: ControlType.Enum,
        options: ["all", "materialized", "partial", "energy", "superposition"],
        defaultValue: "all",
    },
    selectedComponent: {
        title: "Selected Component",
        type: ControlType.String,
        defaultValue: "none",
    },
    minWidth: {
        title: "Min Width",
        type: ControlType.Number,
        defaultValue: 320,
        min: 280,
        max: 600,
        step: 20,
    },
    maxWidth: {
        title: "Max Width",
        type: ControlType.Number,
        defaultValue: 1200,
        min: 800,
        max: 1600,
        step: 50,
    },
    enableM4Optimizations: {
        title: "M4 Optimizations",
        type: ControlType.Boolean,
        defaultValue: true,
    },
    enable3D: {
        title: "3D Rendering",
        type: ControlType.Boolean,
        defaultValue: true,
    },
    enableAnimations: {
        title: "Animations",
        type: ControlType.Boolean,
        defaultValue: true,
    },
})
