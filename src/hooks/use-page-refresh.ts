import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook that provides a function to refresh the current page
 * by navigating to the current location with the replace option
 */
export const usePageRefresh = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Refreshes the current page by navigating to the current location
   * This is equivalent to a page refresh without actually reloading the browser
   */
  const refreshPage = () => {
    navigate(0); // This uses the numeric argument to replace current entry
  };

  /**
   * Refreshes the current page by navigating to the current path
   * Preserves the URL structure but rerenders the page
   */
  const refreshCurrentRoute = () => {
    navigate(location.pathname + location.search, { replace: true });
  };

  return { refreshPage, refreshCurrentRoute };
};
