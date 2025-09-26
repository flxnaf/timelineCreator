# Timeline Creator - Design Guidelines

Essential rules for maintaining consistency and quality across the Timeline Creator project.

## Core Design Principles

### 1. **Icons Over Emojis**
- **Rule**: Never use emojis in the interface
- **Solution**: Use icons from `lucide-react` for consistent and professional visual elements
- **Example**: Use `<Calendar />` instead of 📅
- **Rationale**: Icons provide better consistency across different operating systems and devices

### 2. **Modern Pastel Color Palette**
- **Rule**: Use purposeful pastel solid colors that accent each other well
- **Avoid**: AI-looking gradients and flashy color combinations
- **Color Palette**:
  - **Lavender**: `#b4a7d6` - Primary actions, main branding
  - **Mint**: `#a7d6c3` - Secondary actions, success states
  - **Peach**: `#f2c2a7` - Create/new actions
  - **Rose**: `#e6b3b3` - Delete/destructive actions
  - **Sage**: `#c3d6a7` - Status indicators, guest mode
- **Key**: Colors should look purposeful and professional, not artificial

### 3. **Framer Motion Integration**
- **Rule**: Use Framer Motion for all animations and transitions
- **Applications**: 
  - Page transitions
  - Hover effects
  - Loading animations
  - Modal appearances
  - Event creation animations
- **Guidelines**: Keep animations smooth and purposeful, not distracting

## Interface Standards

### Typography
- **Primary Font**: Inter, system fonts fallback
- **Hierarchy**: Clear font weights (400, 500, 600, 800)
- **Colors**: 
  - Primary text: `#e5e5e5`
  - Secondary text: `#a5a5a5`
  - Muted text: `#666666`

### Dark Mode Theme
- **Background**: `#0a0a0a` (darkest)
- **Surface**: `#1a1a1a` (cards, modals)
- **Elevated**: `#2a2a2a` (hover states)
- **Borders**: `#3a3a3a`

### Component Design
- **Buttons**: Rounded corners (0.5-1rem), solid pastel backgrounds
- **Cards**: Subtle shadows, rounded corners, backdrop blur effects
- **Modals**: Centered, backdrop blur, smooth animations
- **Forms**: Clean inputs with focus states using pastel accents

### Spacing & Layout
- **Grid**: 8px base unit
- **Padding**: 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem
- **Gaps**: 0.5rem, 0.75rem, 1rem
- **Responsive**: Mobile-first approach

## Timeline-Specific Guidelines

### Event Design
- **Shape**: Rounded rectangles with colored borders
- **Content**: Title, date, colored marker
- **Interaction**: Hover effects, click to edit
- **Colors**: Match layer colors

### Layer System
- **Active Layer**: Full opacity, prominent
- **Background Layers**: Reduced opacity (0.3-0.7)
- **Colors**: Use pastel palette for layer identification

### Toolbar Design
- **Guest Mode**: Clear indicators with sage green
- **Actions**: Each button type has specific pastel color
- **Layout**: Left (user/mode), Center (document), Right (actions)

## Implementation Notes

- Always test color combinations for accessibility
- Ensure animations don't interfere with usability
- Maintain consistent spacing throughout the application
- Use semantic HTML elements where possible
- Keep the interface clean and uncluttered

## Examples

### ✅ Good
```jsx
// Purposeful pastel color usage
<button style={{ background: '#b4a7d6', color: '#2d3748' }}>
  <Calendar size={16} />
  Create Event
</button>
```

### ❌ Avoid
```jsx
// Gradient and emoji usage
<button style={{ background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' }}>
  📅 Create Event
</button>
```

---

*These guidelines ensure the Timeline Creator maintains a cohesive, modern, and professional appearance that users will find pleasant and trustworthy.*
