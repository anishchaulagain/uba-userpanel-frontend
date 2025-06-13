import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center"
                >
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Please Sign In
                        </h2>
                        <p className="text-gray-600">
                            You need to be logged in to access this page.
                        </p>
                    </div>
                </motion.div>
            </>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;