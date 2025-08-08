export interface AppConfig {
    apiPrefix: string;
    authenticatedEntryPath: string;
    unAuthenticatedEntryPath: string;
    debugGoogleAnalytics: boolean;
  }
  
  const appConfig: AppConfig = {
    apiPrefix:  import.meta.env.REACT_APP_API_BASE_URL || '',
    authenticatedEntryPath: '/dashboard',
    unAuthenticatedEntryPath: '/auth/login',
    debugGoogleAnalytics: false,
  };
  
  export default appConfig;
  