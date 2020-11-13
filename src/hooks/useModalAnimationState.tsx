import { useMemo, useState } from 'react';

export function useModalAnimationState (
    parentSetState: (v: boolean) => void,
    delay: number
) : [ boolean, (v: boolean) => void, () => void ] {
    // 内部state控制 Modal组件显示隐藏的动画
    const [ state, setState ] = useState(true)

    const [ innerClose, unmount ] = useMemo(() => {
        let timer: number;
        const innerClose = (v: boolean) => {
            // 先控制显示隐藏的动画
            setState(v);
            timer = window.setTimeout(() => {
                // 延迟后卸载Modal
                parentSetState(v)
                // 重置Modal自身state控制下次显示动画
                setState(true)
            }, delay)
        }
        // 卸载DOM后 清除延迟器
        const unmount = () => window.clearTimeout(timer)

        return [ innerClose, unmount ]
    }, [parentSetState, delay, setState])

    return [ state, innerClose, unmount]
}
