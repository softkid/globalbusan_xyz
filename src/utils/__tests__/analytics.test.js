import { sendToAnalytics, trackPageView, trackEvent, trackException } from '../analytics';

describe('analytics', () => {
  let mockGtag;

  beforeEach(() => {
    mockGtag = jest.fn();
    global.window = {
      gtag: mockGtag,
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete global.window;
  });

  describe('sendToAnalytics', () => {
    it('should send event to Google Analytics when gtag is available', () => {
      sendToAnalytics('test_event', { param1: 'value1' });

      expect(mockGtag).toHaveBeenCalledWith('event', 'test_event', { param1: 'value1' });
    });

    it('should not send event when gtag is not available', () => {
      delete global.window.gtag;
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      sendToAnalytics('test_event', { param1: 'value1' });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Google Analytics (gtag) not loaded. Event not sent:',
        'test_event',
        { param1: 'value1' }
      );
      consoleWarnSpy.mockRestore();
    });

    it('should handle undefined window', () => {
      const originalWindow = global.window;
      delete global.window;

      expect(() => {
        sendToAnalytics('test_event');
      }).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('trackPageView', () => {
    it('should track page view when gtag is available', () => {
      trackPageView('/test-page', 'Test Page');

      expect(mockGtag).toHaveBeenCalledWith('config', 'G-XXXXXXXXXX', {
        page_path: '/test-page',
        page_title: 'Test Page',
      });
    });

    it('should not track when gtag is not available', () => {
      delete global.window.gtag;

      expect(() => {
        trackPageView('/test-page', 'Test Page');
      }).not.toThrow();
    });
  });

  describe('trackEvent', () => {
    it('should track custom events', () => {
      trackEvent('button_click', { button_name: 'donate' });

      expect(mockGtag).toHaveBeenCalledWith('event', 'button_click', {
        button_name: 'donate',
      });
    });

    it('should handle events without parameters', () => {
      trackEvent('simple_event');

      expect(mockGtag).toHaveBeenCalledWith('event', 'simple_event', {});
    });
  });

  describe('trackException', () => {
    it('should track exceptions with fatal flag', () => {
      trackException('Test error', true, { component: 'TestComponent' });

      expect(mockGtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'Test error',
        fatal: true,
        component: 'TestComponent',
      });
    });

    it('should track exceptions as non-fatal by default', () => {
      trackException('Test error');

      expect(mockGtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'Test error',
        fatal: false,
      });
    });

    it('should include additional parameters', () => {
      trackException('Test error', false, { error_code: 'E001', user_id: '123' });

      expect(mockGtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'Test error',
        fatal: false,
        error_code: 'E001',
        user_id: '123',
      });
    });
  });
});

