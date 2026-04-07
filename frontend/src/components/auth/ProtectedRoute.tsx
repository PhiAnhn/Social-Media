import { useAuthStore } from "@/stores/useAuthStore.ts";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
    // Lấy trực tiếp từ Zustand store
    const {
        accessToken,
        user,
        loading,
        refresh,
        fetchMe
    } = useAuthStore();

    // Khởi tạo auth khi component mount
    useEffect(() => {
        const init = async () => {
            // Trường hợp refresh trang: chưa có token
            if (!accessToken) {
                await refresh();
            }

            // Có token nhưng chưa có thông tin user
            if (accessToken && !user) {
                await fetchMe();
            }
        };

        init();
    }, [accessToken, user, refresh, fetchMe]);   // dependencies đúng

    // Hiển thị loading khi đang xử lý
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                Đang tải trang...
            </div>
        );
    }

    // Nếu không có accessToken → chuyển hướng về đăng nhập
    if (!accessToken) {
        return <Navigate to="/signin" replace />;
    }

    // Cho phép vào các route con
    return <Outlet />;
};

export default ProtectedRoute;