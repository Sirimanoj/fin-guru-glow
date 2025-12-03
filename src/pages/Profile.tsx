const Profile = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <header className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold">User Name</h1>
                <p className="text-muted-foreground">@username</p>
            </header>

            <div className="glass-card p-6 rounded-xl space-y-4">
                <h2 className="text-lg font-semibold border-b border-border pb-2">Settings</h2>
                <div className="flex justify-between items-center">
                    <span>Dark Mode</span>
                    <div className="w-10 h-6 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span>Notifications</span>
                    <div className="w-10 h-6 bg-muted rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
