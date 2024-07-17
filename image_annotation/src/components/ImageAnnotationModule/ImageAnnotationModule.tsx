import { useState, useEffect, useRef } from "react";
import axios from "axios";
import LabelPopupDialog from "../LabelPopupDialog/LabelPopupDialog";
import ActionButton from "../ActionButton/ActionButton";
import Widget from "../Widget/Widget";
import { DndContext } from "@dnd-kit/core";
import { Droppable } from "../Droppable/Droppable";
import { Draggable } from "../Draggable/Draggable";
import { useSelector, useDispatch } from "react-redux";
import {imageAreaOnCanvas} from "../../internal_calc/InternalCalc"
import TwoButtonDialog from "../TwoButtonDialog/TwoButtonDialog";
import { setTwoButtonDialog } from "../../store/slices/twoButtlonDialogSlice";
// import './App.css'
interface Annotation {
	id: string;
	top: string;
	left: string;
	height: string;
	width: string;
	label: string;
	content: string;
}
function ImageAnnotationModule() {
	const [coord, setCoord] = useState({ cx: 0, cy: 0 });
	const [annotations, setAnnotations] = useState<Annotation[]>([]);
	const [prev, setPrev] = useState({ x: 0, y: 0 });
	const [pointIndex, setPointIndex] = useState(0);
	const [selectedAnnotation, setselectedAnnotation] = useState<Annotation>();
	const [showDialog, setShowDialog] = useState(false);
	const [backgroundImage, setBackgroundImage] = useState("");
	const [imageHeight, setImageHeight] = useState(0);
	const [imageWidth, setImageWidth] = useState(0);
	const [imageBuffer, setImageBuffer] = useState<ArrayBuffer>(
		new ArrayBuffer(0)
	);
	const [imageUploadMessageState, setImageUploadMessageState] = useState(2);
	const [RemoveButtonState, setRemoveButtonState] = useState(false);
	const [loadButtonState, setLoadButtonState] = useState(false);
	const [saveButtonState, setSaveButtonState] = useState(false);
	const [writeChangesButtonState, setWriteChangesButtonState] =
		useState(false);
	const expandState = useSelector((state: any) => {
		return state.expand.value;
	});
	const twoButtonDialog = useSelector((state:any)=>{
		return state.twoButtonDialog.value;
	})

	const dispatch = useDispatch();
	const imageRef = useRef<HTMLInputElement>(null);
	const contentRef = useRef<HTMLTextAreaElement>(null);

	const imageUploadMessages = [
		["bg-green-500", "Image Is Already Annotated"],
		["bg-red-500", "Image Is Not Already Annotated"],
		["bg-yellow-500", "Upload An Image To Begin"],
	];

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setCoord({ cx: e.clientX, cy: e.clientY });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	function clearAnnotations() {
		setAnnotations([]);
	}

	function saveAnnotations(storage: string) {
		axios
			.post("http://localhost:3000/newAnnotations", {
				storage: storage,
				annotations: annotations,
			})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function loadAnnotations() {
		axios
			.get("http://localhost:3000/getAnnotations", {
				params: { storage: "storage 1" },
			})
			.then((response) => {
				console.log(response.data[0].annotations);
				setAnnotations(response.data[0].annotations);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function createAnnotation() {
		let id = new Date().toISOString();
		let height = "";
		let width = "";
		let left = "";
		let top = "";
		if (coord.cx > prev.x && coord.cy > prev.y) {
			(top = `${prev.y}px`),
				(left = `${prev.x}px`),
				(height = `${coord.cy - prev.y}px`),
				(width = `${coord.cx - prev.x}px`);
		} else if (coord.cx < prev.x && coord.cy > prev.y) {
			(top = `${prev.y}px`),
				(left = `${coord.cx}px`),
				(height = `${coord.cy - prev.y}px`),
				(width = `${prev.x - coord.cx}px`);
		} else if (coord.cx > prev.x && coord.cy < prev.y) {
			(top = `${coord.cy}px`),
				(left = `${prev.x}px`),
				(height = `${prev.y - coord.cy}px`),
				(width = `${coord.cx - prev.x}px`);
		} else if (coord.cx < prev.x && coord.cy < prev.y) {
			(top = `${coord.cy}px`),
				(left = `${coord.cx}px`),
				(height = `${prev.y - coord.cy}px`),
				(width = `${prev.x - coord.cx}px`);
		}
		let newAnnotation: Annotation = {
			id: id,
			top: top,
			left: left,
			height: height,
			width: width,
			label: `Label ${annotations.length + 1}`,
			content: "Information about the annotation",
		};
		if (left !== "" && top !== "" && height !== "" && width !== "") {
			setAnnotations([...annotations, newAnnotation]);
		}
	}

	function updateAnnotation(
		selectedAnnotation?: Annotation,
		label?: string,
		content?: string
	) {
		if (selectedAnnotation) {
			annotations.forEach((annotation) => {
				if (annotation.id === selectedAnnotation.id) {
					annotation.label = label ? label : annotation.label;
					annotation.content = content ? content : annotation.content;
				}
			});
		}
	}

	function extractAnnotationsFromImageBuffer(buffer: ArrayBuffer) {
		let index = 0;
		let view = new Uint8Array(buffer);

		for (let i = buffer.byteLength - 1; i > 0; i--) {
			if (view[i] === 36) {
				console.log("found at ", i, "bytelength", buffer.byteLength);
				index = i;
				break;
			}
		}
		if (index !== 0) {
			console.log(
				"viewlslice->",
				view.slice(index + 1, buffer.byteLength - 1)
			);
			let decodedAnnotations = JSON.parse(
				new TextDecoder().decode(
					view.slice(index + 1, buffer.byteLength - 1)
				)
			);
			console.log(decodedAnnotations);
			return decodedAnnotations;
		}
		return [];
	}

	function loadAnnotationsFromImage(img: any) {
		img.arrayBuffer()
			.then((buffer: any) => {
				let view = new Uint8Array(buffer);
				console.log(view.buffer);

				if (view[buffer.byteLength - 1] === 126) {
					setImageBuffer(buffer);
					setImageUploadMessageState(0);
					setAnnotations(extractAnnotationsFromImageBuffer(buffer));
					console.log("image is loaded");
				} else {
					setImageBuffer(buffer);
					setImageUploadMessageState(1);
					setAnnotations([]);
					console.log("image is not loaded");
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
	}

	function imageUploadHandler(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];

			if (file) {
				let url = URL.createObjectURL(file);

				let img = new Image();
				img.src = url;
				img.onload = () => {
					setImageHeight(img.height);
					setImageWidth(img.width);
					console.log(img.height, img.width);
				};

				if (contentRef.current) contentRef.current.value = "";
				setAnnotations([]);
				setselectedAnnotation(undefined);
				setBackgroundImage(url);
				setRemoveButtonState(true);
				setLoadButtonState(true);
				setSaveButtonState(true);
				setWriteChangesButtonState(true);
				loadAnnotationsFromImage(file);
			}
		}
	}

	function saveAnnotationsToImage() {
		if (imageBuffer) {
			let view = new Uint8Array(imageBuffer);
			if (imageUploadMessageState === 0) {
				let index = 0;
				for (let i = imageBuffer.byteLength - 1; i > 0; i--) {
					if (view[i] === 36) {
						console.log("found at ->", i);

						index = i;
						break;
					}
				}
				if (index !== 0) {
					// console.log("found at ", i, "bytelength", buffer.byteLength);
					console.log(view, view.byteLength);
					view = view.slice(0, index + 1);
					console.log(view, view.byteLength);
					let encodedAnnotations = new TextEncoder().encode(
						JSON.stringify(annotations)
					);
					console.log(
						encodedAnnotations,
						encodedAnnotations.byteLength
					);
					// let newBuffer = new Uint8Array(view.byteLength+ 1 + encodedAnnotations.byteLength);
					// newBuffer.set(view,0);
					// newBuffer.set(encodedAnnotations, view.byteLength);
					// newBuffer.set([126], view.byteLength+encodedAnnotations.byteLength);
					const newBuffer = new Uint8Array([
						...view,
						...encodedAnnotations,
						126,
					]);
					console.log(newBuffer, newBuffer.byteLength);
					setImageBuffer(newBuffer.buffer);
				} else {
					console.log("save image annotation i not found");
				}
			} else {
				let encodedAnnotations = new TextEncoder().encode(
					JSON.stringify(annotations)
				);
				console.log(encodedAnnotations, encodedAnnotations.byteLength);

				const newBuffer = new Uint8Array([
					...view,
					36,
					...encodedAnnotations,
					126,
				]);
				console.log(newBuffer, newBuffer.byteLength);
				setImageBuffer(newBuffer.buffer);
			}
		}
	}
	function handleDragEnd(event: any) {
		console.log(event);
		const { active, over } = event;

		if (active && over) {
			// Get the draggable element and the droppable container
			console.log("active->", active.id, "over->", over.id);

			const draggableElement = document.getElementById(active.id);
			const droppableContainer = document.getElementById(over.id);

			console.log(
				"draggableElement->",
				draggableElement,
				"droppableContainer->",
				droppableContainer
			);

			if (draggableElement && droppableContainer) {
				// Remove the draggable element from its current parent and append it to the droppable container
				draggableElement.parentNode?.removeChild(draggableElement);
				console.log(
					"draggable element parent->",
					draggableElement.parentNode
				);
				if (over.id === "drop_div_2") {
					if (expandState) {
						draggableElement.style.display = "none";
					}
				}
				droppableContainer.appendChild(draggableElement);
				console.log("droppableContainer->", droppableContainer);
			}
		}
	}

	return (
		<>
			{showDialog ? (
				<div className="absolute z-10 w-full h-full flex justify-center items-center">
					<LabelPopupDialog
						setShowDialog={setShowDialog}
						onDialogClosedCallback={updateAnnotation}
						selectedAnnotation={selectedAnnotation}
					/>
				</div>
			) : (
				<></>
			)}
			{twoButtonDialog ? (
				<div className="absolute z-10 w-full h-full flex justify-center items-center">
					<TwoButtonDialog
						key={"two_button_dialog"}
						dialogLabel="Export Annotations As"
						firstOptionLabel="Image File"
						secondOptionLabel="Project File"
						onCancelCallback={()=>{dispatch(setTwoButtonDialog(false))}}
						onFirstOptionClickedCallback={()=>{
							console.log("write changes to image");
							const blob = new Blob([imageBuffer], {
								type: "file",
							});
							var link = document.createElement("a");
							link.href =
								window.URL.createObjectURL(blob);
							if (imageRef.current) {
								if (imageRef.current.files) {
									link.download =
										"annotated_" +
										imageRef.current.files[0].name.split(".")[0] + 
										".jpeg";
								}
							}
							link.click();
						}}
						onSecondOptionClickedCallback={()=>{
							
							console.log("write changes to iap");
							const blob = new Blob([imageBuffer], {
								type: "file",
							});
							var link = document.createElement("a");
							link.href =
								window.URL.createObjectURL(blob);
							if (imageRef.current) {
								if (imageRef.current.files) {
									link.download =
										"annotated_" +
										imageRef.current.files[0].name.split(".")[0] + 
										".iap";
								}
							}
							link.click();
						
						}}
					/>
				</div>
			) : (
				<></>
			)}
			<DndContext onDragEnd={handleDragEnd}>
				
				<div key={"top"} className="flex flex-row">
					<div key={"canvas-and-bottom-col"} className="flex flex-col">
					<div
						onClick={(e) => {
							console.log(
								e.screenX,
								e.screenY,
								e.clientX,
								e.clientY
							);
							if (pointIndex) {
								createAnnotation();
							}
							setPrev({ x: coord.cx, y: coord.cy });
							pointIndex ? setPointIndex(0) : setPointIndex(1);
							// createAnnotation("1");
						}}
						className={` ${
							backgroundImage === ""
								? "cursor-crosshair h-[550px] w-[950px] bg-black"
								: "cursor-crosshair relative bg-no-repeat bg-contain h-[550px] w-[950px] bg-black"
						}`}
						style={{ backgroundImage: `url(${backgroundImage})` }}
					>
						{pointIndex ? (
							coord.cx > prev.x && coord.cy > prev.y ? (
								<div
									className={`absolute bg-gray-200 opacity-50`}
									style={{
										top: `${prev.y}px`,
										left: `${prev.x}px`,
										height: `${coord.cy - prev.y}px`,
										width: `${coord.cx - prev.x}px`,
									}}
								/>
							) : coord.cx < prev.x && coord.cy > prev.y ? (
								<div
									className={`absolute bg-gray-200 opacity-50`}
									style={{
										top: `${prev.y}px`,
										left: `${coord.cx}px`,
										height: `${coord.cy - prev.y}px`,
										width: `${prev.x - coord.cx}px`,
									}}
								/>
							) : coord.cx > prev.x && coord.cy < prev.y ? (
								<div
									className={`absolute bg-gray-200 opacity-50`}
									style={{
										top: `${coord.cy}px`,
										left: `${prev.x}px`,
										height: `${prev.y - coord.cy}px`,
										width: `${coord.cx - prev.x}px`,
									}}
								/>
							) : coord.cx < prev.x && coord.cy < prev.y ? (
								<div
									className={`absolute bg-gray-200 opacity-50`}
									style={{
										top: `${coord.cy}px`,
										left: `${coord.cx}px`,
										height: `${prev.y - coord.cy}px`,
										width: `${prev.x - coord.cx}px`,
									}}
								/>
							) : (
								<></>
							)
						) : (
							<></>
						)}

						{/*<p>
					{coord.cx}, {coord.cy} prev {prev.x}, {prev.y} pointIndex{" "}
					{pointIndex}
				</p>
				*/}
						{annotations.map((annotation: Annotation) => {
							return (
								<div
									id={annotation.id.toString()}
									onClick={(e) => {
										console.log(e);
										setselectedAnnotation(annotation);
										if (contentRef.current) {
											contentRef.current.value =
												annotation.content
													? annotation.content
													: "";
										}
										e.stopPropagation();
									}}
									className={`absolute bg-gray-200 opacity-50 cursor-pointer hover:opacity-70`}
									style={{
										top: annotation.top,
										left: annotation.left,
										height: annotation.height,
										width: annotation.width,
									}}
								>
									<div className="relative flex justify-center items-center font-monsterratBold text-base w-100 h-full opacity-0 hover:opacity-100 hover:text-lg duration-300">
										<div
											onClick={(e) => {
												// let newAnnotations = annotations.filter((item)=>{return item.id!==annotation.id});
												// setAnnotations(newAnnotations);
												let index =
													annotations.findIndex(
														(item) => {
															return (
																item.id ===
																annotation.id
															);
														}
													);
												annotations.splice(index, 1);
												setselectedAnnotation(
													undefined
												);
												if (contentRef.current) {
													contentRef.current.value =
														"";
												}
												e.stopPropagation();
											}}
											className="absolute h-[10px] w-[10px] bg-red-600 top-0 right-0 m-1"
										></div>
										<div
											onClick={(e) => {
												console.log("edit label");
												setselectedAnnotation(
													annotation
												);
												if (contentRef.current) {
													contentRef.current.value =
														annotation.content
															? annotation.content
															: "";
												}
												setShowDialog(true);
												// updateAnnotation(annotation.id);
												e.stopPropagation();
											}}
											className="absolute h-[10px] w-[10px] bg-blue-600 top-0 right-[15px] m-1"
										></div>
										{annotation.label}
										{/* {annotation.id} */}
									</div>
								</div>
							);
						})}
					</div>
					<div
					key={"bottom"}
					className=" top-[555px] flex flex-row w-[950px] justify-between"
				>
					<div key={"controls"} className="flex flex-col w-[370px]">
						<div
							key={"action_buttons"}
							className="flex flex-row ms-1 justify-start"
						>
							<ActionButton
								onClick={() => {
									console.log("clear");
									clearAnnotations();
									setselectedAnnotation(undefined);
									if (contentRef.current) {
										contentRef.current.value = "";
									}
								}}
								text="Clear"
								buttonState={true}
							/>

							<ActionButton
								onClick={() => {
									console.log("save");
									saveAnnotationsToImage();
								}}
								text="Save"
								buttonState={saveButtonState}
							/>

							<ActionButton
								onClick={() => {
									console.log("load");
									if (imageRef.current) {
										if (imageRef.current.files) {
											loadAnnotationsFromImage(
												imageRef.current.files[0]
											);
										}
									}
								}}
								text="Load"
								buttonState={loadButtonState}
							/>

							<ActionButton
								onClick={() => {dispatch(setTwoButtonDialog(true))}}
								text="Export This File"
								buttonState={writeChangesButtonState}
							/>
						</div>
						<form className="flex justify-start">
							<input
								id="files"
								ref={imageRef}
								type="file"
								accept="image/*, .iap"
								onChange={imageUploadHandler}
								className="mx-2 w-[329px] font-montserratSemiBold text-sm bg-violet-200 cursor-pointer rounded-lg p-2 text-purple-600 file:bg-violet-500 file:border-none file:p-1.5 file:rounded-lg file:text-white"
							/>
						</form>
						<div
							key={"remove_image_section"}
							className="flex flex-row ms-1 justify-start"
						>
							<ActionButton
								text="Remove"
								customBgColor="bg-red-500"
								customHoverColor="hover:bg-red-700"
								buttonState={RemoveButtonState}
								onClick={() => {
									setBackgroundImage("");
									setAnnotations([]);
									setRemoveButtonState(false);
									setLoadButtonState(false);
									setSaveButtonState(false);
									setWriteChangesButtonState(false);
									setImageUploadMessageState(2);
									setImageBuffer(new ArrayBuffer(0));
									setImageHeight(0);
									setImageWidth(0);
									setselectedAnnotation(undefined);
									if (imageRef.current)
										imageRef.current.value = "";
									if (contentRef.current)
										contentRef.current.value = "";
								}}
							/>
							<div
								key={"loaded_img_indicator"}
								className={`flex justify-center items-center ${imageUploadMessages[imageUploadMessageState][0]} h-[40px] mt-3 mb-3 mx-2 px-2 rounded-lg text-white font-montserratSemiBold text-sm`}
							>
								<p>
									{
										imageUploadMessages[imageUploadMessageState][1]
									}
								</p>
							</div>
						</div>
					</div>
					<div key={"data_section"} className="flex flex-col mt-3">
						<div
							key={"annotation_information"}
							className="grid grid-cols-3 font-monsterratBold w-[600px]"
						>
							<Widget
								key="annotation_label"
								title="Annotation Label"
								value={
									selectedAnnotation
										? selectedAnnotation.label
										: "..."
								}
							/>

							<Widget
								key="annotation_area"
								title="Annotation Area"
								value={
									selectedAnnotation?.height &&
									selectedAnnotation?.width
										? (parseInt(selectedAnnotation?.height) * parseInt(selectedAnnotation?.width)).toString() + "px"+ "²"
										: "..."
								}
							/>

							<Widget
								key="annotation_height"
								title="Annotation Height"
								value={
									selectedAnnotation
										? selectedAnnotation.height
										: "..."
								}
							/>

							<Widget
								key="annotation_width"
								title="Annotation Width"
								value={
									selectedAnnotation
										? selectedAnnotation.width
										: "..."
								}
							/>

							<Widget
								key="annotation_area_to_canvas_area"
								title="Canvas Area Covered"
								value={
									selectedAnnotation
										? (((parseInt(selectedAnnotation.height) * parseInt(selectedAnnotation.width)) /(550 * 950)) *100).toString().slice(0, 4) + "%"
										: "..."
								}
							/>
							
							<Widget
								key="image_area_covered"
								title="Image Area Covered"
								value={
									backgroundImage ?
									selectedAnnotation
										? (((parseInt(selectedAnnotation.height) * parseInt(selectedAnnotation.width)) /(imageAreaOnCanvas(imageWidth, imageHeight, 950, 550))) *100).toString().slice(0, 4) + "%"
										: "..."
										: "..."
								}
							/>
						
							
						</div>
					</div>
				</div>
					</div>
					<Droppable id={"drop_div_1"}>
						<Draggable id={"x_coords"}>
							<Widget
								key="x_coords"
								title="X Coordinate"
								value={coord.cx.toString()}
							/>
						</Draggable>

						<Draggable id={"y_coords"}>
							<Widget
								key="y_coords"
								title="Y Coordinate"
								value={coord.cy.toString()}
							/>
						</Draggable>

						<Draggable id={"prev_x_coords"}>
							<Widget
								key="prev_x_coords"
								title="X Cap Coordinate"
								value={prev.x.toString()}
							/>
						</Draggable>

						<Draggable id={"prev_y_coords"}>
							<Widget
								key="prev_y_coords"
								title="Y Cap Coordinate"
								value={prev.y.toString()}
							/>
						</Draggable>

						<Draggable id={"point_index"}>
							<Widget
								key="point_index"
								title="Marking Status"
								value={pointIndex ? "Marking" : "Not Marking"}
							/>
						</Draggable>

						{/* <Draggable id={'content'}> */}
						<div
							key={"content"}
							className="flex flex-col bg-violet-200 p-1 mb-2 mx-1 text-center rounded-lg"
						>
							<p className="text-sm  text-purple-500">Content</p>
							<div className="bg-violet-100 text-purple-600 text-wrap p-1 m-1 rounded-lg">
								<div className="flex justify-center items-center">
									<textarea
										ref={contentRef}
										disabled={
											selectedAnnotation ? false : true
										}
										id="label-input"
										className="w-[300px] h-[200px] p-1 outline-none caret-violet-500 bg-white rounded-lg shadow-none hover:shadow-lg duration-200"
									/>
								</div>
							</div>
							<ActionButton
								buttonState={selectedAnnotation ? true : false}
								text="Update Content"
								onClick={() => {
									updateAnnotation(
										selectedAnnotation,
										undefined,
										contentRef.current?.value
									);
								}}
							/>
						</div>
						{/* </Draggable> */}
						{/* </div> */}
					</Droppable>

					<Droppable id={"drop_div_2"}>
						<Draggable id="image_height_widget">
							<Widget
								key="image_height"
								title="Image Height"
								value={
									imageHeight !== 0
										? imageHeight.toString() + "px"
										: "..."
								}
							/>
						</Draggable>
						<Draggable id="image_width_widget">
							<Widget
								key="image_width"
								title="Image Width"
								value={
									imageWidth !== 0
										? imageWidth.toString() + "px"
										: "..."
								}
							/>
						</Draggable>
						<Draggable id="image_area">
							<Widget
								key="original_image_area"
								title="Original Image Area"
								value={
									imageHeight !== 0 && imageWidth !== 0
										? (imageHeight * imageWidth).toString() + "px" + "²"
										: "..."
								}
							/>
						</Draggable>
						<Draggable key="canvas_image_area">
						<Widget
								key="image_area_on_canvas"
								title="Canvas Image Area"
								value={
									imageHeight !== 0 && imageWidth !== 0
										? Math.round(imageAreaOnCanvas(imageWidth, imageHeight, 950, 550)).toString() + "px" + "²"
										: "..."
								}
							/>
						</Draggable>
						<Draggable id="canvas_to_image_ratio">
						<Widget
								key="canvas_area_to_image_area_ratio"
								title="Canvas : Original Image"
								value={
									imageHeight !== 0 && imageWidth !== 0 ? 1 + " : " +Math.round((imageHeight * imageWidth) / (550 * 950) ): "..."
								}
							/>
						</Draggable>
						
						
					</Droppable>
				</div>

				
			</DndContext>
		</>
	);
}

export default ImageAnnotationModule;
