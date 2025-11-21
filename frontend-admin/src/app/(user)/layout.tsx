import ProtectedRoute from "@/libs/ProtectedRoute";

import { Sidebar } from "@/components/shared/profile/Sidebar";

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_STAFF", "ROLE_DOCTOR"]}
    >
      {/* full width fixed container */}
      <div className="fixed top-18 left-0 right-0 bottom-0 overflow-auto">
        <div className="flex gap-6 p-4 h-full">
          {/* Left side - Sidebar */}
          <Sidebar />
          {/* Right side - Main content: important -> flex-1 w-0 */}
          <div className="flex-1 w-0 h-full min-h-0">
            <div className="border border-gray-200 p-4 rounded-lg shadow-md h-full min-h-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
