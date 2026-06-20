import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';
import { toast } from 'sonner';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created');
    },
    onError: () => toast.error('Failed to create category'),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated');
    },
    onError: () => toast.error('Failed to update category'),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Category deleted');
    },
    onError: () => toast.error('Failed to delete category'),
  });
}
