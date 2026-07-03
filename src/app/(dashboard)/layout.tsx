import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getCourses } from "@/app/actions/courses";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileData = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single();
    profileData = data;
  }

  const userData = user ? { email: user.email, profile: profileData } : null;

  // Fetch courses server-side so Sidebar can render them without client fetching
  const courses = await getCourses();

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar - visible en lg+ */}
      <Sidebar courses={courses} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <TopBar user={userData} />

        <main id="main-content" role="main" className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav - visible solo <lg */}
      <MobileNav />
    </div>
  );
}
