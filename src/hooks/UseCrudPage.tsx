import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}

interface CrudService<T, TCreate, TUpdate = TCreate> {
  list: (params: { page: number }) => Promise<{ data: PaginatedResponse<T> }>;
  create: (payload: TCreate) => Promise<unknown>;
  update: (id: string, payload: TUpdate) => Promise<unknown>;
  remove: (id: string) => Promise<unknown>;
}

interface UseCrudPageOptions<T> {
  service: CrudService<T, unknown>;
  entityName: string;
  getId: (item: T) => string;
}

export function useCrudPage<T>({ service, entityName, getId }: UseCrudPageOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<T | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<T | undefined>();

  const fetchItems = useCallback(async (targetPage: number) => {
    try {
      setLoading(true);
      const { data } = await service.list({ page: targetPage });
      setItems(data.data ?? []);
      setPage(data.page ?? targetPage);
      setTotalPages(data.totalPages ?? 1);
      setTotalItems(data.total ?? 0);
    } catch {
      toast.error(`Failed to fetch ${entityName}s`);
    } finally {
      setLoading(false);
    }
  }, [service, entityName]);

  useEffect(() => {
    fetchItems(page);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = useCallback(async (
    values: unknown,
    buildPayload?: (v: unknown) => unknown,
  ) => {
    try {
      setSubmitLoading(true);
      const payload = buildPayload ? buildPayload(values) : values;
      if (selected) {
        await service.update(getId(selected), payload as never);
        toast.success(`${entityName} updated`);
      } else {
        await service.create(payload as never);
        toast.success(`${entityName} created`);
      }
      setModalOpen(false);
      setSelected(undefined);
      await fetchItems(page);
    } catch {
      toast.error(`Failed to save ${entityName}`);
    } finally {
      setSubmitLoading(false);
    }
  }, [selected, service, entityName, getId, fetchItems, page]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await service.remove(getId(deleteTarget));
      toast.success(`${entityName} deleted`);
      await fetchItems(page);
    } catch {
      toast.error(`Failed to delete ${entityName}`);
    } finally {
      setDeleteTarget(undefined);
    }
  }, [deleteTarget, service, entityName, getId, fetchItems, page]);

  const openCreate = useCallback(() => {
    setSelected(undefined);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((item: T) => {
    setSelected(item);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback((open: boolean) => {
    setModalOpen(open);
    if (!open) setSelected(undefined);
  }, []);

  return {
    items,
    loading,
    submitLoading,
    page,
    totalPages,
    totalItems,
    modalOpen,
    selected,
    deleteTarget,
    setPage,
    setDeleteTarget,
    handleSubmit,
    handleDelete,
    openCreate,
    openEdit,
    closeModal,
  };
}