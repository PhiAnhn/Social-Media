import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
    const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        // có thể xảy ra khi refresh trang
        if (user && !accessToken) {
            try {
                await refresh();
            } catch (error) {
                console.warn("Refresh token thất bại khi init");
                // Không cần toast ở đây, để interceptor hoặc fetchMe xử lý
            }
        }

        else if (accessToken && !user) {
            await fetchMe().catch(() => { });
        }

        setStarting(false);
    };

    useEffect(() => {
        init();
    }, []);

    if (starting || loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                Đang tải trang...
            </div>
        );
    }

    if (!accessToken || !user) {
        return (
            <Navigate
                to="/signin"
                replace
            />
        );
    }

    return <Outlet></Outlet>;
};

export default ProtectedRoute;
