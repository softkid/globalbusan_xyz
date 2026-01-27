/**
 * Analytics utility functions
 * Google Analytics 4 integration
 */

/**
 * Sends an event to Google Analytics
 * @param {string} eventName - The event name
 * @param {Object} eventParams - Event parameters
 */
export const sendToAnalytics = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  } else {
    console.warn('Google Analytics (gtag) not loaded. Event not sent:', eventName, eventParams);
  }
};

/**
 * Tracks page views
 * @param {string} pagePath - The page path
 * @param {string} pageTitle - The page title
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-XXXXXXXXXX', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

/**
 * Tracks custom events
 * @param {string} eventName - The event name
 * @param {Object} eventParams - Event parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  sendToAnalytics(eventName, eventParams);
};

/**
 * Tracks exceptions/errors
 * @param {string} description - Error description
 * @param {boolean} fatal - Whether the error is fatal
 * @param {Object} additionalParams - Additional parameters
 */
export const trackException = (description, fatal = false, additionalParams = {}) => {
  sendToAnalytics('exception', {
    description,
    fatal,
    ...additionalParams,
  });
};

