import React from 'react'

type Props = {
  content: string,
  handleRemoveItem: React.MouseEventHandler<HTMLButtonElement>,
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