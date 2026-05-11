// Admin Panel Design System
// Color palette and styling constants for admin panel

export const AdminColors = {
  // Main background
  bg: {
    primary: '#0d1117',      // Main app background
    secondary: '#161b22',    // Cards and secondary backgrounds
    tertiary: '#1c2128',     // Hover/active states
  },

  // Borders and dividers
  border: {
    default: '#30363d',      // Standard borders
    light: '#21262d',        // Light borders
    muted: '#161b22',        // Very light borders
  },

  // Text colors
  text: {
    primary: '#e6edf3',      // Main text
    muted: '#8b949e',        // Secondary text, labels
    subtle: '#6e7681',       // Very subtle text
    accent: '#58a6ff',       // Accent text
    error: '#f85149',        // Error messages
    success: '#3fb950',      // Success messages
    warning: '#d29922',      // Warning messages
  },

  // Interactive elements
  interactive: {
    accent: '#58a6ff',       // Primary action color
    accentHover: '#79c0ff',  // Hover state
    accentActive: '#388bfd', // Active/pressed state
    ghost: 'rgba(88, 166, 255, 0.1)', // Ghost button background
  },

  // Status colors
  status: {
    active: '#3fb950',       // Green - active
    inactive: '#8b949e',     // Gray - inactive
    pending: '#d29922',      // Orange - pending
    error: '#f85149',        // Red - error/diet
    info: '#58a6ff',         // Blue - info
    success: '#3fb950',      // Green - success
  },

  // Badge colors (for activity types)
  badges: {
    diet: 'rgba(88, 166, 255, 0.2)',         // Blue background
    dietText: '#58a6ff',                      // Blue text
    registration: 'rgba(121, 192, 255, 0.2)', // Light blue background
    registrationText: '#79c0ff',              // Light blue text
  },
};

export const AdminSpacing = {
  xs: 4,      // 4px
  sm: 8,      // 8px
  md: 12,     // 12px
  lg: 16,     // 16px
  xl: 24,     // 24px
  xxl: 32,    // 32px
};

export const AdminBorderRadius = {
  none: 0,
  sm: 5,      // For badges and small elements
  md: 7,      // For inputs and buttons
  lg: 10,     // For cards
  full: 999,  // For circles
};

export const AdminFonts = {
  family: {
    main: 'DM Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  size: {
    xs: 11,
    sm: 12,
    base: 13,
    md: 14,
    lg: 15,
    xl: 16,
    xxl: 18,
    xxxl: 20,
    title: 24,
    header: 28,
    heroTitle: 32,
  },
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const AdminShadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
};

export const AdminTransitions = {
  fast: 150,      // ms
  normal: 250,    // ms
  slow: 350,      // ms
};

// StyleSheet helper for creating admin styles
export const adminStyleSheet = (styles: Record<string, any>) => {
  // In React Native, you'd use StyleSheet.create(styles)
  // For web, this could be used to create CSS-in-JS objects
  return styles;
};

// Common component styles
export const AdminComponentStyles = {
  card: {
    backgroundColor: AdminColors.bg.secondary,
    borderWidth: 1,
    borderColor: AdminColors.border.default,
    borderRadius: AdminBorderRadius.lg,
    padding: AdminSpacing.lg,
  },

  input: {
    backgroundColor: AdminColors.bg.primary,
    borderWidth: 1,
    borderColor: AdminColors.border.default,
    borderRadius: AdminBorderRadius.md,
    paddingHorizontal: AdminSpacing.md,
    paddingVertical: AdminSpacing.md,
    color: AdminColors.text.primary,
    fontSize: AdminFonts.size.md,
    fontFamily: AdminFonts.family.main,
    fontWeight: AdminFonts.weight.normal,
  },

  button: {
    paddingHorizontal: AdminSpacing.lg,
    paddingVertical: AdminSpacing.md,
    borderRadius: AdminBorderRadius.md,
    backgroundColor: AdminColors.interactive.accent,
    color: AdminColors.bg.primary,
    fontWeight: AdminFonts.weight.semibold,
    fontSize: AdminFonts.size.md,
  },

  badge: {
    paddingHorizontal: AdminSpacing.sm,
    paddingVertical: 2,
    borderRadius: AdminBorderRadius.sm,
    fontSize: AdminFonts.size.xs,
    fontWeight: AdminFonts.weight.semibold,
  },

  navButton: {
    paddingHorizontal: AdminSpacing.lg,
    paddingVertical: AdminSpacing.sm,
    borderRadius: AdminBorderRadius.md,
    fontSize: AdminFonts.size.md,
    fontWeight: AdminFonts.weight.medium,
    color: AdminColors.text.muted,
  },

  navButtonActive: {
    backgroundColor: AdminColors.bg.tertiary,
    borderWidth: 1,
    borderColor: AdminColors.border.default,
    color: AdminColors.text.primary,
  },
};
