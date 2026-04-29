

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="text-center max-w-md">

                {/* BIG 404 */}
                <h1 className="text-7xl font-extrabold text-gray-900">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                    Page Not Found
                </h2>

                <p className="mt-3 text-gray-500">
                    Sorry, the page you are looking for doesn’t exist or has been moved.
                </p>


                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">

                    <Link href="/">
                        <Button className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white">
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>

                </div>

                {/* Footer text */}
                <p className="mt-8 text-xs text-gray-400">
                    If you think this is a mistake, please contact support.
                </p>

            </div>
        </div>
    );
}