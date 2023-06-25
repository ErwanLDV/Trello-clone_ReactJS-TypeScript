import React from 'react'

type Props = {
  content: string,
  handleRemoveItem: React.MouseEventHandler<HTMLButtonElement>,
  // onDragStart: (e: React.DragEvent<HTMLLIElement>) => void;
  // onDragOver: (e: React.DragEvent<HTMLLIElement>) => void;
  // onDrop: (e: React.DragEvent<HTMLLIElement>) => void;
  // onDragEnd: (e: React.DragEvent<HTMLLIElement>) => void;
}

function Item({ content, handleRemoveItem }: Props) {
  return (
    <>
      <div style={{ maxWidth: '90%' }}>{content}</div>
      <button onClick={handleRemoveItem}>X</button>
      </>
  )
}

export default Item