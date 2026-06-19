# Kuest Architecture

Visual map of the codebase — a monorepo for a gamified city quest app with two clients and a Supabase backend.

## High-level architecture

```mermaid
flowchart TB
    subgraph Monorepo["kuest (Yarn workspaces)"]
        direction TB
        Mobile["apps/mobile<br/>Expo · React Native · Expo Router"]
        Admin["apps/admin<br/>Next.js 14 · port 3001"]
    end

    subgraph Supabase["supabase/"]
        Auth["Auth"]
        DB["PostgreSQL + RLS"]
        Storage["Storage: proof-photos"]
        Edge["Edge Functions"]
        Migrations["migrations/001_initial_schema.sql"]
        Seed["seed.sql"]
    end

    Player["Player (mobile)"] --> Mobile
    Operator["Admin operator (web)"] --> Admin

    Mobile --> Auth
    Mobile --> DB
    Mobile --> Storage
    Admin --> DB
    Admin --> Edge

    Edge --> DB
    Migrations --> DB
    Seed --> DB
```

## Mobile app structure

```mermaid
flowchart LR
    subgraph Routes["app/ (Expo Router)"]
        Auth["(auth)/<br/>sign-in · sign-up"]
        Tabs["(tabs)/"]
        QuestDetail["quest/[id]"]
        Submit["submit/[questId]"]
    end

    subgraph TabsScreens["Tab screens"]
        Index["index — Quest feed"]
        Map["map — Map view"]
        Leaderboard["leaderboard — Weekly ranks"]
        Profile["profile — XP & badges"]
    end

    subgraph Hooks["hooks/"]
        useAuth["useAuth"]
        useQuests["useQuests"]
        useLocation["useLocation"]
    end

    subgraph Lib["lib/"]
        types["types.ts"]
        constants["constants.ts"]
        supabase["supabase.ts"]
    end

    subgraph Components["components/"]
        QuestCard["QuestCard"]
        XPBar["XPBar"]
        BadgeGrid["BadgeGrid"]
        Others["Avatar · LevelChip · EmptyState · …"]
    end

    Root["_layout.tsx<br/>auth guard"] --> Auth
    Root --> Tabs
    Root --> QuestDetail
    Root --> Submit

    Tabs --> TabsScreens
    TabsScreens --> Hooks
    QuestDetail --> Hooks
    Submit --> Hooks
    Hooks --> Lib
    TabsScreens --> Components
```

## Admin dashboard

```mermaid
flowchart TB
    Layout["app/layout.tsx<br/>Sidebar nav"]

    Layout --> Dashboard["/ — Dashboard"]
    Layout --> Completions["/completions — Approve / reject queue"]
    Layout --> Quests["/quests — Quest CRUD"]
    Layout --> Users["/users — User list"]
    Layout --> Sponsors["/sponsors — Sponsor reports"]

    Completions -->|"approve completion"| Trigger["DB trigger: award_xp_on_approval"]
    Completions -->|"sponsored quest"| RedeemFn["generate-redemption-code"]

    Quests --> DBQuests[("quests table")]
    Completions --> DBCompletions[("completions table")]
    Users --> DBProfiles[("profiles table")]
```

## Database schema

```mermaid
erDiagram
    auth_users ||--|| profiles : "id"
    profiles ||--o{ completions : "user_id"
    quests ||--o{ completions : "quest_id"
    profiles ||--o{ user_badges : "user_id"
    badges ||--o{ user_badges : "badge_id"

    profiles {
        uuid id PK
        text username
        text city
        int total_xp
        int level
        text avatar_url
    }

    quests {
        uuid id PK
        text title
        quest_category category
        float lat
        float lng
        int radius_meters
        int xp_reward
        bool is_sponsored
        quest_status status
    }

    completions {
        uuid id PK
        uuid user_id FK
        uuid quest_id FK
        text photo_url
        float lat
        float lng
        completion_status status
        text redemption_code
    }

    badges {
        uuid id PK
        text name
        text unlock_condition
    }

    user_badges {
        uuid user_id FK
        uuid badge_id FK
    }

    leaderboard {
        view weekly_xp
    }
```

## Core quest flow

```mermaid
sequenceDiagram
    actor Player
    participant Mobile as Mobile App
    participant GPS as expo-location
    participant Camera as expo-camera
    participant SB as Supabase
    participant Admin as Admin Panel
    participant Trigger as award_xp trigger

    Player->>Mobile: Browse quests (feed / map)
    Mobile->>SB: SELECT active quests
    Player->>Mobile: Open quest detail
    Player->>Mobile: Submit proof
    Mobile->>GPS: Verify geofence
    Mobile->>Camera: Capture photo
    Mobile->>SB: Upload to proof-photos bucket
    Mobile->>SB: INSERT completion (status: pending)

    Admin->>SB: Review completions queue
    alt Approved
        Admin->>SB: UPDATE status → approved
        SB->>Trigger: on_completion_approved
        Trigger->>SB: profiles.total_xp + level
        opt Sponsored quest
            Admin->>SB: generate-redemption-code
            Player->>Mobile: Redeem at sponsor
        end
    else Rejected
        Admin->>SB: UPDATE status → rejected
    end

    Player->>Mobile: Check leaderboard
    Mobile->>SB: SELECT leaderboard view
```

## Folder tree

```
Kuest/
├── apps/
│   ├── mobile/          Expo app (player-facing)
│   │   ├── app/         Routes: auth, tabs, quest detail, submit
│   │   ├── components/  UI: QuestCard, XPBar, BadgeGrid, …
│   │   ├── hooks/       useAuth, useQuests, useLocation
│   │   └── lib/         types, constants, supabase client
│   └── admin/           Next.js dashboard (operator-facing)
│       └── app/         pages: completions, quests, users, sponsors
└── supabase/
    ├── migrations/      Schema, RLS, triggers, storage
    ├── functions/       award-xp, generate-redemption-code
    └── seed.sql         Starter quests & badges
```
