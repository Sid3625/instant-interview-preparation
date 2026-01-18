import { useNavigate } from "react-router-dom";
import { QuizSelectionPage } from "./QuizSelectionPage";

export default function QuizApp() {
  const navigate = useNavigate();

  const handleQuizSelection = (id: string) => {
    const routeMap: Record<string, string> = {
      "guess-output": "/guess-output",
      "mcq-quiz": "/mcq",
      "code-debug": "/debug",
      "react-hooks": "/react-hooks",
      "async-js": "/async-js",
      "algorithms": "/algorithms",
    };

    const route = routeMap[id];
    if (route) {
      navigate(route);
    } else {
      alert(`${id} quiz template coming soon!`);
    }
  };

  return <QuizSelectionPage onSelectQuiz={handleQuizSelection} />;
}
