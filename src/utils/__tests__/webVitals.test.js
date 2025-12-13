import { trackWebVitals, getCLS, getFID, getLCP, getFCP, getTTFB } from '../webVitals';

// Mock web-vitals
jest.mock('web-vitals', () => ({
  getCLS: jest.fn((onReport) => {
    onReport({ name: 'CLS', value: 0.1, id: 'cls-1', delta: 0.1 });
  }),
  getFID: jest.fn((onReport) => {
    onReport({ name: 'FID', value: 100, id: 'fid-1', delta: 100 });
  }),
  getLCP: jest.fn((onReport) => {
    onReport({ name: 'LCP', value: 2000, id: 'lcp-1', delta: 2000 });
  }),
  getFCP: jest.fn((onReport) => {
    onReport({ name: 'FCP', value: 1500, id: 'fcp-1', delta: 1500 });
  }),
  getTTFB: jest.fn((onReport) => {
    onReport({ name: 'TTFB', value: 500, id: 'ttfb-1', delta: 500 });
  }),
}));

describe('webVitals', () => {
  let mockGtag;

  beforeEach(() => {
    mockGtag = jest.fn();
    global.window.gtag = mockGtag;
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete global.window.gtag;
  });

  describe('trackWebVitals', () => {
    it('should track all Core Web Vitals', () => {
      const onReport = jest.fn();
      trackWebVitals(onReport);

      expect(getCLS).toHaveBeenCalled();
      expect(getFID).toHaveBeenCalled();
      expect(getLCP).toHaveBeenCalled();
      expect(getFCP).toHaveBeenCalled();
      expect(getTTFB).toHaveBeenCalled();

      // Verify onReport was called for each metric
      expect(onReport).toHaveBeenCalledTimes(5);
    });

    it('should send CLS metric to Google Analytics', () => {
      const onReport = jest.fn();
      trackWebVitals(onReport);

      // CLS should be multiplied by 1000
      expect(mockGtag).toHaveBeenCalledWith('event', 'CLS', expect.objectContaining({
        value: 100, // 0.1 * 1000
        metric_id: 'cls-1',
        metric_value: 0.1,
        metric_delta: 0.1,
      }));
    });

    it('should send FID metric to Google Analytics', () => {
      const onReport = jest.fn();
      trackWebVitals(onReport);

      expect(mockGtag).toHaveBeenCalledWith('event', 'FID', expect.objectContaining({
        value: 100,
        metric_id: 'fid-1',
        metric_value: 100,
        metric_delta: 100,
      }));
    });

    it('should send LCP metric to Google Analytics', () => {
      const onReport = jest.fn();
      trackWebVitals(onReport);

      expect(mockGtag).toHaveBeenCalledWith('event', 'LCP', expect.objectContaining({
        value: 2000,
        metric_id: 'lcp-1',
        metric_value: 2000,
        metric_delta: 2000,
      }));
    });

    it('should send FCP metric to Google Analytics', () => {
      const onReport = jest.fn();
      trackWebVitals(onReport);

      expect(mockGtag).toHaveBeenCalledWith('event', 'FCP', expect.objectContaining({
        value: 1500,
        metric_id: 'fcp-1',
        metric_value: 1500,
        metric_delta: 1500,
      }));
    });

    it('should send TTFB metric to Google Analytics', () => {
      const onReport = jest.fn();
      trackWebVitals(onReport);

      expect(mockGtag).toHaveBeenCalledWith('event', 'TTFB', expect.objectContaining({
        value: 500,
        metric_id: 'ttfb-1',
        metric_value: 500,
        metric_delta: 500,
      }));
    });

    it('should not send to analytics if gtag is not available', () => {
      delete global.window.gtag;
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const onReport = jest.fn();
      trackWebVitals(onReport);

      expect(consoleWarnSpy).not.toHaveBeenCalled(); // No error, just no tracking
      consoleWarnSpy.mockRestore();
    });

    it('should call onReport callback for each metric', () => {
      const onReport = jest.fn();
      trackWebVitals(onReport);

      expect(onReport).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'CLS' })
      );
      expect(onReport).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'FID' })
      );
      expect(onReport).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'LCP' })
      );
      expect(onReport).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'FCP' })
      );
      expect(onReport).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'TTFB' })
      );
    });
  });

  describe('individual metric functions', () => {
    it('should export getCLS', () => {
      expect(getCLS).toBeDefined();
      expect(typeof getCLS).toBe('function');
    });

    it('should export getFID', () => {
      expect(getFID).toBeDefined();
      expect(typeof getFID).toBe('function');
    });

    it('should export getLCP', () => {
      expect(getLCP).toBeDefined();
      expect(typeof getLCP).toBe('function');
    });

    it('should export getFCP', () => {
      expect(getFCP).toBeDefined();
      expect(typeof getFCP).toBe('function');
    });

    it('should export getTTFB', () => {
      expect(getTTFB).toBeDefined();
      expect(typeof getTTFB).toBe('function');
    });
  });
});

