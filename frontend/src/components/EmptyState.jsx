const EmptyState = ({ message, actionText, actionLink }) => (
  <div className="text-center py-10">
    <div className="text-6xl mb-4">📝</div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Content</h3>
    <p className="text-gray-500 mb-4">{message}</p>
    {actionText && actionLink && (
      <a
        href={actionLink}
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        {actionText}
      </a>
    )}
  </div>
);

export default EmptyState;
