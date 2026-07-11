import { prisma } from "@/lib/db";
import { Bell, Check } from "@/lib/icons";
import { formatKWD } from "@/lib/utils";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth-client";
import { prisma as p } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function markAllRead() {
  "use server";
  await p.notification.updateMany({ where: { read: false }, data: { read: true } });
  revalidatePath("/admin/notifications");
}

export default async function NotificationsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const notifications = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500">{notifications.filter((n) => !n.read).length} unread</p>
        </div>
        <form action={markAllRead}>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50">
            <Check className="w-4 h-4" /> Mark all read
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            <Bell className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            No notifications
          </div>
        ) : notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-white rounded-xl border p-4 ${n.read ? "border-gray-200" : "border-orange-200 bg-orange-50/30"}`}
          >
            <div className="flex items-start gap-3">
              <div className={`shrink-0 w-2 h-2 rounded-full mt-2 ${n.read ? "bg-gray-300" : "bg-[#ff6600]"}`} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{n.title}</p>
                <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
