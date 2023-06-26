import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Item from './Item/Item'
import { handleAddItem, toggleForm } from '../../scripts/script'

type Props = {
  title: string,
  handleDeleteContainer: React.MouseEventHandler<HTMLButtonElement>,
  task: Array<{ name: string, items: string[] }>,
  setTask: React.Dispatch<React.SetStateAction<{ name: string; items: string[]; }[]>>,
  containerIndex: number,
  hoveredContainer: number | null,
  dragStartParentContainer: (e: React.DragEvent<HTMLElement>, containerIndex: number, itemIndex?: number) => void,
  dragOverParentContainer: (e: React.DragEvent<HTMLElement>, index: number, itemIndex?: number) => void,
  handleDropParentContainer: (e: React.DragEvent<HTMLElement>, targetIndex: number) => void,
  isDragging: boolean,
  elementToDrag: string,
  draggedOverItemIndex: number | null,
  indexContainerForHover: number | null,
}

function ItemContainer({ title, handleDeleteContainer, task, setTask, containerIndex,indexContainerForHover,isDragging,elementToDrag,draggedOverItemIndex, hoveredContainer,dragStartParentContainer,dragOverParentContainer, handleDropParentContainer }: Props) {
  const truncatedTitle = title.length > 27 ? title.substring(0, 27) + '...' : title;
  
  // const [items, setItems] = useState<string[]>([]);
  const objectContainer = task.find(element => element.name === title);

  // input
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const span = useRef<HTMLSpanElement>(null);


  const closeForm: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const actualBtn = e.currentTarget;
    const form = actualBtn.closest('form') as HTMLFormElement;
    const btnAddItem = btnRef.current;

    if (form && btnAddItem !== null) {
      toggleForm(btnAddItem, form, false);
    }
  }

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const actualValidation = span.current;

    if (inputValue.length === 0) {
      actualValidation!.textContent = "Must be at least 1 character long"
      return;
    } else {
      actualValidation!.textContent = "";

      if (objectContainer?.items) {
        const updatedElement = [...objectContainer.items, inputValue];

        setTask((prevObjects) => {
          prevObjects.find(element => objectContainer.name === element.name)!.items = updatedElement;

          return [...prevObjects];
        })
        if (inputValue) {
          setInputValue('');
        }
      }
    }
  }

  // sans strict mode !!!!!!!!!!!!
  // const handleRemoveItem = (index: number) => {
  //   if (objectContainer?.items) {
  //     setTask((prevObjects) => {

  //       prevObjects.find(element => objectContainer.name === element.name)!.items.splice(index, 1);

  //       return [...prevObjects];
  //     })
  //   }
  //   // const updatedItems = [...task];
  //   // updatedItems.splice(index, 1);

  //   // setTask(updatedItems);
  // }

  // Avec stricmode =============================================================!!!!!!!!!!!!
  const handleRemoveItem = (index: number) => {
    if (objectContainer?.items) {
      setTask((prevObjects) => {
        const updatedObjects = prevObjects.map((element) => {
          if (objectContainer.name === element.name) {
            const updatedItems = [...element.items]; // Copie des items avant modification
            updatedItems.splice(index, 1); // Modification de la copie des items
            return { ...element, items: updatedItems }; // Retour de l'élément modifié
          }
          return element; // Retour des éléments inchangés
        });

        return updatedObjects; // Retour des objets mis à jour
      });
    }
  };


  // Drag and drop =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// console.log(hoveredContainer);
// console.log(containerIndex);
  
  return (
    <div ref={containerRef} className="items-container" draggable="true">
      <div className="top-container">
        <h2>{truncatedTitle}</h2>
        <button className="delete-container-btn" onClick={handleDeleteContainer}>X</button>
      </div>
      <ul>
        {objectContainer?.items.map((element, index) => (
          <li className={`item ${draggedOverItemIndex === index && (hoveredContainer !== null ? containerIndex === hoveredContainer : containerIndex === indexContainerForHover) ? 'dragover-item' : ''}`} draggable key={index}
            onDragStart={(e) => dragStartParentContainer(e,containerIndex, index)}
            onDragOver={(e) => {dragOverParentContainer(e, containerIndex, index);setInputValue(''); }}
            onDrop={(e) =>{ handleDropParentContainer(e,  containerIndex); setInputValue('');}}
             >
            <Item key={index} content={element} handleRemoveItem={() => handleRemoveItem(index)}
            />
          </li>
        ))}
      </ul>
      <button ref={btnRef} className="add-item-btn" onClick={handleAddItem}>Add an item</button>
      <form autoComplete="off" onSubmit={submitForm}>
        <div className="top-form-container">
          <label htmlFor="item">Add a new item</label>
          <button type="button" className="close-form-btn" onClick={closeForm}>X</button>
        </div>
        <input value={inputValue} onChange={handleInputChange} type="text" id="item" />
        <span ref={span} className="validation-msg"></span>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default ItemContainer