// src/pages/Notifications.jsx
const Notifications = () => {
  const notifications = [
    "Resume review completed for Alice",
    "New company visit scheduled",
    "Placement result published",
  ];

  return (
    <div className="pt-[80px] p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul className="list-disc list-inside space-y-2">
        {notifications.map((n, i) => (
          <li key={i} className="p-2 bg-blue-50 rounded shadow">{n}</li>
        ))}
      </ul>
    </div>
  );
};
export default Notifications;
