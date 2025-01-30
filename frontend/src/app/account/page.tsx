import { cookies } from 'next/headers';
import ClientBooks from './components/clientBooks';
import ClientDetails from './components/clientDetails';

async function Account({ clientId }: { clientId: number }) {
  const cookieStore = await cookies();
  const clientIdCookie = cookieStore.get('client_id')
    ?.value as unknown as number;
  const accessToken = cookieStore.get('accessToken');
  return (
    <div className="flex flex-col gap-4">
      {/* <ClientDetails clientId={clientIdCookie} /> */}
      {/* <ClientBooks accessToken={accessToken?.value as string} /> */}
    </div>
  );
}

export default Account;
