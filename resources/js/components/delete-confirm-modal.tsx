import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
    processing?: boolean;
}

export function DeleteConfirmModal({
    open,
    onOpenChange,
    onConfirm,
    title = 'Delete Item',
    description,
    itemName,
    processing = false,
}: DeleteConfirmModalProps) {
    const defaultDescription = itemName
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : 'Are you sure you want to delete this item? This action cannot be undone.';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription className="mt-1">
                                {description || defaultDescription}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="rounded-lg border border-red-100 bg-red-50 p-3 dark:border-red-200/10 dark:bg-red-700/10">
                    <p className="text-sm text-red-600 dark:text-red-100">
                        <span className="font-medium">Warning:</span> This action is permanent and cannot be reversed.
                    </p>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={processing}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={processing}
                    >
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
