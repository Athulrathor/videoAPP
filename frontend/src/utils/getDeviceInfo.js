
export const getDeviceInfo = () => {
    const ua = navigator.userAgent;

    const getOS = () => {
        if (/Windows NT 10/.test(ua)) return "Windows 10";
        if (/Windows NT 6.1/.test(ua)) return "Windows 7";
        if (/Windows/.test(ua)) return "Windows";
        if (/Mac OS X/.test(ua)) return "macOS";
        if (/Android/.test(ua)) return "Android";
        if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
        if (/Linux/.test(ua)) return "Linux";
        return "Unknown OS";
    };

    const getBrowser = () => {
        if (/Edg\//.test(ua)) return "Edge";
        if (/OPR\/|Opera/.test(ua)) return "Opera";
        if (/Chrome\//.test(ua)) return "Chrome";
        if (/Firefox\//.test(ua)) return "Firefox";
        if (/Safari\//.test(ua)) return "Safari";
        return "Unknown Browser";
    };

    const getDeviceName = () => {
        if (/iPhone/.test(ua)) return "iPhone";
        if (/iPad/.test(ua)) return "iPad";
        if (/Android.*Mobile/.test(ua)) return "Android Phone";
        if (/Android/.test(ua)) return "Android Tablet";
        if (/Macintosh/.test(ua)) return "Mac";
        if (/Windows/.test(ua)) return "Windows PC";
        if (/Linux/.test(ua)) return "Linux PC";
        return "Unknown Device";
    };

    const getPlatform = () => {
        if (/Mobile|iPhone|Android.*Mobile/.test(ua)) return "Mobile";
        if (/iPad|Tablet/.test(ua)) return "Tablet";
        return "Desktop";
    };

    // Persist sessionId so same browser tab = same session across refreshes
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = crypto.randomUUID();  // built-in browser API, no package needed
        localStorage.setItem("sessionId", sessionId);
    }

    return {
        sessionId,
        deviceName: getDeviceName(),
        browser: getBrowser(),
        os: getOS(),
        platform: getPlatform(),
    };
};