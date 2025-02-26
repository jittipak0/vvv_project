import { useAuth } from "@/hooks/useAuth";

export function useTutorialTracking(tutorialState: string) {
  const { user } = useAuth();

  if (!user) return false;

  if (user.tutorial && !user.visited_page?.includes(tutorialState)) {
    return true;
  }
  return false;
}
