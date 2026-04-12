import { redirect } from "next/navigation";

export default function Home() {
  // For demonstration, redirect immediately to a seeded project slug
  // In a real app this would check auth and redirect to the user's default project
  redirect('/default-project')
}
