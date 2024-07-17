// import React from "react";
import { useDroppable } from "@dnd-kit/core";
import ActionButton from "../ActionButton/ActionButton";
import {useSelector, useDispatch} from 'react-redux';
import { setButtonToCollapse, setButtonToExpand, triggerExpansionHandler } from "../../store/slices/expandSlice";
import { useEffect, useRef } from "react";
import { Draggable } from "../Draggable/Draggable";
import Widget from "../Widget/Widget";

export function Droppable(props: any) {
	const { isOver, setNodeRef } = useDroppable({
		id: props.id,
	});
	const expandState = useSelector((state: any) => {return state.expand.value});
	const expandButtonState = useSelector((state: any) => {return state.expand.enabled});
	// const expandTrigger = useSelector((state: any) => {return state.expand.trigger});
	const dispatch = useDispatch();
	// const divRef = useRef<HTMLDivElement>(null);
	// useEffect(()=>{
	// 	if(!expandTrigger){return}
	// 	if(divRef.current){
	// 		// let button = divRef.current.children[1];
	// 		const expandButton = divRef.current?.children[1] as HTMLButtonElement;
	// 		if (expandButton) {
	// 			console.log("expandButton");
				
	// 			expandButton.click();
	// 		}
	// 		console.log("button from useEffect->");
	// 		dispatch(triggerExpansionHandler(false));
			
	// 	}
	// }, [expandTrigger])

	function expandButtonHandler(e:any) {
		let parent = e.target?.parentNode?.parentNode;
		console.log(parent);
		if (parent) {
			let children = parent.children;
			console.log("parent->", parent);
			console.log("children->", children);
			if (!expandState) {
				for (let i = 1; i < children.length; i++) {
					if (parent) {
						// let children = Array.from(parent.children) as HTMLElement[];
						console.log("parent->", parent);
						console.log("children->", children);
						if (!expandState) {
							for (let i = 1; i < children.length; i++) {
								children[i].style.display = "none";
							}
						} else {
							for (let i = 1; i < children.length; i++) {
								children[i].style.display = "block";
							}
						}
					} else {
						console.log("no parent");
					}
				}
			}
			else{
				for (let i = 1; i < children.length; i++) {
					// if (!expandState) {
						for (let i = 1; i < children.length; i++) {
							children[i].style.display = "block";
						// }
					}
				}
			}
		} else {
			console.log("no parent");
		}
		
		if (expandState) {
			dispatch(setButtonToCollapse())
		} else {
			dispatch(setButtonToExpand());
		}
	}

	return (
		// <div  style={style}>
		/* {props.children} */

		<div
			id={props.id}
			ref={setNodeRef}
			className={`${
				props.id === "drop_div_1"
					? "min-h-[700px]"
					: "h-full"
			}  w-[250px] z-0 p-2 ms-3 m-2 font-monsterratBold bg-violet-100 duration-200 rounded-lg ${
				isOver ? "bg-violet-200" : "bg-violet-100"
			}`}
		>
			{props.id === "drop_div_2" ? (
				<div className="flex flex-col items-center ">
					<p className="text-sm text-violet-400 ">Extra Widgets</p>
					<ActionButton
						text={expandState ? "Expand" : "Collapse"}
						buttonState={expandButtonState}
						customBgColor=" w-[225px] mb-1 bg-violet-500"
						onClick={(e)=>{expandButtonHandler(e)}}/>
				</div>) : null}
			{props.children}
		</div>
	);
}
