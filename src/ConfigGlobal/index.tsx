
import toast from "react-hot-toast";
import Notify from "../components/Notify";

export const routes = {
  afterAuthSuccess: '/devices',
  afterAuthFailure: '/sign',
}

export const notify = ({ title = "", body = "" }) =>
  toast.custom((t) => <Notify title={title} body={body} state={t} />, {
    duration: 5000,
  });
