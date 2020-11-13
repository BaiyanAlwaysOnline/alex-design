import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import Progress from "./progress";

const ProgressComp = () => {
  const [percent, setPercent] = useState(10);
  useEffect(() => {
    let timer: number;
    timer = window.setInterval(() => {
      setPercent((preState) => {
        if (preState >= 100) return 100;
        return preState + 10;
      });
    }, 500);
    return () => {
      clearInterval(timer)
    };
  }, []);
  return (
    <>
      <Progress percent={percent} />
      <Progress percent={percent} theme='danger'  styles={{marginTop: '50px'}} />
      <Progress strokeHeight={20} percent={percent} showText={false} theme='info'  styles={{marginTop: '50px'}} />
    </>
  );
};

storiesOf("Progress 进度条", module)
  .addParameters({
    info: {
      text: `
    ~~~js
    import Progress from "alex-design";
    ~~~
  `,
    },
  })
  .add("进度条", ProgressComp);
