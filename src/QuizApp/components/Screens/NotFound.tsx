import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
            <div className="container mx-auto p-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
                        <AlertCircle className="w-28 h-28 text-red-400 mx-auto mb-4" />

                        <h1 className="text-7xl font-bold text-white mb-4">404</h1>

                        <h2 className="text-4xl font-bold text-white mb-4">
                            Page Not Found
                        </h2>

                        <p className="text-xl text-purple-200 mb-8">
                            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                        </p>

                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
