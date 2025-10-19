"use client";
import { Button, Card, NewCryptoFormSchema } from "@/shared";
import BackButton from "@/shared/components/BackButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCryptoNew } from "../hooks";
import type { NewCryptoFormData, NewCryptoFormProps } from "../types";

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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          role="form"
          aria-label="Add new cryptocurrency form"
        >
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              نام <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Bitcoin"
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Symbol Field */}
          <div>
            <label
              htmlFor="symbol"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              نماد <span className="text-red-500">*</span>
            </label>
            <input
              {...register("symbol")}
              type="text"
              id="symbol"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., BTC"
              aria-describedby={errors.symbol ? "symbol-error" : undefined}
              aria-invalid={!!errors.symbol}
            />
            {errors.symbol && (
              <p
                id="symbol-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
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
              آدرس تصویر
            </label>
            <input
              {...register("image")}
              type="url"
              id="image"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com/bitcoin.png"
              aria-describedby={errors.image ? "image-error" : undefined}
              aria-invalid={!!errors.image}
            />
            {errors.image && (
              <p
                id="image-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              توضیحات
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="توضیحات کوتاه در مورد رمز ارز"
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p
                id="description-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
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
              وبسایت
            </label>
            <input
              {...register("website")}
              type="url"
              id="website"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com"
              aria-describedby={errors.website ? "website-error" : undefined}
              aria-invalid={!!errors.website}
            />
            {errors.website && (
              <p
                id="website-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
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
              توییت
            </label>
            <input
              {...register("twitter")}
              type="url"
              id="twitter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://twitter.com/example"
              aria-describedby={errors.twitter ? "twitter-error" : undefined}
              aria-invalid={!!errors.twitter}
            />
            {errors.twitter && (
              <p
                id="twitter-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
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
              گیت‌هاب
            </label>
            <input
              {...register("github")}
              type="url"
              id="github"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://github.com/example"
              aria-describedby={errors.github ? "github-error" : undefined}
              aria-invalid={!!errors.github}
            />
            {errors.github && (
              <p
                id="github-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.github.message}
              </p>
            )}
          </div>

          {/* Error Display */}
          {(error || submitError) && (
            <div
              className="p-4 bg-red-50 border border-red-200 rounded-md"
              role="alert"
              aria-live="assertive"
            >
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
              aria-label={
                loading
                  ? "Creating cryptocurrency, please wait"
                  : "Create new cryptocurrency"
              }
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
