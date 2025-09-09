import DeviceDetector from 'node-device-detector';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../utils/asyncHandler.js';
import geoip from 'geoip-lite';

const detector = new DeviceDetector();

export const detectDevice = asyncHandler(async (req, res, next) => { 
    const userAgent = req.headers['user-agent'];
    const result = detector.detect(userAgent);

    let ipAddress = req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        '127.0.0.1';

    // Remove IPv6 prefix if present (::ffff:)
    if (ipAddress.startsWith('::ffff:')) {
        ipAddress = ipAddress.substring(7);
    }

    // Get location from IP
    const geo = geoip.lookup(ipAddress);

    console.log("geo : ",geo,"ipAddress : ",ipAddress)

    let deviceId = req.cookies.deviceId || req.headers['x-device-id'];
    if (!deviceId) {
        deviceId = uuidv4();
    }

    req.deviceInfo = {
        deviceId,
        deviceName: result.device?.model || 'Unknown Device',
        platform: result.device?.type || 'Unknown',
        browser: `${result.client?.name || 'Unknown'} ${result.client?.version || ''}`,
        os: `${result.os?.name || 'Unknown'} ${result.os?.version || ''}`,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent,
        location: geo ? {
            country: geo.country,
            region: geo.region,
            city: geo.city,
            timezone: geo.timezone,
            coordinates: geo.ll ? {
                latitude: geo.ll[0],
                longitude: geo.ll[1]
            } : null
        } : null
    };

    res.cookie('deviceId', deviceId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true
    });

    next();
});