// import Draggable from "react-draggable";

export interface widget {
    key: string;
    title: string;
    value: string;

}

export default function Widget(props:widget) {
	return (
		
		<div
			key={props.key}
			className="z-10 flex flex-col w-100 bg-violet-200 p-1 my-1 mx-1 text-center rounded-lg duration-200"
		>
			<p className="text-sm  text-purple-500">{props.title}</p>
			<div className="bg-violet-100 text-purple-600 text-wrap p-1 m-1 rounded-lg">
				{props.value}
			</div>
		</div>
	);
}

