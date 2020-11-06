import React, {FC, ReactNode, useEffect, useMemo, useState} from "react";
import { render, unmountComponentAtNode } from 'react-dom'
import Icon from "../Icon/icon";
import classnames from 'classnames'

export type MessageType = "success" | "danger" | "warning" | "primary";

export interface MessageConfig {
    /** 挂载点*/
    mount: HTMLElement;
    /** 动画延迟时间 */
    delay: number;
    /** 结束后回调 */
    callback: any;
    /** 动画持续时间 */
    animationDuring: number;
}

const defaultConfig: MessageConfig = {
    mount: document.body,
    delay: 2000,
    callback: null,
    animationDuring: 300,
};

let wrapper: HTMLElement;
export const createMessage = (type: MessageType) => {
    return (content: ReactNode, config: Partial<MessageConfig> = {}) => {
        const fconfig = {...defaultConfig, ...config}
        if (!wrapper) {
            // 说明是首次挂载，创建message的容器
            wrapper = document.createElement('div')
            wrapper.style.cssText =
                `line-height:1.5;
                 text-align:center;
                 color: #333;
		         box-sizing: border-box;
		         margin: 0;
		         padding: 0;
		         list-style: none;
		         position: fixed;
		         z-index: 100000;
		         width: 20%;
		         top: 16px;
		         left: 50%;
                 transform: translate(-50%, 0);
		         pointer-events: none;`;

            if (wrapper) {
                // 将message容器挂载到body上
                document.body && document.body.appendChild(wrapper)
            }
        }
        // 再创建一个div，通过这个div去挂载message组件，方便销毁DOM（2个方面：1.真实的DOM树上；2.fiber上（避免内存泄露））
        const D = document.createElement('div');
        wrapper.appendChild(D)
        render(<Message fconfig={fconfig} type={type} rootNode={wrapper} parentNode={D} content={content} />, D)
    }
}

export type MessageProps = {
    rootNode: HTMLElement;
    parentNode: Element | DocumentFragment,
    content: ReactNode,
    fconfig: MessageConfig,
    type: MessageType
}

export const Message: FC<MessageProps> = (props) => {
    const { rootNode, parentNode, content, type, fconfig } = props
    const [ isShow, setIsShow ] = useState(false)
    // 卸载DOM
    const unmount = useMemo(() => {
        return () => {
            if (rootNode && parentNode) {
                unmountComponentAtNode(parentNode)
                rootNode.removeChild(parentNode)
            }
        }
    }, [rootNode, parentNode])

    useEffect(() => {
        //结束操作
        let closeStart = fconfig.delay - fconfig.animationDuring;
        // 关闭弹窗
        let timer1 = window.setTimeout(
            () => {
                setIsShow(true);
            },
            closeStart > 0 ? closeStart : 0
        );
        //移除DOM 执行回调
        let timer2 = window.setTimeout(() => {
            setIsShow(false);
            unmount();
            if (fconfig.callback) {
                fconfig.callback();
            }
        }, fconfig.delay);

        return () => {
            window.clearTimeout(timer1);
            window.clearTimeout(timer2);
        };
    }, [unmount, fconfig]);

    // 渲染正确的icon
    const renderIcon = useMemo(() => {
        return (type: MessageType) => {
            switch (type) {
                case "primary":
                    return <Icon theme={type} icon='info-circle' />
                case "warning":
                    return <Icon theme={type} icon='exclamation-triangle' />
                case "danger":
                    return <Icon theme={type} icon='times-circle' />
                case "success":
                    return <Icon theme={type} icon='check-circle' />
                default:
                    return null;
            }
        }
    }, [type])
    const classes = classnames('alex-message-wrapper', {
        'is-show': !isShow
    })
    return (
        <div className={classes}>
            {renderIcon(type)}
            <span className='alex-message-text-wrapper'>{content}</span>
        </div>
    )
}


export default {
    success: createMessage('success'),
    primary: createMessage('primary'),
    warning: createMessage('warning'),
    danger: createMessage('danger')
}
