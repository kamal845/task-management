import { format, formatDistanceToNow, isBefore, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';

// Format date for display
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

// Get relative time (e.g., "2 hours ago", "in 3 days")
export const getRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

// Check if date is overdue
export const isOverdue = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(dateObj, new Date());
};

// Check if date is today
export const isDueToday = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
};

// Check if date is tomorrow
export const isDueTomorrow = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isTomorrow(dateObj);
};

// Check if date is yesterday
export const isDueYesterday = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isYesterday(dateObj);
};

// Get due date status
export const getDueDateStatus = (date) => {
  if (!date) return 'no-due-date';
  
  if (isOverdue(date)) return 'overdue';
  if (isDueToday(date)) return 'due-today';
  if (isDueTomorrow(date)) return 'due-tomorrow';
  
  return 'upcoming';
};

// Get due date status color
export const getDueDateStatusColor = (date) => {
  const status = getDueDateStatus(date);
  
  switch (status) {
    case 'overdue':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'due-today':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'due-tomorrow':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'upcoming':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Format date for input field
export const formatDateForInput = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

// Format time for input field
export const formatTimeForInput = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm');
};

// Get date range for filtering
export const getDateRange = (range) => {
  const now = new Date();
  
  switch (range) {
    case 'today':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      };
    case 'tomorrow':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2)
      };
    case 'this-week':
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);
      
      return { start: startOfWeek, end: endOfWeek };
    case 'this-month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 1)
      };
    default:
      return null;
  }
};
