import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    try {
      settingsMap[s.key] = JSON.parse(s.value);
    } catch {
      settingsMap[s.key] = s.value;
    }
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Store configuration and business information</p>
      </div>
      <SettingsForm initial={settingsMap} />
    </div>
  );
}
