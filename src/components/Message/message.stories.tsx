import React from "react";
import { storiesOf } from "@storybook/react";
import Button from "../Button/button";
import message from './message'
import {action} from "@storybook/addon-actions";

storiesOf("Message 消息提示", module)
    .addParameters({
        info: {
            text: `
    ~~~js
    import message from "alex-design";
    
    // 可以通过函数式调用组件：
    message.primary('primary！', { delay:5000, callback: () => {alert('回调执行！')} })
    message.success('成功！')
    message.info('警告！')
    message.danger('失败！')
    ~~~
  `,
        },
    })
    .add("默认 message", () => (
        <>
            <Button style={{ marginRight: 30 }} onClick={() => {
                action("clicked")
                message.primary('primary！延迟5s', { delay:5000, callback: () => {alert('回调执行！')} })
            }}>
                primary！延迟5s
            </Button>
            <Button style={{ marginRight: 30 }} onClick={() => {
                message.success('成功！默认2s')
            }}>
                成功! 默认2s
            </Button>
            <Button style={{ marginRight: 30 }} onClick={() => {
                message.warning('警告！')
            }}>
                警告
            </Button>
            <Button style={{ marginRight: 30 }} onClick={() => {
                message.danger('失败！')
            }}>
                失败
            </Button>
        </>
    ))

