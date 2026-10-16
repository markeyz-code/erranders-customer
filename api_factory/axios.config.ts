import axios, { type AxiosResponse } from "axios";
import { useUser } from "@/composables/modules/auth/user";
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useNetworkStatus } from '@/composables/core/useNetworkStatus'
import { getSelectedInstitutionId } from '@/composables/useInstitution'
// Lazy-init toast to avoid calling composable outside Vue setup context
let _showToast: ReturnType<typeof useCustomToast>['showToast'] | null = null;
const getToast = () => {
  if (!_showToast) {
    try {
      const { showToast } = useCustomToast();
      _showToast = showToast;
    } catch {
      // Fallback: no-op during SSR/build
      _showToast = (() => {}) as any;
    }
  }
  return _showToast!;
};

// Use useRuntimeConfig() for the API base URL so Vercel env vars work correctly.
// import.meta.env.VITE_* won't be populated on Vercel since .env is gitignored.
const getBaseUrl = (): string => {
  try {
    const config = useRuntimeConfig();
    return (config.public.apiBase as string) || 'https://api.erranders.org';
  } catch {
    // Fallback if called outside Nuxt context
    const envApiUrl = import.meta.env?.VITE_API_BASE_URL;
    return envApiUrl || 'https://api.erranders.org';
  }
};

const cleanBaseUrl = getBaseUrl().replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = cleanBaseUrl;
const $GATEWAY_ENDPOINT = `${cleanBaseUrl}/api/v1`;
const $GATEWAY_ENDPOINT_V2 = `${cleanBaseUrl}/v2`;
const $IMAGE_UPLOAD_ENDPOINT = cleanBaseUrl;


export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
});
export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V2,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
];

instanceArray.forEach((instance) => {
  instance.defaults.timeout = 15000; // Set global timeout to 15 seconds
  instance.interceptors.request.use((config: any) => {
    let token = '';
    
    // In browser environment, read cookie directly to avoid Nuxt useUser reactivity issues
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )errandr_token=([^;]+)'));
      if (match) {
        token = match[2];
      }
    } else {
      // Fallback for SSR/Node if needed
      try {
        const { token: userToken } = useUser();
        token = userToken.value;
      } catch (e) {
        // ignore
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Campus scoping. The same synchronous, Vue-free read as the token above, so
    // it works in the browser and during SSR. With no campus selected we send NO
    // header at all, which keeps the backend's existing unscoped
    // (public/legacy) behaviour for every visitor who has not chosen one.
    const institutionId = getSelectedInstitutionId();
    if (institutionId && config.headers) {
      config.headers['X-Institution-Id'] = institutionId;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      return response;
    },
    (err: any) => {
      const { logOut } = useUser();
      
      // Check for timeout or network connection error (which includes CORS errors in browsers)
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('Network Error') || typeof err.response === "undefined") {
        try {
          const { recordSlowNetwork } = useNetworkStatus();
          recordSlowNetwork();
        } catch (e) {}
        
        let errorMessage = "Network Error. Please check your connection.";
        // In a browser, if it's a Network Error and we are online, it's highly likely a CORS error or server down
        if (typeof window !== 'undefined' && window.navigator.onLine && err.message?.includes('Network Error')) {
          errorMessage = "Network Error (or CORS error). The server might be unreachable or rejecting the request origin.";
        }

        getToast()({
          title: "Connection Error",
          message: errorMessage,
          toastType: "error",
          duration: 4000
        });
        
        return {
          type: "ERROR",
          ...(err.response || { status: 0, statusText: errorMessage }),
        };
      }
      if (err.response.status === 401) {
        console.log(err.response.data.error)
        
        const publicPaths = ['/dashboard', '/vendors', '/search', '/', '/auth/login', '/auth/register', '/cart', '/errands/custom'];
        const isPublicPath = typeof window !== 'undefined' && 
          (publicPaths.includes(window.location.pathname) || window.location.pathname.startsWith('/vendors/'));
        
        logOut(isPublicPath ? false : true);
        
        if (!isPublicPath) {
          getToast()({
            title: "Session Expired",
            message: "Please login to continue",
            toastType: "error",
            duration: 3000
          });
        }
        
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (statusCodeStartsWith(err.response.status, 4)) {
        const isGroupOrderCheck = err.response.status === 404 && err.config?.url?.includes('/group-orders/');
        const isVendorCheck = err.response.status === 404 && err.config?.url?.includes('/vendors/');
        // Campus discovery and its light counts are best-effort: a campus the
        // backend does not know about (or a failing count) must fall through to
        // the normal site silently instead of shouting at every visitor.
        const isCampusLookup = err.config?.url?.includes('/institutions');
        if (err.response.data.message && !isGroupOrderCheck && !isVendorCheck && !isCampusLookup) {
          getToast()({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
            toastType: "error",
            duration: 3000
          });
        }
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 500) {
        // Same carve-out as the 4xx branch above: a campus count is decoration.
        if (!err.config?.url?.includes('/institutions')) {
          getToast()({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
            toastType: "error",
            duration: 3000
          });
        }
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 409) {
        getToast()({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
      }
    }
  );
});

const statusCodeStartsWith = (
  statusCode: number,
  startNumber: number
): boolean => {
  const statusCodeString = statusCode.toString();
  const startNumberString = startNumber.toString();

  return statusCodeString.startsWith(startNumberString);
};
