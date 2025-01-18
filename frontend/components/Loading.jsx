const Loading = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 right-0 bottom-0">
                    <div className="w-20 h-20 border-8 border-gray-200 rounded-full animate-spin border-t-blue-500" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-white rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default Loading;
