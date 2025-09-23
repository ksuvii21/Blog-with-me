// components/EmptyState.jsx
const EmptyState = ({ icon, title, description, action }) => (
  <div style={{ textAlign: 'center', padding: '40px' }}>
    <div style={{ fontSize: '64px', marginBottom: '20px' }}>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    {action && <button onClick={action.onClick}>{action.label}</button>}
  </div>
);