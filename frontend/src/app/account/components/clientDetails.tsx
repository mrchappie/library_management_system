async function ClientDetails({ clientId }: { clientId: number }) {
  const res = await fetch(`http://localhost:3001/api/clients/${clientId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const [user] = await res.json();

  return (
    <div className="border p-2 flex flex-col justify-center items-center gap-4 max-w-[250px]">
      <h3>User Information</h3>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
}

export default ClientDetails;
