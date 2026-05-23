/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CourierSettings } from "@/types/courierSettings";
import { useUpdateCourierSettingsMutation } from "@/redux/features/courierSettings/courierSettingsApi";

interface UpdateCourierSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings?: CourierSettings | null;
  onSuccess?: () => void;
}

export function UpdateCourierSettingsModal({
  open,
  onOpenChange,
  settings,
  onSuccess,
}: UpdateCourierSettingsModalProps) {
  const [updateCourierSettings, { isLoading }] =
    useUpdateCourierSettingsMutation();

  const [formData, setFormData] = useState({
    displayName: "",
    isSandbox: false,
    isActive: true,
    webhookUrl: "",
    notes: "",
    pickupInfo: {
      name: "",
      phone: "",
      address: "",
      area: "",
      city: "",
    },
    configFields: [] as Array<{ key: string; value: string }>,
  });

  useEffect(() => {
    if (settings) {
      const configFields = Object.entries(settings.config).map(
        ([key, value]) => ({
          key,
          value,
        }),
      );

      setTimeout(() => {
        setFormData({
          displayName: settings.displayName,
          isSandbox: settings.isSandbox,
          isActive: settings.isActive,
          webhookUrl: settings.webhookUrl || "",
          notes: settings.notes || "",
          pickupInfo: {
            name: settings.pickupInfo?.name || "",
            phone: settings.pickupInfo?.phone || "",
            address: settings.pickupInfo?.address || "",
            area: settings.pickupInfo?.area || "",
            city: settings.pickupInfo?.city || "",
          },
          configFields,
        });
      }, 100);
    }
  }, [settings, open]);

  const handleAddConfig = () => {
    setFormData((prev) => ({
      ...prev,
      configFields: [...prev.configFields, { key: "", value: "" }],
    }));
  };

  const handleRemoveConfig = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      configFields: prev.configFields.filter((_, i) => i !== index),
    }));
  };

  const handleConfigChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      configFields: prev.configFields.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handlePickupInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      pickupInfo: {
        ...prev.pickupInfo,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!settings) return;

    if (formData.configFields.some((f) => !f.key || !f.value)) {
      toast.error("All config fields must have key and value");
      return;
    }

    try {
      const config: Record<string, string> = {};
      formData.configFields.forEach((field) => {
        config[field.key] = field.value;
      });

      await updateCourierSettings({
        id: settings._id,
        data: {
          displayName: formData.displayName,
          config,
          isSandbox: formData.isSandbox,
          isActive: formData.isActive,
          webhookUrl: formData.webhookUrl,
          notes: formData.notes,
          pickupInfo: {
            name: formData.pickupInfo.name,
            phone: formData.pickupInfo.phone,
            address: formData.pickupInfo.address,
            area: formData.pickupInfo.area,
            city: formData.pickupInfo.city,
          },
        },
      }).unwrap();

      toast.success("Courier settings updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update courier settings");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit Courier Settings
          </DialogTitle>
          <DialogDescription>{settings?.displayName}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="border-0 bg-linear-to-br from-amber-50/50 to-orange-50/30 p-4 dark:from-amber-950/20 dark:to-orange-950/20">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="e.g., Steadfast BD"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        displayName: e.target.value,
                      }))
                    }
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    placeholder="https://example.com/webhook"
                    value={formData.webhookUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        webhookUrl: e.target.value,
                      }))
                    }
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about this courier..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="rounded-lg"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: Boolean(checked),
                        }))
                      }
                    />
                    <Label
                      htmlFor="isActive"
                      className="font-normal cursor-pointer"
                    >
                      Active
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isSandbox"
                      checked={formData.isSandbox}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isSandbox: Boolean(checked),
                        }))
                      }
                    />
                    <Label
                      htmlFor="isSandbox"
                      className="font-normal cursor-pointer"
                    >
                      Sandbox Mode
                    </Label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pickup Information */}
            <Card className="border-0 bg-linear-to-br from-blue-50/50 to-cyan-50/30 p-4 dark:from-blue-950/20 dark:to-cyan-950/20">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Pickup Information
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pickupName">Contact Name</Label>
                    <Input
                      id="pickupName"
                      placeholder="John Doe"
                      value={formData.pickupInfo.name}
                      onChange={(e) =>
                        handlePickupInfoChange("name", e.target.value)
                      }
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickupPhone">Phone</Label>
                    <Input
                      id="pickupPhone"
                      placeholder="+880 123 456 7890"
                      value={formData.pickupInfo.phone}
                      onChange={(e) =>
                        handlePickupInfoChange("phone", e.target.value)
                      }
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickupAddress">Address</Label>
                    <Input
                      id="pickupAddress"
                      placeholder="123 Main Street"
                      value={formData.pickupInfo.address}
                      onChange={(e) =>
                        handlePickupInfoChange("address", e.target.value)
                      }
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickupArea">Area</Label>
                    <Input
                      id="pickupArea"
                      placeholder="Mirpur"
                      value={formData.pickupInfo.area}
                      onChange={(e) =>
                        handlePickupInfoChange("area", e.target.value)
                      }
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="pickupCity">City</Label>
                    <Input
                      id="pickupCity"
                      placeholder="Dhaka"
                      value={formData.pickupInfo.city}
                      onChange={(e) =>
                        handlePickupInfoChange("city", e.target.value)
                      }
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Configuration */}
            <Card className="border-0 bg-linear-to-br from-emerald-50/50 to-teal-50/30 p-4 dark:from-emerald-950/20 dark:to-teal-950/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Configuration
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddConfig}
                    className="gap-2 rounded-lg border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950/30"
                  >
                    <Plus className="h-4 w-4" />
                    Add Config
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.configFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex gap-2 rounded-lg bg-white/50 p-3 dark:bg-gray-800/30"
                    >
                      <Input
                        placeholder="Key"
                        value={field.key}
                        onChange={(e) =>
                          handleConfigChange(index, "key", e.target.value)
                        }
                        className="rounded-lg"
                      />
                      <Input
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) =>
                          handleConfigChange(index, "value", e.target.value)
                        }
                        className="rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveConfig(index)}
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Settings"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
