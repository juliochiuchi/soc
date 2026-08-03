create extension if not exists pgcrypto;

create table if not exists public.soc_categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null
);

create table if not exists public.soc_payment_methods (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null
);

create table if not exists public.soc_folders (
  id uuid primary key default gen_random_uuid(),
  folder_name varchar(255) not null,
  description varchar(255),
  date date,
  local varchar(255),
  status boolean not null default false
);

create table if not exists public.soc_transactions (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  date date not null,
  price numeric(12, 2) not null,
  folder_id uuid,
  payment_method uuid not null,
  category_id uuid not null,
  sent_by uuid not null,
  proof_payment varchar(255),
  note text,
  constraint soc_transactions_folder_id_fkey
    foreign key (folder_id)
    references public.soc_folders (id),
  constraint soc_transactions_payment_method_fkey
    foreign key (payment_method)
    references public.soc_payment_methods (id),
  constraint soc_transactions_category_id_fkey
    foreign key (category_id)
    references public.soc_categories (id),
  constraint soc_transactions_sent_by_fkey
    foreign key (sent_by)
    references public.soc_users (id)
);

create index if not exists idx_soc_transactions_folder_id
  on public.soc_transactions (folder_id);

create index if not exists idx_soc_transactions_payment_method
  on public.soc_transactions (payment_method);

create index if not exists idx_soc_transactions_category_id
  on public.soc_transactions (category_id);

create index if not exists idx_soc_transactions_sent_by
  on public.soc_transactions (sent_by);
