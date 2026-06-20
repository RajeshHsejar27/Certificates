import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  moveCertificateToCategory,
} from '@/lib/api';
import { deleteFile } from '@/lib/storage';
import type { CertificateFormData } from '@/types';
import { toast } from 'sonner';

export function useCertificates() {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: getCertificates,
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate uploaded');
    },
    onError: () => toast.error('Failed to upload certificate'),
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CertificateFormData> }) =>
      updateCertificate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate updated');
    },
    onError: () => toast.error('Failed to update certificate'),
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (certificate: { id: string; file_url: string }) => {
      await deleteFile(certificate.file_url);
      await deleteCertificate(certificate.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate deleted');
    },
    onError: () => toast.error('Failed to delete certificate'),
  });
}

export function useMoveCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, categoryId }: { id: string; categoryId: string }) =>
      moveCertificateToCategory(id, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
    onError: () => toast.error('Failed to move certificate'),
  });
}
