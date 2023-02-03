import Script from "next/script";
import { useEffect } from "react";
import AppPage from "../components/AppPage";

declare global {
  interface Window {
    formbricks: any;
  }
}

export default function FeedbackWidget() {
  useEffect(() => {
    window.formbricks = {
      config: {
        hqUrl: "http://localhost:3000",
        formId: "cldohpx4t000019vijzlf8mgn",
        contact: {
          name: "Matti Nannt",
          position: "Founder",
          imgUrl: "https://avatars.githubusercontent.com/u/675065?s=128&v=4",
        },
        customer: {
          name: "Formbricks",
          email: "johannes@formbricks.com",
        },
      },
    };
  }, []);
  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@formbricks/feedback@0.2.1/dist/index.umd.js" defer />
      <>
        <AppPage onClickFeedback={(event) => window.formbricks.open(event)} />
      </>
    </>
  );
}
