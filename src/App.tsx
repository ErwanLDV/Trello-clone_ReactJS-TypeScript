import { useRef, useState } from 'react';
import React from 'react';
import Nav from './components/Nav/Nav';
import ItemContainer from './components/ItemContainer/ItemContainer';
import { toggleForm,handleAddItem } from './scripts/script';

function App() {
  
  const [task, setTask] = useState<Array<{ name: string, items: string[] }>>([
    { name: 'Current', items: [] },
    { name: 'To Do', items: [] },
    { name: 'Finished', items: [] },
  ]);
  
  
  // input
  const [inputAddContainer, setInputAddContainer] = useState('');
  const handleChangeInputAddContainer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAddContainer(e.target.value)
  }

  //ref span
  const span = useRef<HTMLSpanElement>(null);


  const handleDeleteContainer = (index: number) => {
    const updatedItemContainers = [...task];
    updatedItemContainers.splice(index, 1);

    setTask(updatedItemContainers);
  }

  const handleCloseFormAddNewContainer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget.closest('.add-new-container')?.querySelector('.add-container-btn') as HTMLButtonElement;
    const form = e.currentTarget.closest('form') as HTMLFormElement;
    toggleForm(button, form, false);
  }

  const addContainer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const actualValidation = span.current;

    if(inputAddContainer.length === 0) {
      actualValidation!.textContent = "Must be at least 1 character long"
      return;
    } else {
    setTask(prevObjects => [...prevObjects, {name:inputAddContainer, items:[]}]);
    setInputAddContainer('');
    actualValidation!.textContent= '';
    }
  };

  //Drag and drop ===================================>>
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false); // État pour indiquer si un élément est en cours de glissement
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [draggedOverItemIndex, setDraggedOverItemIndex] = useState<number | null>(null);
  const [elementToDrag, setElementToDrag] = useState<string>('');
  const [indexContainer, setIndexContainer] = useState<number | null>(null);
  const [indexItemLi, setIndexItemLi] = useState<number | null>(null);


  const handleDragStartContainer = (e: React.DragEvent<HTMLElement>, containerIndex: number, itemIndex?: number) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', containerIndex.toString());
    setIsDragging(true);
    setElementToDrag(e.currentTarget.nodeName);
    
    
    setIndexContainer(containerIndex!);
    
    if (itemIndex !== null && itemIndex !== undefined) {
      setIndexItemLi(itemIndex);
    } 
    
  };

  const handleDragOverContainer = (e: React.DragEvent<HTMLElement>, index: number, itemIndex?: number ) => {
    e.preventDefault();    
    
    setDraggingIndex(index);    
    
    if (draggingIndex !== null  && draggingIndex !== index) {
      setHoveredIndex(index); 
    }
    
    if (itemIndex !== undefined) {
      setDraggedOverItemIndex(itemIndex); 
    }
  };


  const handleDropContainer = (e: React.DragEvent<HTMLElement>, targetIndex: number,) => {
    e.stopPropagation();
    const updatedContainers = [...task];

    if (indexContainer !== targetIndex && elementToDrag === 'DIV') {
      const [draggedContainer] = updatedContainers.splice(indexContainer!, 1);
      updatedContainers.splice(targetIndex, 0, draggedContainer);
    }

    if((e.currentTarget.nodeName === 'DIV' || e.currentTarget.nodeName === 'LI') && draggedOverItemIndex !== null &&  elementToDrag === 'LI') {
        const [draggedItem] = updatedContainers[indexContainer!].items.splice(indexItemLi!,1)
        updatedContainers[targetIndex].items.splice(draggedOverItemIndex, 0, draggedItem)
    }

    setTask(updatedContainers)
    setDragOverIndex(null);
    setHoveredIndex(null);
    setDraggedOverItemIndex(null);
    setIndexContainer(null);
    setElementToDrag('');
    setIsDragging(false);
  };

  return (
    <div className="App">

      <Nav />
      <section className='board'>
        <h1>Team board</h1>
        <div className="main-content">
          {task.map((element, containerIndex) => (
            <div
              key={containerIndex}
              draggable
              className={`draggable-container ${isDragging && draggingIndex === containerIndex ? 'dragging-container' : ''} ${dragOverIndex === containerIndex ? 'dragover-container' : ''}`}
              onDragStart={(e) => handleDragStartContainer(e, containerIndex)}
              onDragOver={(e) => handleDragOverContainer(e, containerIndex)}
              onDrop={(e) => handleDropContainer(e, containerIndex)}
            >
              <ItemContainer 
              title={element.name} 
              task={task} setTask={setTask} 
              containerIndex={containerIndex} 
              hoveredContainer={hoveredIndex} 
              indexContainerForHover={indexContainer}
              dragStartParentContainer={handleDragStartContainer}
              dragOverParentContainer={handleDragOverContainer}
              handleDropParentContainer={handleDropContainer}
              draggedOverItemIndex={draggedOverItemIndex}
              handleDeleteContainer={() => handleDeleteContainer(containerIndex)} />
            </div>
          ))}
          <div className="ring">
            <div className="add-new-container">
              <button className="add-container-btn" onClick={handleAddItem}>Add another container</button>
              <form autoComplete="off" onSubmit={addContainer}>
                <div className="top-form-container">
                  <label htmlFor="new-container">Add a new container</label>
                  <button type="button" className="close-form-btn close-add-list" onClick={handleCloseFormAddNewContainer}>X</button>
                </div>
                <input type="text" id="new-container" value={inputAddContainer} onChange={handleChangeInputAddContainer} />
                <span ref={span} className="validation-msg"></span>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
