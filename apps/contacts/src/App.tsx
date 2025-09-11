import React from 'react'
import { Button } from '@bhq/ui'
import { contacts } from '@bhq/mock'

export default function App() {
  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: 16 }}>BreederHQ Contacts</h1>
      <p style={{ marginBottom: 16 }}>Starter page using @bhq/ui and @bhq/mock.</p>
      <Button onClick={() => alert('Hello from BreederHQ Contacts!')}>Test Button</Button>
      <section style={{ marginTop: 24 }}>
        <h2>Mock contacts</h2>
        <ul>
          {contacts.map((c) => (
            <li key={c.id}>
              {c.first_name} {c.last_name} {c.email ? `- ${c.email}` : ''}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
