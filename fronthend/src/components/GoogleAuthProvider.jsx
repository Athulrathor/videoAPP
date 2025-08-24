import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID;

export const GoogleAuthWrapper = ({ children }) => {
    if (!GOOGLE_CLIENT_ID) return <div>Google Auth not configured</div>;
    return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>;
};