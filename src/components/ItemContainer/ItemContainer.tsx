import React, { FormEvent, useRef, useState } from 'react'
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
  draggedOverItemIndex: number | null,
  indexContainerForHover: number | null,
}

function ItemContainer({ title, handleDeleteContainer, task, setTask, containerIndex, indexContainerForHover, draggedOverItemIndex, hoveredContainer, dragStartParentContainer, dragOverParentContainer, handleDropParentContainer }: Props) {
  
  const truncatedTitle = title.length > 27 ? title.substring(0, 27) + '...' : title;

  const objectContainer = task.find(element => element.name === title);

  // input
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Refs
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

  const handleRemoveItem = (index: number) => {
    if (objectContainer?.items) {
      setTask((prevObjects) => {
        const updatedObjects = prevObjects.map((element) => {
          if (objectContainer.name === element.name) {
            const updatedItems = [...element.items]; // Copy of items before modification
            updatedItems.splice(index, 1); // Modification of the copy items
            return { ...element, items: updatedItems }; // Return of modified element
          }
          return element; // Return of unchanged elements
        });

        return updatedObjects; // Return of updated objects
      });
    }
  };

  return (
    <div ref={containerRef} className="items-container" draggable="true">
      <div className="top-container">
        <h2>{truncatedTitle}</h2>
        <button className="delete-container-btn" onClick={handleDeleteContainer}>X</button>
      </div>
      <ul>
        {objectContainer?.items.map((element, index) => (
          <li className={`item ${draggedOverItemIndex === index && (hoveredContainer !== null ? containerIndex === hoveredContainer : containerIndex === indexContainerForHover) ? 'dragover-item' : ''}`} draggable key={index}
            onDragStart={(e) => dragStartParentContainer(e, containerIndex, index)}
            onDragOver={(e) => { dragOverParentContainer(e, containerIndex, index); setInputValue(''); }}
            onDrop={(e) => { handleDropParentContainer(e, containerIndex); setInputValue(''); }}
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