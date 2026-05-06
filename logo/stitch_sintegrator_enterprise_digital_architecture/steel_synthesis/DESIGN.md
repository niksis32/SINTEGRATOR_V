# Design System Documentation: Professional Editorial Guidelines

## 1. Overview & Creative North Star: "The Machined Monolith"

This design system is built upon the intersection of heavy industrial precision and fluid digital grace. Our Creative North Star is **The Machined Monolith**. We treat every screen not as a flat canvas, but as a singular slab of cold-rolled metal, precision-cut with architectural intent. 

To move beyond the "template" look common in enterprise software, this system rejects the rigid 12-column grid in favor of **Intentional Asymmetry**. We utilize generous white space, overlapping metallic surfaces, and high-contrast typography scales to create an editorial experience that feels expensive, curated, and authoritative. The interface does not just house data; it "displays" it with the weight of a physical luxury object.

---

## 2. Colors & Materiality

The palette is a sophisticated range of metallic neutrals, designed to evoke the feeling of brushed steel and polished chrome. We avoid pure black to maintain a sense of "light-reflecting" depth, using deep slate blues instead.

### The "No-Line" Rule
Structural integrity in this system is achieved through **Tonal Separation**, not strokes. Designers are strictly prohibited from using 1px solid borders to section off areas. Instead:
- Use background shifts (e.g., placing a `surface_container_low` section on top of a `surface` background).
- Use vertical white space to define regions.
- Boundaries are felt through the transition from "brushed" to "polished" tones.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to create "nested" depth:
- **Base Layer:** `surface` (#f8f9ff)
- **Primary Workspaces:** `surface_container_low` (#eff4ff)
- **Interactive Modules:** `surface_container_highest` (#d5e3fc)

### The "Glass & Gradient" Rule
To achieve the "Liquid Metal" aesthetic, use subtle linear gradients (135°) for primary CTAs and hero elements, transitioning from `primary` (#545f73) to `primary_container` (#a6b2c9). This provides a "metallic soul" that flat colors cannot replicate. Floating elements should utilize **Glassmorphism**: semi-transparent `surface_bright` with a 20px backdrop-blur to simulate high-reflectivity chrome.

---

## 3. Typography: Architectural Authority

Our typography is the backbone of the "solid" feel. By combining the technical precision of **Space Grotesk** with the neutral clarity of **Inter**, we balance high-tech utility with luxury editorial.

*   **Display & Headlines (Space Grotesk):** These are our "architectural" elements. They should be set with **wide tracking** (letter-spacing: 0.05em to 0.1em) to feel expansive and premium.
*   **Body & Titles (Inter):** Used for density and readability. Titles should remain bold and low-tracking, providing a "heavy" counterpoint to the airy headlines.
*   **Labels (Inter):** Always uppercase with increased tracking (0.1em) when used for navigation or small metadata to mimic the look of engraved serial numbers on hardware.

---

## 4. Elevation & Depth: Tonal Layering

We reject traditional structural lines. Hierarchy is communicated through the way "light" hits our metallic surfaces.

### The Layering Principle
Depth is achieved by "stacking" surface tiers. For a card to feel "raised," place a `surface_container_lowest` (#ffffff) element on a `surface_container_low` (#eff4ff) background. This creates a natural, soft lift that feels integrated into the material.

### Ambient Shadows
Shadows must be "Ambient," not "Drop." Use large blur values (24px - 48px) at extremely low opacities (4%–6%). The shadow color should be a tinted version of `on_surface` (#0d1c2e), ensuring it looks like a soft occlusion of light rather than a gray smudge.

### The "Ghost Border" Fallback
If a container requires a boundary for accessibility, use a **Ghost Border**: the `outline_variant` token (#c5c6cc) at 20% opacity. This suggests a "micro-border" sheen—a glint of light on a metal edge—without adding visual weight.

---

## 5. Components

### Buttons
*   **Primary:** Linear gradient from `primary` to `primary_container`. Text is `on_primary`. Apply a 0.5px "Ghost Border" of `white` at 30% opacity to the top edge to simulate a metallic bevel.
*   **Secondary:** `surface_container_highest` background with `on_surface` text. No border.
*   **Tertiary:** Transparent background, `primary` text, wide tracking, uppercase.

### Input Fields
Inputs should feel like "milled" slots in a metal surface.
*   **State:** Use `surface_container_low` for the field background.
*   **Focus:** A 1px `primary` border and a subtle `surface_tint` glow.
*   **Shape:** `roundedness.sm` (0.125rem) to maintain "Architectural Precision." Avoid large rounds; keep it sharp.

### Cards & Lists
*   **Strict Rule:** No dividers. Separate list items using 16px–24px of vertical white space or a subtle hover state shift to `surface_container_high`.
*   **Cards:** Use the "Layering Principle." A card should be a background shift, never a bordered box.

### Signature Component: The "Chrome HUD" Tooltip
Tooltips use high-reflectivity glassmorphism. Background: `surface_bright` at 80% opacity with a 30px backdrop blur. This makes the tooltip feel like a floating heads-up display (HUD) over the metallic interface.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts where one column is significantly wider than the other to create an editorial feel.
*   **Do** use `primary_fixed_dim` for icons to give them a "brushed steel" appearance.
*   **Do** prioritize white space over "filling the screen." Luxury is defined by the space you can afford to waste.

### Don't
*   **Don't** use pure black (#000000). It breaks the metallic light model. Use `on_background` (#0d1c2e) for maximum contrast.
*   **Don't** use `roundedness.full` on primary containers. Luxury enterprise feels "solid" and "stable," which requires the structured corners of `sm` or `md`.
*   **Don't** use standard blue for links. Use `primary` (#545f73) and indicate interactivity through weight and tracking shifts.