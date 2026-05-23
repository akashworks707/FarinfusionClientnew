'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { CourierSettings } from '@/types/courierSettings';
import { format } from 'date-fns';

interface CourierSettingsTableProps {
  data: CourierSettings[];
  isLoading?: boolean;
  onEdit?: (settings: CourierSettings) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onView?: (settings: CourierSettings) => void;
}

export function CourierSettingsTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
}: CourierSettingsTableProps) {
  const handleCopyConfig = (config: Record<string, string>) => {
    const configStr = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(configStr);
    toast.success('Configuration copied to clipboard');
  };

  return (
    <ScrollArea className="w-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200 bg-linear-to-r from-amber-50/50 to-orange-50/50 dark:border-gray-800 dark:from-amber-950/20 dark:to-orange-950/20 hover:bg-transparent">
            <TableHead className="font-semibold text-amber-900 dark:text-amber-100">
              Provider
            </TableHead>
            <TableHead className="font-semibold text-amber-900 dark:text-amber-100">
              Display Name
            </TableHead>
            <TableHead className="font-semibold text-amber-900 dark:text-amber-100">
              Status
            </TableHead>
            <TableHead className="font-semibold text-amber-900 dark:text-amber-100">
              Sandbox
            </TableHead>
            <TableHead className="font-semibold text-amber-900 dark:text-amber-100">
              Pickup Info
            </TableHead>
            <TableHead className="font-semibold text-amber-900 dark:text-amber-100">
              Updated
            </TableHead>
            <TableHead className="text-right font-semibold text-amber-900 dark:text-amber-100">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell colSpan={7} className="h-12 bg-gray-100 dark:bg-gray-800" />
                </TableRow>
              ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No courier settings found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((setting) => (
              <TableRow
                key={setting._id}
                className="border-b border-gray-200 transition-colors hover:bg-amber-50/30 dark:border-gray-800 dark:hover:bg-amber-950/20"
              >
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                  <Badge
                    variant="outline"
                    className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
                  >
                    {setting.provider}
                  </Badge>
                </TableCell>

                <TableCell className="text-gray-700 dark:text-gray-300">
                  {setting.displayName}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={setting.isActive ? 'default' : 'secondary'}
                    className={
                      setting.isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }
                  >
                    {setting.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>

                <TableCell>
                  {setting.isSandbox ? (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-100">
                      Sandbox
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400">
                      Live
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                  {setting.pickupInfo?.name ? (
                    <span>{setting.pickupInfo.name}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>

                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(setting.updatedAt), 'MMM dd, yyyy')}
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/30"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="rounded-xl">
                      {onView && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onView(setting)}
                            className="gap-2 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}

                      {onEdit && (
                        <DropdownMenuItem
                          onClick={() => onEdit(setting)}
                          className="gap-2 cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={() => handleCopyConfig(setting.config)}
                        className="gap-2 cursor-pointer"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Config
                      </DropdownMenuItem>

                      {onToggleStatus && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onToggleStatus(setting._id)}
                            className="gap-2 cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4" />
                            {setting.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                        </>
                      )}

                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(setting._id)}
                            className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600 dark:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ScrollBar orientation="horizontal" className="rounded-full" />
    </ScrollArea>
  );
}
