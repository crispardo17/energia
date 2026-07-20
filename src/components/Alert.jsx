import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

export default function Alert({ type, message, onClose }) {
  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-400",
      text: "text-green-800",
      icon: CheckCircle,
      iconColor: "text-green-400",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-400",
      text: "text-red-800",
      icon: XCircle,
      iconColor: "text-red-400",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-400",
      text: "text-blue-800",
      icon: Info,
      iconColor: "text-blue-400",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-400",
      text: "text-yellow-800",
      icon: AlertCircle,
      iconColor: "text-yellow-400",
    },
  };

  const style = styles[type] || styles.info;
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} border ${style.border} ${style.text} px-4 py-3 rounded-lg relative mb-4`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <span className="block sm:inline text-sm">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
