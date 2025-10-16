import type { ActionButton, Column } from "../types";

// Helper function to get responsive classes for columns
export const getResponsiveClasses = <T extends Record<string, any>>(
  column: Column<T>
) => {
  const { responsive } = column;
  if (!responsive) return ""; // Show by default on all screens

  const classes = [];

  // Start with base visibility
  if (responsive.mobile === false) {
    classes.push("hidden");
  } else {
    classes.push("block");
  }

  // Override for tablet (md: breakpoint)
  if (responsive.tablet !== undefined) {
    if (responsive.tablet === false) {
      classes.push("md:hidden");
    } else {
      classes.push("md:block");
    }
  }

  // Override for desktop (lg: breakpoint)
  if (responsive.desktop !== undefined) {
    if (responsive.desktop === false) {
      classes.push("lg:hidden");
    } else {
      classes.push("lg:block");
    }
  }

  return classes.join(" ");
};

export // Helper function to get responsive classes for action buttons
const getActionResponsiveClasses = <T extends Record<string, any>>(
  action: ActionButton<T>
) => {
  const { responsive } = action;
  if (!responsive) return ""; // Show by default on all screens

  const classes = [];

  // Start with base visibility
  if (responsive.mobile === false) {
    classes.push("hidden");
  } else {
    classes.push("block");
  }

  // Override for tablet (md: breakpoint)
  if (responsive.tablet !== undefined) {
    if (responsive.tablet === false) {
      classes.push("md:hidden");
    } else {
      classes.push("md:block");
    }
  }

  // Override for desktop (lg: breakpoint)
  if (responsive.desktop !== undefined) {
    if (responsive.desktop === false) {
      classes.push("lg:hidden");
    } else {
      classes.push("lg:block");
    }
  }

  return classes.join(" ");
};

export // Helper function to check if action column should be visible
const shouldShowActionColumn = <T extends Record<string, any>>(
  actions: ActionButton<T>[]
) => {
  if (actions.length === 0) return false;

  // If any action has responsive settings, check if at least one is visible on any screen
  const hasResponsiveActions = actions.some((action) => action.responsive);

  if (!hasResponsiveActions) return true; // Show by default if no responsive settings

  // Check if at least one action is visible on any screen size
  return actions.some((action) => {
    const { responsive } = action;
    if (!responsive) return true; // Show by default

    // Check if action is visible on at least one screen size
    return (
      responsive.mobile !== false ||
      responsive.tablet !== false ||
      responsive.desktop !== false
    );
  });
};

// Helper function to get responsive classes for action column
export const getActionColumnResponsiveClasses = <T extends Record<string, any>>(
  actions: ActionButton<T>[]
) => {
  if (actions.length === 0) return "hidden";

  // If no responsive settings, show on all screens
  const hasResponsiveActions = actions.some((action) => action.responsive);
  if (!hasResponsiveActions) return "";

  // Check if any action is visible on mobile
  const hasVisibleOnMobile = actions.some((action) => {
    const { responsive } = action;
    if (!responsive) return true;
    return responsive.mobile !== false;
  });

  // Check if any action is visible on tablet
  const hasVisibleOnTablet = actions.some((action) => {
    const { responsive } = action;
    if (!responsive) return true;
    return responsive.tablet !== false;
  });

  // Check if any action is visible on desktop
  const hasVisibleOnDesktop = actions.some((action) => {
    const { responsive } = action;
    if (!responsive) return true;
    return responsive.desktop !== false;
  });

  const classes = [];

  // Mobile visibility
  if (!hasVisibleOnMobile) {
    classes.push("hidden");
  } else {
    classes.push("block");
  }

  // Tablet visibility
  if (hasVisibleOnTablet) {
    classes.push("md:block");
  } else {
    classes.push("md:hidden");
  }

  // Desktop visibility
  if (hasVisibleOnDesktop) {
    classes.push("lg:block");
  } else {
    classes.push("lg:hidden");
  }

  return classes.join(" ");
};

// Get visible columns based on responsive settings
export const getVisibleColumns = <T extends Record<string, any>>(
  columns: Column<T>[]
) => {
  return columns.filter((column) => {
    const { responsive } = column;
    if (!responsive) return true; // Show by default

    // For now, we'll show all columns and let CSS handle visibility
    // In a real implementation, you might want to use a hook to detect screen size
    return true;
  });
};
