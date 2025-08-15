"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle, CircleXIcon, } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        
        return (
          <Toast key={id} {...props} className={`${variant == "default" ? "bg-green-200" : "bg-red-500 border-red-700"}`}>
            
            <div className="grid gap-1">
              {title && <ToastTitle className={`flex flex-center gap-2 text-lg font-sans ${variant == "default" ? "text-green-700" : "text-white"}`}>{variant == "default" ? <CheckCircle /> :  <CircleXIcon />}{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
