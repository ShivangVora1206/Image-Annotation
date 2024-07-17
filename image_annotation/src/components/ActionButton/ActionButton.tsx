
type ActionButtonProps = {
    text: string,
    onClick: (e:any) => void,
    buttonState: boolean,
    customBgColor?: string
    customHoverColor?: string
    ref?: any
}
export default function ActionButton(props:ActionButtonProps) {
    return (
        <button ref={props.ref} className={` min-w-[60px] h-[40px] mt-3 mb-3 p-2 mx-1 text-white rounded-lg ${props.customHoverColor ? props.customHoverColor : "hover:bg-violet-700"} font-montserratSemiBold text-sm ${!props.buttonState ? "cursor-not-allowed opacity-60" : ""} ${props.customBgColor ? props.customBgColor : "bg-violet-500"} `}
        onClick={props.onClick} disabled={!props.buttonState}>
                {props.text}
        </button>
    )
}
