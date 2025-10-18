"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card } from "@/shared";
import { useCryptoNew } from "../hooks";
import { NewCryptoFormSchema, NewCryptoFormData } from "../types";
import { useState } from "react";
import BackButton from "@/shared/components/BackButton";

interface NewCryptoFormProps {
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

const NewCryptoForm = ({ onSuccess, onCancel }: NewCryptoFormProps) => {
  const { createCrypto, loading, error } = useCryptoNew();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewCryptoFormData>({
    resolver: zodResolver(NewCryptoFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      image: "",
      description: "",
      website: "",
      twitter: "",
      github: "",
    },
  });

  const onSubmit = async (data: NewCryptoFormData) => {
    setSubmitError(null);

    // Clean up empty strings
    const cleanedData = {
      ...data,
      image: data.image || undefined,
      website: data.website || undefined,
      twitter: data.twitter || undefined,
      github: data.github || undefined,
    };

    const response = await createCrypto(cleanedData);

    if (response.success) {
      reset();
      onSuccess?.(response.data);
    } else {
      setSubmitError(response.error || "Failed to create cryptocurrency");
    }
  };

  return (
    <Card className="relative">
      <div className="absolute top-0 left-0">
        <BackButton />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">افزودن رمز ارز جدید</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              نام *
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Bitcoin"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Symbol Field */}
          <div>
            <label
              htmlFor="symbol"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              نماد *
            </label>
            <input
              {...register("symbol")}
              type="text"
              id="symbol"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., BTC"
            />
            {errors.symbol && (
              <p className="mt-1 text-sm text-red-600">
                {errors.symbol.message}
              </p>
            )}
          </div>

          {/* Image URL Field */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              آدرس تصویر *
            </label>
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              توضیحات *
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="توضیحات کوتاه در مورد رمز ارز"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Website Field */}
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              وبسایت *
            </label>
            <input
              {...register("website")}
              type="url"
              id="website"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">
                {errors.website.message}
              </p>
            )}
          </div>

          {/* Twitter Field */}
          <div>
            <label
              htmlFor="twitter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              توییتر *
            </label>
            <input
              {...register("twitter")}
              type="url"
              id="twitter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://twitter.com/example"
            />
            {errors.twitter && (
              <p className="mt-1 text-sm text-red-600">
                {errors.twitter.message}
              </p>
            )}
          </div>

          {/* GitHub Field */}
          <div>
            <label
              htmlFor="github"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              گیت‌هاب *
            </label>
            <input
              {...register("github")}
              type="url"
              id="github"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://github.com/example"
            />
            {errors.github && (
              <p className="mt-1 text-sm text-red-600">
                {errors.github.message}
              </p>
            )}
          </div>

          {/* Error Display */}
          {(error || submitError) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{submitError || error}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              size="small"
              variant="primary"
              disabled={loading}
              className="flex-1 px-4 py-2"
            >
              {loading ? "در حال ایجاد..." : "ایجاد رمز ارز"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                size="small"
                className="flex-1"
              >
                انصراف
              </Button>
            )}
          </div>
        </form>
      </div>
    </Card>
  );
};

export default NewCryptoForm;
