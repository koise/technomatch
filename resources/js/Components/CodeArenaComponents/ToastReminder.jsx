import { useEffect, useState } from "react";
import '../../../scss/Components/CodeArena/ToastReminder.scss';

const ToastReminder = ({ minutesLeft }) => {
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (minutesLeft === 9) {
      setMessage("⏰ 10 minutes left! Stay sharp!");
      setShowToast(true);
    } else if (minutesLeft === 4) {
      setMessage("🔥 5 minutes left! Wrap it up!");
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [minutesLeft]);

  if (!showToast) return null;

  return (
    <div className="toast-reminder">
      <p>{message}</p>
    </div>
  );
};

export default ToastReminder;
