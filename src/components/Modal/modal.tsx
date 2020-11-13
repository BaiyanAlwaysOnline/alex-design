import React, { FC, ReactNode, useMemo } from 'react';
import { useModalAnimationState } from '../../hooks/useModalAnimationState';
import { useStopScroll } from '../../hooks/useModalStopScroll'
import { createPortal } from 'react-dom';
import Button from "../Button/button";
import classnames from 'classnames';

interface baseProps {
    /** 控制Modal显示隐藏 */
    visible: boolean,
    /** 维持visible */
    parentSetState: (v: boolean) => void;
    /** 标题 */
    title?: ReactNode
    /** 是否有确认按钮 */
    confirm?: boolean;
    /** 改变确认按钮文本*/
    okText?: string;
    /** 改变取消按钮文本*/
    cancelText?: string;
    /** 点了确认的回调，如果传了，需要自行处理关闭 */
    onOk?: (fn:(v: boolean) => void) => void;
    /** 点了取消的回调，如果传了，需要自行处理关闭*/
    onCancel?: (fn:(v: boolean) => void) => void;
    /** 点击mask是否关闭模态框 */
    maskClose?: boolean;
    /** 是否有mask */
    mask?: boolean;
    /** 是否停止滚动*/
    stopScroll?: boolean;
}

export type ModalPropsType = baseProps

export const Modal:FC<ModalPropsType> = (props) => {
    const { visible, parentSetState, title, confirm, okText, cancelText, onCancel, onOk, mask, maskClose, stopScroll } = props;
    const [ state, setState, unmount ] = useModalAnimationState(parentSetState, 300)
    useStopScroll(visible, 300, stopScroll);
    const render = useMemo(() => {
        const mount = document.body;
        const classes = classnames('alex-modal-viewport', {
            "is-hide": !state
        })
        if(visible) {
            return createPortal(
                <div className="alex-modal-wrapper">
                    <div className={classes}>
                        {title && <div className="alex-modal-head">
                            <div className="alex-modal-title">
                                {title}
                            </div>
                        </div>}
                        <div className="alex-modal-close" onClick={() => setState(false)}>
                            <svg width='12' height='12' fill='currentColor'>
                                <line x1='0' y1='0' x2='12' y2='12' strokeWidth='2' stroke='#666' />
                                <line x1='0' y1='12' x2='12' y2='0' strokeWidth='2' stroke='#666' />
                            </svg>
                        </div>
                        <div className="alex-modal-content">
                            {props.children}
                        </div>
                        {confirm && <div className="alex-modal-foot">
                            <Button
                                style={{marginRight: '10px'}}
                                onClick={() => {
                                    onCancel ? onCancel(setState) : setState(false)
                                }}
                            >
                                {cancelText ? cancelText : '取消'}
                            </Button>
                            <Button
                                btnType={"primary"}
                                onClick={() => {
                                    onOk ? onOk(setState) : setState(false)
                                }}
                            >
                                {okText ? okText : '确认'}
                            </Button>
                        </div>}
                    </div>
                    { mask && <div className="alex-modal-mask" onClick={() => {
                        maskClose && setState(false)
                    }} /> }
                </div>
                , mount)
        }else {
            unmount()
            return null
        }
    }, [visible, state, unmount, setState, props.children, title, confirm, okText, cancelText, onCancel, onOk, mask, maskClose])
    return <>{render}</>
}

Modal.defaultProps = {
    confirm: true,
    mask: true,
    maskClose: true,
    stopScroll: true
}

export default Modal
