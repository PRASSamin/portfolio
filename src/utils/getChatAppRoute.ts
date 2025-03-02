// Define the route mapping from website to app
const ROUTE_MAP: Record<string, string> = {
    "/chat": "/",
    "/chat/nova": "/nova",
    "/chat/invite/:cid": "/invite/:cid",
  };
  
  /**
   * Converts a website chat route to an app route.
   * @param path The website path (e.g., "/chat/invite/324354y6", "/chat/nova")
   * @returns The corresponding app route (e.g., "/invite/324354y6", "/nova")
   */
  export const getChatAppRoute = (path: string): string => {
    // Normalize the path (remove trailing slash, ensure leading slash)
    const normalizedPath = `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  
    // Find a matching route in ROUTE_MAP
    for (const [webRoute, appRoute] of Object.entries(ROUTE_MAP)) {
      // Split routes into segments for comparison
      const webSegments = webRoute.split("/").filter(Boolean);
      const pathSegments = normalizedPath.split("/").filter(Boolean);
  
      // Check if the number of segments matches
      if (webSegments.length !== pathSegments.length) {
        continue; 
      }
  
      // Check for static match or dynamic parameter match
      let isMatch = true;
      const params: Record<string, string> = {};
  
      for (let i = 0; i < webSegments.length; i++) {
        const webSegment = webSegments[i];
        const pathSegment = pathSegments[i];
  
        if (webSegment.startsWith(":")) {
          // Dynamic segment (e.g., :cid)
          const paramName = webSegment.slice(1); // Remove ":" prefix
          params[paramName] = pathSegment; // Store the parameter value (e.g., "324354y6")
        } else if (webSegment !== pathSegment) {
          isMatch = false;
          break;
        }
      }
  
      if (isMatch) {
        // Construct the app route by substituting dynamic parameters
        let finalAppRoute = appRoute;
        for (const [paramName, paramValue] of Object.entries(params)) {
          finalAppRoute = finalAppRoute.replace(`:${paramName}`, paramValue);
        }
        return finalAppRoute;
      }
    }
  
    // If no match, return the original path
    return normalizedPath;
  };