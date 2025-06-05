import ChatInterface from "@/components/Home/ChatInterface";
import { LoginForm } from "@/components/Home/LoginForm";
import { auth } from "@/server/auth";

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;
  return (
    <main className="w-full h-full flex justify-center items-center" >
      {
        user ? (
          <ChatInterface />
        ) : (
          <LoginForm />
        )
      }
    </main>
  );
}
