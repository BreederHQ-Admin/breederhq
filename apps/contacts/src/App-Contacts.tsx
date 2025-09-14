import { AppShell, PageHeader, ThemeToggle, Button, Card } from "@bhq/ui";

export default function App() {
  return (
    <AppShell title="BreederHQ" headerSlot={<ThemeToggle />}>
      <PageHeader
        title="Contacts"
        subtitle="Manage people across your breeding programs"
        actions={<Button>New Contact</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="text-sm text-fg-muted">Example card content</div>
        </Card>
      </div>
    </AppShell>
  );
}
