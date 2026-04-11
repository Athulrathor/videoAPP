import { useEffect, useRef, useState } from "react";
import { checkUsername } from "../../apis/user.api";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export const useUsernameCheck = (username) => {
    const [status, setStatus] = useState("idle");
    // idle | checking | available | taken

    const currentRequest = useRef(0);
    const isValidUsername = USERNAME_PATTERN.test(username || "");

    useEffect(() => {
        if (!isValidUsername) {
            currentRequest.current += 1;
            return;
        }

        const requestId = ++currentRequest.current;

        const delay = setTimeout(async () => {
            setStatus("checking");

            try {
                const res = await checkUsername(username);

                if (requestId !== currentRequest.current) return;

                setStatus(res.data.available ? "available" : "taken");
            } catch {
                if (requestId !== currentRequest.current) return;
                setStatus("idle");
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [isValidUsername, username]);

    return isValidUsername ? status : "idle";
};
