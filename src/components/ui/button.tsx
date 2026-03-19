import { cn } from "@/lib/utils"
export function Button({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50", className)} {...props}>{children}</button>
}
