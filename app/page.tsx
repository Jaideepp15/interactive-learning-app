// app/page.tsx
import { div } from "framer-motion/client";
import Login from "./Login";

export default function Page() {
  return (
  <div className="flex">
    <div className="h-screen w-1/2 bg-purple-100 flex items-center justify-center">
  <img src="/login.jpg" alt="Login" className="w-1/2 h-auto object-contain" />
</div>


    <div className="flex items-center justify-center w-1/2">
      <Login />

    </div>

  </div>
  
  );
}
