/**
 * Formats an ISO 8601 timestamp into a user-friendly string.
 * @param {string} isoString - The ISO timestamp to format.
 * @returns {string} - Formatted time/date string.
 */
export const formatMessageTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    const now = new Date();

    // Check if valid date
    if (isNaN(date.getTime())) return isoString;

    const isToday = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
        // Return HH:mm
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
        return "Yesterday";
    } else {
        // Return dd/MM/yyyy
        return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
};
