// import React from 'react';
import { useDraggable } from "@dnd-kit/core";

export function Draggable(props: any) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: props.id,
	});
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
				zIndex:10
            }
		: undefined;

	return (
		<div id={props.id} ref={setNodeRef} style={style} {...listeners} {...attributes}>
			{props.children}
		</div>
	);
}
