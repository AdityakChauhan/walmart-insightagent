import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format numbers with commas
export function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

// Get action badge variant
export function getActionBadgeVariant(action) {
  switch (action?.toUpperCase()) {
    case 'DONATE':
      return 'default';
    case 'MARKDOWN -30%':
    case 'MARKDOWN -10%':
      return 'secondary';
    case 'RETURN TO SUPPLIER':
      return 'destructive';
    case 'NO_ACTION':
      return 'outline';
    default:
      return 'outline';
  }
}

// Get action emoji
export function getActionEmoji(action) {
  switch (action?.toUpperCase()) {
    case 'DONATE':
      return '🍽️';
    case 'MARKDOWN -30%':
    case 'MARKDOWN -10%':
      return '🛒';
    case 'RETURN TO SUPPLIER':
      return '↩️';
    case 'NO_ACTION':
      return '✅';
    default:
      return '❓';
  }
}

// Get risk color
export function getRiskColor(riskScore) {
  if (riskScore >= 75) return 'destructive';
  if (riskScore >= 50) return 'secondary';
  return 'default';
}

// Get confidence color
export function getConfidenceColor(confidence) {
  if (confidence >= 80) return 'default';
  if (confidence >= 60) return 'secondary';
  return 'destructive';
}

// Calculate efficiency score
export function calculateEfficiencyScore(co2Saved, wasteValue) {
  if (wasteValue === 0) return 0;
  return (co2Saved / wasteValue) * 100;
}

// Format date
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format timestamp
export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Get category color
export function getCategoryColor(category) {
  const colors = {
    'meat': 'destructive',
    'dairy': 'secondary',
    'produce': 'default',
    'baked_goods': 'outline',
    'beverages': 'default',
    'frozen': 'secondary',
    'household': 'outline',
  };
  return colors[category?.toLowerCase()] || 'outline';
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
