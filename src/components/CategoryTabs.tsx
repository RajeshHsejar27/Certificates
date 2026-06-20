import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminStore } from '@/stores/adminStore';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import type { Category } from '@/types';

interface CategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryTabs({ selectedCategory, onSelectCategory }: CategoryTabsProps) {
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const { data: categories } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    createMutation.mutate(newName.trim(), { onSuccess: () => { setAdding(false); setNewName(''); } });
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    updateMutation.mutate({ id, name: editName.trim() }, { onSuccess: () => setEditingId(null) });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this category and all its certificates?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Tabs value={selectedCategory} onValueChange={onSelectCategory} className="w-auto">
          <TabsList className="h-9 bg-transparent p-0 gap-1">
            <TabsTrigger value="all" className="rounded-full px-4 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All
            </TabsTrigger>
            {categories?.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="relative rounded-full px-4 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {editingId === cat.id ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-6 w-24 text-xs"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(cat.id)}
                    />
                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => handleSaveEdit(cat.id)}>
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => setEditingId(null)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="flex items-center gap-1">
                    {cat.name}
                    {isAdmin && selectedCategory === cat.id && (
                      <span className="ml-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-4 w-4 p-0" onClick={(e) => { e.stopPropagation(); handleEdit(cat); }}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-4 w-4 p-0 text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </span>
                    )}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isAdmin && (
          <>
            {adding ? (
              <div className="flex items-center gap-1">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Category name"
                  className="h-8 w-32 text-xs"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleAdd}>
                  <Check className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setAdding(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs" onClick={() => setAdding(true)}>
                <Plus className="h-3 w-3" /> Category
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
