import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Loader2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateCertificate, useUpdateCertificate } from '@/hooks/useCertificates';
import { useCategories } from '@/hooks/useCategories';
import { uploadFile, getFileType, isValidFile, isValidFileSize } from '@/lib/storage';
import { PDFThumbnail } from './PDFThumbnail';
import type { Certificate } from '@/types';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  description: z.string().optional(),
  issue_date: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  file_type: z.enum(['pdf', 'image']),
  file_url: z.string().min(1, 'File is required'),
  external_url: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CertificateUploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate?: Certificate | null;
}

export function CertificateUploadForm({ open, onOpenChange, certificate }: CertificateUploadFormProps) {
  const { data: categories } = useCategories();
  const createMutation = useCreateCertificate();
  const updateMutation = useUpdateCertificate();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isEditing = !!certificate;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      issuer: '',
      description: '',
      issue_date: '',
      category_id: '',
      file_type: 'image',
      file_url: '',
      external_url: '',
    },
  });

  const fileUrl = watch('file_url');

  useEffect(() => {
    if (certificate) {
      setValue('title', certificate.title);
      setValue('issuer', certificate.issuer);
      setValue('description', certificate.description || '');
      setValue('issue_date', certificate.issue_date || '');
      setValue('category_id', certificate.category_id);
      setValue('file_type', certificate.file_type);
      setValue('file_url', certificate.file_url);
      setValue('external_url', certificate.external_url || '');
      setPreview(certificate.file_url);
    } else {
      reset();
      setPreview(null);
    }
  }, [certificate, setValue, reset, open]);

  const handleFileSelect = async (file: File) => {
    if (!isValidFile(file)) {
      toast.error('Invalid file type. Only PDF, PNG, JPG, JPEG, WEBP allowed.');
      return;
    }
    if (!isValidFileSize(file)) {
      toast.error('File too large. Max 10MB.');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFile(file);
      const ftype = getFileType(file);
      setValue('file_url', url, { shouldValidate: true });
      setValue('file_type', ftype, { shouldValidate: true });
      setPreview(url);
      toast.success('File uploaded successfully');
    } catch (err: any) {
      const msg = err?.message || err?.error?.message || 'Upload failed';
      toast.error(`Upload failed: ${msg}`);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const onSubmit = async (data: FormData) => {
    if (isEditing && certificate) {
      updateMutation.mutate(
        { id: certificate.id, data },
        {
          onSuccess: () => {
            reset();
            setPreview(null);
            onOpenChange(false);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          reset();
          setPreview(null);
          onOpenChange(false);
        },
      });
    }
  };

  const handleClose = () => {
    reset();
    setPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Certificate' : 'Upload Certificate'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer">Issuer</Label>
            <Input id="issuer" {...register('issuer')} placeholder="e.g. Google, AWS, Microsoft" />
            {errors.issuer && <p className="text-xs text-destructive">{errors.issuer.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(v) => setValue('category_id', v, { shouldValidate: true })}
              value={watch('category_id')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('category_id')} />
            {errors.category_id && <p className="text-xs text-destructive">{errors.category_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input id="issue_date" type="date" {...register('issue_date')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file_type">File Type</Label>
              <Select
                onValueChange={(v: 'pdf' | 'image') => setValue('file_type', v, { shouldValidate: true })}
                value={watch('file_type')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('file_type')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={2} placeholder="Optional description..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="external_url">Certificate URL</Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="external_url"
                {...register('external_url')}
                placeholder="https://coursera.org/verify/..."
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">Optional link to verify or view the certificate online</p>
          </div>

          <div className="space-y-2">
            <Label>File Upload</Label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer rounded-lg border-2 border-dashed border-border p-4 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              {uploading ? (
                <div className="space-y-2 py-4">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : preview ? (
                <div className="relative mx-auto" style={{ maxWidth: '320px' }}>
                  <div className="relative w-full overflow-hidden rounded-md border bg-muted/50">
                    {preview.toLowerCase().endsWith('.pdf') ? (
                      <div className="h-48">
                        <PDFThumbnail url={preview} width={320} />
                      </div>
                    ) : (
                      <img
                        src={preview}
                        alt="preview"
                        className="mx-auto h-48 w-full object-contain"
                      />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full shadow-sm"
                    onClick={(e) => { e.stopPropagation(); setPreview(null); setValue('file_url', '', { shouldValidate: true }); }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drop file or click to browse</p>
                  <p className="text-xs text-muted-foreground">PDF, PNG, JPG, WEBP up to 10MB</p>
                </div>
              )}
            </div>
            {errors.file_url && <p className="text-xs text-destructive">{errors.file_url.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending || (!preview && !fileUrl)}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : isEditing
                  ? 'Update'
                  : 'Upload'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
