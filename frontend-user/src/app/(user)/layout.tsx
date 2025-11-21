import { Sidebar } from "@/components/shared/profile/Sidebar";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[calc(100vh-5rem)]">
      <div className="flex gap-6 p-6 h-full">
        {/* Left side - Sidebar */}
        <Sidebar />
        {/* Right side - Main content: important -> flex-1 w-0 */}
        <div className="flex-1 w-0 h-full min-h-0">
          <div className="border border-gray-200 p-4 rounded-lg h-full min-h-screen">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
