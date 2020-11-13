import React, {useState} from "react";
import { storiesOf } from "@storybook/react";
import Modal from "./modal";
import Button from "../Button/button";
import Input from "../Input/input";
import {action} from "@storybook/addon-actions";


storiesOf("Modal 弹窗", module)
  .addParameters({
    info: {
      text: `
    ~~~js
    import Modal from "alex-design";
    ~~~
  `,
    },
  })
  .add("弹窗", () => {
      const [visible, setVisible] = useState(false)
      const handleToggle = () => {
          setVisible(true)
      }
      return (
          <>
              <Button onClick={handleToggle}>展示弹窗</Button>
              <Modal
                  visible={visible}
                  parentSetState={setVisible}
                  title='确认拒绝吗？'
                  onOk={action('confirm')}
              >
                  <div>理由：</div>
                  <Input onChange={action('changeValue')} />
              </Modal>
          </>
      )
  });
