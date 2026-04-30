export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center">
        <Icon className="w-9 h-9 text-slate-600" />
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        {description && (
          <p className="text-slate-400 mt-1 text-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
