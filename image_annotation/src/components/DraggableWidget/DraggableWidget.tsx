
export interface widget {
    key: string;
    title: string;
    value: string;

}

export default function DraggableWidget(props:widget) {
	return (
	
		<div
			key={props.key}
            id={props.key}
            // draggable={true}
            onDrag={(e)=>{console.log("onDrag->",e);}}
			className="flex flex-col bg-violet-200 p-1 mb-2 mx-1 text-center rounded-lg"
		>
			<p className="text-sm  text-purple-500">{props.title}</p>
			<div className="bg-violet-100 text-purple-600 text-wrap p-1 m-1 rounded-lg">
				{props.value}
			</div>
		</div>
        
	);
}

