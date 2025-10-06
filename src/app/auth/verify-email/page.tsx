import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VerifyEmailPageProps = {
  searchParams?: {
    error?: string;
  };
};

const errorMessageMap: Record<string, string> = {
  token_expired: "验证链接已过期，请重新登录并请求新的验证邮件。",
  invalid_token: "验证链接无效，请检查链接是否完整或重新获取验证邮件。",
  user_not_found: "未找到对应的账号，请确认注册邮箱。",
  unauthorized: "请先登录后再尝试验证邮箱。",
};

export default function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const error = searchParams?.error;
  const hasError = Boolean(error);
  const message = hasError
    ? errorMessageMap[error as keyof typeof errorMessageMap] || "邮箱验证失败，请重试。"
    : "邮箱验证成功，您现在可以使用账号登录。";

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-6 px-6 py-12 text-center sm:px-10 lg:px-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {hasError ? "邮箱验证未完成" : "邮箱验证成功"}
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">{message}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link className={cn(buttonVariants({ size: "lg" }))} href="/">
          返回首页
        </Link>
        <Link className={cn(buttonVariants({ variant: "outline", size: "lg" }))} href="#auth">
          前往登录区域
        </Link>
      </div>
    </main>
  );
}
