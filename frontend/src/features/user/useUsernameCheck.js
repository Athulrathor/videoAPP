import { useEffect, useState } from "react";
import { checkUsername } from "../../apis/user.api";

export const useUsernameCheck = (username) => {
    const [status, setStatus] = useState("idle");
    // idle | checking | available | taken

    const isValidUsername = /^[a-z0-9_]{3,20}$/;

    let currentRequest = 0;

    useEffect(() => {
        if (!username) return;

        const requestId = ++currentRequest;

        const delay = setTimeout(async () => {
            setStatus("checking");

            const res = await checkUsername(username);

            if (requestId !== currentRequest) return;

            setStatus(res.data.available ? "available" : "taken");
        }, 500);

        if (!isValidUsername.test(username)) {
            setStatus("idle");
            return;
        }

        return () => clearTimeout(delay);
    }, [username]);

    return status;
};