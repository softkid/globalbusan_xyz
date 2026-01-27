import { register, unregister } from '../serviceWorker';

describe('serviceWorker', () => {
  let mockServiceWorker;
  let mockRegistration;

  beforeEach(() => {
    mockRegistration = {
      installing: null,
      addEventListener: jest.fn(),
    };

    mockServiceWorker = {
      register: jest.fn().mockResolvedValue(mockRegistration),
      ready: Promise.resolve(mockRegistration),
      controller: null,
    };

    global.navigator = {
      serviceWorker: mockServiceWorker,
    };

    global.window = {
      addEventListener: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register service worker when available', () => {
      register();

      expect(window.addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
    });

    it('should not register service worker when not available', () => {
      delete global.navigator.serviceWorker;
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      register();

      expect(mockServiceWorker.register).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should handle registration success', async () => {
      register();

      // Simulate load event
      const loadHandler = window.addEventListener.mock.calls.find(
        call => call[0] === 'load'
      )?.[1];

      if (loadHandler) {
        await loadHandler();
      }

      expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw.js');
    });

    it('should handle registration error', async () => {
      const error = new Error('Registration failed');
      mockServiceWorker.register.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      register();

      const loadHandler = window.addEventListener.mock.calls.find(
        call => call[0] === 'load'
      )?.[1];

      if (loadHandler) {
        await loadHandler();
      }

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should handle updatefound event', async () => {
      const installingWorker = {
        addEventListener: jest.fn(),
        state: 'installed',
      };
      mockRegistration.installing = installingWorker;

      register();

      const loadHandler = window.addEventListener.mock.calls.find(
        call => call[0] === 'load'
      )?.[1];

      if (loadHandler) {
        await loadHandler();
      }

      // Simulate updatefound event
      const updateFoundHandler = mockRegistration.addEventListener.mock.calls.find(
        call => call[0] === 'updatefound'
      )?.[1];

      if (updateFoundHandler) {
        updateFoundHandler();

        // Simulate statechange event
        const stateChangeHandler = installingWorker.addEventListener.mock.calls.find(
          call => call[0] === 'statechange'
        )?.[1];

        if (stateChangeHandler) {
          stateChangeHandler();
        }
      }

      expect(mockRegistration.addEventListener).toHaveBeenCalledWith('updatefound', expect.any(Function));
    });
  });

  describe('unregister', () => {
    it('should unregister service worker when available', async () => {
      mockRegistration.unregister = jest.fn().mockResolvedValue(true);

      await unregister();

      expect(mockRegistration.unregister).toHaveBeenCalled();
    });

    it('should not unregister when service worker not available', async () => {
      delete global.navigator.serviceWorker;
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await unregister();

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should handle unregister error', async () => {
      const error = new Error('Unregister failed');
      mockServiceWorker.ready = Promise.reject(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await unregister();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});

