import {useRef} from 'react';

function LabelPopupDialog(props: any) {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <>
            <div className="absolute z-10 flex flex-col w-[350px] h-[180px] rounded-lg bg-violet-200 font-montserratSemiBold ">
                <h1 className="text-center text-lg mt-3 font-bold text-violet-500">Label your annotation</h1>
                <div className="flex justify-center">
                    <input ref={inputRef} id="label-input" type="text" className="w-[300px] h-[40px] mt-4 p-2 outline-none caret-violet-500 bg-white rounded-lg shadow-none hover:shadow-lg duration-200" />
                </div>
                <div className="flex justify-center">
                    <button className="bg-violet-500 w-[100px] h-[40px] mt-6 p-2 me-3 text-sm text-white rounded-lg hover:bg-violet-700"
                    onClick={
                        ()=>{
                            props.onDialogClosedCallback(props.selectedAnnotation, inputRef.current?.value);
                            props.setShowDialog(false);
                        }
                        }>Label</button>
                    <button className="bg-violet-500 w-[100px] h-[40px] mt-6 p-2 ms-3 text-sm text-white rounded-lg hover:bg-violet-700"
                    onClick={
                        ()=>{props.setShowDialog(false);}
                    }>Cancel</button>
                </div>
            </div>
        </>
    )
}

export default LabelPopupDialog