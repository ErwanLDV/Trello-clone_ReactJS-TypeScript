import { useEffect, useRef, useState } from 'react';
import React from 'react';
// import './App.css';
import Nav from './components/Nav/Nav';
import ItemContainer from './components/ItemContainer/ItemContainer';
import { toggleForm,handleAddItem } from './scripts/script';

function App() {
  // const [itemContainers, setItemContainers] = useState<string[]>(['Current', 'To Do', 'Finished']);
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

  //DND
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false); // État pour indiquer si un élément est en cours de glissement
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  //ref span
  const span = useRef<HTMLSpanElement>(null);

  const handleDeleteContainer = (index: number) => {
    const updatedItemContainers = [...task];
    updatedItemContainers.splice(index, 1);

    setTask(updatedItemContainers);
  }


  // const handleOpenAddNewContainerForm = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   // const button = e.currentTarget;
    
  //   // const form = button.nextElementSibling as HTMLFormElement;
  //   handleAddItem(e);

  //   // toggleForm(button, form, true);
  // }

  const handleCloseFormAddNewContainer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget.closest('.add-new-container')?.querySelector('.add-container-btn') as HTMLButtonElement;
    const form = e.currentTarget.closest('form') as HTMLFormElement;
    toggleForm(button, form, false);
  }

  const addContainer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const actualValidation = span.current;
    console.log(actualValidation);


    if(inputAddContainer.length === 0) {
      actualValidation!.textContent = "Must be at least 1 character long"
      return;
    } else {
    setTask(prevObjects => [...prevObjects, {name:inputAddContainer, items:[]}]);
    setInputAddContainer('');
    actualValidation!.textContent= '';
    }
  };

  //Drag and drop
  const handleDragStartContainer = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', index.toString());
    setIsDragging(true);
  };

  const handleDragOverContainer = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index); // Définit l'index de l'élément survolé dans l'état dragOverIndex
    //test
    if (draggingIndex !== null && draggingIndex !== index) {
      setHoveredIndex(index);
    }
  };

  const handleDragLeaveContainer = () => {
    setDragOverIndex(null); // Réinitialise l'index de l'élément survolé lorsque le survol se termine
  };

  const handleDropContainer = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.stopPropagation();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);

    if (draggedIndex !== targetIndex) {
      const updatedContainers = [...task];
      const [draggedContainer] = updatedContainers.splice(draggedIndex, 1);
      updatedContainers.splice(targetIndex, 0, draggedContainer);

      setTask(updatedContainers);
    }
    // setDragOverIndex(null);
    // setHoveredIndex(null);
  };

  const handleDragEnd = () => {
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
              onDragLeave={handleDragLeaveContainer}
              onDrop={(e) => handleDropContainer(e, containerIndex)}
              onDragEnd={handleDragEnd}
            >
              <ItemContainer title={element.name} task={task} setTask={setTask}  handleDeleteContainer={() => handleDeleteContainer(containerIndex)} />
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
