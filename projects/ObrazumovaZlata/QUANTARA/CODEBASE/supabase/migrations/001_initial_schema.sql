-- ============================================================
-- Квантара — Initial Schema
-- Migration 001
-- ============================================================

-- ============================================================
-- HELPER: extract org_id from JWT custom claims
-- ============================================================
create or replace function auth_org_id()
returns uuid
language sql stable
as $$
  select (auth.jwt() ->> 'org_id')::uuid;
$$;

-- ============================================================
-- TABLES
-- ============================================================

create table organizations (
  id    uuid primary key default gen_random_uuid(),
  name  text not null,
  slug  text not null unique,
  plan  text not null default 'free'
);

create table profiles (
  id        uuid primary key references auth.users on delete cascade,
  org_id    uuid not null references organizations on delete cascade,
  full_name text,
  role      text not null default 'researcher',
  email     text not null
);

create table projects (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references organizations on delete cascade,
  responsible_id uuid references profiles on delete set null,
  name           text not null,
  description    text,
  status         text not null default 'active',
  tags           text[] not null default '{}',
  start_date     date,
  deadline       date,
  deleted_at     timestamptz
);

create table project_members (
  project_id uuid not null references projects on delete cascade,
  user_id    uuid not null references profiles on delete cascade,
  primary key (project_id, user_id)
);

create table tasks (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references organizations on delete cascade,
  project_id     uuid references projects on delete cascade,
  responsible_id uuid references profiles on delete set null,
  name           text not null,
  status         text not null default 'todo',
  progress       int not null default 0 check (progress between 0 and 100),
  start_date     date,
  end_date       date,
  deleted_at     timestamptz
);

create table reagents (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references organizations on delete cascade,
  project_id    uuid references projects on delete cascade,
  name          text not null,
  category      text,
  cas_number    text,
  formula       text,
  concentration text,
  storage       text,
  stock         numeric not null default 0,
  unit          text,
  min_stock     numeric not null default 0,
  expiry_date   date,
  location      text,
  supplier      text,
  deleted_at    timestamptz
);

create table consumables (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references organizations on delete cascade,
  name       text not null,
  category   text,
  stock      numeric not null default 0,
  unit       text,
  min_stock  numeric not null default 0,
  location   text,
  supplier   text,
  comment    text,
  deleted_at timestamptz
);

create table audit_log (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references organizations on delete cascade,
  user_id    uuid references profiles on delete set null,
  table_name text not null,
  row_id     uuid not null,
  action     text not null,  -- INSERT | UPDATE | DELETE
  old_data   jsonb,
  new_data   jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index on projects (org_id) where deleted_at is null;
create index on tasks (org_id) where deleted_at is null;
create index on tasks (project_id) where deleted_at is null;
create index on reagents (org_id) where deleted_at is null;
create index on consumables (org_id) where deleted_at is null;
create index on audit_log (org_id, created_at desc);

-- ============================================================
-- DB TRIGGER: auto-create profile on user signup
-- ============================================================
create or replace function handle_new_user()
returns trigger
language plpgsql security definer
as $$
begin
  insert into profiles (id, org_id, email, role)
  values (
    new.id,
    (new.raw_user_meta_data ->> 'org_id')::uuid,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'researcher')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- RLS: enable on all tables
-- ============================================================
alter table organizations    enable row level security;
alter table profiles         enable row level security;
alter table projects         enable row level security;
alter table project_members  enable row level security;
alter table tasks            enable row level security;
alter table reagents         enable row level security;
alter table consumables      enable row level security;
alter table audit_log        enable row level security;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- organizations: each user sees only their own org
create policy "org_select" on organizations
  for select using (id = auth_org_id());

-- profiles: everyone in the org
create policy "profiles_select" on profiles
  for select using (org_id = auth_org_id());

create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());

-- projects: org-scoped (soft-delete aware)
create policy "projects_select" on projects
  for select using (org_id = auth_org_id() and deleted_at is null);

create policy "projects_insert" on projects
  for insert with check (org_id = auth_org_id());

create policy "projects_update" on projects
  for update using (org_id = auth_org_id());

-- project_members: if you are a member of the org
create policy "project_members_select" on project_members
  for select using (
    exists (
      select 1 from projects p
      where p.id = project_id and p.org_id = auth_org_id()
    )
  );

create policy "project_members_insert" on project_members
  for insert with check (
    exists (
      select 1 from projects p
      where p.id = project_id and p.org_id = auth_org_id()
    )
  );

create policy "project_members_delete" on project_members
  for delete using (
    exists (
      select 1 from projects p
      where p.id = project_id and p.org_id = auth_org_id()
    )
  );

-- tasks
create policy "tasks_select" on tasks
  for select using (org_id = auth_org_id() and deleted_at is null);

create policy "tasks_insert" on tasks
  for insert with check (org_id = auth_org_id());

create policy "tasks_update" on tasks
  for update using (org_id = auth_org_id());

-- reagents
create policy "reagents_select" on reagents
  for select using (org_id = auth_org_id() and deleted_at is null);

create policy "reagents_insert" on reagents
  for insert with check (org_id = auth_org_id());

create policy "reagents_update" on reagents
  for update using (org_id = auth_org_id());

-- consumables
create policy "consumables_select" on consumables
  for select using (org_id = auth_org_id() and deleted_at is null);

create policy "consumables_insert" on consumables
  for insert with check (org_id = auth_org_id());

create policy "consumables_update" on consumables
  for update using (org_id = auth_org_id());

-- audit_log: read-only for users in org, written only by server-side functions
create policy "audit_log_select" on audit_log
  for select using (org_id = auth_org_id());
