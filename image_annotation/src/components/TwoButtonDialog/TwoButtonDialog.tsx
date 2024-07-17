
interface TwoButtonDialogProps {
    key: string;
    dialogLabel: string;
    firstOptionLabel: string;
    secondOptionLabel: string;
    onFirstOptionClickedCallback: () => void;
    onSecondOptionClickedCallback: () => void;
    onCancelCallback: () => void;
}

export default function TwoButtonDialog(props:TwoButtonDialogProps) {
    return (
        <>
        <div key={props.key} className="relative z-10 flex flex-col w-[350px] h-[130px] rounded-lg bg-violet-200 font-montserratSemiBold ">
            <div className="absolute font-monsterratBold text-sm cursor-pointer text-violet-500 right-2" onClick={()=>{props.onCancelCallback()}}>X</div>
            <h1 className="text-center text-lg mt-3 font-bold text-violet-500">{props.dialogLabel}</h1>
            <div className="flex justify-center">
                <button className="bg-violet-500 w-[100px] h-[40px] mt-6 p-2 me-3 text-sm text-white rounded-lg hover:bg-violet-700"
                onClick={
                    ()=>{props.onFirstOptionClickedCallback();}
                    }>{props.firstOptionLabel}</button>
                <button className="bg-violet-500 w-[100px] h-[40px] mt-6 p-2 ms-3 text-sm text-white rounded-lg hover:bg-violet-700"
                onClick={
                    ()=>{props.onSecondOptionClickedCallback();}
                }>{props.secondOptionLabel}</button>
            </div>
        </div>
    </>
    )
}
