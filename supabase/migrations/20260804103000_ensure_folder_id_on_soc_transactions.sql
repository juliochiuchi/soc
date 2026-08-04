alter table public.soc_transactions
  add column if not exists folder_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'soc_transactions_folder_id_fkey'
  ) then
    alter table public.soc_transactions
      add constraint soc_transactions_folder_id_fkey
      foreign key (folder_id)
      references public.soc_folders (id);
  end if;
end $$;

create index if not exists idx_soc_transactions_folder_id
  on public.soc_transactions (folder_id);
